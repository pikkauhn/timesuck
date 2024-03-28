import { NextRequest, NextResponse } from "next/server";
import * as argon2 from 'argon2';

import OTPGen from "@/app/components/system/OTPGen";
import mailTransporter from "@/app/components/system/Transporter";
import { SupabaseClient } from "@/app/components/system/SupaConx";

const supabase = SupabaseClient.getSupabaseClient();

interface RequestBody {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
}

export async function POST(req: NextRequest) {
    if (req.method === 'POST') {
        try {
            const transporter = mailTransporter();
            const { otpCode, hashedOTP } = await OTPGen();

            const passedValue = await new Response(req.body).text();
            const body: RequestBody = JSON.parse(passedValue);

            const { firstName, lastName, email, password } = body;

            // Supabase calls
            const hashedPassword = await argon2.hash(password);
            const { data: user, error: createUserError } = await supabase
                .from('users')
                .insert({
                    email,
                    firstName,
                    lastName,
                    password: hashedPassword,
                })

            if (createUserError) {
                console.error('Error creating user: ', createUserError);
                return NextResponse.json({ message: 'Faiiled to create user' }, { status: 500 })
            }

            const { data: createdUser, error: userFindError } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single()

            if (userFindError) {
                console.error('Error finding user: ', userFindError);
            }

            const expirationDateTime = new Date(Date.now() + 60 * 60 * 1000);
            if (await createdUser.id) {
                const { data: otp, error: createOtpError } = await supabase
                    .from('OTP')
                    .insert({
                        userId: createdUser.id,
                        code: hashedOTP,
                        expirationDateTime
                    });

                const mailOptions = {
                    from: 'test@searcywater.org',
                    to: email,
                    subject: 'Your OTP for Verification',
                    text: `Your OTP is: ${otpCode}`,
                };

                await transporter.sendMail(mailOptions);
                return NextResponse.json({ message: createdUser.id }, { status: 200 });
            }
        } catch (error) {
            console.error('Error: ', error);
            return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
        }


    } else {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
    }
}
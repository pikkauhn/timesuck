import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import * as argon2 from "argon2";
import { SupabaseClient } from "@/app/components/system/SupaConx";

interface RequestBody {
  otp: string,
}

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    const cookieStore = cookies();
    const userIdCookie = cookieStore.get('userId');
    const userId = userIdCookie?.value;

    try {
      if (userId) {
        const passedValue = await new Response(req.body).text();
        const body: RequestBody = JSON.parse(passedValue);
        const { otp } = body;

        const supabase = SupabaseClient.getSupabaseClient(); // Assuming a getter function

        const { data: otpRecord, error: findOtpError } = await supabase
          .from('OTP')
          .select('*')
          .eq('userId', userId)
          .eq('isVerified', false)
          .single();

        if (findOtpError) {
          console.error('Error finding OTP:', findOtpError);
          return NextResponse.json({ message: 'Failed to verify OTP' }, { status: 500 });
        }

        if (!otpRecord) {
          return NextResponse.json({ message: 'OTP not found or already verified' }, { status: 404 });
        }

        const isMatch = await argon2.verify(otpRecord.code, otp);
        if (isMatch) {
          const { error: updateOtpError } = await supabase
            .from('OTP')
            .update({ isVerified: true })
            .eq('id', otpRecord.id);

          if (updateOtpError) {
            console.error('Error updating OTP:', updateOtpError);
            return NextResponse.json({ message: 'Failed to verify OTP' }, { status: 500 });
          }

          return NextResponse.json({ message: 'OTP verified successfully' }, { status: 200 });
        } else {
          return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
        }
      } else {
        return NextResponse.json({ message: 'User not in cookies or header, they need to attempt to log in again' }, { status: 404 })
      }
    } catch (error) {
      console.error('Error verifying OTP: ', error);
      return NextResponse.json({ message: 'Failed to verify OTP' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }
}

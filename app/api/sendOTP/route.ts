import { NextApiRequest, NextApiResponse } from "next";

import { SupabaseClient } from '../../components/system/SupaConx';
import mailTransporter from '../../components/system/Transporter'
import OTPGen from '../../components/system/OTPGen'

const supabase = SupabaseClient.getSupabaseClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const transporter = mailTransporter();
    const { otpCode, hashedOTP } = await OTPGen();

    // Supabase calls
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', req.body.user)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      res.status(500).json({ message: 'Failed to retrieve user' });
      return;
    }

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const expirationDateTime = new Date(Date.now() + 60 * 60 * 1000);

    const { data: otp, error: otpError } = await supabase
      .from('oTP')
      .insert({
        userId: user.id,
        code: hashedOTP,
        expirationDateTime,
      });

    if (otpError) {
      console.error('Error creating OTP:', otpError);
      res.status(500).json({ message: 'Failed to create OTP' });
      return;
    }

    const mailOptions = {
      from: process.env.NEXT_PUBLIC_EMAIL_USER,
      to: req.body.email,
      subject: 'Your OTP for Verification',
      text: `Your OTP is: ${otpCode}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
}
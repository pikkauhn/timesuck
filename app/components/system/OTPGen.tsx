import * as argon2 from 'argon2'

export default async function OTPGen(): Promise<{ otpCode: string; hashedOTP: string }> {
    const randomNumber = Math.floor(Math.random() * 1000000); // Generate 6-digit random number
    const otpCode = randomNumber.toString().padStart(6, '0');

    const hashedOTP = await argon2.hash(otpCode);

    return { otpCode, hashedOTP };
}
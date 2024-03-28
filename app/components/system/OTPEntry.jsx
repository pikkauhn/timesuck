'use client'
import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import OTPInput from 'react-otp-input';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useRouter } from 'next/navigation'

export default function OtpEntry() {
    const router = useRouter();
    const [otp, setOtp] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_NEXTAUTH_URL + "/api/checkOTP", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    otp,
                }),
            });
            if (res.ok) {
                router.replace('/api/auth/signin')
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className='flex flex-column' onSubmit={(e) => handleSubmit(e)}>

            <Card className='flex mt-8 justify-content-center text-center' title="Input OTP">
                <OTPInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    inputStyle={{ width: '3rem' }}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => <InputText {...props} />}
                />
                <Button className='mt-4' type="submit" label="Submit" />
            </Card>
        </form>
    )
}
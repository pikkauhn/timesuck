"use client"
import { useRouter } from 'next/navigation'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import React, { useState } from 'react'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

interface Roles {
    name: string;
}

const CredForm = () => {
    const router = useRouter();

    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (confirmPassword !== password) {
            alert('Passwords must match!')
        }
        else {
            try {
                const res = await fetch(process.env.NEXT_PUBLIC_NEXTAUTH_URL + "/api/user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        email,
                        password,
                    }),
                });

                if (res.ok) {
                    const data = await res.json();
                    const userId = await data.message;
                    document.cookie = (`userId=${userId}`);
                    await router.replace('/OTPEntry');
                } else if (res.status === 400) {
                    const data = await res.json();
                    console.error('Error:', data.message);
                    // Display user-friendly error message (e.g., using toast or alert)
                } else {
                    console.error('Unexpected error:', res.status);
                }
            } catch (error) {
                console.error('Error:', error);
                // Display user-friendly error message (e.g., using toast or alert)
            }

        }
    }

    return (
        <form className='flex flex-column' onSubmit={(e) => handleSubmit(e)}>
            <InputText className='flex mb-2' id='firstname' placeholder='First Name' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <InputText className='flex mb-2' id='lastname' placeholder='Last Name' value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <InputText className='flex mb-2' type='email' id='email' placeholder='Email Address' value={email} onChange={(e) => setEmail(e.target.value)} />
            <InputText className='flex mb-2'
                id='password' type='password' placeholder='Create Password' value={password}
                autoComplete='password'
                onChange={(e) => setPassword(e.target.value)}
            />
            <InputText className='flex mb-2'
                id='confirmPassword' type='password' placeholder='Re-Enter Password' value={confirmPassword}
                autoComplete='password'
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button className='mt-2' type="submit" label="Submit" />
        </form>
    )
}

export default CredForm
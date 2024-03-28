'use client'
import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from 'primereact/button';

const SigninButton = () => {
    const { data: session } = useSession();    
    if (session && session.user) {

        return (
            <div className="flex">                
                <Button label="Sign Out" size='large' text onClick={() => signOut({ callbackUrl: '/' })} />
            </div>)
    }
    return (
        <Button label='Sign In' size='large' text onClick={() => signIn(undefined, { callbackUrl: '/' })} />
    )
}

export default SigninButton
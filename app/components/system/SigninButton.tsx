'use client'
import React, { useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from 'primereact/button';
import showMessage from './ShowMessage';
import { SupabaseClient } from './SupaConx';
import { MessageSeverity } from 'primereact/api';

const supabase = SupabaseClient.getSupabaseClient();

const SigninButton = () => {
    const { data: session } = useSession();    

    useEffect(() => {
        let ignore = false
        const loadData = async () => {
          try {
            // Notify the user that the server is spinning up
            showMessage('warn', 'Server Spinning Up', 'Please wait...');
            const { data:result, error } = await supabase
            .from("users")
            .select('firstName')
            
            // Update the message once the server is up
            showMessage('success', 'Server is Up', 'Data loaded successfully.');
          } catch (error) {
            console.log(error);
            // Notify the user about the server error
            showMessage('error', 'Server Error', 'An error occurred.');
          }
        };
    
        loadData();
      }, []);

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
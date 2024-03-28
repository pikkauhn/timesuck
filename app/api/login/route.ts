import { signJwtAccessToken } from '@/app/lib/jwt';
import { NextRequest, NextResponse } from 'next/server';
import * as argon2 from 'argon2';

import { SupabaseClient } from '@/app/components/system/SupaConx';
const supabase = SupabaseClient.getSupabaseClient();

interface RequestBody{
    username: string;
    password: string;
}

export async function POST(request: NextRequest) {
    const body:RequestBody = await request.json();
    const { data: user, error: findUserError } = await supabase
    .from('users')
    .select('*')
    .eq('email', body.username)
    .single();

    if (findUserError) {
        console.error('Error finding user: ', findUserError);
        throw new Error("User does not exist");
    }


    if (user && ( await argon2.verify(user.password, body.password))) {
        const {password, ...userWithoutPass} = user;
        const accessToken = signJwtAccessToken(userWithoutPass);
        const result = {
            ...userWithoutPass,
            accessToken,
        }
        return new Response(JSON.stringify(result));
    }
    else {
        throw new Error("Invalid Credentials");
    };
}
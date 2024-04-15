import Watch from '@/app/components/Watch';
import React from 'react';

interface Params {
    id: string;
}

export default function page({ params }: {
    params: Params,
}) {
    const watchId = params.id;

    return (
        <>
        <Watch videoId={watchId} />
        </>
    )
}
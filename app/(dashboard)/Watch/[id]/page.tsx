import Watch from '@/app/components/Watch';
import React from 'react';

export default function page({ params }: {
    params: Params,
}) {
    const watchId = params.id;

    return (
        <div className='pageContainer'>
            <Watch videoId={watchId} />
        </div>
    )
}
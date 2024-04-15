'use client'
import React from 'react'

interface RequestProps {
    videoId: string;
}

export default function Watch({ videoId }: RequestProps) {

    console.log(videoId);
    const link = `https://www.youtube.com/embed/${videoId}?autoplay=0`;

    return(
        <div className='container'>
            <iframe 
            id='ytplayter'
            width='900'
            height='500'
            frameBorder='0'
            src={link}

            />
        </div>
    )
}
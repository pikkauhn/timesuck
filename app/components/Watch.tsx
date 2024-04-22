'use client'
import React from 'react'



export default function Watch({ videoId }: RequestProps) {
    const link = `https://www.youtube.com/embed/${videoId}?autoplay=0`;

    return (
        <div className='videoContainer'>
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
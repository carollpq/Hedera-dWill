import React from 'react';
import {Newsreader} from "next/font/google";
import Image from "next/image";

const newsreader = Newsreader({subsets: ['latin']});

interface GlassCardProps {
    title: string;
    description: string;
    img: string;
    alt: string;
    className?: string;
}


export default function GlassCard({title, img, description, alt, className = ''}: GlassCardProps) {
    return (
        <div data-property-1="Default"
            className={`
                w-96 h-[500px] px-10 py-14 
                bg-gradient-to-br from-white/20 to-white/0 rounded-[20px] 
                shadow-[0px_12px_34px_0px_rgba(0,0,0,0.25)] outline outline-1 
                outline-offset-[-1px] outline-white/50 backdrop-blur-xl inline-flex 
                justify-center items-center gap-2 hover:cursor-pointer hover:bg-white/20
                ${className}
            `}
        >
            <div className="w-full h-full">
                <Image src={img} alt={alt} width={300} height={300}/>
                <h3 className={`text-3xl font-[400] my-5 text-start ${newsreader.className} `}>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    )
}
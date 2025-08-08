import React, { ReactNode } from 'react';
import { Newsreader } from "next/font/google";
import Image from "next/image";

const newsreader = Newsreader({ subsets: ['latin'] });

interface RoleCardProps {
    title: string;
    src: string;
    alt: string;
    btnText: string;
    className?: string;
    onClick?: () => void;
    children?: ReactNode;
}

export default function RoleCard({
    title,
    src,
    alt,
    btnText,
    className = '',
    onClick,
    children
}: RoleCardProps) {
    return (
        <div
            data-property-1="Role Card"
            className={`px-10 py-14 bg-gradient-to-br
             from-black/60 to-black/0 hover:from-white/50 hover:to-white/0 rounded-[20px] shadow-[0px_12px_34px_0px_rgba(0,0,0,0.25)]
             outline outline-black/50 hover:outline-white/50 backdrop-blur-xl
             inline-flex justify-start items-center gap-2 hover:cursor-pointer ${className}`}
        >
            <div className="w-72 inline-flex flex-col justify-start items-center gap-7">
                <div className={`self-stretch text-center justify-start text-white text-4xl font-normal ${newsreader.className}`}>
                    {title}
                </div>
                <div className="w-32 h-32 relative overflow-hidden flex flex-col justify-center items-center">
                    <Image src={src} alt={alt} width={300} height={300} />
                </div>
                
                {children}
                <button
                    onClick={onClick}
                    data-property-1="cta"
                    className="w-44 h-14 py-2 relative bg-fuchsia-500/10 bg-gradient-to-br from-black/50 to-black/0 rounded-lg shadow-[0px_12px_34px_0px_rgba(0,0,0,0.25)] outline outline-black/50 hover:outline-white/50 backdrop-blur-blur inline-flex justify-center items-center gap-2"
                >
                    <span className="align-middle text-white text-xl font-normal font-['Quicksand']">
                        {btnText}
                    </span>
                </button>
            </div>
        </div>
    );
}

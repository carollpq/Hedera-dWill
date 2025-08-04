"use client";

import {Newsreader} from "next/font/google";
import RoleCard from "@/components/RoleCard";

const newsreader = Newsreader({ subsets: ['latin'] });

export default function RoleSelection() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center text-white/70 py-20 relative">
            <div
                className="absolute -z-10"
                style={{
                    width: '300px',
                    height: '500px',
                    transform: 'rotate(-26.465deg)',
                    flexShrink: 0,
                    borderRadius: '492.006px',
                    background: 'linear-gradient(180deg, #DC00D3 31.73%, #03FAF5 100%)',
                    filter: 'blur(175px)',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%) rotate(-26.465deg)'
                }}
            />
            <h1 className={`text-5xl font-[400] mb-8 text-start ${newsreader.className} `}>Ready to Start?</h1>
            <div className="flex flex-row gap-[7rem]">
                <RoleCard title="I am a benefactor" src="/benefactor.png" alt="A picture of a treasure chest" btnText="Subscribe" status="subscribed"/>
                <RoleCard title="I am a beneficiary" src="/beneficiary.png" alt="A picture of a coin" btnText="Sign Up" status="signed up"/>
            </div>
        </div>
    );
}
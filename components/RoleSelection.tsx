"use client";

import {Newsreader} from "next/font/google";
import GlassCard from "@/components/GlassCard";

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
                    transform: 'translate(-50%, -60%) rotate(-26.465deg)'
                }}
            />
            <h1 className={`text-5xl font-[400] mb-8 text-start ${newsreader.className} `}>Ready to Start?</h1>
            <div className="flex flex-row gap-10">
                <GlassCard title="Assign Beneficiaries" img="/add-beneficiary.png" alt="A picture of a man adding beneficiaries" description="Generate your keys and assign your beneficiaries files dedicated just for them."/>
                <GlassCard title="Upload Documents" img="/upload-files.png" alt="A picture of a man uploading files" description="Encrypt and upload your files to the IPFS network."/>
                <GlassCard title="Enable Switch" img="/enable-switch.png" alt="A picture of a switch"description="Enable your very own dead mans switch."/>
            </div>
        </div>
    );
}
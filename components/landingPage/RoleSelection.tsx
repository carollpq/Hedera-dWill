"use client";

import {Newsreader} from "next/font/google";
import GlassCard from "@/components/GlassCard";
import RoleCard from "@/components/RoleCard";
import { useWalletConnect } from "@/hooks/useWalletConnect";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const newsreader = Newsreader({ subsets: ['latin'] });


export default function RoleSelection() {
    const { accountId, open, setOpen, handleConnect } = useWalletConnect();
    const router = useRouter();

    const handleSignIn = async (role: 'benefactor' | 'beneficiary') => {
        if (accountId) {
            console.log("Connected to wallet with account ID:" + accountId);
            // Optionally store role in localStorage, context, or state if needed
            localStorage.setItem('userRole', role); 
            router.push("/dashboard");

        } else {
            alert("Connect wallet first.");
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center text-white/70 py-20 relative">
            {/* Blurred background */}
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
                <RoleCard 
                    title="I am a benefactor"
                    src="/benefactor.png"
                    alt="A picture of a treasure chest"
                    btnText="Sign In"
                    status="benefactor"
                    onClick={() => handleSignIn("benefactor")}
                />
                <RoleCard 
                    title="I am a beneficiary"
                    src="/beneficiary.png"
                    alt="A picture of a coin"
                    btnText="Sign In"
                    status="beneficiary"
                    onClick={() => handleSignIn("beneficiary")}
                />
            </div>
        </div>
    );
}

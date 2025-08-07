"use client";

import {Newsreader} from "next/font/google";
import RoleCard from "@/components/RoleCard";
import {useWalletConnect} from "@/hooks/useWalletConnect";
import {useRouter} from "next/navigation";
import {useState} from "react";

const newsreader = Newsreader({subsets: ["latin"]});

export default function RoleSelection() {
    const {accountId, handleConnect} = useWalletConnect();
    const router = useRouter();

    const [benefactorKey, setBenefactorKey] = useState("");
    const [beneficiaryKey, setBeneficiaryKey] = useState("");

    const handleSignIn = async (
        role: "benefactor" | "beneficiary",
        publicKey: string
    ) => {
        if (!accountId) {
            alert("Please connect your wallet first.");
            return;
        }

        if (!publicKey || publicKey.length < 20) {
            alert("Please enter a valid public key.");
            return;
        }

        localStorage.setItem("userRole", role);
        localStorage.setItem("accoutnId", accountId);
        localStorage.setItem("publicKey", publicKey);

        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center text-white/70 py-20 relative">
            {/* Blurred background */}
            <div
                className="absolute -z-10"
                style={{
                    width: "300px",
                    height: "500px",
                    transform: "rotate(-26.465deg)",
                    flexShrink: 0,
                    borderRadius: "492.006px",
                    background:
                        "linear-gradient(180deg, #DC00D3 31.73%, #03FAF5 100%)",
                    filter: "blur(175px)",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%) rotate(-26.465deg)",
                }}
            />
            <h1
                className={`text-5xl font-[400] mb-8 text-start ${newsreader.className}`}
            >
                Ready to Start?
            </h1>

            <div className="flex flex-row gap-[7rem]">
                {/* Benefactor Card */}
                <RoleCard title="I am a benefactor" src="/benefactor.png" alt="A picture of a treasure chest"
                          btnText="Subscribe" onClick={() => handleSignIn("benefactor", benefactorKey)} children={<input
                    type="text"
                    placeholder="Enter your public key"
                    value={benefactorKey}
                    onChange={(e) => setBenefactorKey(e.target.value)}
                    className="w-full p-3 rounded-md text-md text-black bg-white/50"
                />}/>
                <RoleCard title="I am a beneficiary" src="/beneficiary.png" alt="A picture of a coin" btnText="Sign Up"
                          onClick={() => handleSignIn("beneficiary", beneficiaryKey)} children={<input
                    type="text"
                    placeholder="Enter your public key"
                    value={beneficiaryKey}
                    onChange={(e) => setBeneficiaryKey(e.target.value)}
                    className="w-full p-3 rounded-md text-md text-black bg-white/50"
                />}/>
            </div>
        </div>
    );
}

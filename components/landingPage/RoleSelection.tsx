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
    const [showDialog, setShowDialog] = useState(false);
    const [enteredBenefactorAddress, setEnteredBenefactorAddress] = useState("");

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

        if (role === "benefactor") {
            // Store directly and go to dashboard
            localStorage.setItem("userRole", role);
            localStorage.setItem("accountId", accountId);
            localStorage.setItem("publicKey", publicKey);
            router.push("/dashboard");
        } else if (role === "beneficiary") {
            // Show popup for benefactor address input
            setShowDialog(true);
        }
    };

    const handleGoToDashboard = () => {
        if (!enteredBenefactorAddress || enteredBenefactorAddress.length < 10) {
            alert("Please enter a valid benefactor address.");
            return;
        }

        localStorage.setItem("userRole", "beneficiary");
        localStorage.setItem("accountId", accountId);
        localStorage.setItem("publicKey", beneficiaryKey);
        localStorage.setItem("benefactorAddress", enteredBenefactorAddress);

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

            <h1 className={`text-5xl font-[400] mb-8 text-start ${newsreader.className}`}>
                Ready to Start?
            </h1>

            <div className="flex flex-row gap-[7rem]">
                {/* Benefactor Card */}
                <RoleCard
                    title="I am a benefactor"
                    src="/benefactor.png"
                    alt="A picture of a treasure chest"
                    btnText="Sign In"
                    onClick={() => handleSignIn("benefactor", benefactorKey)}
                    children={
                        <input
                            type="text"
                            placeholder="Enter your public key"
                            value={benefactorKey}
                            onChange={(e) => setBenefactorKey(e.target.value)}
                            className="w-full p-3 rounded-md text-md text-black bg-white/50"
                        />
                    }
                />

                {/* Beneficiary Card */}
                <RoleCard
                    title="I am a beneficiary"
                    src="/beneficiary.png"
                    alt="A picture of a coin"
                    btnText="Sign In"
                    onClick={() => handleSignIn("beneficiary", beneficiaryKey)}
                    children={
                        <input
                            type="text"
                            placeholder="Enter your public key"
                            value={beneficiaryKey}
                            onChange={(e) => setBeneficiaryKey(e.target.value)}
                            className="w-full p-3 rounded-md text-md text-black bg-white/50"
                        />
                    }
                />
            </div>

            {/* Benefactor Address Dialog */}
            {showDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-gray-900 text-white p-8 rounded-xl shadow-2xl w-[350px] flex flex-col gap-4">
                <h2 className="text-xl font-semibold text-center">Enter Benefactor Address</h2>
                <input
                    type="text"
                    placeholder="Benefactor account ID"
                    value={enteredBenefactorAddress}
                    onChange={(e) => setEnteredBenefactorAddress(e.target.value)}
                    className="w-full p-3 rounded-md text-md bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                    onClick={handleGoToDashboard}
                    className="w-full bg-purple-700 hover:bg-purple-900 text-white font-semibold py-2 px-4 rounded-lg text-sm transition"
                >
                    Go to Dashboard
                </button>
                <button
                    onClick={() => setShowDialog(false)}
                    className="text-sm text-purple-400 hover:underline text-center mt-2"
                >
                    Cancel
                </button>
                </div>
            </div>
            )}
        </div>
    );
}

"use client";

import { Newsreader } from "next/font/google";
import GlassCard from "@/components/GlassCard";
import { useWalletConnect } from "@/hooks/useWalletConnect";
import { useRouter } from "next/navigation";
import { useState } from "react";

const newsreader = Newsreader({ subsets: ["latin"] });

export default function RoleSelection() {
  const { accountId, handleConnect } = useWalletConnect();
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
        <div className="flex flex-col gap-4 items-center bg-white/5 p-6 rounded-2xl w-[280px]">
          <img
            src="/benefactor.png"
            alt="A picture of a treasure chest"
            className="w-32 h-32 object-contain"
          />
          <h2 className="text-xl font-semibold text-white">I am a benefactor</h2>
          <input
            type="text"
            placeholder="Enter your public key"
            value={benefactorKey}
            onChange={(e) => setBenefactorKey(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm text-black"
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full transition"
            onClick={() => handleSignIn("benefactor", benefactorKey)}
          >
            Sign In
          </button>
        </div>

        {/* Beneficiary Card */}
        <div className="flex flex-col gap-4 items-center bg-white/5 p-6 rounded-2xl w-[280px]">
          <img
            src="/beneficiary.png"
            alt="A picture of a coin"
            className="w-32 h-32 object-contain"
          />
          <h2 className="text-xl font-semibold text-white">I am a beneficiary</h2>
          <input
            type="text"
            placeholder="Enter your public key"
            value={beneficiaryKey}
            onChange={(e) => setBeneficiaryKey(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm text-black"
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full transition"
            onClick={() => handleSignIn("beneficiary", beneficiaryKey)}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

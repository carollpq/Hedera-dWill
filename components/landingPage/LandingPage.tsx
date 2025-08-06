"use client";

import { Newsreader, Nixie_One } from "next/font/google";
import Image from "next/image";
import NavBtn from "@/components/NavBtn";
import ScrollIndicator from "../ScrollIndicator";
import React, { useRef } from "react";
import RoleSelection from "./RoleSelection";

const newsreader = Newsreader({ subsets: ["latin"] });
const nixieOne = Nixie_One({ weight: ["400"], subsets: ["latin"] });

export default function LandingPage() {
  const roleSelectionRef = useRef<HTMLDivElement>(null);

  const scrollToRoleSelection = () => {
    if (roleSelectionRef.current) {
      roleSelectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="min-h-screen flex flex-row items-center justify-between w-full max-w-7xl px-4 gap-8">
        <div className="flex-1 flex flex-col items-start justify-center gap-10">
          <h1 className={`text-8xl ${newsreader.className} font-[400]`}>
            dWill<sup>H</sup>
          </h1>
          <h2 className={`text-4xl ${nixieOne.className}`}>
            Decentralized Inheritance
          </h2>
          <div className="flex flex-row items-start">
            <NavBtn text="Learn More" variant="outline" className="mt-4" />
            <NavBtn
              text="Start"
              variant="cta"
              className="mt-4"
              onClick={scrollToRoleSelection}
            />
          </div>
        </div>

        <div className="flex-1 relative h-[500px] flex items-center justify-center">
          <div className="relative">
            <div
              className="absolute -z-10"
              style={{
                width: "400px",
                height: "480px",
                transform: "rotate(-26.465deg)",
                flexShrink: 0,
                borderRadius: "492.006px",
                background:
                  "linear-gradient(180deg, #DC00D3 31.73%, #03FAF5 100%)",
                filter: "blur(175px)",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -60%) rotate(-26.465deg)",
              }}
            />
            <div className="relative z-10">
              <Image
                src="/hedera_token.png"
                alt="Decorative"
                width={400}
                height={400}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <ScrollIndicator />

      <div ref={roleSelectionRef}>
        <RoleSelection />
      </div>
    </div>
  );
}

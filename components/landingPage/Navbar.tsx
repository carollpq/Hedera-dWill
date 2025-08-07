"use client";

import { useCallback } from 'react';
import NavBtn from "@/components/NavBtn";
import { useWalletConnect } from "@/hooks/useWalletConnect";
import { WalletSelectionDialog } from "@/components/WalletSelectionDialog";
import Link from 'next/link';
import Image from 'next/Image';

export default function Navbar() {
    const { accountId, open, setOpen, handleConnect } = useWalletConnect();

    const scrollToSection = useCallback((sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    return (
        <>
            <header className="fixed top-0 left-0 w-screen flex items-center justify-between px-[160px] py-[20px] z-50 bg-transparent backdrop-blur-lg">
                <Link
                    href="/"
                    className="hover:cursor-pointer block"
                    onClick={(e) => {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                >
                    <Image
                        src="/logo.png"
                        alt="dWill Logo"
                        width={140}
                        height={60}
                        priority
                    />
                </Link>
                <div className="flex items-center text-xl">
                    <NavBtn
                        text="Home"
                        variant="primary"
                        onClick={() => scrollToSection('home')}
                        className="mr-2"
                    />
                    <NavBtn
                        text="About"
                        variant="primary"
                        onClick={() => scrollToSection('about')}
                        className="mx-2"
                    />
                    <NavBtn
                        text={accountId ? `Connected: ${accountId}` : "Connect"}
                        variant="cta"
                        onClick={handleConnect}
                        className="ml-2"
                    />
                </div>
            </header>

            {/* Wallet dialog appears when user clicks "Connect" */}
            <WalletSelectionDialog
                open={open}
                setOpen={setOpen}
                onClose={() => setOpen(false)}
            />
        </>
    );
}
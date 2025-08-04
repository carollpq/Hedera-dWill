import type { Metadata } from "next";
import "../globals.css";
import { Quicksand } from "next/font/google";
import Sidebar from "@/components/Sidebar";

const quicksand = Quicksand({ weight: ["400"], subsets: ["latin"] });

export const metadata: Metadata = {
    title: "dWill",
    description: "Decentralized Inheritance",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={quicksand.className}>
            <div className="flex h-screen">
                <Sidebar />
                <main className="flex-1 p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

import type {Metadata} from "next";
import {Quicksand, Newsreader} from 'next/font/google';
import "./globals.css";
import { DashboardProvider } from "@/context/DashboardContext";

const quicksand = Quicksand({weight: ["400"], subsets: ['latin']});


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
        <html lang="en">
        <body
            className={`${quicksand.className} antialiased`}
        >
            <DashboardProvider>
                {children}
            </DashboardProvider>
        </body>
        </html>
    );
}

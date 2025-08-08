'use client';

import Link from 'next/link';
import Image from 'next/image';
import {Home, Upload, Lock, Users} from 'lucide-react';
import {useDashboardContext} from '@/context/DashboardContext';
import {useWalletConnect} from "@/hooks/useWalletConnect";
import { useEffect, useState } from "react";
import { FileText } from 'lucide-react';

export default function Sidebar() {

    // New state to track role
        const [userRole, setUserRole] = useState<"benefactor" | "beneficiary" | null>(null);
    
        // Load user role from localStorage on mount
        useEffect(() => {
            const role = localStorage.getItem("userRole") as "benefactor" | "beneficiary" | null;
            setUserRole(role);
        }, []);

    const {
        isKeySet,
        isEncryptPage,
        isUploadPage,
        setIsEncryptPage,
        setIsUploadPage,
        isAssignBeneficiariesPage,
        setIsAssignBeneficiariesPage,
        isViewDocumentsPage,
        setIsViewDocumentsPage,
    } = useDashboardContext();

    const {accountId, open, setOpen, handleConnect} = useWalletConnect();

    // Role-based sidebar items
const navItems = userRole === "benefactor"
    ? [
        {
            name: 'Upload Assets',
            onClick: () => {
                setIsUploadPage(true);
                setIsEncryptPage(false);
                setIsAssignBeneficiariesPage(false);
                setIsViewDocumentsPage(false);
            },
            icon: Upload,
            isActive: isUploadPage,
        },
        {
            name: 'Encrypt Assets',
            onClick: () => {
                setIsEncryptPage(true);
                setIsUploadPage(false);
                setIsAssignBeneficiariesPage(false);
                setIsViewDocumentsPage(false);
            },
            icon: Lock,
            isActive: isEncryptPage,
        },
        {
            name: 'Assign Beneficiaries',
            onClick: () => {
                setIsAssignBeneficiariesPage(true);
                setIsUploadPage(false);
                setIsEncryptPage(false);
                setIsViewDocumentsPage(false);
            },
            icon: Users,
            isActive: isAssignBeneficiariesPage,
        },
        {
            name: 'View Assets',
            onClick: () => {
                setIsViewDocumentsPage(true);
                setIsEncryptPage(false);
                setIsUploadPage(false);
                setIsAssignBeneficiariesPage(false);
            },
            icon: FileText,
            isActive: isViewDocumentsPage,
        },
    ]
    : userRole === "beneficiary"
    ? [
        {
            name: 'Download Inheritance',
            onClick: () => {
                setIsUploadPage(true);
                setIsEncryptPage(false);
                setIsAssignBeneficiariesPage(false);
                setIsViewDocumentsPage(false);
            },
            icon: Upload,
            isActive: isUploadPage,
        },
        {
            name: 'Decrypt Assets',
            onClick: () => {
                setIsEncryptPage(true);
                setIsUploadPage(false);
                setIsAssignBeneficiariesPage(false);
                setIsViewDocumentsPage(false);
            },
            icon: Lock,
            isActive: isEncryptPage,
        },
        // {
        //     name: 'View Inheritance',
        //     onClick: () => {
        //         setIsViewDocumentsPage(true);
        //         setIsEncryptPage(false);
        //         setIsUploadPage(false);
        //         setIsAssignBeneficiariesPage(false);
        //     },
        //     icon: FileText,
        //     isActive: isViewDocumentsPage,
        // },
    ]
    : [];


    return (
        <div className="w-64 h-screen bg-black/50 text-white p-4 flex flex-col">
            <Link href="/" className="mb-8 p-2 hover:cursor-pointer block">
                <Image
                    src="/logo.png"
                    alt="dWill Logo"
                    width={120} // Adjust width as needed
                    height={40} // Adjust height as needed
                    priority
                />
            </Link>
            <nav className="flex-1">
                <ul className="space-y-2">
                    {/* Home is always shown */}
                    <li key="Home">
                        <div
                            onClick={() => {
                                setIsUploadPage(false);
                                setIsEncryptPage(false);
                                setIsAssignBeneficiariesPage(false);
                                setIsViewDocumentsPage(false);
                            }}

                            className={`flex items-center p-3 rounded-lg transition-colors hover:cursor-pointer ${
                                !isUploadPage && !isEncryptPage && !isAssignBeneficiariesPage
                                    ? 'bg-blue-600 text-white'
                                    : isKeySet ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                                        : "text-gray-300 pointer-events-none"
                            }`}
                        >
                            <Home className="w-5 h-5 mr-3"/>
                            Home
                        </div>
                    </li>

                    {/* Role-specific items */}
                    {navItems.map((item) => {
                        const isActive = item.isActive;
                        return (
                            <li key={item.name}>
                                <div
                                    onClick={item.onClick}
                                    className={`flex items-center p-3 rounded-lg transition-colors hover:cursor-pointer ${
                                        isActive
                                            ? 'bg-blue-600 text-white'
                                            : isKeySet ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                                                : "text-gray-300 pointer-events-none"
                                    }`}
                                >
                                    <item.icon className="w-5 h-5 mr-3"/>
                                    {item.name}
                                </div>
                            </li>
                        );
                    })}
                </ul>

            </nav>
        </div>
    );
}

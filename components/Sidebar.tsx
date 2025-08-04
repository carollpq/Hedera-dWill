'use client';

import Link from 'next/link';
import { Home, Upload, Lock } from 'lucide-react';
import { useDashboardContext } from '@/context/DashboardContext';

export default function Sidebar() {

    const { isEncryptPage, isUploadPage, setIsEncryptPage, setIsUploadPage } = useDashboardContext();


    const navItems = [
        { name: 'Home', onClick: () => { setIsUploadPage(false); setIsEncryptPage(false)}, icon: Home, isActive: !isUploadPage && !isEncryptPage },
        { name: 'Upload', onClick: () => { setIsUploadPage(true); setIsEncryptPage(false)}, icon: Upload, isActive: isUploadPage && !isEncryptPage },
        { name: 'Encrypt', onClick: () => { setIsEncryptPage(true); setIsUploadPage(false)}, icon: Lock, isActive: isEncryptPage && !isUploadPage },
    ];

    return (
        <div className="w-64 h-screen bg-black/50 text-white p-4 flex flex-col">
            <Link href="/" className="text-2xl font-bold mb-8 p-2 hover:cursor-pointer">dWill</Link>
            <nav className="flex-1">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const isActive = item.isActive;
                        return (
                            <li key={item.name}>
                                <div onClick={item.onClick}
                                    className={`flex items-center p-3 rounded-lg transition-colors hover:cursor-pointer ${
                                        isActive
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
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
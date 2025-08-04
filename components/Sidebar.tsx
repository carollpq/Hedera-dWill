'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Upload, Lock } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();
    
    const navItems = [
        { name: 'Home', href: '/dashboard', icon: Home },
        { name: 'Upload', href: '/dashboard/upload', icon: Upload },
        { name: 'Encrypt', href: '/dashboard/encrypt', icon: Lock },
    ];

    return (
        <div className="w-64 h-screen bg-black/50 text-white p-4 flex flex-col">
            <Link href="/" className="text-2xl font-bold mb-8 p-2 hover:cursor-pointer">dWill</Link>
            <nav className="flex-1">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center p-3 rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}
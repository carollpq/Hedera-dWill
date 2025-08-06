'use client';

import Link from 'next/link';
import Image from 'next/Image';
import { Home, Upload, Lock, Users } from 'lucide-react';
import { useDashboardContext } from '@/context/DashboardContext';
import { useWalletConnect } from "@/hooks/useWalletConnect";

export default function Sidebar() {
  const {
    isEncryptPage,
    isUploadPage,
    setIsEncryptPage,
    setIsUploadPage,
    isAssignBeneficiariesPage,
    setIsAssignBeneficiariesPage
  } = useDashboardContext();

  const { accountId, open, setOpen, handleConnect } = useWalletConnect();

  const navItems = [
    {
      name: 'Home',
      onClick: () => {
        setIsUploadPage(false);
        setIsEncryptPage(false);
        setIsAssignBeneficiariesPage(false);
      },
      icon: Home,
      isActive: !isUploadPage && !isEncryptPage && !isAssignBeneficiariesPage,
    },
    {
      name: 'Upload Assets',
      onClick: () => {
        setIsUploadPage(true);
        setIsEncryptPage(false);
        setIsAssignBeneficiariesPage(false);
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
      },
      icon: Users,
      isActive: isAssignBeneficiariesPage,
    },
  ];

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
          {navItems.map((item) => {
            const isActive = item.isActive;
            return (
              <li key={item.name}>
                <div
                  onClick={item.onClick}
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

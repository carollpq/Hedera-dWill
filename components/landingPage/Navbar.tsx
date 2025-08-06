"use client";

import NavBtn from "@/components/NavBtn";
import { useWalletConnect } from "@/hooks/useWalletConnect";
import { WalletSelectionDialog } from "@/components/WalletSelectionDialog";
import Link from 'next/link';
import Image from 'next/Image';


export default function Navbar() {
  const { accountId, open, setOpen, handleConnect } = useWalletConnect();

  return (
    <>
      <header className="absolute top-0 left-0 w-screen flex items-center justify-between px-[160px] py-[40px]">
        <Link href="/" className="mb-8 p-2 hover:cursor-pointer block">
          <Image
            src="/logo.png"
            alt="dWill Logo"
            width={140} // Adjust width as needed
            height={60} // Adjust height as needed
            priority
          />
        </Link>
        <div className="flex items-center text-xl">
          <NavBtn text="Home" variant="primary" />
          <NavBtn text="About" variant="primary" />
          <NavBtn
            text={accountId ? `Connected: ${accountId}` : "Connect"}
            variant="cta"
            onClick={handleConnect}
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

"use client";

import NavBtn from "@/components/NavBtn";
import { useWalletConnect } from "@/hooks/useWalletConnect";
import { WalletSelectionDialog } from "@/components/WalletSelectionDialog";

export default function Navbar() {
  const { accountId, open, setOpen, handleConnect } = useWalletConnect();

  return (
    <>
      <header className="absolute top-0 left-0 w-screen flex items-center justify-between px-[160px] py-[40px]">
        <div className="text-2xl">Logo</div>
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

import { useEffect, useState } from 'react';
import { useWalletInterface } from '@/services/wallets/useWalletInterface';

export function useWalletConnect() {
  const [open, setOpen] = useState(false);
  const { accountId, walletInterface } = useWalletInterface();

  const handleConnect = async () => {
    if (accountId) {
      walletInterface.disconnect();
    } else {
      setOpen(true);
    }
  };

  useEffect(() => {
    if (accountId) {
      setOpen(false);
    }
  }, [accountId]);

  return {
    accountId,
    open,
    setOpen,
    handleConnect,
  };
}

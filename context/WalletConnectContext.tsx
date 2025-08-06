// context/WalletConnectContext.tsx
"use client";

import { createContext, useState, ReactNode } from "react";

interface WalletConnectContextType {
  accountId: string;
  setAccountId: (newValue: string) => void;
  isConnected: boolean;
  setIsConnected: (newValue: boolean) => void;
  publicKey: string | null;
  setPublicKey: (key: string | null) => void;
}

const defaultValue: WalletConnectContextType = {
  accountId: '',
  setAccountId: () => {},
  isConnected: false,
  setIsConnected: () => {},
  publicKey: null,
  setPublicKey: () => {},
};

export const WalletConnectContext = createContext<WalletConnectContextType>(defaultValue);

export const WalletConnectContextProvider = (props: { children: ReactNode }) => {
  const [accountId, setAccountId] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  return (
    <WalletConnectContext.Provider
      value={{ accountId, setAccountId, isConnected, setIsConnected, publicKey, setPublicKey }}
    >
      {props.children}
    </WalletConnectContext.Provider>
  );
};

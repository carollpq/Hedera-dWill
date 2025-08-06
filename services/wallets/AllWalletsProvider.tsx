import { ReactNode } from "react"
import { WalletConnectContextProvider } from "../../context/WalletConnectContext"
import { WalletConnectClient } from "./walletconnect/walletConnectClient"

export const AllWalletsProvider = (props: {
  children: ReactNode | undefined
}) => {
  return (
      <WalletConnectContextProvider>
        <WalletConnectClient />
        {props.children}
      </WalletConnectContextProvider>
  )
}
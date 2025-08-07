"use client";

import { PrivateKey } from "@hashgraph/sdk"; //used for types to make a dummy operator for a query to fetch public key
import { WalletConnectContext } from "../../../context/WalletConnectContext";
import { useCallback, useContext, useEffect } from "react";
import { WalletInterface } from "../walletInterface";
import {
  AccountId,
  ContractExecuteTransaction,
  Transaction,
  ContractId,
  LedgerId,
  TokenAssociateTransaction,
  TokenId,
  TransferTransaction,
  Client,
  AccountInfoQuery,
} from "@hashgraph/sdk";
import { ContractFunctionParameterBuilder } from "../contractFunctionParameterBuilder";
import { appConfig } from "../../../config";
import { SignClientTypes } from "@walletconnect/types";
import {
  DAppConnector,
  HederaJsonRpcMethod,
  HederaSessionEvent,
  HederaChainId,
} from "@hashgraph/hedera-wallet-connect";
import EventEmitter from "events";

const refreshEvent = new EventEmitter();
const walletConnectProjectId = "377d75bb6f86a2ffd427d032ff6ea7d3";
const currentNetworkConfig = appConfig.networks.testnet;
const hederaNetwork = currentNetworkConfig.network;
const hederaClient = Client.forName(hederaNetwork);

let dappConnector: DAppConnector;
let walletConnectInitPromise: Promise<void> | undefined = undefined;

const initializeWalletConnect = async () => {
  if (typeof window === "undefined") return;

  if (!dappConnector) {
    const metadata: SignClientTypes.Metadata = {
      name: "Hedera CRA Template",
      description: "Hedera CRA Template",
      url: window.location.origin,
      icons: [window.location.origin + "/logo192.png"],
    };

    dappConnector = new DAppConnector(
      metadata,
      LedgerId.fromString(hederaNetwork),
      walletConnectProjectId,
      Object.values(HederaJsonRpcMethod),
      [HederaSessionEvent.ChainChanged, HederaSessionEvent.AccountsChanged],
      [HederaChainId.Testnet]
    );
  }

  if (walletConnectInitPromise === undefined) {
    walletConnectInitPromise = dappConnector.init();
  }

  await walletConnectInitPromise;
};

export const openWalletConnectModal = async () => {
  await initializeWalletConnect();
  await dappConnector.openModal().then(() => {
    refreshEvent.emit("sync");
  });
};

class WalletConnectWallet implements WalletInterface {
  public getSigner() {
    if (!dappConnector || dappConnector.signers.length === 0) {
      throw new Error("No signers found!");
    }
    return dappConnector.signers[0];
  }

  public getAccountId() {
    return AccountId.fromString(this.getSigner().getAccountId().toString());
  }

  async transferHBAR(toAddress: AccountId, amount: number) {
    const tx = new TransferTransaction()
      .addHbarTransfer(this.getAccountId(), -amount)
      .addHbarTransfer(toAddress, amount);

    const signer = this.getSigner();
    await tx.freezeWithSigner(signer);
    const result = await tx.executeWithSigner(signer);
    return result ? result.transactionId : null;
  }

  async transferFungibleToken(toAddress: AccountId, tokenId: TokenId, amount: number) {
    const tx = new TransferTransaction()
      .addTokenTransfer(tokenId, this.getAccountId(), -amount)
      .addTokenTransfer(tokenId, toAddress, amount);

    const signer = this.getSigner();
    await tx.freezeWithSigner(signer);
    const result = await tx.executeWithSigner(signer);
    return result ? result.transactionId : null;
  }

  async transferNonFungibleToken(toAddress: AccountId, tokenId: TokenId, serialNumber: number) {
    const tx = new TransferTransaction()
      .addNftTransfer(tokenId, serialNumber, this.getAccountId(), toAddress);

    const signer = this.getSigner();
    await tx.freezeWithSigner(signer);
    const result = await tx.executeWithSigner(signer);
    return result ? result.transactionId : null;
  }

  async associateToken(tokenId: TokenId) {
    const tx = new TokenAssociateTransaction()
      .setAccountId(this.getAccountId())
      .setTokenIds([tokenId]);

    const signer = this.getSigner();
    await tx.freezeWithSigner(signer);
    const result = await tx.executeWithSigner(signer);
    return result ? result.transactionId : null;
  }

  async executeContractFunction(
    contractId: ContractId,
    functionName: string,
    functionParameters: ContractFunctionParameterBuilder,
    gasLimit: number
  ) {
    const tx = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(gasLimit)
      .setFunction(functionName, functionParameters.buildHAPIParams());

    const signer = this.getSigner();
    await tx.freezeWithSigner(signer);
    const result = await tx.executeWithSigner(signer);
    return result ? result.transactionId : null;
  }

  async signTransaction(tx: Transaction): Promise<Transaction> {
    const signer = this.getSigner();
    await tx.freezeWithSigner(signer);
    return tx.signWithSigner(signer);
  }

  async getPublicKey(): Promise<string> {
    const publicKey = localStorage.getItem("publicKey");
    if (!publicKey) {
      throw new Error("Public key not found in localStorage. Please sign in again.");
    }
    return publicKey;
  }

  disconnect() {
    dappConnector.disconnectAll().then(() => {
      refreshEvent.emit("sync");
    });
  }
}

export const walletConnectWallet = new WalletConnectWallet();

export const WalletConnectClient = () => {
  const { setAccountId, setIsConnected, setPublicKey } = useContext(WalletConnectContext);

  const syncWithWalletConnectContext = useCallback(async () => {
    const accountId = dappConnector?.signers[0]?.getAccountId()?.toString();
    if (accountId) {
      setAccountId(accountId);
      setIsConnected(true);

    } else {
      setAccountId("");
      setIsConnected(false);
      setPublicKey("");
    }
  }, [setAccountId, setIsConnected, setPublicKey]);

  useEffect(() => {
    refreshEvent.addListener("sync", syncWithWalletConnectContext);
    initializeWalletConnect().then(syncWithWalletConnectContext);
    return () => {
      refreshEvent.removeListener("sync", syncWithWalletConnectContext);
    };
  }, [syncWithWalletConnectContext]);

  return null;
};

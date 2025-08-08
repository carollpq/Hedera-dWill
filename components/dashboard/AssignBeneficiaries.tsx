"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import HeaderWithActions from "@/components/HeaderWithActions";
import { useWalletConnect } from "@/hooks/useWalletConnect";
import { walletConnectWallet } from "@/services/wallets/walletconnect/walletConnectClient";
import { User } from "lucide-react";

import {
  AccountAllowanceApproveTransaction,
  TransferTransaction,
  Hbar,
  HbarUnit ,
  Client,
  PrivateKey,
  TransactionId,
  ScheduleCreateTransaction,
  ScheduleSignTransaction,
  AccountId,
  ScheduleInfoQuery
} from "@hashgraph/sdk";

const client = Client.forTestnet();
client.setOperator(
  AccountId.fromString(process.env.NEXT_PUBLIC_OPERATOR_ID!),
  PrivateKey.fromString(process.env.NEXT_PUBLIC_OPERATOR_KEY!)
);



interface Beneficiary {
  name: string;
  address: string;
  files: string[];
  funds: number; // HBAR
}

export default function AssignBeneficiaries() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newFunds, setNewFunds] = useState(""); // Track HBAR input
  const { accountId, open, setOpen, handleConnect } = useWalletConnect();

  const handleAdd = async () => {
    if (newAddress.trim()) {
      const funds = parseFloat(newFunds);
      setBeneficiaries((prev) => [
        ...prev,
        {
          name: newName || "Unnamed",
          address: newAddress,
          files: [],
          funds: isNaN(funds) ? 0 : funds,
        },
      ]);
      await approveHBARAllowance([
      ...beneficiaries,
      {
        name: newName || "Unnamed",
        address: newAddress,
        files: [],
        funds: isNaN(funds) ? 0 : funds,
      }
    ]);
      setNewName("");
      setNewAddress("");
      setNewFunds(""); // Reset input
    }
  };

  const approveHBARAllowance = async (beneficiariesToUse = beneficiaries) => {
    try {
      for (const b of beneficiariesToUse) {
        if (b.funds > 0) {
          const tx = new AccountAllowanceApproveTransaction()
            .approveHbarAllowance(accountId!, b.address, Hbar.from(b.funds, HbarUnit.Hbar))
            .setTransactionId(TransactionId.generate(accountId!)) // important for wallet signing
            .setNodeAccountIds([new AccountId(5)]) // since error mentions node 0.0.5
            .freezeWith(client);

          // Get bytes to send to wallet
          const txBytes = tx.toBytes();
          const signer = walletConnectWallet['getSigner'](); // Access the private method (see below if you want to make it public)

          // Sign with WalletConnect-connected wallet
          const response = await tx.executeWithSigner(signer); // <- your custom wallet hook method

          const receipt = await response.getReceipt(client);
          console.log(`Allowance set for ${b.address}:`, receipt.status.toString());
        }
      }
    } catch (error) {
      console.error("Failed to approve allowance:", error);
    }
  };


  const transferHBARFromAllowance = async () => {
    try {
      for (const b of beneficiaries) {
        if (b.funds > 0) {
          const transferTx = new TransferTransaction()
            .addApprovedHbarTransfer(accountId!, Hbar.from(b.funds, HbarUnit.Hbar).negated()) //to benefactor
            .addHbarTransfer(b.address, Hbar.from(b.funds, HbarUnit.Hbar)) // to beneficiary
            .freezeWith(client);
          // Get bytes to send to wallet
          const txBytes = transferTx.toBytes();
          // Sign with WalletConnect-connected wallet
          const response = await transferTx.execute(client);
          const receipt = await response.getReceipt(client);
          console.log(`Transferred ${b.funds} HBAR to ${b.address}:`, receipt.status.toString());
        }
      }
    } catch (error) {
      console.error("Transfer from allowance failed:", error);
    }
  };

  // Replace `signerKey1` with the appropriate signer key or WalletConnect signer as needed
  // and adjust `walletConnectWallet` usage if necessary.

  const scheduleTransferHBARFromAllowance = async (beneficiariesToUse = beneficiaries) => {
    try {
      const signer = walletConnectWallet['getSigner'](); // Use the signer from the wallet

      for (const b of beneficiariesToUse) {
        if (b.funds > 0) {
          // Step 1: Create the transaction
          const transferTx = new TransferTransaction()
            .addApprovedHbarTransfer(accountId!, Hbar.from(b.funds, HbarUnit.Hbar).negated())
            .addHbarTransfer(b.address, Hbar.from(b.funds, HbarUnit.Hbar))
            .setTransactionMemo(`Scheduled HBAR transfer to ${b.address}`)
            .freezeWith(client);

          // Step 2: Wrap in a schedule transaction
          const scheduleCreateTx = await new ScheduleCreateTransaction()
            .setScheduledTransaction(transferTx)
            .execute(client);

          const receipt = await scheduleCreateTx.getReceipt(client);
          const scheduleId = receipt.scheduleId;
          const scheduledTxId = receipt.scheduledTransactionId;
          console.log("Schedule created with ID:", scheduleId?.toString());

          // Step 3: Sign the scheduled transaction with the connected wallet
          const scheduleSignTx = new ScheduleSignTransaction()
            .setScheduleId(scheduleId)
            .freezeWith(client);

          const signedTx = await scheduleSignTx.signWithSigner(signer); // Use your custom WalletConnect hook to sign
          const executedTx = await signedTx.execute(client);

          const signReceipt = await executedTx.getReceipt(client);
          console.log("Signature receipt:", signReceipt.status.toString());

          // Optional: Query schedule info
          const query = await new ScheduleInfoQuery()
            .setScheduleId(scheduleId)
            .execute(client);
          console.log("Schedule Info:", query.toString());
        }
      }
    } catch (error) {
      console.error("Scheduling transfer from allowance failed:", error);
    }
  };


  return (
    <div className="space-y-6 p-6">
      <HeaderWithActions title="Assign Beneficiaries" />

      {/* Input Section */}
      <div className="bg-black/60 rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white mb-2">Add New Beneficiary</h2>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">
            Beneficiary Name (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Alice"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">
            Beneficiary Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="0.0.xxxxx or 0x..."
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">
            HBAR Funds (optional)
          </label>
          <input
            type="number"
            placeholder="e.g. 10"
            value={newFunds}
            onChange={(e) => setNewFunds(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
            min="0"
          />
        </div>

        <button
          onClick={handleAdd}
          disabled={!newAddress.trim()}
          className="hover:cursor-pointer w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-800 transition"
        >
          <Plus className="w-4 h-4" />
          Add Beneficiary
        </button>
        {/* <button
        onClick={transferHBARFromAllowance}
        className="hover:cursor-pointer w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-800 transition">
          TRIAL TRANSFER HBAR
        </button> */}
      </div>

      {/* Grid Section */}
      <div className="bg-gray-900 rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Assigned Beneficiaries</h2>
        {beneficiaries.length === 0 ? (
          <p className="text-white/70">No beneficiaries added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beneficiaries.map((b, i) => (
              <div
                key={i}
                className="rounded-xl p-6 bg-gray-800 text-white border border-purple-500/30 shadow-md flex flex-col items-center space-y-3"
              >
                <User className="w-10 h-10 text-purple-400" />
                <div className="text-center">
                  <p className="font-semibold text-lg">{b.name}</p>
                </div>

                <div className="w-full text-sm space-y-1 mt-2">
                  <div>
                    <span className="font-semibold text-white">Address:</span>
                    <p className="text-white/70 break-words">{b.address}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-white">Assets:</span>{" "}
                    <span className="text-white/80">{b.files.length} file(s)</span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">Funds:</span>{" "}
                    <span className="text-white/80">{b.funds} HBAR</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

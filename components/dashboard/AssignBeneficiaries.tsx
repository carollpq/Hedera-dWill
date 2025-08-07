"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import HeaderWithActions from "@/components/HeaderWithActions";
import { useWalletConnect } from "@/hooks/useWalletConnect";

interface Beneficiary {
  name: string;
  address: string;
  files: string[]; // Replace with file names or IDs
  funds: number;   // Replace with real token data
}

export default function AssignBeneficiaries() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const { accountId, open, setOpen, handleConnect } = useWalletConnect();

  const handleAdd = () => {
    if (newAddress.trim()) {
      setBeneficiaries((prev) => [
        ...prev,
        {
          name: newName || "Unnamed",
          address: newAddress,
          files: [],
          funds: 0,
        },
      ]);
      setNewName("");
      setNewAddress("");
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

      <button
        onClick={handleAdd}
        disabled={!newAddress.trim()}
        className="hover:cursor-pointer w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-800 transition"
      >
        <Plus className="w-4 h-4" />
        Add Beneficiary
      </button>
    </div>

      {/* Grid Section */}
      <div className="bg-black/60 rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Assigned Beneficiaries</h2>
        {beneficiaries.length === 0 ? (
          <p className="text-white/70">No beneficiaries added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {beneficiaries.map((b, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm"
              >
                <p className="font-medium text-gray-800">👤 {b.name}</p>
                <p className="text-sm text-gray-500 break-all">🏠 {b.address}</p>
                <p className="mt-2 text-sm text-gray-700">🗂 Files: {b.files.length}</p>
                <p className="text-sm text-gray-700">💰 Funds: {b.funds} HBAR</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

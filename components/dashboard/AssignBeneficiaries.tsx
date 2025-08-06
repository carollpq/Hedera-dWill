// app/dashboard/assign-beneficiaries/page.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

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
      <h1 className="text-3xl font-bold text-gray-900">Assign Beneficiaries</h1>

      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Add New Beneficiary</h2>
        <input
          type="text"
          placeholder="Beneficiary Name (optional)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2"
        />
        <input
          type="text"
          placeholder="Beneficiary Address"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2"
        />
        <button
          onClick={handleAdd}
          disabled={!newAddress.trim()}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          Add Beneficiary
        </button>
      </div>

      {/* Grid Section */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Assigned Beneficiaries</h2>
        {beneficiaries.length === 0 ? (
          <p className="text-gray-600">No beneficiaries added yet.</p>
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

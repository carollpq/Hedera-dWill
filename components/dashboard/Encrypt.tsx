"use client";

import React, { useRef, useState } from "react";
import { FileText, Lock, X } from "lucide-react";
import HeaderWithActions from "@/components/HeaderWithActions";
import { useWalletConnect } from "@/hooks/useWalletConnect";

// Encrypt component allows users to drag & drop a file, enter recipient info, and encrypt/download the file
export default function Encrypt() {
  // State for drag highlight, selected file, and recipient info
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [beneficiaryAddress, setBeneficiaryAddress] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { accountId, open, setOpen, handleConnect } = useWalletConnect();

  // Handle drag events to highlight drop area
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle file drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  // Handle file selection via input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Clear the selected file
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <HeaderWithActions title="Encrypt" />

      {/* Drag and Drop Section */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors relative ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{ cursor: "pointer" }}
      >
        {/* Hidden file input */}
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          onChange={handleChange}
        />
        {/* Lock icon */}
        <Lock className="w-8 h-8 text-blue-600 mb-2" />
        {/* File name or prompt */}
        <p className="text-gray-700 font-medium">
          {file
            ? `Selected: ${file.name}`
            : "Drag & drop your file here, or click to select"}
        </p>
        {/* Clear file button */}
        {file && (
          <button
            className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-1"
            onClick={handleClear}
            type="button"
            aria-label="Clear file"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </div>

      {/* Beneficiary info and action buttons */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Generate Secret Key and Download Files
        </h2>
        {/* Beneficiary Name input */}
        <input
          type="text"
          placeholder="Beneficiary Name"
          value={beneficiaryName}
          onChange={(e) => setBeneficiaryName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-2"
        />
        {/* Beneficiary Address input */}
        <input
          type="text"
          placeholder="Beneficiary Address"
          value={beneficiaryAddress}
          onChange={(e) => setBeneficiaryAddress(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-2"
        />
        {/* Generate Secret Key button */}
        <button
          className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition"
          //onClick={handleUpload}
          type="button"
          disabled={!file || !beneficiaryAddress}
        >
          Generate Secret Key
        </button>
        {/* Download button */}
        <button
          className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition"
          //onClick={handleUpload}
          type="button"
          disabled={!file || !beneficiaryAddress}
        >
          Download
        </button>
      </div>
    </div>
  );
}
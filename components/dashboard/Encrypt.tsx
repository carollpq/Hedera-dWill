"use client";

import React, { useRef, useState } from "react";
import { FileText, Lock, X } from "lucide-react";
import HeaderWithActions from "@/components/HeaderWithActions";
import { useWalletConnect } from "@/hooks/useWalletConnect";

// Converts text key to AES-GCM CryptoKey
async function deriveKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("deadman-switch-salt"), // salt must be consistent for both sides
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// Encrypts the file using the derived AES key
async function encryptFile(file: File, secretKey: string): Promise<Blob> {
  const key = await deriveKey(secretKey);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV

  const fileData = await file.arrayBuffer();
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    fileData
  );

  // Prepend IV to encrypted data for decryption
  const combined = new Uint8Array(iv.byteLength + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.byteLength);

  return new Blob([combined], { type: "application/octet-stream" });
}

// Download blob as file
function downloadBlob(blob: Blob, name: string) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.click();
  URL.revokeObjectURL(link.href);
}


async function decryptFile(encryptedBlob: Blob, secretKey: string): Promise<Blob> {
  const key = await deriveKey(secretKey);
  const data = new Uint8Array(await encryptedBlob.arrayBuffer());

  const iv = data.slice(0, 12); // extract IV
  const ciphertext = data.slice(12); // extract encrypted content

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );

  return new Blob([decrypted], { type: "application/octet-stream" });
}



// Encrypt component allows users to drag & drop a file, enter recipient info, and encrypt/download the file
export default function Encrypt() {
  // State for drag highlight, selected file, and recipient info
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [beneficiaryPublicKey, setBeneficiaryPublicKey] = useState("");
  const [beneficiaryAddress, setBeneficiaryAddress] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isKeySet, setIsKeySet] = useState(false);
  const [secretKey, setSecretKey] = useState("");

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

  //function here to set the secrety key using the public key of the beneficiary and the benefactor's private key that was input earlier when they set up their account

  return (
    <div className="space-y-8">
      {/* Header */}
      <HeaderWithActions title="Encrypt" />

      {/* Drag and Drop Section */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors relative ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-black/60"
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
        <p className="text-white/70 font-medium">
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
      <div className="bg-black/60 rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white mb-4">
          Generate Secret Key and Download Files
        </h2>
        {/* Beneficiary Address input */}
        <input
          type="text"
          placeholder="Beneficiary Address"
          value={beneficiaryAddress}
          onChange={(e) => setBeneficiaryAddress(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-2"
        />
        {/* Beneficiary Public Key input */}
        <input
          type="text"
          placeholder="Beneficiary Public Key"
          value={beneficiaryPublicKey}
          onChange={(e) => setBeneficiaryPublicKey(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-2"
        />
        {/* Encrypt button */}
        <button
          className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition"
          onClick={async () => {
            setSecretKey(beneficiaryPublicKey); // Set the secret key to the beneficiary's public key for now
            if (!file || !secretKey.trim()) {
              alert("Missing file or secret key.");
              return;
            }

            try {
              // Read and log original file contents (text or binary preview)
              const originalArrayBuffer = await file.arrayBuffer();
              const originalText = new TextDecoder().decode(originalArrayBuffer.slice(0, 100));
              console.log("Original file preview:", originalText);

              // Encrypt
              const encryptedBlob = await encryptFile(file, secretKey);

              // Download encrypted
              downloadBlob(encryptedBlob, `${file.name}.encrypted`);

              // Decrypt for test (debug only)
              const decryptedBlob = await decryptFile(encryptedBlob, secretKey);
              const decryptedBuffer = await decryptedBlob.arrayBuffer();
              const decryptedText = new TextDecoder().decode(decryptedBuffer.slice(0, 100));
              console.log("Decrypted preview:", decryptedText);

            } catch (err) {
              console.error("Encryption or decryption failed:", err);
              alert("Encryption or decryption failed.");
            }
          }}

          type="button"
          disabled={!file || !beneficiaryAddress}
        >
          Encrypt
        </button>

      </div>
    </div>
  );
}
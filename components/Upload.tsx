"use client";

import React, { useRef, useState } from "react";
import { FileText, Upload as UploadIcon, X } from "lucide-react";

export default function Upload() {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [beneficiaryName, setBeneficiaryName] = useState("");
    const [beneficiaryAddress, setBeneficiaryAddress] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleUpload = () => {
        // Implement upload logic here
        alert("Uploading file...");
    };

    return (
        <div className="space-y-8">
            <div className="rounded-xl shadow-sm p-6">
                <h1 className="text-3xl font-bold text-white-900">Upload</h1>
            </div>

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
                <input
                    type="file"
                    ref={inputRef}
                    className="hidden"
                    onChange={handleChange}
                />
                <UploadIcon className="w-8 h-8 text-blue-600 mb-2" />
                <p className="text-gray-700 font-medium">
                    {file ? `Selected: ${file.name}` : "Drag & drop your file here, or click to select"}
                </p>
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

            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Enter beneficiary address to assign to:</h2>
                <input
                    type="text"
                    placeholder="Beneficiary Name"
                    value={beneficiaryName}
                    onChange={e => setBeneficiaryName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 mb-2"
                />
                <input
                    type="text"
                    placeholder="Beneficiary Address"
                    value={beneficiaryAddress}
                    onChange={e => setBeneficiaryAddress(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 mb-2"
                />
                <button
                    className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition"
                    onClick={handleUpload}
                    type="button"
                    disabled={!file || !beneficiaryAddress}
                >
                    Upload File
                </button>
            </div>
        </div>
    );
}
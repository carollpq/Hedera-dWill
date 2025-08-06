"use client";

import React, { useRef, useState } from "react";
import { FileText, Upload as UploadIcon, X } from "lucide-react";
import HeaderWithActions from "@/components/HeaderWithActions";
import {
    FileCreateTransaction,
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType,
    TokenMintTransaction,
    Hbar,
    PublicKey,
    AccountId,
    Client
} from "@hashgraph/sdk";
import { useWalletInterface } from "@/services/wallets/useWalletInterface";

export default function Upload() {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [beneficiaryName, setBeneficiaryName] = useState("");
    const [beneficiaryAddress, setBeneficiaryAddress] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const { accountId, walletInterface } = useWalletInterface();

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
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

    const handleUpload = async () => {
        if (!file || !beneficiaryAddress || !accountId || !walletInterface) {
            alert("Missing input or not connected");
            return;
        }

        try {
            const arrayBuffer = await file.arrayBuffer();
            const fileBytes = new Uint8Array(arrayBuffer);

            const pubKey = await walletInterface.getPublicKey();
            const PRIVATE_KEY = "7693a736f38b0aef4766a6380e7fbbb3b30e5cb64233e2b980cfa9d285fb2201";

            // 1. Upload to HFS
            const client = Client.forTestnet();
            client.setOperator(accountId, PRIVATE_KEY);
            const fileTx = new FileCreateTransaction()
                .setContents(fileBytes)
                .setKeys([PublicKey.fromString(pubKey)])
                .setMaxTransactionFee(new Hbar(2))
                // .freezeWith(client);

            const fileSigned = await walletInterface.signTransaction(fileTx);
            console.log("Signed transaction:", fileSigned.toString());
            const fileResponse = await fileSigned.execute(Client.forTestnet());
            const fileReceipt = await fileResponse.getReceipt(Client.forTestnet());
            const fileId = fileReceipt.fileId!.toString();
            console.log("File uploaded:", fileId);

            // 2. Create NFT
            // const client = Client.forTestnet();
            const nftCreateTx = new TokenCreateTransaction()
                .setTokenName("DWill Document NFT")
                .setTokenSymbol("DWNFT")
                .setTokenType(TokenType.NonFungibleUnique)
                .setSupplyType(TokenSupplyType.Finite)
                .setMaxSupply(1)
                .setTreasuryAccountId(AccountId.fromString(accountId))
                .setAdminKey(PublicKey.fromString(pubKey))
                .setSupplyKey(PublicKey.fromString(pubKey))
                .setMaxTransactionFee(new Hbar(10))
                // .freezeWith(client);


            const createSigned = await walletInterface.signTransaction(nftCreateTx);
            const createSubmit = await createSigned.execute(Client.forTestnet());
            const createReceipt = await createSubmit.getReceipt(Client.forTestnet());
            const tokenId = createReceipt.tokenId;
            console.log("NFT TokenID:", tokenId?.toString());

            // 3. Mint NFT
            const metadata = Buffer.from(`fileId:${fileId}`);
            // const client = Client.forTestnet();
            const mintTx = new TokenMintTransaction()
                .setTokenId(tokenId!)
                .setMetadata([metadata])
                .setMaxTransactionFee(new Hbar(10))
                // .freezeWith(client);


            const mintSigned = await walletInterface.signTransaction(mintTx);
            const mintSubmit = await mintSigned.execute(Client.forTestnet());
            const mintReceipt = await mintSubmit.getReceipt(Client.forTestnet());
            console.log("NFT Minted. Serial:", mintReceipt.serials?.toString());

            alert("NFT Minted and stored with benefactor");
        } catch (err) {
            console.error("Error during NFT minting:", err);
            alert("Something went wrong.");
        }
    };

    return (
        <div className="space-y-8">
            <HeaderWithActions title="Upload" />

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
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Beneficiary Name (optional)
                    </label>
                    <input
                    type="text"
                    placeholder="e.g. Alice"
                    value={beneficiaryName}
                    onChange={(e) => setBeneficiaryName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Beneficiary Address <span className="text-red-500">*</span>
                    </label>
                    <input
                    type="text"
                    placeholder="0.0.xxxxx or 0x..."
                    value={beneficiaryAddress}
                    onChange={(e) => setBeneficiaryAddress(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    />
                </div>
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

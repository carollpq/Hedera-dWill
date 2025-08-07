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
    PrivateKey,
    AccountId,
    Client,
    FileContentsQuery,
    TokenAssociateTransaction,
    TransferTransaction
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
            console.log(`publicKey: ${pubKey} `);
            const PRIVATE_KEY = PrivateKey.fromStringECDSA("7693a736f38b0aef4766a6380e7fbbb3b30e5cb64233e2b980cfa9d285fb2201");
            const client = Client.forTestnet();
            client.setOperator(accountId, PRIVATE_KEY);

            // 1. Upload to HFS
            const fileCreateTx = new FileCreateTransaction()
                .setContents(arrayBuffer.toString())
                .setKeys([PublicKey.fromString(pubKey)])
                .setMaxTransactionFee(new Hbar(2))
                .freezeWith(client);

            const fileCreateTxSigned = await fileCreateTx.sign(PRIVATE_KEY);
            const fileCreateTxSubmitted = await fileCreateTxSigned.execute(client);
            const fileCreateTxId = fileCreateTxSubmitted.transactionId;
            const fileCreateTxReceipt = await fileCreateTxSubmitted.getReceipt(client);
            const fileId = fileCreateTxReceipt.fileId;
            console.log("File uploaded:", fileId);


            //1.1 Read the file contents to ensure it was uploaded correctly
            const fileReadQuery = new FileContentsQuery()
                .setFileId(fileId!);
            const networkFileContents = await fileReadQuery.execute(client);

            const toExplorerURL = `https://hashscan.io/testnet/transaction/${fileCreateTxId.toString()}`;
            console.log(`fileId: ${fileId}`);
            console.log(`fileCreateTxId: ${fileCreateTxId}`);
            console.log(`actualFileContents: ${fileBytes}`);
            console.log(`networkFileContents: ${networkFileContents}`);
            console.log(`toExplorerURL: ${toExplorerURL}`);


            // 2. Assign file to beneficiary
            // 2. Create NFT
            const nftCreateTx = await new TokenCreateTransaction()
                .setTokenName("DWill Document NFT")
                .setTokenSymbol("DWNFT")
                .setTokenType(TokenType.NonFungibleUnique)
                .setDecimals(0)
                .setInitialSupply(0)
                .setSupplyType(TokenSupplyType.Finite)
                .setMaxSupply(1)
                .setTreasuryAccountId(AccountId.fromString(accountId))
                .setAdminKey(PublicKey.fromString(pubKey))
                .setSupplyKey(PublicKey.fromString(pubKey))
                .setMaxTransactionFee(new Hbar(10))
                // .freezeWith(client);

            const nftCreateSigned = await walletInterface.signTransaction(nftCreateTx);
            const nftCreateSubmit = await nftCreateSigned.execute(client);
            const nftCreateReceipt = await nftCreateSubmit.getReceipt(client);
            const tokenId = nftCreateReceipt.tokenId;
            console.log("NFT TokenID:", tokenId?.toString());
            
            const currentPubKey = await walletInterface.getPublicKey();
            console.log("Connected Wallet Public Key:", currentPubKey);

            // 3. Mint NFT with fileId as metadata
            const metadata = Buffer.from(`fileId:${fileId}`);
            const mintTx = await new TokenMintTransaction()
                .setTokenId(tokenId!)
                .setMetadata([metadata])
                .setMaxTransactionFee(new Hbar(10))
                // .freezeWith(client);

            const mintSigned = await walletInterface.signTransaction(mintTx);
            const mintSubmit = await mintSigned.execute(client);
            const mintReceipt = await mintSubmit.getReceipt(client);
            console.log("NFT Minted. Serial:", mintReceipt.serials?.toString());

            // 5. Transfer NFT from you (treasury) to beneficiary
            const transferTx = await new TransferTransaction()
                .addNftTransfer(tokenId!, 1, accountId, beneficiaryAddress)
                // .freezeWith(client);

            const transferSigned = await walletInterface.signTransaction(transferTx);
            const transferSubmit = await transferSigned.execute(client);
            const transferReceipt = await transferSubmit.getReceipt(client);
            console.log(`NFT transferred to beneficiary: ${transferReceipt.status.toString()}`);

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
                    dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-black/60"
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
                <p className="text-white/70 font-medium">
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

            <div className="bg-black/60 rounded-xl shadow-sm p-6 space-y-4">
                <h2 className="text-lg font-semibold text-white mb-4">Enter beneficiary address to assign to:</h2>
                <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">
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
                    <label className="block text-sm font-medium text-white/70 mb-1">
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
                    className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-800 transition hover:cursor-pointer"
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

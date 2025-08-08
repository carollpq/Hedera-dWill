"use client";

import { FileText, KeyRound } from "lucide-react";
import { useDashboardContext } from "@/context/DashboardContext";
import HeaderWithActions from "@/components/HeaderWithActions";
import { useWalletConnect } from "@/hooks/useWalletConnect";
import { useEffect, useState } from "react";

export default function Home() {
    const {
        isKeySet, setIsKeySet, isEncryptPage,
        setIsEncryptPage, setIsUploadPage,
        setIsViewDocumentsPage, setIsAssignBeneficiariesPage
    } = useDashboardContext();

    const { accountId } = useWalletConnect();

    const [privateKey, setPrivateKey] = useState("");
    const [highlightKeyForm, setHighlightKeyForm] = useState(false);

    // New state to track role
    const [userRole, setUserRole] = useState<"benefactor" | "beneficiary" | null>(null);

    // Load user role from localStorage on mount
    useEffect(() => {
        const role = localStorage.getItem("userRole") as "benefactor" | "beneficiary" | null;
        setUserRole(role);
    }, []);

    const CardWrapper = ({
        children,
        onClick,
    }: {
        children: React.ReactNode;
        onClick?: () => void;
    }) => (
        <div
            onClick={isKeySet ? onClick : undefined}
            className={`bg-black/60 rounded-xl shadow-sm p-6 transition-all ${
                isKeySet
                    ? "hover:shadow-md hover:cursor-pointer hover:bg-black"
                    : "opacity-40 pointer-events-none"
            }`}
        >
            {children}
        </div>
    );

    return (
        <div className="space-y-8">
            <HeaderWithActions title="Dashboard" />

            <p className="text-white/80">
                Manage your documents and encryption settings from your dashboard.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Secret Key Setup Card */}
                {!isKeySet && (
                    <div
                        onClick={() => {
                            setHighlightKeyForm(true);
                            setTimeout(() => setHighlightKeyForm(false), 1500);
                        }}
                        className="bg-black/60 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow hover:cursor-pointer hover:bg-black"
                    >
                        <div className="p-3 bg-orange-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                            <KeyRound className="w-6 h-6 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Keys Setup</h3>
                        <p className="text-white/70 mt-1 text-sm">
                            Configure your secret key for securing your assets.
                        </p>
                    </div>
                )}


                {/* Benefactor-only Cards */}
                {userRole === "benefactor" && (
                    <>
                        <CardWrapper onClick={() => setIsViewDocumentsPage(true)}>
                            <div className="p-3 bg-blue-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">View Assets</h3>
                            <p className="text-white/70 mt-1 text-sm">
                                Browse all your assets in one place.
                            </p>
                        </CardWrapper>

                        <CardWrapper onClick={() => setIsUploadPage(true)}>
                            <div className="p-3 bg-blue-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Upload Assets</h3>
                            <p className="text-white/70 mt-1 text-sm">
                                Securely upload new assets to your storage.
                            </p>
                        </CardWrapper>

                        <CardWrapper onClick={() => setIsEncryptPage(true)}>
                            <div className="p-3 bg-blue-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Encrypt Files</h3>
                            <p className="text-white/70 mt-1 text-sm">
                                Protect your sensitive files with encryption.
                            </p>
                        </CardWrapper>

                        <CardWrapper onClick={() => setIsAssignBeneficiariesPage(true)}>
                            <div className="p-3 bg-blue-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Assign Beneficiaries</h3>
                            <p className="text-white/70 mt-1 text-sm">
                                Assign beneficiaries and their inheritance.
                            </p>
                        </CardWrapper>
                    </>
                )}

                {/* Beneficiary-only Cards */}
                {userRole === "beneficiary" && (
                    <>
                        {/* Download Inheritance */}
                        <CardWrapper onClick={() => {
                            // Define what this button should trigger
                            alert("Download Inheritance triggered");
                        }}>
                            <div className="p-3 bg-green-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                                <FileText className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Download Inheritance</h3>
                            <p className="text-white/70 mt-1 text-sm">
                                Access the assets that have been assigned to you by the benefactor.
                            </p>
                        </CardWrapper>

                        {/* Decrypt Assets */}
                        <CardWrapper onClick={() => {
                            // Define what this button should trigger
                            alert("Decrypt Assets triggered");
                        }}>
                            <div className="p-3 bg-purple-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                                <FileText className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Decrypt Assets</h3>
                            <p className="text-white/70 mt-1 text-sm">
                                Use your secret key to decrypt and view assigned encrypted files.
                            </p>
                        </CardWrapper>
                    </>
                )}

            </div>

            {/* Secret Key Form */}
            {!isKeySet && (
                <div className={`mt-8 bg-black/60 p-6 rounded-xl shadow-sm transition-all duration-300 ${
                    highlightKeyForm ? "ring-2 ring-orange-400 shadow-orange-400" : ""
                }`}>
                    <h3 className="text-white text-lg font-semibold mb-4">Enter Your Secret Key</h3>
                    <p className="text-white/70 text-sm mb-4">
                        This key will be used to encrypt and decrypt your files. Make sure to remember it.
                    </p>
                    <input
                        type="password"
                        placeholder="Enter your private key:"
                        className="w-full p-3 rounded-md bg-black text-white border border-white/20 placeholder-white/50"
                        onChange={(e) => setPrivateKey(e.target.value)}
                    />
                    <button
                        onClick={() => {
                            if (privateKey.trim() !== "") {
                                setIsKeySet(true);
                            } else {
                                alert("Please enter your private key.");
                            }
                        }}
                        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Set Key
                    </button>
                </div>
            )}
        </div>
    );
}

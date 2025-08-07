import { FileText, Lock, Upload as UploadIcon, Users } from "lucide-react";
import { useDashboardContext } from "@/context/DashboardContext";
import HeaderWithActions from "@/components/HeaderWithActions";
import { useWalletConnect } from "@/hooks/useWalletConnect";
import { KeyRound } from "lucide-react";
import { useState } from "react";

export default function Home() {
    const {
        isBenefactor, setIsBenefactor, isEncryptPage,
        setIsEncryptPage, isUploadPage, setIsUploadPage,
        setIsBeneficiary, isBeneficiary,
        isViewDocumentsPage, setIsViewDocumentsPage,
        setIsAssignBeneficiariesPage, isAssignBeneficiariesPage,
    } = useDashboardContext();

    const { accountId, open, setOpen, handleConnect } = useWalletConnect();
    
    const [privateKey, setPrivateKey] = useState("");
    const [isKeySet, setIsKeySet] = useState(false);
    const [highlightKeyForm, setHighlightKeyForm] = useState(false);

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
            {/* Dashboard Header */}
            <HeaderWithActions title="Dashboard" />
            <div className="rounded-xl shadow-sm">
                <p className="text-white/80 text-600">
                    Manage your documents and encryption settings from your dashboard.
                </p>
            </div>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Keys setup */}
                {!isKeySet && (
                    <div
                        onClick={() => {
                            setHighlightKeyForm(true);
                            // Automatically remove highlight after 1.5 seconds
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

                {/* View Documents Card */}
                <CardWrapper onClick={() => setIsViewDocumentsPage(true)}>
                    <div className="p-3 bg-blue-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                        <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">View Assets</h3>
                    <p className="text-white/70 mt-1 text-sm">
                        Browse and manage all your uploaded assets in one place.
                    </p>
                </CardWrapper>
                {/* Upload Files Card */}
                <CardWrapper onClick={() => setIsUploadPage(true)}>
                    <div className="p-3 bg-blue-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                        <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Upload Assets</h3>
                    <p className="text-white/70 mt-1 text-sm">
                        Securely upload new assets to your storage.
                    </p>
                </CardWrapper>
                {/* Encrypt Files Card */}
                <CardWrapper onClick={() => setIsEncryptPage(true)}>
                    <div className="p-3 bg-blue-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                        <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Encrypt Files</h3>
                    <p className="text-white/70 mt-1 text-sm">
                        Protect your sensitive files with encryption.
                    </p>
                </CardWrapper>
                {/* Assign Beneficiaries Card */}
                <CardWrapper onClick={() => setIsAssignBeneficiariesPage(true)}>
                    <div className="p-3 bg-blue-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                        <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Assign Beneficiaries</h3>
                    <p className="text-white/70 mt-1 text-sm">
                        Assign beneficiaries and their inheritance.
                    </p>
                </CardWrapper>

            </div>

            {/* Key Setup Form */}
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



            {/* Recent Activity Section */}
            {/*<div className="bg-white rounded-xl shadow-sm p-6">*/}
            {/*    <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>*/}
            {/*    <div className="space-y-4">*/}
            {/*        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">*/}
            {/*            <div className="flex items-center space-x-3">*/}
            {/*                <div className="p-2 bg-blue-100 rounded-lg">*/}
            {/*                    <UploadIcon className="w-5 h-5 text-blue-600" />*/}
            {/*                </div>*/}
            {/*                <div>*/}
            {/*                    <p className="text-sm font-medium text-gray-900">Document uploaded</p>*/}
            {/*                    <p className="text-xs text-gray-500">2 hours ago</p>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*            <span className="text-sm text-gray-600">will.pdf</span>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
}

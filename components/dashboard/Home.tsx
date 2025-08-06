import { FileText, Lock, Upload as UploadIcon, Users } from "lucide-react";
import { useDashboardContext } from "@/context/DashboardContext";
import HeaderWithActions from "@/components/HeaderWithActions";
import { useWalletConnect } from "@/hooks/useWalletConnect";

export default function Home() {
    const {
        isBenefactor, setIsBenefactor, isEncryptPage,
        setIsEncryptPage, isUploadPage, setIsUploadPage,
        setIsBeneficiary, isBeneficiary,
        isViewDocumentsPage, setIsViewDocumentsPage,
        setIsAssignBeneficiariesPage, isAssignBeneficiariesPage,
    } = useDashboardContext();

    const { accountId, open, setOpen, handleConnect } = useWalletConnect();
    
    return (
        <div className="space-y-8">
            {/* Dashboard Header */}
            <HeaderWithActions title="Dashboard" />
            <div className="rounded-xl shadow-sm p-6">
                <p className="text-white/80 text-600 mt-2">
                    Manage your documents and encryption settings from your dashboard.
                </p>
            </div>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* View Documents Card */}
                <div
                    onClick={() => setIsViewDocumentsPage(true)}
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow hover:cursor-pointer"
                >
                    <div className="p-3 bg-blue-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                        <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">View Assets</h3>
                    <p className="text-gray-600 mt-1 text-sm">
                        Browse and manage all your uploaded assets in one place.
                    </p>
                </div>

                {/* Upload Files Card */}
                <div
                    onClick={() => setIsUploadPage(true)}
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow hover:cursor-pointer"
                >
                    <div className="p-3 bg-green-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                        <UploadIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Upload Assets</h3>
                    <p className="text-gray-600 mt-1 text-sm">
                        Securely upload new assets to your storage.
                    </p>
                </div>

                {/* Encrypt Files Card */}
                <div
                    onClick={() => setIsEncryptPage(true)}
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow hover:cursor-pointer"
                >
                    <div className="p-3 bg-purple-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                        <Lock className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Encrypt Files</h3>
                    <p className="text-gray-600 mt-1 text-sm">
                        Protect your sensitive files with encryption.
                    </p>
                </div>

                {/* Assign Beneficiaries Card */}
                <div
                    onClick={() => setIsAssignBeneficiariesPage(true)}
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow hover:cursor-pointer"
                >
                    <div className="p-3 bg-yellow-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Assign Beneficiaries</h3>
                    <p className="text-gray-600 mt-1 text-sm">
                        Assign beneficiaries and their inheritance.
                    </p>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <UploadIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Document uploaded</p>
                                <p className="text-xs text-gray-500">2 hours ago</p>
                            </div>
                        </div>
                        <span className="text-sm text-gray-600">will.pdf</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

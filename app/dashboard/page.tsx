import {FileText, Lock, Upload as UploadIcon} from 'lucide-react';
import {useDashboardContext} from "@/context/DashboardContext";

export default function DashboardPage() {
    const {
        isBenefactor, setIsBenefactor, isEncryptPage,
        setIsEncryptPage, isUploadPage, setIsUploadPage,
        setIsBeneficiary, isBeneficiary
    } = useDashboardContext();

    return (
        <div className="space-y-8">
            <div className="rounded-xl shadow-sm p-6">
                <h1 className="text-3xl font-bold text-white-900">Welcome back!</h1>
                <p className="text-white/80 text-600 mt-2">Manage your documents and encryption settings from your
                    dashboard.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-blue-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                        <FileText className="w-6 h-6 text-blue-600"/>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">View Documents</h3>
                    <p className="text-gray-600 mt-1 text-sm">Browse and manage all your uploaded documents in one
                        place.</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-green-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                        <UploadIcon className="w-6 h-6 text-green-600"/>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Upload Files</h3>
                    <p className="text-gray-600 mt-1 text-sm">Securely upload new documents to your storage.</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-purple-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                        <Lock className="w-6 h-6 text-purple-600"/>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Encrypt Files</h3>
                    <p className="text-gray-600 mt-1 text-sm">Protect your sensitive documents with encryption.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <UploadIcon className="w-5 h-5 text-blue-600"/>
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
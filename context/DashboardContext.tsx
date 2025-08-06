"use client";

import { createContext, useContext, useState } from "react";

// Define the shape of the dashboard context state and setters
type DashboardContextType = {
    isBenefactor: boolean;
    setIsBenefactor: (value: boolean) => void;
    isBeneficiary: boolean;
    setIsBeneficiary: (value: boolean) => void;
    isUploadPage: boolean;
    setIsUploadPage: (value: boolean) => void;
    isEncryptPage: boolean;
    setIsEncryptPage: (value: boolean) => void;
    isViewDocumentsPage: boolean;
    setIsViewDocumentsPage: (value: boolean) => void;
    isAssignBeneficiariesPage: boolean;
    setIsAssignBeneficiariesPage: (value: boolean) => void;
};

// Create the context with a default value of null
const DashboardContext = createContext<DashboardContextType | null>(null);

// Provider component to wrap your app and provide dashboard state
export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
    // State for user roles and navigation
    const [isBenefactor, setIsBenefactor] = useState(false);
    const [isBeneficiary, setIsBeneficiary] = useState(false);
    const [isUploadPage, setIsUploadPage] = useState(false);
    const [isEncryptPage, setIsEncryptPage] = useState(false);
    const [isViewDocumentsPage, setIsViewDocumentsPage] = useState(false);
    const [isAssignBeneficiariesPage, setIsAssignBeneficiariesPage] = useState(false);

    return (
        <DashboardContext.Provider value={{
            isBenefactor,
            setIsBenefactor,
            isBeneficiary,
            setIsBeneficiary,
            isUploadPage,
            setIsUploadPage,
            isEncryptPage,
            setIsEncryptPage,
            isViewDocumentsPage,
            setIsViewDocumentsPage,
            isAssignBeneficiariesPage,
            setIsAssignBeneficiariesPage
        }}>
            {children}
        </DashboardContext.Provider>
    );
}

// Custom hook to use the dashboard context in components
export const useDashboardContext = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error("useDashboardContext must be used within a DashboardProvider");
    }
    return context;
}
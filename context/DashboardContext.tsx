"use client";

import {createContext, useContext, useState} from "react";

type DashboardContextType = {
    isBenefactor: boolean;
    setIsBenefactor: (value: boolean) => void;
    isBeneficiary: boolean;
    setIsBeneficiary: (value: boolean) => void;
    isUploadPage: boolean;
    setIsUploadPage: (value: boolean) => void;
    isEncryptPage: boolean;
    setIsEncryptPage: (value: boolean) => void;
};

const DashboardContext = createContext<DashboardContextType | null>(null);


export const DashboardProvider = ({children}: { children: React.ReactNode }) => {
    const [isBenefactor, setIsBenefactor] = useState(false);
    const [isBeneficiary, setIsBeneficiary] = useState(false);
    const [isUploadPage, setIsUploadPage] = useState(false);
    const [isEncryptPage, setIsEncryptPage] = useState(false);

    return (
        <DashboardContext.Provider value={{
            isBenefactor,
            setIsBenefactor,
            isBeneficiary,
            setIsBeneficiary,
            isUploadPage,
            setIsUploadPage,
            isEncryptPage,
            setIsEncryptPage
        }
        }>
            {children}
        </DashboardContext.Provider>
    );
}

export const useDashboardContext = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error("useDashboardContext must be used within a DashboardProvider");
    }
    return context;
}
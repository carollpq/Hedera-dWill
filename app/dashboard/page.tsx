"use client";

import { useEffect } from 'react';
import { useDashboardContext } from '@/context/DashboardContext';
import Upload from '@/components/Upload';
import Encrypt from '@/components/Encrypt';
import Home from '@/components/Home';

export default function DashboardPage() {
    const {
        isBenefactor, 
        setIsBenefactor, 
        isEncryptPage,
        setIsEncryptPage, 
        isUploadPage, 
        setIsUploadPage,
        setIsBeneficiary, 
        isBeneficiary, 
        isViewDocumentsPage, 
        setIsViewDocumentsPage
    } = useDashboardContext();

    // Reset page states when component mounts
    useEffect(() => {
        // Set default states when the dashboard loads
        setIsUploadPage(false);
        setIsEncryptPage(false);
        // Add any other default state resets here
        
        // Cleanup function to reset states when component unmounts
        return () => {
            setIsUploadPage(false);
            setIsEncryptPage(false);
        };
    }, [setIsUploadPage, setIsEncryptPage]);

    // Handle page changes based on navigation
    useEffect(() => {
        // You can add additional logic here when page states change
        // For example, you might want to fetch data when switching to a specific page
        if (isUploadPage) {
            // Handle upload page specific logic
            console.log('Upload page active');
        } else if (isEncryptPage) {
            // Handle encrypt page specific logic
            console.log('Encrypt page active');
        } else {
            // Handle home page specific logic
            console.log('Home page active');
        }
    }, [isUploadPage, isEncryptPage]);

    return (
        <>
            {isUploadPage && <Upload />}
            {isEncryptPage && <Encrypt />}
            {!isUploadPage && !isEncryptPage && <Home />}
        </>
    );
}
// components/HeaderWithActions.tsx
"use client";

import React from "react";
import { useEffect, useState } from "react";

interface HeaderWithActionsProps {
  title: string;
  children?: React.ReactNode; // optional extra content
}

export default function HeaderWithActions({ title, children }: HeaderWithActionsProps) {
  // New state to track role
    const [userRole, setUserRole] = useState<"benefactor" | "beneficiary" | null>(null);
    const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);
    // Load user role from localStorage on mount
    useEffect(() => {
        const role = localStorage.getItem("userRole") as "benefactor" | "beneficiary" | null;
        setUserRole(role);
    }, []);

  return (
    <div className="flex items-center justify-between p-6 ml-[-1.5rem] bg-transparent">
      <h1 className="text-3xl font-bold text-white">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Example countdown timer placeholder */}
        {isSwitchEnabled && userRole === "benefactor" && (
          <>
            <div className="bg-gray-100 text-lg text-gray-800 px-5 py-1 rounded-lg shadow-md font-medium w-48 text-center whitespace-nowrap">
              6d 12h 30m 5s
            </div>
            <button className="w-full bg-red-600 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded-lg text-sm transition hover:cursor-pointer">
              Disable Switch
            </button>
          </>
        )}

        {userRole === "beneficiary" && (
          isSwitchEnabled ? (
            <button className="w-full bg-red-600 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded-lg text-sm transition hover:cursor-pointer">
              Disable Switch
            </button>
          ) : (
            <button className="w-full bg-purple-600 hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded-lg text-sm transition hover:cursor-pointer">
              Enable Switch
            </button>
          )
        )}

        {children}
      </div>
    </div>
  );
}

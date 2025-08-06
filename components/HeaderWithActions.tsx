// components/HeaderWithActions.tsx
"use client";

import React from "react";

interface HeaderWithActionsProps {
  title: string;
  children?: React.ReactNode; // optional extra content
}

export default function HeaderWithActions({ title, children }: HeaderWithActionsProps) {
  return (
    <div className="flex items-center justify-between rounded-xl shadow-sm p-6 bg-white">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Example countdown timer placeholder */}
        <div className="bg-gray-100 text-lg text-gray-800 px-5 py-2 rounded-lg shadow-md font-medium w-48 text-center whitespace-nowrap">
          23h 59m
        </div>
        {/* Example button */}
        <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition">
          ENABLE SWITCH
        </button>

        {children}
      </div>
    </div>
  );
}

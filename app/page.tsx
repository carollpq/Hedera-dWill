"use client"
import Image from 'next/image'
import Navbar from "@/components/Navbar";
import LandingPage from "@/components/LandingPage";

export default function Home() {
  return (
      <main className="flex min-h-screen flex-col items-center justify-between">
        <Navbar />
          <LandingPage />
      </main>
  )
}
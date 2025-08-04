"use client"
import { useEffect } from 'react';
import Navbar from "@/components/landingPage/Navbar";
import LandingPage from "@/components/landingPage/LandingPage";
import About from "@/components/landingPage/About";
import Services from "@/components/landingPage/Services";
import RoleSelection from "@/components/landingPage/RoleSelection";

export default function Home() {
  useEffect(() => {
    // Smooth scroll behavior for anchor links
    const handleSmoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = target.getAttribute('href');
        if (targetId) {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };

    document.addEventListener('click', handleSmoothScroll);
    return () => document.removeEventListener('click', handleSmoothScroll);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Navbar />
      <LandingPage />
      <About />
      <Services />
      <RoleSelection />
    </main>
  );
}
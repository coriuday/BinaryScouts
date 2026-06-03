'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ServicesGrid from '@/components/ServicesGrid';
import InfoSection from '@/components/InfoSection';
import Footer from '@/components/Footer';
import IntroLoader from '@/components/IntroLoader';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasLoaded = sessionStorage.getItem('gloryx_loaded');
    if (hasLoaded === 'true') {
      setShowIntro(false);
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('gloryx_loaded', 'true');
    setShowIntro(false);
  };

  if (!mounted) {
    return <div className="min-h-screen bg-gx-black text-white" />;
  }

  return (
    <>
      {showIntro ? (
        <IntroLoader onComplete={handleIntroComplete} />
      ) : (
        <div className="min-h-screen bg-gx-black text-white font-sans selection:bg-gx-green selection:text-gx-black transition-opacity duration-1000">
          <Navbar />
          <main>
            <Hero />
            <ServicesGrid />
            <InfoSection />
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}


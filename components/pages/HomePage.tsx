'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/ui/Hero';
import StatsBar from '@/components/ui/StatsBar';
import ServicesGrid from '@/components/ui/ServicesGrid';
import CaseStudiesSection from '@/components/ui/CaseStudiesSection';
import InfoSection from '@/components/ui/InfoSection';
import CTASection from '@/components/ui/CTASection';
import Footer from '@/components/layout/Footer';
import IntroLoader from '@/components/layout/IntroLoader';
import SectionBridge from '@/components/motion/SectionBridge';

export default function Home() {
  // Default showIntro=false — avoids a flash of the loader on SSR.
  // On mount, we check sessionStorage to decide if the loader should play.
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('bs_loaded');
    if (hasLoaded !== 'true') {
      setShowIntro(true);
    }
  }, []);

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem('bs_loaded', 'true');
    setShowIntro(false);
  }, []);

  return (
    <>
      {showIntro && <IntroLoader onComplete={handleIntroComplete} />}

      {/* Skip to main content — screen reader / keyboard navigation */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <div
        className="min-h-screen"
        style={{
          opacity: showIntro ? 0 : 1,
          transition: 'opacity 0.5s ease',
          backgroundColor: '#050505',
        }}
      >
        <Navbar />
        <main id="main-content">
          {/* ── 1. CURIOSITY → AWE ───────────────────────── */}
          <Hero />

          {/* Bridge: hero → proof */}
          <SectionBridge hint="The results that brought them back" direction="light-to-dark" showLine />

          {/* ── 2. AWE → IMMERSION: Numbers anchor belief ── */}
          <div className="section-lazy">
            <StatsBar />
          </div>

          {/* Bridge: proof → story */}
          <SectionBridge hint="The studio behind the numbers" direction="dark-to-light" showLine />

          {/* ── 3. IMMERSION → TRUST: Who we are first ───── */}
          <div className="section-lazy">
            <InfoSection />
          </div>

          {/* Bridge: story → capabilities */}
          <SectionBridge hint="What we build for you" direction="light-to-dark" showLine />

          {/* ── 4. TRUST → INTEREST: Capabilities land on trust ── */}
          <div className="section-lazy">
            <ServicesGrid />
          </div>

          {/* Bridge: capabilities → proof of capabilities */}
          <SectionBridge hint="See these disciplines in action" direction="dark-to-light" showLine />

          {/* ── 5. INTEREST → CONFIDENCE: Work validates everything ── */}
          <div className="section-lazy">
            <CaseStudiesSection />
          </div>

          {/* Bridge: confidence → desire */}
          <SectionBridge hint="Ready to build yours?" direction="light-to-dark" showLine={false} />

          {/* ── 6. CONFIDENCE → DESIRE → INTENT ─────────── */}
          <div className="section-lazy">
            <CTASection />
          </div>
        </main>
        <div className="section-lazy">
          <Footer />
        </div>
      </div>
    </>
  );
}

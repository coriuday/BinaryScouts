'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoadingScreen from '@/components/layout/LoadingScreen';
import HeroNew from '@/components/ui/HeroNew';
import AboutSection from '@/components/ui/AboutSection';
import ServicesBento from '@/components/ui/ServicesBento';
import CaseStudiesNew from '@/components/ui/CaseStudiesNew';
import TeamNew from '@/components/ui/TeamNew';
import ProcessSection from '@/components/ui/ProcessSection';
import TechStackGrid from '@/components/ui/TechStackGrid';
import TestimonialsSection from '@/components/ui/TestimonialsSection';
import ContactSection from '@/components/ui/ContactSection';

export default function Home() {
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
      {showIntro && <LoadingScreen onComplete={handleIntroComplete} />}

      {/* Skip to main content — screen reader / keyboard navigation */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <div
        className="min-h-screen"
        inert={showIntro ? true : undefined}
        aria-hidden={showIntro || undefined}
        style={{
          opacity: showIntro ? 0 : 1,
          transition: 'opacity 0.5s ease',
          backgroundColor: 'var(--space)',
          pointerEvents: showIntro ? 'none' : undefined,
        }}
      >
        <Navbar />
        <main id="main-content">
          {/* ── 1. HERO — Curiosity → Awe ────────────────── */}
          <HeroNew />

          {/* ── 2. ABOUT — Awe → Trust ───────────────────── */}
          <div className="section-lazy">
            <AboutSection />
          </div>

          {/* ── 3. SERVICES — Trust → Interest ───────────── */}
          <div className="section-lazy">
            <ServicesBento />
          </div>

          {/* ── 4. CASE STUDIES — Interest → Confidence ──── */}
          <div className="section-lazy">
            <CaseStudiesNew />
          </div>

          {/* ── 5. TEAM — Confidence → Connection ────────── */}
          <div className="section-lazy">
            <TeamNew />
          </div>

          {/* ── 6. PROCESS — Connection → Understanding ──── */}
          <div className="section-lazy">
            <ProcessSection />
          </div>

          {/* ── 7. TECH STACK — Understanding → Respect ──── */}
          <div className="section-lazy">
            <TechStackGrid />
          </div>

          {/* ── 8. TESTIMONIALS — Respect → Trust ────────── */}
          <div className="section-lazy">
            <TestimonialsSection />
          </div>

          {/* ── 9. CONTACT — Trust → Intent → Action ─────── */}
          <div className="section-lazy">
            <ContactSection />
          </div>
        </main>

        <div className="section-lazy">
          <Footer />
        </div>
      </div>
    </>
  );
}

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoadingScreen, { type IntroMode } from '@/components/layout/LoadingScreen';
import HeroNew from '@/components/ui/HeroNew';
import AboutSection from '@/components/ui/AboutSection';
import ServicesBento from '@/components/ui/ServicesBento';
import CaseStudiesNew from '@/components/ui/CaseStudiesNew';
import TeamNew from '@/components/ui/TeamNew';
import ProcessSection from '@/components/ui/ProcessSection';
import TechStackGrid from '@/components/ui/TechStackGrid';
import TestimonialsSection from '@/components/ui/TestimonialsSection';
import ContactSection from '@/components/ui/ContactSection';

type IntroState = IntroMode | 'pending' | 'done';

export default function Home() {
  const [introState, setIntroState] = useState<IntroState>('pending');

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setIntroState('done');
      return;
    }
    const hasLoaded = sessionStorage.getItem('bs_loaded');
    setIntroState(hasLoaded === 'true' ? 'brief' : 'full');
  }, []);

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem('bs_loaded', 'true');
    setIntroState('done');
  }, []);

  const showIntro = introState === 'pending' || introState === 'full' || introState === 'brief';
  const loaderMode: IntroMode | null =
    introState === 'full' || introState === 'brief' ? introState : null;

  return (
    <>
      {/* Hold black while resolving sessionStorage to avoid content flash */}
      {introState === 'pending' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: '#000',
          }}
          aria-hidden
        />
      )}

      {loaderMode && (
        <LoadingScreen mode={loaderMode} onComplete={handleIntroComplete} />
      )}

      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <div
        className="min-h-screen"
        inert={showIntro ? true : undefined}
        aria-hidden={showIntro || undefined}
        style={{
          opacity: showIntro ? 0 : 1,
          transition: loaderMode === 'brief' ? 'opacity 0.4s ease' : 'opacity 0.5s ease',
          backgroundColor: 'var(--space)',
          pointerEvents: showIntro ? 'none' : undefined,
        }}
      >
        <Navbar />
        <main id="main-content">
          <HeroNew />

          <div className="section-lazy">
            <AboutSection />
          </div>

          <div className="section-lazy">
            <ServicesBento />
          </div>

          <div className="section-lazy">
            <CaseStudiesNew />
          </div>

          <div className="section-lazy">
            <TeamNew />
          </div>

          <div className="section-lazy">
            <ProcessSection />
          </div>

          <div className="section-lazy">
            <TechStackGrid />
          </div>

          <div className="section-lazy">
            <TestimonialsSection />
          </div>

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

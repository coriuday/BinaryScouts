'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';
import LoadingScreen, { type IntroMode } from '@/components/layout/LoadingScreen';
import HeroNew from '@/components/ui/HeroNew';

const AboutSection = dynamic(() => import('@/components/ui/AboutSection'));
const ServicesBento = dynamic(() => import('@/components/ui/ServicesBento'));
const CaseStudiesNew = dynamic(() => import('@/components/ui/CaseStudiesNew'));
const TeamNew = dynamic(() => import('@/components/ui/TeamNew'));
const ProcessSection = dynamic(() => import('@/components/ui/ProcessSection'));
const TechStackGrid = dynamic(() => import('@/components/ui/TechStackGrid'));
const TestimonialsSection = dynamic(() => import('@/components/ui/TestimonialsSection'));
const ContactSection = dynamic(() => import('@/components/ui/ContactSection'));
const Footer = dynamic(() => import('@/components/layout/Footer'));

type IntroState = IntroMode | 'pending' | 'done';

export default function Home() {
  const [introState, setIntroState] = useState<IntroState>('pending');

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduced || coarse) {
      // Skip long intro on touch / reduced-motion — faster first paint.
      setIntroState('done');
      sessionStorage.setItem('bs_loaded', 'true');
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
        <main>
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

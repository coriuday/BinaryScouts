'use client';

import React, { useState, useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { AudioProvider } from '@/components/hooks/AudioProvider';
import { ContactInfoProvider } from '@/components/hooks/ContactInfoProvider';
import dynamic from 'next/dynamic';
import CrewTicker from '@/components/layout/CrewTicker';
import WhatsAppFab from '@/components/ui/WhatsAppFab';

const CustomCursor = dynamic(() => import('@/components/layout/CustomCursor'), { ssr: false });
const Terminal = dynamic(() => import('@/components/ui/Terminal'), { ssr: false });
const ScrollProgressBar = dynamic(() => import('@/components/motion/ScrollProgressBar'), { ssr: false });
const ClickRipple = dynamic(() => import('@/components/motion/ClickRipple'), { ssr: false });

interface LayoutWrapperProps {
  children: React.ReactNode;
  bodyClass: string;
}

export default function LayoutWrapper({ children, bodyClass }: LayoutWrapperProps) {
  const [mounted, setMounted] = useState(false);
  const [enableCursor, setEnableCursor] = useState(false);
  const [enableChromeMotion, setEnableChromeMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnableCursor(!coarse && !reduced);
    setEnableChromeMotion(!reduced);
  }, []);

  return (
    <body
      className={`${bodyClass} antialiased min-h-screen overflow-x-hidden`}
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <MotionConfig reducedMotion="user">
        <AudioProvider>
          <ContactInfoProvider>
            {mounted && enableChromeMotion && <ScrollProgressBar />}
            {mounted && enableCursor && <CustomCursor />}
            {mounted && enableChromeMotion && <ClickRipple />}

            <div className="hidden md:block">
              <CrewTicker />
            </div>

            <div id="main-content">{children}</div>

            {mounted && <WhatsAppFab />}
            {mounted && <Terminal />}
          </ContactInfoProvider>
        </AudioProvider>
      </MotionConfig>
    </body>
  );
}

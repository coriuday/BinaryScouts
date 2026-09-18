'use client';

import React, { useState, useEffect } from 'react';
import { AudioProvider } from '@/components/hooks/AudioProvider';
import { ContactInfoProvider } from '@/components/hooks/ContactInfoProvider';
import CustomCursor from '@/components/layout/CustomCursor';
import CrewTicker from '@/components/layout/CrewTicker';
import Terminal from '@/components/ui/Terminal';
import WhatsAppFab from '@/components/ui/WhatsAppFab';
import ScrollProgressBar from '@/components/motion/ScrollProgressBar';
import ClickRipple from '@/components/motion/ClickRipple';

interface LayoutWrapperProps {
  children: React.ReactNode;
  bodyClass: string;
}

export default function LayoutWrapper({ children, bodyClass }: LayoutWrapperProps) {
  const [mounted, setMounted] = useState(false);
  const [enableCursor, setEnableCursor] = useState(false);

  useEffect(() => {
    setMounted(true);
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnableCursor(!coarse && !reduced);
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
      <AudioProvider>
        <ContactInfoProvider>
          {mounted && <ScrollProgressBar />}
          {mounted && enableCursor && <CustomCursor />}
          {mounted && <ClickRipple />}

          <div className="hidden md:block">
            <CrewTicker />
          </div>

          <div id="main-content">{children}</div>

          {mounted && <WhatsAppFab />}
          <Terminal />
        </ContactInfoProvider>
        </AudioProvider>
    </body>
  );
}

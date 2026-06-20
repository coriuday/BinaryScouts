'use client';

import React, { useState, useEffect } from 'react';
import { AudioProvider } from '@/components/hooks/AudioProvider';
import CustomCursor from '@/components/layout/CustomCursor';
import CrewTicker from '@/components/layout/CrewTicker';
import Terminal from '@/components/ui/Terminal';
import ScrollProgressBar from '@/components/motion/ScrollProgressBar';
import LenisProvider from '@/components/motion/LenisProvider';
import ClickRipple from '@/components/motion/ClickRipple';
import RouteTransition from '@/components/motion/RouteTransition';

interface LayoutWrapperProps {
  children: React.ReactNode;
  bodyClass: string;
}

export default function LayoutWrapper({ children, bodyClass }: LayoutWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <body
      className={`${bodyClass} antialiased min-h-screen`}
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      <LenisProvider>
        <AudioProvider>
          {mounted && <ScrollProgressBar />}
          {mounted && <CustomCursor />}
          {mounted && <ClickRipple />}

          <div className="hidden md:block">
            <CrewTicker />
          </div>

          <RouteTransition>{children}</RouteTransition>

          <Terminal />
        </AudioProvider>
      </LenisProvider>
    </body>
  );
}

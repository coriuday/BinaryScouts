'use client';

import React from 'react';
import { useTheme } from '@/components/hooks/ThemeProvider';
import { AudioProvider } from '@/components/hooks/AudioProvider';
import CustomCursor from '@/components/layout/CustomCursor';
import CrewTicker from '@/components/layout/CrewTicker';
import Terminal from '@/components/ui/Terminal';

interface LayoutWrapperProps {
  children: React.ReactNode;
  bodyClass: string;
}

export default function LayoutWrapper({ children, bodyClass }: LayoutWrapperProps) {
  const { customCursorEnabled } = useTheme();

  return (
    <body
      className={`${bodyClass} antialiased text-white selection:bg-gx-green selection:text-gx-black min-h-screen bg-gx-black ${
        customCursorEnabled ? 'has-custom-cursor' : ''
      }`}
    >
      <AudioProvider>
        {customCursorEnabled && <CustomCursor />}
        <CrewTicker />
        {children}
        <Terminal />
      </AudioProvider>
    </body>
  );
}

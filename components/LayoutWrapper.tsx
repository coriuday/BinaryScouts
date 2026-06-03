'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { AudioProvider } from './AudioProvider';
import CustomCursor from './CustomCursor';
import CrewTicker from './CrewTicker';
import Terminal from './Terminal';

interface LayoutWrapperProps {
  children: React.ReactNode;
  bodyClass: string;
}

export default function LayoutWrapper({ children, bodyClass }: LayoutWrapperProps) {
  const { customCursorEnabled, crtScanlinesEnabled } = useTheme();

  return (
    <body
      className={`${bodyClass} antialiased text-white selection:bg-gx-green selection:text-gx-black min-h-screen bg-gx-black ${
        crtScanlinesEnabled ? 'crt-screen crt-flicker' : ''
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

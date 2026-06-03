'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    primaryRgb: string;
    secondary: string;
    secondaryRgb: string;
    background: string;
    surface: string;
    gray: string;
  };
  fonts: {
    display: string;
    body: string;
    googleLink?: string;
  };
}

export const THEMES: Theme[] = [
  {
    id: 'matrix',
    name: 'SYSTEM MATRIX (GTA)',
    colors: {
      primary: '#79c043',
      primaryRgb: '121, 192, 67',
      secondary: '#f58220',
      secondaryRgb: '245, 130, 32',
      background: '#0a0a0a',
      surface: '#161616',
      gray: '#2a2a2a'
    },
    fonts: {
      display: 'var(--font-oswald)',
      body: 'var(--font-roboto)'
    }
  },
  {
    id: 'red-dead',
    name: 'RED DEAD CONQUEST',
    colors: {
      primary: '#e51b24',
      primaryRgb: '229, 27, 36',
      secondary: '#d4af37',
      secondaryRgb: '212, 175, 55',
      background: '#0f0909',
      surface: '#1a1010',
      gray: '#3a2424'
    },
    fonts: {
      display: "'Rye', serif",
      body: "'Courier Prime', monospace",
      googleLink: 'https://fonts.googleapis.com/css2?family=Rye&family=Courier+Prime:wght@400;700&display=swap'
    }
  },
  {
    id: 'vice-city',
    name: 'VICE RETRO GLOW',
    colors: {
      primary: '#ec4899',
      primaryRgb: '236, 72, 153',
      secondary: '#06b6d4',
      secondaryRgb: '6, 182, 212',
      background: '#0c0211',
      surface: '#1a0724',
      gray: '#3c1252'
    },
    fonts: {
      display: "'Orbitron', sans-serif",
      body: "'Inter', sans-serif",
      googleLink: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Inter:wght@400;700&display=swap'
    }
  },
  {
    id: 'bully',
    name: 'BULLY PREP CLASS',
    colors: {
      primary: '#f59e0b',
      primaryRgb: '245, 158, 11',
      secondary: '#1e3a8a',
      secondaryRgb: '30, 58, 138',
      background: '#060b13',
      surface: '#0c1524',
      gray: '#1f2e47'
    },
    fonts: {
      display: "'Cinzel', serif",
      body: "'Georgia', serif",
      googleLink: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&display=swap'
    }
  }
];

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (id: string) => void;
  customCursorEnabled: boolean;
  setCustomCursorEnabled: (enabled: boolean) => void;
  crtScanlinesEnabled: boolean;
  setCrtScanlinesEnabled: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentThemeId, setCurrentThemeId] = useState('matrix');
  const [customCursorEnabled, setCustomCursorEnabled] = useState(true);
  const [crtScanlinesEnabled, setCrtScanlinesEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('gloryx_theme');
    const savedCursor = localStorage.getItem('gloryx_cursor');
    const savedCrt = localStorage.getItem('gloryx_crt');

    if (savedTheme && THEMES.some(t => t.id === savedTheme)) {
      setCurrentThemeId(savedTheme);
    }
    if (savedCursor !== null) {
      setCustomCursorEnabled(savedCursor === 'true');
    }
    if (savedCrt !== null) {
      setCrtScanlinesEnabled(savedCrt === 'true');
    }
  }, []);

  // Update theme colors and fonts dynamically
  useEffect(() => {
    if (!mounted) return;

    const theme = THEMES.find(t => t.id === currentThemeId) || THEMES[0];

    // Apply color variables
    const root = document.documentElement;
    root.style.setProperty('--gx-green', theme.colors.primary);
    root.style.setProperty('--gx-green-rgb', theme.colors.primaryRgb);
    root.style.setProperty('--gx-orange', theme.colors.secondary);
    root.style.setProperty('--gx-orange-rgb', theme.colors.secondaryRgb);
    root.style.setProperty('--gx-black', theme.colors.background);
    root.style.setProperty('--gx-dark', theme.colors.surface);
    root.style.setProperty('--gx-gray', theme.colors.gray);

    // Apply typography variables mapping directly to Tailwind font rules
    root.style.setProperty('--font-oswald', theme.fonts.display);
    root.style.setProperty('--font-roboto', theme.fonts.body);

    // Handle Google Fonts stylesheet link tags dynamically
    let fontLink = document.getElementById('gloryx-dynamic-fonts') as HTMLLinkElement;
    
    if (theme.fonts.googleLink) {
      if (!fontLink) {
        fontLink = document.createElement('link');
        fontLink.id = 'gloryx-dynamic-fonts';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
      }
      fontLink.href = theme.fonts.googleLink;
    } else if (fontLink) {
      document.head.removeChild(fontLink);
    }

    // Save preferences
    localStorage.setItem('gloryx_theme', currentThemeId);
  }, [currentThemeId, mounted]);

  // Save changes to local state storage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('gloryx_cursor', String(customCursorEnabled));
    }
  }, [customCursorEnabled, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('gloryx_crt', String(crtScanlinesEnabled));
    }
  }, [crtScanlinesEnabled, mounted]);

  const setTheme = (id: string) => {
    if (THEMES.some(t => t.id === id)) {
      setCurrentThemeId(id);
    }
  };

  const currentTheme = THEMES.find(t => t.id === currentThemeId) || THEMES[0];

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        customCursorEnabled,
        setCustomCursorEnabled,
        crtScanlinesEnabled,
        setCrtScanlinesEnabled
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

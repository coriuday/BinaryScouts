'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'bs_theme';

/**
 * ThemeProvider
 *
 * FOUC prevention is handled by a blocking inline script in layout.tsx
 * that applies data-theme to <html> synchronously before React hydrates.
 *
 * This provider's job is only to:
 * 1. Read the already-applied theme from the DOM (not localStorage) to
 *    avoid a second correction pass that would cause a flash.
 * 2. Provide toggleTheme() and isDark to children.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize from the DOM attribute that the blocking script already set.
  // Fallback to 'light' on server (SSR has no DOM).
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof document === 'undefined') return 'dark';
    const attr = document.documentElement.getAttribute('data-theme');
    return attr === 'light' ? 'light' : 'dark';
  });

  // Sync in case the blocking script ran before React and set a different value.
  // This handles edge cases where sessionStorage differs from localStorage.
  useEffect(() => {
    const attr = document.documentElement.getAttribute('data-theme') as ThemeMode | null;
    if (attr && attr !== theme) {
      setTheme(attr);
    }
    // Only on mount — not a reactive dep
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyTheme = useCallback((mode: ThemeMode) => {
    document.documentElement.setAttribute('data-theme', mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: ThemeMode = prev === 'light' ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, [applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

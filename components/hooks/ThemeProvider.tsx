'use client';

import React, { createContext, useContext } from 'react';

interface ThemeContextType {
  theme: 'dark';
  toggleTheme: () => void;
  isDark: true;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider — dark-only.
 * Kept as a thin wrapper so existing consumers (SettingsDrawer, etc.) don't break.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ThemeContext.Provider value={{ theme: 'dark', toggleTheme: () => {}, isDark: true }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

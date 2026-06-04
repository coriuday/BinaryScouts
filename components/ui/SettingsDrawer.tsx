'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, Sliders, ToggleLeft, ToggleRight } from 'lucide-react';
import { useTheme, THEMES } from '@/components/hooks/ThemeProvider';
import { useAudio } from '@/components/hooks/AudioProvider';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsDrawer({ isOpen, onClose }: SettingsDrawerProps) {
  const { currentTheme, setTheme, customCursorEnabled, setCustomCursorEnabled } = useTheme();
  const { playClick, playHover, playSuccess } = useAudio();

  const handleThemeChange = (id: string) => {
    playSuccess();
    setTheme(id);
  };

  const handleCursorToggle = () => {
    playClick();
    setCustomCursorEnabled(!customCursorEnabled);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-[90] cursor-pointer"
          />

          {/* Settings Sliding Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-80 sm:w-96 bg-gx-dark border-l-2 border-gx-green z-[100] flex flex-col justify-between p-6 shadow-[0_0_30px_rgba(0,0,0,0.8)] font-mono text-xs"
          >
            {/* Header section */}
            <div>
              <div className="flex justify-between items-center border-b border-gx-green/20 pb-4 mb-6 text-gx-green">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-2xs">
                  <Sliders className="w-4 h-4 text-gx-green animate-pulse" />
                  <span>SYSTEM OVERLAYS</span>
                </div>
                <button
                  onClick={() => {
                    playClick();
                    onClose();
                  }}
                  onMouseEnter={playHover}
                  className="text-gx-green/60 hover:text-white transition-colors cursor-pointer"
                  title="Close Controls"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Theme customizer selection grid */}
              <div className="mb-8">
                <span className="block text-gray-500 text-[10px] uppercase mb-4 tracking-widest font-bold">
                  1. OPERATION PROFILE (COLOR CONQUER)
                </span>
                
                <div className="space-y-3">
                  {THEMES.map((theme) => {
                    const isActive = theme.id === currentTheme.id;
                    return (
                      <div
                        key={theme.id}
                        onClick={() => handleThemeChange(theme.id)}
                        onMouseEnter={playHover}
                        className={`p-4 border cursor-pointer transition-all duration-300 relative select-none group flex flex-col gap-2 ${
                          isActive
                            ? 'border-gx-green bg-gx-green/10 text-white shadow-[0_0_10px_rgba(var(--gx-green-rgb),0.2)]'
                            : 'border-white/10 bg-gx-black/40 hover:border-white/30 text-gray-400'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`font-bold tracking-wide ${isActive ? 'text-gx-green' : 'text-white/80 group-hover:text-white'}`}>
                            {theme.name}
                          </span>
                          <div className="flex gap-1.5">
                            {/* Color Swatch dots */}
                            <div className="w-2.5 h-2.5 rounded-full border border-white/10" style={{ backgroundColor: theme.colors.primary }} />
                            <div className="w-2.5 h-2.5 rounded-full border border-white/10" style={{ backgroundColor: theme.colors.secondary }} />
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-3xs text-gray-500 font-bold uppercase mt-1">
                          <span>FONTS: {theme.id === 'matrix' ? 'OSWALD / ROBOTO' : theme.id === 'red-dead' ? 'RYE / COURIER' : theme.id === 'vice-city' ? 'ORBITRON / INTER' : 'CINZEL / GEORGIA'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cursor and CRT screen filters customizers */}
              <div className="space-y-6 pt-4 border-t border-gx-green/20">
                <span className="block text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                  2. INTERFACE HARDWARE SYSTEM
                </span>

                {/* Custom Cursor Toggle */}
                <div className="flex justify-between items-center text-white/80">
                  <div>
                    <span className="block font-bold">CROSSHAIR H.U.D. TRACKER</span>
                    <span className="text-gray-500 text-[10px]">Toggles target mouse follower</span>
                  </div>
                  <button
                    onClick={handleCursorToggle}
                    onMouseEnter={playHover}
                    className="text-gx-green hover:scale-105 transition-transform"
                  >
                    {customCursorEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-gray-600" />}
                  </button>
                </div>


              </div>
            </div>

            {/* Panel footer secure alerts */}
            <div className="border-t border-gx-green/20 pt-4 mt-8 flex items-start gap-2.5 text-gx-orange/80 text-[10px]">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 animate-pulse text-gx-orange" />
              <div className="leading-relaxed">
                SECURE INTERFACE LINK OPERATIONAL. THE SYSTEM IS COMMITTED TO LOCAL ENCRYPTION STORAGE. CHANGES CACHED SAFELY.
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

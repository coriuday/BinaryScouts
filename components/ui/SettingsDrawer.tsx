'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Terminal, Sliders } from 'lucide-react';
import { useAudio } from '@/components/hooks/AudioProvider';
import Logo from '@/components/ui/Logo';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onTerminalOpen?: () => void;
}

const Row: React.FC<{ label: string; sub?: string; children: React.ReactNode }> = ({ label, sub, children }) => (
  <div
    className="flex items-center justify-between py-4"
    style={{ borderBottom: '1px solid var(--border-subtle)' }}
  >
    <div>
      <p className="font-sans font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{label}</p>
      {sub && <p className="font-sans text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
    </div>
    {children}
  </div>
);

const Toggle: React.FC<{ checked: boolean; onChange: () => void; id: string }> = ({ checked, onChange, id }) => (
  <button
    id={id}
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className="relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0"
    style={{
      background: checked ? 'linear-gradient(135deg, #6366f1, #06b6d4)' : 'var(--bg-tertiary)',
      border: '1px solid var(--border-default)',
      boxShadow: checked ? '0 0 12px rgba(99,102,241,0.35)' : 'none',
    }}
  >
    <motion.span
      layout
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="absolute top-0.5 w-5 h-5 rounded-full"
      style={{
        backgroundColor: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
        left: checked ? 'calc(100% - 22px)' : '2px',
      }}
    />
  </button>
);

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ isOpen, onClose, onTerminalOpen }) => {
  const { isMuted, toggleMute } = useAudio();
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(isOpen, panelRef);

  // Custom cursor state — persisted in localStorage
  const [cursorEnabled, setCursorEnabled] = React.useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('bs_custom_cursor') !== 'false';
  });

  const toggleCursor = () => {
    const next = !cursorEnabled;
    setCursorEnabled(next);
    localStorage.setItem('bs_custom_cursor', next ? 'true' : 'false');
    // Notify CustomCursor component via custom event
    window.dispatchEvent(new CustomEvent('bs:cursor-toggle', { detail: { enabled: next } }));
  };

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Close on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) setTimeout(() => document.addEventListener('mousedown', onClick), 50);
    return () => document.removeEventListener('mousedown', onClick);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[998]"
            style={{ backgroundColor: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(2px)' }}
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Settings"
            tabIndex={-1}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.9 }}
            className="fixed right-4 z-[999] w-80 rounded-2xl overflow-hidden outline-none"
            style={{
              top: '80px',
              backgroundColor: 'var(--bg-glass-solid)',
              border: '1px solid var(--border-default)',
              boxShadow: 'var(--shadow-glass), 0 20px 60px rgba(0,0,0,0.15)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 pt-5 pb-4"
              style={{ borderBottom: '1px solid var(--border-subtle)' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}
                >
                  <Sliders size={13} className="text-white" />
                </div>
                <span className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                  Settings
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close settings"
                className="p-2 rounded-lg transition-colors duration-200"
                style={{ color: 'var(--text-muted)', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                <X size={16} />
              </button>
            </div>

            {/* Settings rows */}
            <div className="px-5 pb-5">
              {/* Appearance */}
              <p
                className="font-mono text-[10px] uppercase tracking-widest font-semibold mt-4 mb-1"
                style={{ color: 'var(--text-muted)' }}
              >
                Appearance
              </p>

              <Row
                label="Theme"
                sub="Dark cinematic theme (site default)"
              >
                <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                  Dark only
                </span>
              </Row>

              {/* Audio */}
              <p
                className="font-mono text-[10px] uppercase tracking-widest font-semibold mt-5 mb-1"
                style={{ color: 'var(--text-muted)' }}
              >
                Audio
              </p>

              <Row
                label="Sound Effects"
                sub="Micro-interaction audio feedback"
              >
                <Toggle checked={!isMuted} onChange={toggleMute} id="settings-sound" />
              </Row>

              {/* Tools */}
              <p
                className="font-mono text-[10px] uppercase tracking-widest font-semibold mt-5 mb-1"
                style={{ color: 'var(--text-muted)' }}
              >
                Tools
              </p>

              <Row
                label="AI Terminal"
                sub="Chat with B.I.N.A.R.Y. AI"
              >
                <button
                  onClick={() => {
                    onClose();
                    onTerminalOpen?.();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--accent-light)',
                    color: 'var(--accent)',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  <Terminal size={12} />
                  Open
                </button>
              </Row>

              {/* Interaction */}
              <p
                className="font-mono text-[10px] uppercase tracking-widest font-semibold mt-5 mb-1"
                style={{ color: 'var(--text-muted)' }}
              >
                Interaction
              </p>

              <Row
                label="Custom Cursor"
                sub="Dot & ring cursor effect (desktop)"
              >
                <Toggle checked={cursorEnabled} onChange={toggleCursor} id="settings-cursor" />
              </Row>

              {/* About */}
              <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Logo variant="icon" size={24} decorative />
                  <Logo variant="wordmark" size={16} />
                </div>
                <p className="font-sans text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  AI-Native Digital Engineering Studio · v2.5.0
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsDrawer;

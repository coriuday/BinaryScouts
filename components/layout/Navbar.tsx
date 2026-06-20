'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Settings, Sparkles } from 'lucide-react';
import { useTheme } from '@/components/hooks/ThemeProvider';
import { useAudio } from '@/components/hooks/AudioProvider';
import SettingsDrawer from '@/components/ui/SettingsDrawer';

const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Work',     href: '/work' },
  { label: 'Studio',   href: '/about' },
  { label: 'Contact',  href: '/contact' },
];

const Navbar: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { isMuted, toggleMute } = useAudio();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  // Avoid hydration mismatch: isDark comes from localStorage which
  // the server doesn't know about. We delay theme-dependent rendering
  // until after the first client paint.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* ── Floating Pill Navbar ────────────────────────────── */}
      <motion.nav
        className="fixed z-50 w-full flex justify-center"
        style={{ top: 'var(--navbar-top, 12px)', paddingInline: '1rem' }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
      >
        <motion.div
          className="w-full max-w-5xl rounded-2xl flex items-center justify-between px-4 md:px-6 h-14 transition-all duration-500"
          style={{
            background: scrolled ? 'rgba(10,10,10,0.75)' : 'transparent',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
            border: scrolled ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid transparent',
            boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.4)' : 'none',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* ── Logo ─────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div
              className="relative w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <span className="font-display font-bold text-xs text-white tracking-tight z-10">BS</span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.28) 50%, transparent 65%)',
                  backgroundSize: '200% 100%',
                  animationPlayState: 'paused',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.animationPlayState = 'running')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.animationPlayState = 'paused')}
              />
            </div>
            <span
              className="font-display font-bold text-lg tracking-tight transition-colors duration-200 hidden sm:block"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
            >
              Binary<span className="gradient-text">Scouts</span>
            </span>
          </Link>

          {/* ── Desktop Nav Links ─────────────────────────────── */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-xl font-sans font-medium text-sm transition-all duration-200 group nav-active-dot ${isActive ? 'nav-active' : ''}`}
                  style={{
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    letterSpacing: '-0.01em',
                  }}
                  onMouseEnter={(e) => !isActive && (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={(e) => !isActive && (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  {item.label}
                  <span
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: 'var(--accent-light)' }}
                  />
                </Link>
              );
            })}
          </div>

          {/* ── Desktop Actions ───────────────────────────────── */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              // suppressHydrationWarning prevents React from complaining about
              // the title attribute differing between SSR (unknown theme) and
              // the first client paint (theme resolved from localStorage).
              suppressHydrationWarning
              title={mounted ? (isDark ? 'Switch to light' : 'Switch to dark') : 'Toggle theme'}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
              style={{
                color: 'var(--text-muted)',
                border: '1px solid var(--glass-border-1)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border-2)';
                (e.currentTarget as HTMLElement).style.background = 'var(--accent-light)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border-1)';
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              {/* Render neutral icon on server; correct icon after mount */}
              {!mounted ? <Moon size={15} /> : isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Settings */}
            <button
              onClick={() => setSettingsOpen((p) => !p)}
              title="Settings"
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
              style={{
                color: settingsOpen ? 'var(--accent)' : 'var(--text-muted)',
                border: '1px solid',
                borderColor: settingsOpen ? 'var(--glass-border-3)' : 'var(--glass-border-1)',
                background: settingsOpen ? 'var(--accent-light)' : 'transparent',
              }}
            >
              <Settings size={15} />
            </button>

            {/* Primary CTA */}
            <Link href="/planner">
              <button className="btn-primary text-sm px-5 py-2.5 gap-1.5">
                <Sparkles size={13} />
                Book a Call
              </button>
            </Link>
          </div>

          {/* ── Mobile Trigger ────────────────────────────────── */}
          <div className="md:hidden flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              suppressHydrationWarning
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ color: 'var(--text-muted)' }}
            >
              {!mounted ? <Moon size={16} /> : isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ color: 'var(--text-primary)', background: isOpen ? 'var(--accent-light)' : 'transparent' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {isOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </motion.div>
      </motion.nav>

      {/* ── Cinematic Mobile Menu ─────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-40 flex flex-col"
            style={{
              background: 'var(--bg-glass-solid)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              paddingTop: 'calc(var(--navbar-top, 12px) + 64px)',
            }}
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(32px)' }}
            exit={{ opacity: 0, transition: { duration: 0.22 } }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Atmospheric mini-orb inside menu */}
            <div
              className="absolute top-1/4 right-0 w-64 h-64 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, var(--orb-rose) 0%, transparent 65%)',
                filter: 'blur(50px)',
                opacity: 0.6,
                animation: 'atmosphericFloat 10s ease-in-out infinite',
              }}
            />
            <div
              className="absolute bottom-1/4 left-0 w-48 h-48 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, var(--orb-violet) 0%, transparent 65%)',
                filter: 'blur(50px)',
                opacity: 0.4,
                animation: 'atmosphericFloat 14s ease-in-out infinite reverse',
              }}
            />

            {/* Nav links — staggered reveal */}
            <div className="relative z-10 flex flex-col px-6 pt-4 pb-8 flex-1">
              <div className="flex flex-col gap-1 mb-auto">
                {NAV_LINKS.map((item, i) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: -12, filter: 'blur(2px)' }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.05 + i * 0.07 }}
                      className="relative"
                    >
                      {/* Active left-side indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="mobile-active-indicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full"
                          style={{ background: 'var(--gradient-primary)' }}
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-200"
                        style={{
                          color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                          background: isActive ? 'var(--accent-light)' : 'transparent',
                        }}
                      >
                        <span
                          className="font-display font-bold text-2xl"
                          style={{ letterSpacing: '-0.03em' }}
                        >
                          {item.label}
                        </span>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 rounded-full"
                            style={{ background: 'var(--accent)' }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
                className="mt-8 space-y-3"
              >
                <div className="h-px" style={{ background: 'var(--glass-border-1)' }} />
                <Link href="/planner" onClick={closeMenu} className="block">
                  <button className="btn-primary w-full justify-center gap-2 py-4 text-base">
                    <Sparkles size={16} />
                    Start the Conversation
                  </button>
                </Link>
                <p
                  className="text-center font-sans text-[11px]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  30-minute call · No pitch · No commitment
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Drawer */}
      <SettingsDrawer
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onTerminalOpen={() => {}}
      />
    </>
  );
};

export default Navbar;
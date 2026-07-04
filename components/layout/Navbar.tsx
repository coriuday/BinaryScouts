'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Settings } from 'lucide-react';
import { useAudio } from '@/components/hooks/AudioProvider';
import SettingsDrawer from '@/components/ui/SettingsDrawer';
import Logo from '@/components/ui/Logo';

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Work',     href: '#work' },
  { label: 'Team',     href: '#team' },
  { label: 'Process',  href: '#process' },
  { label: 'Contact',  href: '#contact' },
];

const Navbar: React.FC = () => {
  const { isMuted, toggleMute } = useAudio();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);

      // Track active section
      const sections = NAV_LINKS.map((l) => l.href.replace('#', ''));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180) {
            setActiveSection(sections[i]);
            return;
          }
        }
      }
      setActiveSection('');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const handleNavClick = (href: string) => {
    closeMenu();
    if (pathname !== '/') {
      // Navigate to homepage with anchor
      window.location.href = '/' + href;
      return;
    }
    // Smooth scroll on homepage
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
            background: scrolled ? 'rgba(10,10,15,0.8)' : 'transparent',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
            border: scrolled ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid transparent',
            boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.4)' : 'none',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" style={{ textDecoration: 'none' }} aria-label="BinaryScouts home">
            <Logo variant="icon" size={36} priority decorative />
            <Logo variant="wordmark" size={20} priority className="hidden sm:inline-block" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontWeight: 500,
                    fontSize: 13,
                    color: isActive ? 'var(--indigo)' : 'var(--text-2)',
                    background: isActive ? 'var(--indigo-dim)' : 'transparent',
                    border: 'none',
                    borderRadius: 8,
                    padding: '7px 14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--text-1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--text-2)';
                    }
                  }}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-1.5 mr-2" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--emerald)' }}>
              <span className="v2-live-dot" style={{ width: 5, height: 5 }} />
              LIVE
            </div>



            {/* Settings */}
            <button
              onClick={() => setSettingsOpen(true)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                border: '0.5px solid var(--border-v2)',
                background: 'transparent',
                color: 'var(--text-2)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-hover)';
                e.currentTarget.style.color = 'var(--text-1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-v2)';
                e.currentTarget.style.color = 'var(--text-2)';
              }}
              aria-label="Open settings"
            >
              <Settings size={16} />
            </button>

            {/* CTA */}
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
              className="hidden md:inline-flex"
              style={{
                fontFamily: 'var(--font-inter)',
                fontWeight: 600,
                fontSize: 13,
                color: '#fff',
                background: 'linear-gradient(135deg, var(--indigo), var(--cyan-v2))',
                padding: '8px 20px',
                borderRadius: 10,
                textDecoration: 'none',
                transition: 'filter 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(1.15)';
                e.currentTarget.style.boxShadow = '0 0 20px var(--indigo-glow)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'brightness(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Start Project
            </a>

            {/* Mobile hamburger */}
            <button
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                border: '0.5px solid var(--border-v2)',
                background: 'transparent',
                color: 'var(--text-2)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </motion.div>
      </motion.nav>

      {/* ── Mobile Menu Overlay ──────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(20px)' }}
            onClick={closeMenu}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-col items-center justify-center h-full gap-8"
              onClick={(e) => e.stopPropagation()}
            >
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  onClick={() => handleNavClick(link.href)}
                  style={{
                    fontFamily: 'var(--font-syne)',
                    fontWeight: 600,
                    fontSize: 32,
                    color: activeSection === link.href.replace('#', '') ? 'var(--indigo)' : 'var(--text-1)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                  }}
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.a
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                href="#contact"
                onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 600,
                  fontSize: 16,
                  color: '#fff',
                  background: 'linear-gradient(135deg, var(--indigo), var(--cyan-v2))',
                  padding: '14px 36px',
                  borderRadius: 12,
                  textDecoration: 'none',
                  marginTop: 16,
                }}
              >
                Start Project →
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Settings Drawer ──────────────────────────────── */}
      <SettingsDrawer isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
};

export default Navbar;
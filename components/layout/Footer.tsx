'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import TypewriterText from '@/components/motion/TypewriterText';

const SOLUTIONS = [
  { label: 'AI Systems',        href: '/services#ai-systems' },
  { label: 'SaaS Development',  href: '/services#saas-dev' },
  { label: 'CRM Automation',    href: '/services#crm' },
  { label: 'Growth Engineering',href: '/services#growth' },
];

const COMPANY = [
  { label: 'Our Work',  href: '/work' },
  { label: 'About Studio', href: '/about' },
  { label: 'Careers',      href: '/careers' },
  { label: 'Contact',      href: '/contact' },
  { label: 'Legal',        href: '/terms' },
];

/* ── Social icons — SVG inline for brand accuracy ── */
const IconInstagram = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);
const IconLinkedin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const IconGithub = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);
const IconDiscord = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.081.11 18.103.128 18.116a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);
const IconTwitterX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const IconWhatsApp = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

/* Brand-color hover config for each social */
const SOCIALS = [
  {
    Icon: IconInstagram,
    href: '#',
    label: 'Instagram',
    brandColor: '#E1306C',
    brandGlow: 'rgba(225,48,108,0.35)',
    brandBg: 'rgba(225,48,108,0.10)',
    gradient: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
  },
  {
    Icon: IconLinkedin,
    href: '#',
    label: 'LinkedIn',
    brandColor: '#0A66C2',
    brandGlow: 'rgba(10,102,194,0.35)',
    brandBg: 'rgba(10,102,194,0.10)',
  },
  {
    Icon: IconGithub,
    href: '#',
    label: 'GitHub',
    brandColor: '#c9d1d9',
    brandGlow: 'rgba(110,64,201,0.30)',
    brandBg: 'rgba(110,64,201,0.10)',
  },
  {
    Icon: IconDiscord,
    href: '#',
    label: 'Discord',
    brandColor: '#5865F2',
    brandGlow: 'rgba(88,101,242,0.35)',
    brandBg: 'rgba(88,101,242,0.10)',
  },
  {
    Icon: IconTwitterX,
    href: '#',
    label: 'Twitter / X',
    brandColor: '#1DA1F2',
    brandGlow: 'rgba(29,161,242,0.35)',
    brandBg: 'rgba(29,161,242,0.10)',
  },
  {
    Icon: IconWhatsApp,
    href: '#',
    label: 'WhatsApp',
    brandColor: '#25D366',
    brandGlow: 'rgba(37,211,102,0.35)',
    brandBg: 'rgba(37,211,102,0.10)',
  },
];

/* ── Social icon button ── */
const SocialButton: React.FC<typeof SOCIALS[number]> = ({
  Icon, href, label, brandColor, brandGlow, brandBg,
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-250"
      style={{
        color: hovered ? brandColor : '#888',
        background: hovered ? brandBg : 'rgba(26,26,26,0.8)',
        border: `0.5px solid ${hovered ? brandColor + '40' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: hovered ? `0 0 16px ${brandGlow}` : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Icon />
    </a>
  );
};

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer
      className="relative pt-20 pb-10 overflow-hidden"
      style={{ backgroundColor: '#050505' }}
    >
      {/* Cyan top border */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)', opacity: 0.4 }}
      />

      {/* Atmospheric gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, var(--orb-violet) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Main grid ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-6 group">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <span className="font-display font-bold text-sm text-white">BS</span>
              </div>
              <span
                className="font-display font-bold text-lg"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
              >
                Binary<span className="gradient-text">Scouts</span>
              </span>
            </Link>

            <p
              className="font-sans text-sm leading-relaxed mb-6"
              style={{ color: 'var(--text-secondary)' }}
            >
              AI-native digital engineering studio building intelligent systems for modern businesses.
            </p>

            {/* Social icons — brand color hover */}
            <div className="flex flex-wrap gap-2">
              {SOCIALS.map((social) => (
                <SocialButton key={social.label} {...social} />
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h5
              className="font-display font-bold text-xs uppercase tracking-[0.12em] mb-5"
              style={{ color: 'var(--text-primary)' }}
            >
              Solutions
            </h5>
            <ul className="space-y-3">
              {SOLUTIONS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    <ArrowRight
                      size={11}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5
              className="font-display font-bold text-xs uppercase tracking-[0.12em] mb-5"
              style={{ color: 'var(--text-primary)' }}
            >
              Company
            </h5>
            <ul className="space-y-3">
              {COMPANY.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    <ArrowRight
                      size={11}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5
              className="font-display font-bold text-xs uppercase tracking-[0.12em] mb-5"
              style={{ color: 'var(--text-primary)' }}
            >
              Stay Updated
            </h5>
            <p className="font-sans text-sm mb-5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Insights on AI, automation, and digital engineering — monthly.
            </p>

            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-medium"
                style={{
                  background: 'var(--accent-light)',
                  border: '1px solid var(--glass-border-2)',
                  color: 'var(--accent)',
                }}
              >
                <CheckCircle size={15} />
                <span>You&apos;re subscribed!</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="input-cinematic text-sm"
                />
                <button type="submit" className="btn-primary text-sm py-3 justify-center gap-1.5">
                  <Sparkles size={13} />
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── Bottom bar ───────────────────────────────────────── */}
        <div
          className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-xs"
          style={{ borderTop: '1px solid var(--glass-border-1)', color: 'var(--text-muted)' }}
        >
          <p className="font-sans">© {new Date().getFullYear()} BinaryScouts. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-[var(--accent)] duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[var(--accent)] duration-200">
              Terms of Service
            </Link>
          </div>
          <p className="font-sans">
            <TypewriterText text="Built with precision by BinaryScouts Studio" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
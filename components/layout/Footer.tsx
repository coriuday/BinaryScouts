'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Phone, Sparkles } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useContactInfo } from '@/components/hooks/useContactInfo';

const SOLUTIONS = [
  { label: 'AI Systems',         href: '/#services' },
  { label: 'SaaS Development',   href: '/#services' },
  { label: 'CRM Automation',     href: '/#services' },
  { label: 'Growth Engineering',  href: '/#services' },
];

const COMPANY = [
  { label: 'Our Work',      href: '/#work' },
  { label: 'About Studio',  href: '/#about' },
  { label: 'Careers',       href: '/careers' },
  { label: 'Contact',       href: '/#contact' },
  { label: 'Legal',         href: '/terms' },
];

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/coriuday', abbr: 'GH' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/uday-kori-784678210/', abbr: 'in' },
];

const contactLinkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter)',
  fontSize: 14,
  color: 'var(--text-2)',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  transition: 'color 0.2s',
};

const Footer: React.FC = () => {
  const { email: contactEmail, phoneDisplay, whatsappUrl } = useContactInfo();
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [emailDelivered, setEmailDelivered] = useState(true);
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [subError, setSubError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || subStatus === 'loading') return;
    setSubStatus('loading');
    setSubError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'newsletter', email: email.trim(), website: honeypot }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubStatus('error');
        setSubError(data.error || 'Something went wrong. Try again.');
        return;
      }
      setEmailDelivered(data.delivered !== false);
      setSubscribed(true);
      setEmail('');
      setSubStatus('idle');
    } catch {
      setSubStatus('error');
      setSubError('Network error. Please try again.');
    }
  };

  return (
    <footer className="relative pt-20 pb-10 overflow-hidden" style={{ backgroundColor: 'var(--space)' }}>
      {/* Gradient top border */}
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--indigo), transparent)', opacity: 0.4 }} />

      {/* Atmospheric gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, var(--orb-violet) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="mb-6 flex items-center gap-3 group"
              style={{ textDecoration: 'none' }}
              aria-label="BinaryScouts home"
            >
              <Logo variant="icon" size={40} decorative />
              <Logo variant="wordmark" size={22} />
            </Link>

            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 20 }}>
              AI-native digital engineering studio building intelligent systems for modern businesses.
            </p>

            {/* Social icons */}
            <div className="flex flex-wrap gap-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: 'var(--space-3)',
                    border: '0.5px solid var(--border-v2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--text-3)',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-hover)';
                    e.currentTarget.style.color = 'var(--text-1)';
                    e.currentTarget.style.boxShadow = '0 0 12px var(--indigo-glow)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-v2)';
                    e.currentTarget.style.color = 'var(--text-3)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {social.abbr}
                </a>
              ))}
            </div>

            <div className="mt-6 space-y-2.5">
              <a
                href={`mailto:${contactEmail}`}
                style={contactLinkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--indigo)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-2)')}
              >
                <Mail size={14} aria-hidden />
                {contactEmail}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                style={contactLinkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#25D366')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-2)')}
              >
                <Phone size={14} aria-hidden />
                {phoneDisplay}
              </a>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h5 style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-1)', marginBottom: 20 }}>
              Solutions
            </h5>
            <ul className="space-y-3">
              {SOLUTIONS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: 'var(--text-2)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--indigo)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-2)')}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5 style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-1)', marginBottom: 20 }}>
              Company
            </h5>
            <ul className="space-y-3">
              {COMPANY.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('#') ? (
                    <a
                      href={link.href}
                      style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: 'var(--text-2)', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--indigo)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-2)')}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: 'var(--text-2)', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--indigo)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-2)')}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-1)', marginBottom: 20 }}>
              Stay Updated
            </h5>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 16 }}>
              Insights on AI, automation, and digital engineering — monthly.
            </p>

            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-medium"
                style={{ background: 'var(--indigo-dim)', border: '0.5px solid var(--border-v2)', color: 'var(--indigo)' }}
                role="status"
                aria-live="polite"
              >
                <CheckCircle size={15} />
                <span>{emailDelivered ? "You're subscribed!" : "You're on the list!"}</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
                <label htmlFor="footer-newsletter-email" className="sr-only">
                  Email address
                </label>
                {/* Honeypot — hidden from users, bots often fill it */}
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
                />
                <input
                  id="footer-newsletter-email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                  disabled={subStatus === 'loading'}
                  className="input-cinematic text-sm"
                  style={{ borderRadius: 12 }}
                />
                {subError && (
                  <p role="alert" style={{ fontSize: 12, color: '#f87171' }}>{subError}</p>
                )}
                <button
                  type="submit"
                  disabled={subStatus === 'loading'}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, var(--indigo), var(--cyan-v2))',
                    borderRadius: 12,
                    border: 'none',
                    fontFamily: 'var(--font-inter)',
                    fontWeight: 600,
                    fontSize: 14,
                    color: '#fff',
                    cursor: subStatus === 'loading' ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    opacity: subStatus === 'loading' ? 0.7 : 1,
                  }}
                >
                  <Sparkles size={13} />
                  {subStatus === 'loading' ? 'Subscribing…' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-xs"
          style={{ borderTop: '0.5px solid var(--border-v2)', color: 'var(--text-3)' }}
        >
          <p style={{ fontFamily: 'var(--font-inter)' }}>© {new Date().getFullYear()} BinaryScouts. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" style={{ color: 'var(--text-3)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--indigo)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}>
              Privacy Policy
            </Link>
            <Link href="/terms" style={{ color: 'var(--text-3)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--indigo)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}>
              Terms of Service
            </Link>
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)' }}>
            Built with precision by BinaryScouts Studio
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
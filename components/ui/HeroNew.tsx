'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const ParticleCanvas = dynamic(() => import('@/components/ui/ParticleCanvas'), { ssr: false });
const TechBubbles = dynamic(() => import('@/components/ui/TechBubbles'), { ssr: false });

/* ── Status pill component ───────────────────────────── */
const StatusPill: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: 'rgba(16,185,129,0.08)',
        border: '0.5px solid rgba(16,185,129,0.22)',
        borderRadius: 100,
        padding: '7px 16px',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--emerald)',
        whiteSpace: 'nowrap' as const,
      }}
    >
      <span className="v2-live-dot" style={{ width: 5, height: 5 }} />
      {value} {label}
    </div>
  );
};

/* ── Hero Section ────────────────────────────────────── */
const HeroNew: React.FC = () => {
  const CAPABILITY_PILLARS = [
    { value: 'Full-stack', label: 'Product engineering' },
    { value: 'AI-native', label: 'Systems & automation' },
    { value: 'Hands-on', label: 'Engineering partnership' },
    { value: 'Outcome-led', label: 'Delivery focus' },
  ];

  const words1 = ['We', 'build', 'systems'];
  const words2 = ['that', 'scale'];

  const TICKER_ROW_1 = [
    'AI Agent Systems', 'Next.js SaaS', 'WhatsApp CRM', 'GPT-4 Pipelines',
    'Revenue Dashboards', 'Rust APIs', 'RAG Systems', 'Stripe Billing',
    'CI/CD DevOps', 'Supabase DB',
  ];
  const TICKER_ROW_2 = [
    'LangChain Agents', 'Framer Motion', 'TypeScript', 'Docker + K8s',
    'PostgreSQL', 'Redis Cache', 'Vercel Deploy', 'Twilio SMS',
    'OpenAI API', 'Growth SEO',
  ];

  return (
    <section
      className="relative w-full flex items-center overflow-hidden"
      style={{ minHeight: '100dvh', backgroundColor: 'var(--space)' }}
    >
      <ParticleCanvas />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-stretch">
        <div style={{ maxWidth: 700 }}>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mb-6 flex items-center gap-2"
          >
            <span className="v2-live-dot" />
            <span className="v2-eyebrow">AI-NATIVE ENGINEERING STUDIO</span>
          </motion.div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: 'clamp(48px, 6.5vw, 86px)',
              fontWeight: 800,
              fontFamily: 'var(--font-syne)',
              color: 'var(--text-1)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              marginBottom: 24,
            }}
          >
            <span style={{ display: 'block' }}>
              {words1.map((w, i) => (
                <motion.span
                  key={w}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.055, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ display: 'inline-block', marginRight: '0.3em' }}
                >
                  {w}
                </motion.span>
              ))}
            </span>
            <span style={{ display: 'block' }}>
              {words2.map((w, i) => (
                <motion.span
                  key={w}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 + i * 0.055, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ display: 'inline-block', marginRight: '0.3em' }}
                >
                  {w}
                </motion.span>
              ))}
              <motion.span
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.76, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="v2-gradient-word"
                style={{ display: 'inline-block' }}
              >
                futures.
              </motion.span>
            </span>
          </h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            style={{
              fontSize: 18,
              fontFamily: 'var(--font-inter)',
              color: 'var(--text-2)',
              lineHeight: 1.7,
              maxWidth: 540,
              marginBottom: 32,
            }}
          >
            We engineer AI systems, automate business operations, and build
            scalable SaaS products for startups that refuse to move slowly.
          </motion.p>

          {/* Studio Status Bar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            <StatusPill label="studio" value="Remote-first" />
            <StatusPill label="now" value="Accepting projects" />
            <StatusPill label="call" value="30-min discovery" />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3, duration: 0.5, type: 'spring', stiffness: 300, damping: 28 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <a
              href="#work"
              className="btn-magnetic"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'linear-gradient(135deg, var(--indigo), var(--cyan-v2))',
                borderRadius: 12,
                padding: '16px 34px',
                fontFamily: 'var(--font-inter)',
                fontWeight: 600,
                fontSize: 16,
                color: '#fff',
                textDecoration: 'none',
                transition: 'filter 0.2s ease, box-shadow 0.2s ease',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.filter = 'brightness(1.15)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px var(--indigo-glow)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.filter = 'brightness(1)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              Explore Our Work
              <span style={{ transition: 'transform 0.2s', display: 'inline-block' }}>→</span>
            </a>
            <a
              href="#contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'transparent',
                border: '0.5px solid var(--border-strong-v2)',
                borderRadius: 12,
                padding: '16px 34px',
                fontFamily: 'var(--font-inter)',
                fontWeight: 600,
                fontSize: 16,
                color: 'var(--text-2)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)';
                (e.currentTarget as HTMLElement).style.background = 'var(--indigo-dim)';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-1)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong-v2)';
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-2)';
              }}
            >
              Book a Discovery Call
            </a>
          </motion.div>

          {/* Impact Numbers */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="flex items-start gap-8 flex-wrap"
            style={{ borderTop: '0.5px solid var(--border-v2)', paddingTop: 24 }}
          >
            {CAPABILITY_PILLARS.map((s, i) => (
              <div key={s.label} style={{ borderLeft: i > 0 ? '0.5px solid var(--border-v2)' : 'none', paddingLeft: i > 0 ? 24 : 0 }}>
                <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 28, color: 'var(--text-1)', lineHeight: 1.1 }}>{s.value}</div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

          {/* Floating tech bubbles — desktop right column */}
          <div className="hidden lg:block relative w-full min-h-[560px] self-stretch">
            <TechBubbles />
          </div>
        </div>
      </div>

      {/* Live Ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7, duration: 0.5 }}
        className="absolute bottom-0 left-0 right-0 pb-8 overflow-hidden hidden md:block"
        style={{ zIndex: 10 }}
      >
        {/* Row 1 → */}
        <div className="v2-ticker-row mb-3" style={{ overflow: 'hidden' }}>
          <div
            className="v2-ticker-track flex gap-3"
            style={{ animation: 'ticker-scroll-left 38s linear infinite', width: 'max-content' }}
          >
            {[...TICKER_ROW_1, ...TICKER_ROW_1].map((tag, i) => (
              <span
                key={`r1-${i}`}
                style={{
                  background: 'var(--space-3)',
                  border: '0.5px solid var(--border-v2)',
                  borderRadius: 8,
                  padding: '10px 18px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--text-2)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        {/* Row 2 ← */}
        <div className="v2-ticker-row" style={{ overflow: 'hidden' }}>
          <div
            className="v2-ticker-track flex gap-3"
            style={{ animation: 'ticker-scroll-right 38s linear infinite', width: 'max-content' }}
          >
            {[...TICKER_ROW_2, ...TICKER_ROW_2].map((tag, i) => (
              <span
                key={`r2-${i}`}
                style={{
                  background: 'var(--space-3)',
                  border: '0.5px solid var(--border-v2)',
                  borderRadius: 8,
                  padding: '10px 18px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--text-2)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroNew;

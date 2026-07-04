'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ParticleCanvas from '@/components/ui/ParticleCanvas';
import TechBubbles from '@/components/ui/TechBubbles';

/* ── Counter-up hook ─────────────────────────────────── */
function useCountUp(end: number, duration: number, inView: boolean, delay = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(eased * end));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [inView, end, duration, delay]);
  return val;
}

/* ── Status pill component ───────────────────────────── */
const StatusPill: React.FC<{ label: string; value: string; jitter?: boolean }> = ({ label, value, jitter }) => {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!jitter) return;
    const interval = setInterval(() => {
      const base = parseInt(value);
      if (isNaN(base)) return;
      const offset = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
      setDisplay(String(base + offset));
    }, 8000 + Math.random() * 7000);
    return () => clearInterval(interval);
  }, [jitter, value]);

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
      {display} {label}
    </div>
  );
};

/* ── Hero Section ────────────────────────────────────── */
const HeroNew: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    setInView(true);
  }, []);

  const stat1 = useCountUp(50, 1500, inView, 1500);
  const stat2 = useCountUp(2, 1500, inView, 1500);
  const stat3 = useCountUp(98, 1500, inView, 1500);
  const stat4 = useCountUp(49, 1500, inView, 1500); // 4.9 rendered as 49/10

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
      ref={sectionRef}
      className="relative w-full flex items-center overflow-hidden"
      style={{ minHeight: '100dvh', backgroundColor: 'var(--space)' }}
    >
      <ParticleCanvas />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center">
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
            <StatusPill label="Active Projects" value="3" />
            <StatusPill label="Uptime" value="99.98%" />
            <StatusPill label="Engineers Online" value="6" jitter />
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
            {[
              { value: `${stat1}+`, label: 'Systems Built' },
              { value: `$${stat2}M+`, label: 'Revenue Generated' },
              { value: `${stat3}%`, label: 'Client Retention' },
              { value: `${(stat4 / 10).toFixed(1)}★`, label: 'Avg Client Rating' },
            ].map((s, i) => (
              <div key={i} style={{ borderLeft: i > 0 ? '0.5px solid var(--border-v2)' : 'none', paddingLeft: i > 0 ? 24 : 0 }}>
                <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 38, color: 'var(--text-1)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

          {/* Floating tech bubbles — desktop right column */}
          <div className="hidden lg:flex items-center justify-end min-h-[420px]">
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

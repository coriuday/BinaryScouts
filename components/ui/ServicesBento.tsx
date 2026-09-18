'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

/* ── Tilt wrapper for cards ──────────────────────────── */
const TiltCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  accent: string;
  large?: boolean;
}> = ({ children, className = '', accent, large }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current || window.innerWidth < 1024) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.01)`;
    ref.current.style.transition = 'transform 0.1s ease';
  }, []);

  const handleLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
    ref.current.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    setHovered(false);
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      style={{
        background: 'var(--space-2)',
        border: `1px solid ${hovered ? accent + '66' : 'var(--border-v2)'}`,
        borderRadius: 20,
        padding: 32,
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        boxShadow: hovered ? `0 0 48px ${accent}1F` : 'none',
        gridColumn: large ? 'span 2' : undefined,
      }}
    >
      {children}
    </div>
  );
};

/* ── Individual Card Visuals ─────────────────────────── */

/* Card 1: AI Systems */
const AISystemsCard: React.FC = () => {
  const [hovered, setHovered] = useState(false);
  const [modelIdx, setModelIdx] = useState(0);
  const models = ['GPT-4', 'Gemini 2.0', 'Claude 3.5', 'LangChain'];

  useEffect(() => {
    const t = setInterval(() => setModelIdx((i) => (i + 1) % models.length), 2000);
    return () => clearInterval(t);
  }, [models.length]);

  return (
    <TiltCard accent="#6366f1" large>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          {/* Neural network icon */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="6" r="3" fill="none" stroke="#6366f1" strokeWidth="1.5" opacity="0.8">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="6" cy="16" r="3" fill="none" stroke="#6366f1" strokeWidth="1.5" opacity="0.8">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" begin="0.6s" repeatCount="indefinite" />
            </circle>
            <circle cx="26" cy="16" r="3" fill="none" stroke="#6366f1" strokeWidth="1.5" opacity="0.8">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" begin="1.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="10" cy="26" r="3" fill="none" stroke="#6366f1" strokeWidth="1.5" opacity="0.8">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" begin="1.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="22" cy="26" r="3" fill="none" stroke="#6366f1" strokeWidth="1.5" opacity="0.8">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" begin="2.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="16" cy="16" r="4" fill="#6366f1" fillOpacity="0.3" stroke="#6366f1" strokeWidth="1.5" />
            <line x1="16" y1="9" x2="16" y2="12" stroke="#6366f1" strokeWidth="0.5" opacity="0.4" />
            <line x1="9" y1="16" x2="12" y2="16" stroke="#6366f1" strokeWidth="0.5" opacity="0.4" />
            <line x1="20" y1="16" x2="23" y2="16" stroke="#6366f1" strokeWidth="0.5" opacity="0.4" />
            <line x1="12" y1="24" x2="14" y2="20" stroke="#6366f1" strokeWidth="0.5" opacity="0.4" />
            <line x1="20" y1="24" x2="18" y2="20" stroke="#6366f1" strokeWidth="0.5" opacity="0.4" />
          </svg>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6366f1', textTransform: 'uppercase' as const }}>Core</span>
        </div>

        <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: 22, color: 'var(--text-1)', marginBottom: 8 }}>AI Systems</h3>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 8 }}>
          Automate knowledge work with agents and RAG pipelines grounded in your data — not demos that fall apart in production.
        </p>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: 'var(--text-3)', lineHeight: 1.55, marginBottom: 16 }}>
          Models & tooling: GPT-4, Gemini, Claude, LangChain.
        </p>

        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6366f1', marginBottom: 12 }}
          >
            Built on  <span style={{ fontWeight: 600 }}>{models[modelIdx]}</span>
          </motion.div>
        )}

        <div className="mt-auto flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)' }}>
          <span className="v2-live-dot" style={{ background: '#6366f1', width: 5, height: 5, animation: 'pulse-live 2s infinite' }} />
          Production-ready pipelines
        </div>
      </div>
    </TiltCard>
  );
};

/* Card 2: SaaS Development */
const SaaSCard: React.FC = () => {
  const [hovered, setHovered] = useState(false);
  const [typed, setTyped] = useState('');
  const codeStr = "const future = await deploy('next.js')";

  useEffect(() => {
    if (!hovered) { setTyped(''); return; }
    let i = 0;
    const t = setInterval(() => {
      if (i < codeStr.length) {
        setTyped(codeStr.slice(0, i + 1));
        i++;
      } else clearInterval(t);
    }, 35);
    return () => clearInterval(t);
  }, [hovered]);

  return (
    <TiltCard accent="#22d3ee">
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, color: '#22d3ee' }}>
            {'{ '}<span style={{ animation: 'blink 1s infinite' }}>|</span>{' }'}
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#22d3ee', textTransform: 'uppercase' as const }}>Build</span>
        </div>

        <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: 22, color: 'var(--text-1)', marginBottom: 8 }}>SaaS Development</h3>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 8 }}>
          Turn a product idea into a production SaaS — auth, billing, dashboards, and APIs that scale with your users.
        </p>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: 'var(--text-3)', lineHeight: 1.55, marginBottom: 16 }}>
          Stack highlights: Next.js, TypeScript, Rust gateways, Postgres.
        </p>

        {hovered && (
          <>
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'rgba(0,0,0,0.4)',
                borderRadius: 8,
                padding: '8px 12px',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                marginBottom: 12,
                color: 'var(--text-2)',
              }}
            >
              <span style={{ color: '#a78bfa' }}>const</span>{' '}
              <span style={{ color: '#22d3ee' }}>future</span>{' '}
              <span style={{ color: 'var(--text-2)' }}>= await deploy(</span>
              <span style={{ color: '#f59e0b' }}>&apos;next.js&apos;</span>
              <span style={{ color: 'var(--text-2)' }}>)</span>
              <span style={{ animation: 'blink 1s infinite', color: '#22d3ee' }}>|</span>
            </motion.div>

            <div className="flex gap-2 mb-3">
              {['Next.js', 'Supabase', 'Stripe'].map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '0.5px solid var(--border-v2)',
                    borderRadius: 6,
                    padding: '4px 10px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--text-2)',
                  }}
                >
                  {t}
                </motion.span>
              ))}
            </div>
          </>
        )}

        <div className="mt-auto">
          <div className="flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)' }}>
            Focus:
            <span style={{ color: '#22d3ee' }}>Performance · accessibility · scale</span>
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

/* Card 3: CRM Automation */
const CRMCard: React.FC = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <TiltCard accent="#10b981">
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          {/* Pipeline icon */}
          <svg width="32" height="16" viewBox="0 0 96 16" fill="none">
            <text x="0" y="12" fill="#10b981" fontSize="9" fontFamily="var(--font-mono)">Lead</text>
            <text x="34" y="12" fill="#10b981" fontSize="9" fontFamily="var(--font-mono)">Score</text>
            <text x="68" y="12" fill="#10b981" fontSize="9" fontFamily="var(--font-mono)">Act</text>
            <line x1="24" y1="8" x2="32" y2="8" stroke="#10b981" strokeWidth="1" strokeDasharray="2" />
            <line x1="58" y1="8" x2="66" y2="8" stroke="#10b981" strokeWidth="1" strokeDasharray="2" />
            <circle cx="28" cy="8" r="2" fill="#10b981">
              <animate attributeName="cx" values="24;32" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#10b981', textTransform: 'uppercase' as const }}>Automate</span>
        </div>

        <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: 22, color: 'var(--text-1)', marginBottom: 8 }}>CRM Automation</h3>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 16 }}>
          Intelligent lead workflows, WhatsApp automation, email sequences, and CRM integrations that run 24/7.
        </p>

        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{
              background: '#128c7e',
              borderRadius: '18px 18px 4px 18px',
              padding: '10px 16px',
              fontFamily: 'var(--font-inter)',
              fontSize: 13,
              color: '#fff',
              marginBottom: 12,
              alignSelf: 'flex-end',
              maxWidth: '80%',
            }}
          >
            New lead qualified ✓✓
          </motion.div>
        )}

        <div className="flex gap-3 mb-3">
          <span style={{ color: 'var(--text-3)', fontFamily: 'var(--font-inter)', fontSize: 13 }}>Manual follow-up</span>
          <span style={{ color: 'var(--text-3)', fontSize: 13 }}>→</span>
          <span style={{ color: 'var(--emerald)', fontWeight: 600, fontFamily: 'var(--font-inter)', fontSize: 13 }}>Automated routing</span>
        </div>

        <div className="mt-auto" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--emerald)' }}>
          WhatsApp · email · CRM sync
        </div>
      </div>
    </TiltCard>
  );
};

/* Card 4: Growth Engineering */
const GrowthCard: React.FC = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <TiltCard accent="#f59e0b">
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div style={{ fontSize: 28 }}>🚀</div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#f59e0b', textTransform: 'uppercase' as const }}>Scale</span>
        </div>

        <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: 22, color: 'var(--text-1)', marginBottom: 8 }}>Growth Engineering</h3>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 16 }}>
          Data-driven SEO infrastructure, paid acquisition systems, and conversion optimization at every funnel stage.
        </p>

        {hovered && (
          <div className="flex flex-wrap gap-2 mb-3">
            {['Technical SEO', 'Acquisition systems', 'Conversion loops'].map((m, i) => (
              <motion.span
                key={m}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                style={{
                  background: 'rgba(245,158,11,0.12)',
                  border: '0.5px solid rgba(245,158,11,0.3)',
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: '#f59e0b',
                }}
              >
                {m}
              </motion.span>
            ))}
          </div>
        )}

        {/* Funnel */}
        <div className="mt-auto space-y-2">
          {[
            { label: 'Visitors', w: hovered ? '100%' : '0%' },
            { label: 'Leads', w: hovered ? '62%' : '0%' },
            { label: 'Customers', w: hovered ? '24%' : '0%' },
          ].map((bar) => (
            <div key={bar.label} className="flex items-center gap-2">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', width: 60 }}>{bar.label}</span>
              <div style={{ flex: 1, height: 4, background: 'var(--space-4)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: bar.w, height: '100%', background: '#f59e0b', borderRadius: 2, transition: 'width 0.6s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </TiltCard>
  );
};

/* Card 5: Enterprise Dashboards */
const DashboardCard: React.FC = () => {
  const [bars, setBars] = useState([60, 40, 75]);

  useEffect(() => {
    const t = setInterval(() => {
      setBars([
        30 + Math.random() * 60,
        30 + Math.random() * 60,
        30 + Math.random() * 60,
      ]);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <TiltCard accent="#a78bfa" large>
      <div className="h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="2" y="4" width="28" height="20" rx="3" stroke="#a78bfa" strokeWidth="1.5" fill="none" />
            <line x1="8" y1="28" x2="24" y2="28" stroke="#a78bfa" strokeWidth="1.5" />
            <line x1="16" y1="24" x2="16" y2="28" stroke="#a78bfa" strokeWidth="1.5" />
            <rect x="8" y="10" width="4" height="10" rx="1" fill="#a78bfa" fillOpacity="0.3" />
            <rect x="14" y="8" width="4" height="12" rx="1" fill="#a78bfa" fillOpacity="0.5" />
            <rect x="20" y="12" width="4" height="8" rx="1" fill="#a78bfa" fillOpacity="0.3" />
          </svg>
          <span className="flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#10b981', textTransform: 'uppercase' as const }}>
            <span className="v2-live-dot" style={{ width: 5, height: 5 }} />
            LIVE
          </span>
        </div>

        <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: 22, color: 'var(--text-1)', marginBottom: 8 }}>Enterprise Dashboards</h3>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 16 }}>
          Real-time analytics platforms that turn raw data into actionable business intelligence.
        </p>

        {/* Mini live dashboard */}
        <div className="mt-auto" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 16 }}>
          <div className="flex items-end gap-3" style={{ height: 60 }}>
            {bars.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background: `linear-gradient(to top, #a78bfa, rgba(167,139,250,0.3))`,
                  borderRadius: 4,
                  transition: 'height 0.5s ease',
                }}
              />
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)', marginTop: 8, textAlign: 'center' as const }}>
            Many sources → one unified intelligence layer
          </p>
        </div>
      </div>
    </TiltCard>
  );
};

/* Card 6: Infrastructure & DevOps */
const DevOpsCard: React.FC = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <TiltCard accent="#06b6d4">
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="6" y="2" width="20" height="28" rx="3" stroke="#06b6d4" strokeWidth="1.5" fill="none" />
            <line x1="6" y1="10" x2="26" y2="10" stroke="#06b6d4" strokeWidth="0.5" opacity="0.3" />
            <line x1="6" y1="18" x2="26" y2="18" stroke="#06b6d4" strokeWidth="0.5" opacity="0.3" />
            <circle cx="23" cy="6" r="2" fill="#10b981">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="23" cy="14" r="2" fill="#10b981">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" begin="0.3s" repeatCount="indefinite" />
            </circle>
            <circle cx="23" cy="22" r="2" fill="#10b981">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="2.4s" begin="0.6s" repeatCount="indefinite" />
            </circle>
          </svg>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#06b6d4', textTransform: 'uppercase' as const }}>Deploy</span>
        </div>

        <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: 22, color: 'var(--text-1)', marginBottom: 8 }}>Infrastructure & DevOps</h3>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 16 }}>
          Scalable cloud architectures, CI/CD pipelines, containerized deployments, and API gateway engineering.
        </p>

        {hovered && (
          <div className="flex items-center gap-3 mb-3">
            {['Build ✓', 'Test ✓', 'Deploy ✓'].map((stage, i) => (
              <React.Fragment key={stage}>
                {i > 0 && <span style={{ color: '#06b6d4', fontSize: 12 }}>→</span>}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.3 }}
                  style={{ fontFamily: 'var(--font-inter)', fontWeight: 500, fontSize: 12, color: 'var(--emerald)' }}
                >
                  {stage}
                </motion.span>
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center gap-3">
          {/* Uptime arc */}
          <svg width="48" height="28" viewBox="0 0 48 28">
            <path
              d="M4 24 A20 20 0 0 1 44 24"
              fill="none"
              stroke="var(--space-4)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M4 24 A20 20 0 0 1 44 24"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="63"
              strokeDashoffset="0.013"
            />
          </svg>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-2)' }}>
            CI/CD · monitored deploys
          </span>
        </div>
      </div>
    </TiltCard>
  );
};

/* ── Services Bento Grid Section ─────────────────────── */
const ServicesBento: React.FC = () => {
  return (
    <section id="services" style={{ backgroundColor: 'var(--space)', padding: '140px 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <span className="v2-eyebrow">WHAT WE BUILD</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: 'clamp(32px, 4vw, 54px)',
            color: 'var(--text-1)',
            lineHeight: 1.15,
            marginBottom: 48,
          }}
        >
          Six specialties.<br />
          One <span className="v2-gradient-word">integrated</span> studio.
        </motion.h2>

        <div
          className="grid gap-5"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:col-span-2">
            <AISystemsCard />
          </div>
          <SaaSCard />
          <CRMCard />
          <GrowthCard />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:col-span-2">
            <DashboardCard />
          </div>
          <DevOpsCard />
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-14"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2"
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 15,
              color: 'var(--text-2)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-1)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-2)')}
          >
            Not sure which fits your challenge? →{' '}
            <span
              style={{
                border: '0.5px solid var(--border-v2)',
                borderRadius: 100,
                padding: '10px 20px',
                transition: 'border-color 0.2s',
              }}
            >
              Let&apos;s Figure It Out
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesBento;

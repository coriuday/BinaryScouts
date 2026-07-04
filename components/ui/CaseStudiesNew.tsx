'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

/* ── Counter-up ──────────────────────────────────────── */
function CountUp({ end, prefix = '', suffix = '', duration = 1500 }: { end: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * end));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, end, duration]);

  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

/* ── Case Study Data ─────────────────────────────────── */
const CASE_STUDIES = [
  {
    id: 1,
    accent: '#6366f1',
    accentBg: 'rgba(99,102,241,0.08)',
    tag: 'Enterprise SaaS',
    headline: 'We cut lead response time from 4 hours to 45 seconds.',
    description: 'Built an AI-powered lead qualification and routing system that integrates with existing CRM infrastructure, automating the entire pipeline from initial contact to sales handoff.',
    metrics: [
      { value: 410, suffix: '%', label: 'ROI in 90d' },
      { value: 91, suffix: '%', label: 'Faster response time' },
      { value: 1200, suffix: '+', label: 'Leads auto per month' },
    ],
    tags: ['AI Systems', 'CRM Automation', 'GPT-4', 'WhatsApp API'],
    challenge: 'The client\'s sales team was losing 60% of inbound leads due to response times averaging 4+ hours. Manual lead scoring was inconsistent, and their CRM had no intelligent routing.',
    approach: [
      { title: 'AI Lead Scoring Engine', desc: 'We built a GPT-4 powered classifier that scores leads in real-time based on 23 behavioral signals, company data enrichment, and intent analysis.' },
      { title: 'Omnichannel Auto-Response', desc: 'Integrated WhatsApp, email, and SMS response system that engages qualified leads within 45 seconds with personalized, context-aware messaging.' },
      { title: 'Smart CRM Routing', desc: 'Developed a dynamic assignment engine that routes leads to the optimal sales rep based on expertise, availability, and historical close rates.' },
    ],
    testimonial: { quote: 'BinaryScouts shipped our AI lead system in 5 weeks. Month 1 ROI covered the entire project cost.', name: 'Arjun M.', role: 'CTO, Series A SaaS startup' },
  },
  {
    id: 2,
    accent: '#a78bfa',
    accentBg: 'rgba(167,139,250,0.08)',
    tag: 'Healthcare Analytics',
    headline: 'Six disconnected databases. One intelligence layer.',
    description: 'Unified 6 siloed data sources into a single real-time analytics platform, giving analysts 14 hours back per week and enabling data-driven decisions across the organization.',
    metrics: [
      { value: 6, suffix: ' → 1', label: 'Data sources unified' },
      { value: 14, suffix: ' hrs', label: 'Saved/analyst per week' },
      { value: 100, suffix: '%', label: 'Real-time sync' },
    ],
    tags: ['Enterprise Dashboard', 'Data Engineering', 'Supabase', 'Recharts'],
    challenge: 'A healthcare platform had critical patient and operational data scattered across 6 different databases with no unified view. Analysts spent 14+ hours weekly just compiling reports.',
    approach: [
      { title: 'Data Lake Architecture', desc: 'Designed a PostgreSQL-backed data lake with real-time CDC (Change Data Capture) pipelines from all 6 source systems.' },
      { title: 'Unified API Layer', desc: 'Built a GraphQL API gateway that normalizes and serves data from all sources through a single, type-safe interface.' },
      { title: 'Executive Dashboard', desc: 'Deployed an interactive Recharts-powered dashboard with drill-down capabilities, automated alerts, and scheduled report generation.' },
    ],
    testimonial: { quote: 'The dashboard replaced three separate tools. My analysts were sending thank-you messages on Slack.', name: 'Aadit S.', role: 'VP Product, Healthcare platform' },
  },
  {
    id: 3,
    accent: '#f59e0b',
    accentBg: 'rgba(245,158,11,0.08)',
    tag: 'D2C E-commerce',
    headline: 'Built a content engine that generated $1.4M in organic revenue.',
    description: 'Designed and deployed a full-stack content and SEO system that drove 3.2× traffic growth, reduced CAC by 42%, and generated $1.4M in attributable organic revenue within 8 months.',
    metrics: [
      { value: 14, prefix: '$', suffix: 'M', label: 'Organic revenue' },
      { value: 42, prefix: '−', suffix: '%', label: 'CAC reduction' },
      { value: 32, prefix: '', suffix: '×', label: 'Traffic growth' },
    ],
    tags: ['Growth Engineering', 'SEO', 'Content Systems', 'Analytics'],
    challenge: 'A D2C e-commerce brand was spending 80% of their marketing budget on paid ads with diminishing returns. Their organic traffic was flat and they had no systematic content strategy.',
    approach: [
      { title: 'Content Architecture', desc: 'Built a programmatic content engine with AI-assisted writing, automated internal linking, and schema markup generation for 200+ product categories.' },
      { title: 'Technical SEO Infrastructure', desc: 'Implemented server-side rendering, dynamic sitemap generation, Core Web Vitals optimization, and structured data at scale.' },
      { title: 'Analytics & Attribution', desc: 'Deployed a custom attribution model tracking organic revenue from first touch to conversion, enabling data-driven content prioritization.' },
    ],
    testimonial: { quote: 'We came with a vague idea. They came back with an architecture we didn\'t even know was possible.', name: 'Kavya R.', role: 'Co-founder, FinTech' },
  },
];

/* ── Case Study Card ─────────────────────────────────── */
const CaseStudyCard: React.FC<{ study: typeof CASE_STUDIES[0]; index: number; onOpen: () => void }> = ({ study, index, onOpen }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        background: 'var(--space-3)',
        border: '0.5px solid var(--border-v2)',
        borderRadius: 20,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        transition: 'transform 0.3s ease',
      }}
      className="flex-col md:flex-row"
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.01)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {/* Left visual panel */}
      <div
        className="w-full md:w-[38%] flex items-center justify-center p-8 md:p-12"
        style={{ background: `radial-gradient(ellipse at center, ${study.accentBg} 0%, transparent 70%)`, minHeight: 200 }}
      >
        {study.id === 1 && (
          <svg width="200" height="60" viewBox="0 0 200 60" fill="none">
            <text x="10" y="35" fill={study.accent} fontSize="18" fontFamily="var(--font-mono)" opacity="0.7">✉</text>
            <line x1="40" y1="30" x2="80" y2="30" stroke={study.accent} strokeWidth="1" strokeDasharray="4">
              <animate attributeName="stroke-dashoffset" values="8;0" dur="1s" repeatCount="indefinite" />
            </line>
            <text x="85" y="35" fill={study.accent} fontSize="18" fontFamily="var(--font-mono)" opacity="0.7">🧠</text>
            <line x1="110" y1="30" x2="150" y2="30" stroke={study.accent} strokeWidth="1" strokeDasharray="4">
              <animate attributeName="stroke-dashoffset" values="8;0" dur="1s" begin="0.3s" repeatCount="indefinite" />
            </line>
            <text x="155" y="35" fill={study.accent} fontSize="18" fontFamily="var(--font-mono)" opacity="0.7">📞</text>
          </svg>
        )}
        {study.id === 2 && (
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            {/* Pre-computed positions to avoid SSR/client Math.cos/sin float mismatch */}
            {([
              { cx: 105, cy: 60 },
              { cx: 82.5, cy: 99 },
              { cx: 37.5, cy: 99 },
              { cx: 15, cy: 60 },
              { cx: 37.5, cy: 21 },
              { cx: 82.5, cy: 21 },
            ] as const).map((pos, i) => (
              <React.Fragment key={i}>
                <rect x={pos.cx - 8} y={pos.cy - 6} width="16" height="12" rx="2" fill="none" stroke={study.accent} strokeWidth="1" opacity="0.6" />
                <line x1={pos.cx} y1={pos.cy} x2="60" y2="60" stroke={study.accent} strokeWidth="0.5" opacity="0.3">
                  <animate attributeName="opacity" values="0.1;0.6;0.1" dur="2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                </line>
              </React.Fragment>
            ))}
            <circle cx="60" cy="60" r="8" fill={study.accent} fillOpacity="0.3" stroke={study.accent} strokeWidth="1.5" />
          </svg>
        )}
        {study.id === 3 && (
          <svg width="200" height="80" viewBox="0 0 200 80" fill="none">
            <polyline
              points="10,70 40,55 70,60 100,40 130,35 160,20 190,10"
              fill="none"
              stroke={study.accent}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="300"
              strokeDashoffset="300"
            >
              <animate attributeName="stroke-dashoffset" from="300" to="0" dur="1.5s" fill="freeze" />
            </polyline>
            <polygon
              points="10,70 40,55 70,60 100,40 130,35 160,20 190,10 190,80 10,80"
              fill={study.accent}
              fillOpacity="0"
            >
              <animate attributeName="fill-opacity" from="0" to="0.1" dur="1.5s" begin="0.5s" fill="freeze" />
            </polygon>
          </svg>
        )}
      </div>

      {/* Right content panel */}
      <div className="w-full md:w-[62%] p-8 md:p-10 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <span style={{
            background: study.accentBg,
            border: `0.5px solid ${study.accent}40`,
            borderRadius: 6,
            padding: '4px 10px',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: study.accent,
          }}>
            {study.tag}
          </span>
        </div>

        <h3 style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 700,
          fontSize: 'clamp(20px, 2.5vw, 28px)',
          color: 'var(--text-1)',
          lineHeight: 1.3,
          marginBottom: 12,
        }}>
          {study.headline}
        </h3>

        <p style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 14,
          color: 'var(--text-2)',
          lineHeight: 1.6,
          marginBottom: 20,
          maxWidth: '60ch',
        }}>
          {study.description}
        </p>

        {/* Metrics */}
        <div className="flex flex-wrap gap-6 mb-5">
          {study.metrics.map((m, i) => (
            <div key={i}>
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 28, color: 'var(--text-1)' }}>
                <CountUp end={m.value} prefix={m.prefix || ''} suffix={m.suffix || ''} />
              </div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'var(--text-3)' }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {study.tags.map((tag) => (
            <span key={tag} style={{
              background: 'rgba(255,255,255,0.05)',
              border: '0.5px solid var(--border-v2)',
              borderRadius: 6,
              padding: '5px 10px',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--text-2)',
            }}>
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={onOpen}
          style={{
            background: 'none',
            border: 'none',
            fontFamily: 'var(--font-inter)',
            fontWeight: 600,
            fontSize: 14,
            color: study.accent,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: 0,
            transition: 'gap 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.gap = '10px')}
          onMouseLeave={(e) => (e.currentTarget.style.gap = '6px')}
        >
          View Full Case Study →
        </button>
      </div>
    </motion.div>
  );
};

/* ── Full-Screen Case Study Modal ────────────────────── */
const CaseStudyModal: React.FC<{ study: typeof CASE_STUDIES[0] | null; onClose: () => void; onNav: (dir: number) => void }> = ({ study, onClose, onNav }) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNav(-1);
      if (e.key === 'ArrowRight') onNav(1);
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onNav]);

  if (!study) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(20px)',
        zIndex: 1000,
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 35, duration: 0.5 }}
        style={{
          background: 'var(--space-2)',
          borderRadius: '20px 20px 0 0',
          padding: 'clamp(30px, 5vw, 60px) clamp(20px, 5vw, 80px)',
          maxWidth: 900,
          margin: '80px auto 0',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            background: 'none',
            border: 'none',
            color: 'var(--text-3)',
            fontSize: 24,
            cursor: 'pointer',
            transition: 'color 0.2s',
            lineHeight: 1,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-1)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}
        >
          ×
        </button>

        {/* Tag + year */}
        <div className="flex items-center gap-3 mb-6">
          <span style={{ background: study.accentBg, border: `0.5px solid ${study.accent}40`, borderRadius: 6, padding: '4px 10px', fontFamily: 'var(--font-mono)', fontSize: 11, color: study.accent }}>
            {study.tag}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)' }}>2024</span>
        </div>

        {/* Headline */}
        <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--text-1)', lineHeight: 1.2, marginBottom: 16 }}>
          {study.headline}
        </h2>

        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 16, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 32, maxWidth: '65ch' }}>
          {study.description}
        </p>

        {/* The Challenge */}
        <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: 20, color: 'var(--text-1)', marginBottom: 12 }}>The Challenge</h3>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 15, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 32, maxWidth: '65ch' }}>
          {study.challenge}
        </p>

        {/* Our Approach */}
        <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: 20, color: 'var(--text-1)', marginBottom: 16 }}>Our Approach</h3>
        <div className="space-y-6 mb-32">
          {study.approach.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 24, color: study.accent, lineHeight: 1, minWidth: 32 }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: 16, color: 'var(--text-1)', marginBottom: 4 }}>{step.title}</h4>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Results */}
        <div className="flex flex-wrap gap-8 mb-12 py-8" style={{ borderTop: '0.5px solid var(--border-v2)', borderBottom: '0.5px solid var(--border-v2)' }}>
          {study.metrics.map((m, i) => (
            <div key={i}>
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 36, color: 'var(--text-1)' }}>
                {m.prefix || ''}{m.value}{m.suffix || ''}
              </div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: 'var(--text-3)' }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div style={{ background: 'var(--space-3)', border: '0.5px solid var(--border-v2)', borderRadius: 16, padding: 28, marginBottom: 32 }}>
          <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 400, fontStyle: 'italic', fontSize: 20, color: 'var(--text-1)', lineHeight: 1.5, marginBottom: 12 }}>
            &ldquo;{study.testimonial.quote}&rdquo;
          </p>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: 'var(--text-3)' }}>
            — {study.testimonial.name}, {study.testimonial.role}
          </p>
        </div>

        {/* Bottom CTA */}
        <a
          href="#contact"
          onClick={onClose}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'linear-gradient(135deg, var(--indigo), var(--cyan-v2))',
            borderRadius: 12,
            padding: '14px 28px',
            fontFamily: 'var(--font-inter)',
            fontWeight: 600,
            fontSize: 15,
            color: '#fff',
            textDecoration: 'none',
          }}
        >
          Start a Similar Project →
        </a>
      </motion.div>

      {/* Nav arrows */}
      <button
        onClick={(e) => { e.stopPropagation(); onNav(-1); }}
        style={{ position: 'fixed', left: 20, top: '50%', transform: 'translateY(-50%)', background: 'var(--space-3)', border: '0.5px solid var(--border-v2)', borderRadius: '50%', width: 48, height: 48, color: 'var(--text-2)', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}
      >
        ←
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNav(1); }}
        style={{ position: 'fixed', right: 20, top: '50%', transform: 'translateY(-50%)', background: 'var(--space-3)', border: '0.5px solid var(--border-v2)', borderRadius: '50%', width: 48, height: 48, color: 'var(--text-2)', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}
      >
        →
      </button>
    </motion.div>
  );
};

/* ── Case Studies Section ────────────────────────────── */
const CaseStudiesNew: React.FC = () => {
  const [modalIdx, setModalIdx] = useState<number | null>(null);

  const handleNav = (dir: number) => {
    if (modalIdx === null) return;
    const next = (modalIdx + dir + CASE_STUDIES.length) % CASE_STUDIES.length;
    setModalIdx(next);
  };

  return (
    <section id="work" style={{ backgroundColor: 'var(--space-2)', padding: '140px 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-4">
          <span className="v2-eyebrow">CLIENT WORK</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 'clamp(32px, 4vw, 54px)', color: 'var(--text-1)', lineHeight: 1.15, marginBottom: 48 }}
        >
          Three projects.<br />
          <span className="v2-gradient-word">Real</span> results.
        </motion.h2>

        <div className="space-y-6">
          {CASE_STUDIES.map((study, i) => (
            <CaseStudyCard key={study.id} study={study} index={i} onOpen={() => setModalIdx(i)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {modalIdx !== null && (
          <CaseStudyModal
            study={CASE_STUDIES[modalIdx]}
            onClose={() => setModalIdx(null)}
            onNav={handleNav}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default CaseStudiesNew;

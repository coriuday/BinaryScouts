'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';

/* ── Studio Dashboard Widget ─────────────────────────── */
const StudioDashboard: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    ref.current.style.transition = 'transform 0.1s ease';
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
    ref.current.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  };

  const rows = [
    { label: 'Engagement model', value: 'Embedded team' },
    { label: 'Delivery cadence', value: 'Bi-weekly demos' },
    { label: 'Typical timeline', value: '4 – 8 weeks' },
    { label: 'Support after ship', value: '30-day warranty' },
    { label: 'Stack focus', value: 'AI + full-stack' },
    { label: 'Availability', value: 'Discovery open' },
  ];

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        background: 'var(--space-3)',
        border: '0.5px solid var(--border-strong-v2)',
        borderRadius: 18,
        padding: 28,
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <span style={{ color: 'var(--text-2)', fontWeight: 500 }}>Engagement snapshot</span>
        <span className="flex items-center gap-2" style={{ color: 'var(--emerald)', fontSize: 12, fontWeight: 500 }}>
          <span className="v2-live-dot" />
          LIVE
        </span>
      </div>
      <div style={{ height: 1, background: 'var(--border-v2)', marginBottom: 16 }} />
      {rows.map((r) => (
        <div key={r.label} className="flex justify-between py-2" style={{ borderBottom: '0.5px solid var(--border-v2)' }}>
          <span style={{ color: 'var(--text-3)' }}>{r.label}</span>
          <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>{r.value}</span>
        </div>
      ))}
    </div>
  );
};

const BUILD_FOR = [
  { title: 'What we build', body: 'AI systems, SaaS products, CRM automation, dashboards, and full-stack web platforms — shipping to production, not demos.' },
  { title: 'Who we work with', body: 'Founders, startups, and growing businesses that need a lean engineering partner instead of a slow agency process.' },
  { title: 'How we operate', body: 'Small team, clear milestones, bi-weekly demos, documented handoffs. We embed like your engineering team.' },
];

/* ── About Section ───────────────────────────────────── */
const AboutSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const philosophyPills = ['⬡ Outcome-Driven', '⬡ No Vendor Lock-in', '⬡ Code That Lasts'];

  return (
    <section id="about" style={{ backgroundColor: 'var(--space-2)', padding: '140px 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <span className="v2-eyebrow">ABOUT</span>
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
            marginBottom: 24,
          }}
        >
          We are not an agency.<br />
          We are your <span className="v2-gradient-word">engineering team.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 16,
            color: 'var(--text-2)',
            lineHeight: 1.65,
            maxWidth: '68ch',
            marginBottom: 40,
          }}
        >
          BinaryScouts is a lean technology startup. We design and ship production software —
          AI systems, SaaS products, automation, and digital infrastructure — for teams that need
          serious engineering without enterprise theater.
        </motion.p>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {[
                'Too many “digital agencies” sell slides and hand off unfinished systems. We started BinaryScouts to do the opposite: own the engineering, ship working software, and stay accountable after go-live.',
                'Every system we build is designed to outlast the engagement. We document what we ship, train your team where needed, and remain available when production issues matter.',
                'We measure success by what ships and what lasts — not vanity traffic metrics. If it doesn\'t move the business, it doesn\'t ship.',
              ].map((p, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 16,
                    color: 'var(--text-2)',
                    lineHeight: 1.65,
                    marginBottom: 20,
                    maxWidth: '68ch',
                  }}
                >
                  {p}
                </p>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 mb-8">
              {BUILD_FOR.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.35 + i * 0.06, duration: 0.4 }}
                  style={{
                    background: 'var(--space-3)',
                    border: '0.5px solid var(--border-v2)',
                    borderRadius: 14,
                    padding: 16,
                  }}
                >
                  <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: 14, color: 'var(--text-1)', marginBottom: 8 }}>
                    {item.title}
                  </p>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: 'var(--text-3)', lineHeight: 1.55 }}>
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-2 items-center">
              {philosophyPills.map((pill, i) => (
                <motion.span
                  key={pill}
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.45 + i * 0.08, duration: 0.4 }}
                  style={{
                    background: 'var(--indigo-dim)',
                    border: '0.5px solid var(--border-hover)',
                    borderRadius: 100,
                    padding: '10px 20px',
                    fontFamily: 'var(--font-inter)',
                    fontWeight: 500,
                    fontSize: 14,
                    color: 'var(--text-2)',
                  }}
                >
                  {pill}
                </motion.span>
              ))}
              <Link
                href="/about"
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--indigo)',
                  textDecoration: 'none',
                  marginLeft: 4,
                }}
              >
                Meet the team →
              </Link>
            </div>
          </div>

          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <StudioDashboard />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

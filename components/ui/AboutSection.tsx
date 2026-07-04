'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/* ── Studio Dashboard Widget ─────────────────────────── */
const StudioDashboard: React.FC = () => {
  const [lastDeploy, setLastDeploy] = useState(2);
  const [nps, setNps] = useState(91);
  const [velocity, setVelocity] = useState(92);
  const [coverage, setCoverage] = useState(94);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Last deploy counter
    const deployTimer = setInterval(() => setLastDeploy((p) => p + 1), 60000);
    // Jitter other values
    const jitterTimer = setInterval(() => {
      setNps((p) => p + (Math.random() > 0.5 ? 1 : -1));
      setVelocity((p) => Math.max(88, Math.min(96, p + (Math.random() > 0.5 ? 1 : -1))));
      setCoverage((p) => Math.max(92, Math.min(96, p + (Math.random() > 0.5 ? 1 : -1))));
    }, 10000);
    return () => { clearInterval(deployTimer); clearInterval(jitterTimer); };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
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
    { label: 'Active Projects', value: '3 / 5' },
    { label: 'Sprint Velocity', value: `${velocity} pts/week` },
    { label: 'Avg Delivery Time', value: '6.2 weeks' },
    { label: 'Client NPS Score', value: String(nps) },
    { label: 'Code Coverage (avg)', value: `${coverage}%` },
    { label: 'Last Deploy', value: `${lastDeploy} min ago` },
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
        <span style={{ color: 'var(--text-2)', fontWeight: 500 }}>Studio Status</span>
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

/* ── About Section ───────────────────────────────────── */
const AboutSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const philosophyPills = ['⬡ Outcome-Driven', '⬡ No Vendor Lock-in', '⬡ Code That Lasts'];

  return (
    <section id="about" style={{ backgroundColor: 'var(--space-2)', padding: '140px 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <span className="v2-eyebrow">THE STUDIO</span>
        </motion.div>

        {/* Headline */}
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
          We are not an agency.<br />
          We are your <span className="v2-gradient-word">engineering team.</span>
        </motion.h2>

        {/* Two-column layout */}
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left column — copy */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {[
                'BinaryScouts was founded on one belief: great software is never built by vendors — it\'s built by engineers who care about the outcome as much as the client does.',
                'Every system we build is designed to outlast the engagement. We don\'t do handoffs that need handholding. We document everything, we train your team, and we are still on call when it matters.',
                'We have generated over $2M in measurable revenue impact for our clients. Not traffic. Not impressions. Actual revenue.',
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

            {/* Philosophy pills */}
            <div className="flex flex-wrap gap-3 mt-6">
              {philosophyPills.map((pill, i) => (
                <motion.span
                  key={pill}
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
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
            </div>
          </div>

          {/* Right column — Studio Dashboard */}
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

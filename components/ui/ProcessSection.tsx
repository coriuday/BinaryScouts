'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const STEPS = [
  {
    num: '01',
    title: 'Discover',
    color: '#6366f1',
    items: ['Business & user context', 'Requirements & constraints', 'Scope alignment'],
    tip: 'A focused discovery call — pointed questions, not a sales pitch.',
  },
  {
    num: '02',
    title: 'Architect',
    color: '#22d3ee',
    items: ['System design', 'Tech stack selection', 'Delivery plan'],
    tip: 'Architecture docs double as your technical knowledge base.',
  },
  {
    num: '03',
    title: 'Build',
    color: '#a78bfa',
    items: ['Iterative development', 'Bi-weekly demos', 'Continuous feedback'],
    tip: 'You see working software every two weeks. No end-of-project surprises.',
  },
  {
    num: '04',
    title: 'Deploy',
    color: '#10b981',
    items: ['Production release', 'Monitoring basics', 'Handoff docs'],
    tip: 'We ship to production with a clear runbook, not a zip file.',
  },
  {
    num: '05',
    title: 'Support',
    color: '#f59e0b',
    items: ['30-day warranty', 'Issue triage', 'Optional retainers'],
    tip: 'We don\'t disappear after launch. Stabilization is part of delivery.',
  },
];

const ProcessSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="process" style={{ backgroundColor: 'var(--space-2)', padding: '140px 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-4">
          <span className="v2-eyebrow">HOW WE WORK</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 'clamp(32px, 4vw, 54px)', color: 'var(--text-1)', lineHeight: 1.15, marginBottom: 16 }}
        >
          From brief to <span className="v2-gradient-word">deployment</span><br />
          with clear milestones.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          style={{ fontFamily: 'var(--font-inter)', fontSize: 16, color: 'var(--text-2)', lineHeight: 1.65, maxWidth: '60ch', marginBottom: 48 }}
        >
          A straightforward engagement path so you always know what happens next —
          and what you&apos;ll see before you pay for more work.
        </motion.p>

        <div ref={ref} className="relative">
          <div className="hidden lg:block absolute top-16 left-0 right-0" style={{ height: 2, zIndex: 0 }}>
            <svg width="100%" height="2" aria-hidden>
              <line x1="0" y1="1" x2="100%" y2="1" stroke="var(--border-v2)" strokeWidth="2" />
              <line
                x1="0" y1="1" x2="100%" y2="1"
                stroke="var(--indigo)"
                strokeWidth="2"
                strokeDasharray="2000"
                strokeDashoffset={inView ? '0' : '2000'}
                style={{ transition: 'stroke-dashoffset 1.8s ease' }}
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 relative z-10">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <StepCard step={step} />
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-3)' }}
        >
          Typical engagements: 4 – 8 weeks · Bi-weekly demos · 30-day support after ship
        </motion.div>
      </div>
    </section>
  );
};

const StepCard: React.FC<{ step: typeof STEPS[0] }> = ({ step }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--space-3)',
        border: '0.5px solid var(--border-v2)',
        borderRadius: 16,
        padding: 22,
        height: '100%',
        transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.3)' : 'none',
        borderColor: hovered ? `${step.color}55` : 'var(--border-v2)',
        cursor: 'default',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 800,
          fontSize: 28,
          color: hovered ? step.color : 'var(--text-3)',
          transition: 'color 0.3s',
          marginBottom: 10,
        }}
      >
        {step.num}
      </div>
      <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: 18, color: 'var(--text-1)', marginBottom: 10 }}>
        {step.title}
      </h3>
      {step.items.map((item) => (
        <p key={item} style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
          {item}
        </p>
      ))}
      <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: step.color, marginTop: 12, lineHeight: 1.45 }}>
        {step.tip}
      </p>
    </div>
  );
};

export default ProcessSection;

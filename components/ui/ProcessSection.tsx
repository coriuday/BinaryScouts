'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

const STEPS = [
  { num: '01', title: 'Discovery', color: '#6366f1', items: ['30-min call', 'Define scope', 'Review past work'], tip: 'We come prepared. Expect pointed questions, not a sales pitch.' },
  { num: '02', title: 'Architecture', color: '#22d3ee', items: ['System design', '+ tech stack', 'selection'], tip: 'Our architecture docs double as your technical knowledge base.' },
  { num: '03', title: 'Engineering', color: '#a78bfa', items: ['Bi-weekly sprints', '+ daily async', 'updates + demos'], tip: 'You see working code every 2 weeks. No surprises at delivery.' },
  { num: '04', title: 'Delivery', color: '#10b981', items: ['Ship, monitor', 'iterate + SLA', '30-day support'], tip: 'We don\'t disappear after handoff. 30-day warranty is standard.' },
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
          style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 'clamp(32px, 4vw, 54px)', color: 'var(--text-1)', lineHeight: 1.15, marginBottom: 48 }}
        >
          From brief to <span className="v2-gradient-word">deployment</span><br />
          with clear milestones.
        </motion.h2>

        <div ref={ref} className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-0 right-0" style={{ height: 2, zIndex: 0 }}>
            <svg width="100%" height="2">
              <line
                x1="0" y1="1" x2="100%" y2="1"
                stroke="var(--border-v2)"
                strokeWidth="2"
              />
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <StepCard step={step} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom metrics */}
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
        padding: 24,
        transition: 'transform 0.3s, box-shadow 0.3s',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.3)' : 'none',
        cursor: 'default',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 800,
          fontSize: 32,
          color: hovered ? step.color : 'var(--text-3)',
          transition: 'color 0.3s',
          marginBottom: 12,
        }}
      >
        {step.num}
      </div>
      <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: 20, color: 'var(--text-1)', marginBottom: 12 }}>
        {step.title}
      </h3>
      {step.items.map((item) => (
        <p key={item} style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
          {item}
        </p>
      ))}
      {hovered && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: step.color, marginTop: 12, fontStyle: 'italic' }}
        >
          {step.tip}
        </motion.p>
      )}
    </div>
  );
};

export default ProcessSection;

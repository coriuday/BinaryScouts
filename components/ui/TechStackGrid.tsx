'use client';

import React from 'react';
import { motion } from 'framer-motion';

const TECHS = [
  'Next.js', 'React', 'TypeScript', 'Node.js', 'Python',
  'Rust', 'Supabase', 'PostgreSQL', 'Redis', 'Docker',
  'Kubernetes', 'GitHub Actions', 'Vercel', 'AWS', 'GCP',
  'OpenAI', 'LangChain', 'Stripe', 'Twilio', 'Framer Motion',
];

const TechStackGrid: React.FC = () => {
  return (
    <section style={{ backgroundColor: 'var(--space)', padding: '100px 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-4">
          <span className="v2-eyebrow">OUR STACK</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 'clamp(32px, 4vw, 54px)', color: 'var(--text-1)', lineHeight: 1.15, marginBottom: 48 }}
        >
          Tools trusted by<br />
          <span className="v2-gradient-word">serious</span> engineers.
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {TECHS.map((tech, i) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.015 }}
              style={{
                background: 'var(--space-2)',
                border: '0.5px solid var(--border-v2)',
                borderRadius: 12,
                padding: '16px 20px',
                fontFamily: 'var(--font-inter)',
                fontWeight: 500,
                fontSize: 13,
                color: 'var(--text-2)',
                transition: 'all 0.2s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)';
                (e.currentTarget as HTMLElement).style.background = 'var(--space-3)';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-1)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px var(--indigo-glow)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-v2)';
                (e.currentTarget as HTMLElement).style.background = 'var(--space-2)';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-2)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              {tech}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackGrid;

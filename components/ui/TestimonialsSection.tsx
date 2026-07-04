'use client';

import React from 'react';
import { motion } from 'framer-motion';

const TESTIMONIALS = [
  { stars: 5, quote: 'BinaryScouts shipped our AI lead system in 5 weeks. Month 1 ROI covered the entire project cost.', name: 'Arjun M.', role: 'CTO', company: 'Series A SaaS startup', initials: 'AM' },
  { stars: 5, quote: 'They built something our internal team said would take 6 months. It took them 6 weeks and it\'s been running flawlessly.', name: 'Priya K.', role: 'Founder', company: 'D2C brand', initials: 'PK' },
  { stars: 5, quote: 'The dashboard replaced three separate tools. My analysts were sending thank-you messages on Slack.', name: 'Aadit S.', role: 'VP Product', company: 'Healthcare platform', initials: 'AS' },
  { stars: 5, quote: 'Zero dependency on them after handoff. Everything was documented, everything worked. Rare.', name: 'Rohit D.', role: 'CEO', company: 'Logistics startup', initials: 'RD' },
  { stars: 5, quote: 'We came with a vague idea. They came back with an architecture we didn\'t even know was possible.', name: 'Kavya R.', role: 'Co-founder', company: 'FinTech', initials: 'KR' },
  { stars: 5, quote: 'Their AI agent handles 80% of our customer inquiries now. Support costs dropped 60% in 3 months.', name: 'Vikram P.', role: 'COO', company: 'E-commerce platform', initials: 'VP' },
  { stars: 5, quote: 'Best engineering team we\'ve worked with. Period. The code quality is on a different level.', name: 'Sneha L.', role: 'CTO', company: 'EdTech startup', initials: 'SL' },
  { stars: 5, quote: 'They didn\'t just build what we asked for — they challenged our assumptions and built something better.', name: 'Rajan T.', role: 'Founder', company: 'PropTech', initials: 'RT' },
];

const TestimonialCard: React.FC<{ t: typeof TESTIMONIALS[0] }> = ({ t }) => (
  <div
    style={{
      background: 'var(--space-3)',
      border: '0.5px solid var(--border-strong-v2)',
      borderRadius: 16,
      padding: '26px 30px',
      minWidth: 340,
      maxWidth: 340,
      flexShrink: 0,
    }}
  >
    <div style={{ color: 'var(--amber)', fontSize: 13, letterSpacing: 2, marginBottom: 12 }}>
      {'★'.repeat(t.stars)}
    </div>
    <p style={{ fontFamily: 'var(--font-inter)', fontWeight: 400, fontSize: 15, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 16 }}>
      &ldquo;{t.quote}&rdquo;
    </p>
    <div className="flex items-center gap-3">
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--indigo), var(--purple))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-syne)',
          fontWeight: 700,
          fontSize: 14,
          color: '#fff',
          flexShrink: 0,
        }}
      >
        {t.initials}
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-inter)', fontWeight: 600, fontSize: 14, color: 'var(--text-1)' }}>{t.name}</div>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'var(--text-3)' }}>{t.role}, {t.company}</div>
      </div>
    </div>
  </div>
);

const TestimonialsSection: React.FC = () => {
  const row1 = [...TESTIMONIALS.slice(0, 4), ...TESTIMONIALS.slice(0, 4)];
  const row2 = [...TESTIMONIALS.slice(4), ...TESTIMONIALS.slice(4)];

  return (
    <section style={{ backgroundColor: 'var(--space-2)', padding: '140px 0', overflow: 'hidden' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-4">
          <span className="v2-eyebrow">CLIENT FEEDBACK</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 'clamp(32px, 4vw, 54px)', color: 'var(--text-1)', lineHeight: 1.15 }}
        >
          What founders say<br />
          after we <span className="v2-gradient-word">deliver.</span>
        </motion.h2>
      </div>

      {/* Row 1 → scrolling left */}
      <div className="v2-ticker-row mb-4" style={{ overflow: 'hidden' }}>
        <div className="v2-ticker-track flex gap-5" style={{ animation: 'scroll-testimonial 55s linear infinite', width: 'max-content' }}>
          {row1.map((t, i) => <TestimonialCard key={`r1-${i}`} t={t} />)}
        </div>
      </div>

      {/* Row 2 ← scrolling right */}
      <div className="v2-ticker-row" style={{ overflow: 'hidden' }}>
        <div className="v2-ticker-track flex gap-5" style={{ animation: 'scroll-testimonial-reverse 55s linear infinite', width: 'max-content' }}>
          {row2.map((t, i) => <TestimonialCard key={`r2-${i}`} t={t} />)}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

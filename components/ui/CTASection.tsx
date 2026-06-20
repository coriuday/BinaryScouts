'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, CalendarCheck } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import MagneticButton from '@/components/motion/MagneticButton';
import ScrollReveal from '@/components/motion/ScrollReveal';

const CTASection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [btnHover, setBtnHover] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const orbY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-30, 30]);

  return (
    <section ref={sectionRef} className="py-28 relative overflow-hidden" style={{ backgroundColor: '#050505' }}>
      {/* Animated gradient orb */}
      <motion.div
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        style={{ y: orbY }}
        aria-hidden="true"
      >
        <div
          className="w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, rgba(123,0,255,0.06) 40%, transparent 70%)',
            filter: 'blur(80px)',
            animation: reduced ? 'none' : 'atmosphericFloat 20s ease-in-out infinite',
          }}
        />
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div
            className="rounded-[2rem] p-12 md:p-16 text-center relative overflow-hidden"
            style={{
              background: 'rgba(17,17,17,0.6)',
              backdropFilter: 'blur(12px)',
              border: '0.5px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="eyebrow-badge mb-8 mx-auto w-fit">
              <CalendarCheck size={12} />
              <span>Free Strategy Session</span>
            </div>

            <h2 className="font-sans font-medium text-4xl md:text-5xl lg:text-6xl leading-tight mb-6" style={{ color: '#fff' }}>
              Ready to build something{' '}
              <span style={{ color: '#00d4ff' }}>extraordinary?</span>
            </h2>

            <p className="font-sans text-lg leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: '#888' }}>
              Let&apos;s spend 30 minutes mapping what your business could become with the right systems behind it.
            </p>

            {/* Animated steps */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 mb-10 flex-wrap">
              {[
                { step: '01', label: 'We talk' },
                { step: '02', label: 'We map' },
                { step: '03', label: 'We build' },
              ].map(({ step, label }, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-2"
                >
                  <span className="font-mono text-xs font-medium" style={{ color: '#00d4ff' }}>{step}</span>
                  <span className="font-sans text-sm font-medium" style={{ color: '#888' }}>{label}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <div onMouseEnter={() => setBtnHover(true)} onMouseLeave={() => setBtnHover(false)}>
                <Link href="/planner">
                  <MagneticButton className="btn-primary text-base px-10 py-4 gap-2 relative overflow-hidden" strength={0.25} radius={80}>
                    {btnHover && (
                      <motion.span
                        className="absolute inset-0 origin-left"
                        style={{ background: 'rgba(0,212,255,0.15)' }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                    <CalendarCheck size={17} className="relative z-10" />
                    <span className="relative z-10">Start the Conversation</span>
                  </MagneticButton>
                </Link>
              </div>
              <Link href="/services">
                <button className="btn-secondary text-base px-10 py-4 gap-2">
                  View All Services
                  <ArrowRight size={15} />
                </button>
              </Link>
            </div>

            <p className="mt-8 font-sans text-sm" style={{ color: '#555' }}>
              30-minute call · No pitch · No commitment
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTASection;

'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ScrambleText from '@/components/motion/ScrambleText';
import HeroDotGrid from '@/components/ui/HeroDotGrid';
import HeroWireframes from '@/components/ui/HeroWireframes';
import HeroTerminalBar from '@/components/ui/HeroTerminalBar';

const AnimatedStat: React.FC<{ end: number; prefix?: string; suffix?: string; label: string; delay: number }> = ({
  end, prefix = '', suffix = '', label, delay,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = React.useState(0);

  useEffect(() => {
    if (!inView) return;
    const timeout = setTimeout(() => {
      const duration = 1400;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setVal(Math.round(eased * end));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timeout);
  }, [inView, end, delay]);

  return (
    <div ref={ref} className="flex flex-col">
      <p className="font-mono font-medium text-xl leading-none mb-1" style={{ color: '#00d4ff' }}>
        {prefix}{val}{suffix}
      </p>
      <p className="font-sans text-[10px]" style={{ color: '#444' }}>{label}</p>
    </div>
  );
};

const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useMemo(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
    []
  );

  const { scrollY } = useScroll();
  const heroO = useTransform(scrollY, [0, 500], isMobile ? [1, 1] : [1, 0]);
  const heroS = useTransform(scrollY, [0, 500], isMobile ? [1, 1] : [1, 0.98]);

  return (
    <motion.section
      ref={sectionRef}
      className="hero-section relative min-h-screen w-full flex items-center overflow-hidden pt-28 pb-32"
      style={{
        backgroundColor: '#050505',
        opacity: heroO,
        scale: heroS,
        ['--spot-x' as string]: '50%',
        ['--spot-y' as string]: '40%',
      }}
    >
      <HeroDotGrid containerRef={sectionRef} />
      <HeroWireframes />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <span
              className="font-sans text-[10px] uppercase tracking-[0.2em] font-medium"
              style={{ color: '#00d4ff' }}
            >
              AI-Native Engineering Studio
            </span>
          </motion.div>

          <h1
            className="font-sans font-medium text-5xl md:text-6xl lg:text-[5rem] leading-[1.08] tracking-tight mb-6 text-balance"
            style={{ color: '#fff', letterSpacing: '-0.03em' }}
          >
            <ScrambleText text="We build" delay={0.2} />
            <br />
            <span style={{ color: '#00d4ff' }}>
              <ScrambleText text="systems" delay={0.5} />
            </span>
            {' '}
            <ScrambleText text="that" delay={0.7} />
            <br />
            <ScrambleText text="scale futures." delay={0.9} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 1.1 }}
            className="font-sans text-lg md:text-xl leading-relaxed mb-10 max-w-lg"
            style={{ color: '#888' }}
          >
            Most agencies deliver deliverables. We engineer outcomes that compound over time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
            className="flex flex-wrap gap-3 items-center"
          >
            <Link href="/planner" className="btn-primary text-base px-8 py-4 gap-2 inline-flex items-center">
              Start the Conversation
              <ArrowRight size={17} />
            </Link>
            <Link href="/work" className="btn-secondary text-base px-8 py-4 inline-flex items-center">
              See Our Work
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.4 }}
            className="flex items-center gap-8 mt-14 pt-8 flex-wrap"
            style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}
          >
            <AnimatedStat end={50} suffix="+" label="Systems deployed" delay={200} />
            <AnimatedStat end={2} prefix="$" suffix="M+" label="Revenue generated" delay={350} />
            <AnimatedStat end={98} suffix="%" label="Client retention" delay={500} />
          </motion.div>
        </div>
      </div>

      <HeroTerminalBar />
    </motion.section>
  );
};

export default Hero;

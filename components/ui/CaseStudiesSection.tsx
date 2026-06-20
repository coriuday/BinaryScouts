'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getFeaturedProjects } from '@/lib/projects';
import ProjectCard from '@/components/ui/ProjectCard';
import ScrollReveal from '@/components/motion/ScrollReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const CaseStudiesSection: React.FC = () => {
  const featured = getFeaturedProjects();
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollX = useMotionValue(0);
  const [maxDrag, setMaxDrag] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const el = containerRef.current;
      setMaxDrag(Math.max(0, el.scrollWidth - el.clientWidth));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [featured.length]);

  useEffect(() => {
    const unsub = scrollX.on('change', (v) => {
      if (maxDrag > 0) setProgress(Math.abs(v) / maxDrag);
    });
    return unsub;
  }, [scrollX, maxDrag]);

  return (
    <section id="work" className="py-28 relative overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
            <div className="max-w-xl">
              <div className="eyebrow-badge mb-5">
                <Sparkles size={11} />
                <span>The Work</span>
              </div>
              <h2 className="font-sans font-medium text-4xl md:text-5xl leading-tight mb-4" style={{ color: '#fff' }}>
                The work speaks.{' '}
                <span style={{ color: '#00d4ff' }}>Three transformations.</span>
              </h2>
              <p className="font-sans text-lg leading-relaxed" style={{ color: '#888' }}>
                A glimpse into what becomes possible when you stop patching problems and start engineering solutions.
              </p>
            </div>
            <Link href="/work">
              <button className="btn-secondary px-7 py-3 text-sm whitespace-nowrap gap-2">
                View All Work
                <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </ScrollReveal>

        {/* Progress bar */}
        <div className="h-px mb-6 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: '#00d4ff', width: `${progress * 100}%` }}
          />
        </div>

        {/* Horizontal drag scroll */}
        <motion.div
          ref={containerRef}
          className="flex gap-6 cursor-grab active:cursor-grabbing pb-4"
          style={{ x: scrollX }}
          drag={reduced ? false : 'x'}
          dragConstraints={{ left: -maxDrag, right: 0 }}
          dragElastic={0.08}
          onDragEnd={(_, info) => {
            if (reduced) return;
            const target = Math.max(-maxDrag, Math.min(0, scrollX.get() + info.velocity.x * 0.3));
            animate(scrollX, target, { type: 'spring', stiffness: 300, damping: 30 });
          }}
        >
          {featured.map((project, i) => (
            <div key={project.id} className="flex-shrink-0 w-[340px] md:w-[380px]">
              <ProjectCard project={project} index={i} showLiveTicker />
            </div>
          ))}
        </motion.div>

        <ScrollReveal delay={0.2}>
          <p className="text-center mt-10 font-sans text-sm" style={{ color: '#555' }}>
            Full case studies — real metrics, real methodology, real impact.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CaseStudiesSection;

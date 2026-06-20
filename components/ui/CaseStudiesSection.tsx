'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getFeaturedProjects } from '@/lib/projects';
import ProjectCard from '@/components/ui/ProjectCard';
import ScrollReveal from '@/components/motion/ScrollReveal';

const CaseStudiesSection: React.FC = () => {
  const featured = getFeaturedProjects();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, [featured.length]);

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

        <div className="h-px mb-6 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full transition-[width] duration-150"
            style={{ background: '#00d4ff', width: `${progress * 100}%` }}
          />
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {featured.map((project, i) => (
            <div key={project.id} className="flex-shrink-0 w-[340px] md:w-[380px] snap-start">
              <ProjectCard project={project} index={i} showLiveTicker />
            </div>
          ))}
        </div>

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

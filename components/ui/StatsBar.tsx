'use client';

import React, { useRef } from 'react';
import ArcProgressRing from '@/components/ui/ArcProgressRing';
import ScrollReveal from '@/components/motion/ScrollReveal';

const STATS = [
  { value: 50, max: 50, suffix: '+', label: 'Systems Deployed', delay: 0 },
  { value: 2, max: 2, prefix: '$', suffix: 'M+', label: 'Revenue Generated', delay: 100 },
  { value: 98, max: 100, suffix: '%', label: 'Client Retention', delay: 200 },
  { value: 45, max: 60, suffix: 's', label: 'Avg Lead Response', delay: 300 },
  { value: 3, max: 5, suffix: '', label: 'Countries Served', delay: 400 },
];

const StatsBar: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section ref={ref} className="relative py-24 overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.2), transparent)' }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.2), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal className="text-center mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08))' }} />
            <span className="font-sans text-[10px] uppercase tracking-[0.25em] font-medium" style={{ color: '#555' }}>
              The Impact
            </span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)' }} />
          </div>
          <p className="font-sans text-sm max-w-sm mx-auto" style={{ color: '#555' }}>
            Every number is a real outcome, from a real partnership.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 items-start">
          {STATS.map((stat) => (
            <ArcProgressRing
              key={stat.label}
              value={stat.value}
              max={stat.max}
              prefix={stat.prefix}
              suffix={stat.suffix}
              label={stat.label}
              delay={stat.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;

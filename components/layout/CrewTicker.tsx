'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Zap, Globe } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Honest status lines — no fabricated uptime, traffic, or lead counts */
const TICKER_ITEMS = [
  'Studio online — discovery calls open this week',
  'Shipping AI-native systems and full-stack products',
  'Engagement model: embedded engineering, not vendor handoffs',
  'Delivery cadence: bi-weekly demos with working software',
  'Stack: Next.js, TypeScript, Rust, Python, and modern AI APIs',
  'Remote-first team — serving clients globally',
];

const CrewTicker: React.FC = () => {
  const reduced = useReducedMotion();
  const [logIndex, setLogIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (reduced) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setLogIndex((prev) => (prev + 1) % TICKER_ITEMS.length);
        setVisible(true);
      }, 350);
    }, 5000);
    return () => clearInterval(interval);
  }, [reduced]);

  return (
    <div
      className="w-full h-8 flex items-center justify-between px-4 md:px-6 select-none relative z-[60]"
      style={{
        backgroundColor: 'var(--ticker-bg)',
        borderBottom: '1px solid var(--ticker-border)',
      }}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="relative flex h-2 w-2 flex-shrink-0">
          {!reduced && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: 'var(--accent)' }} />
          )}
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: 'var(--accent)' }} />
        </span>
        <span
          className="font-sans text-[10px] md:text-xs font-semibold uppercase tracking-wider hidden sm:block flex-shrink-0"
          style={{ color: 'var(--accent)' }}
        >
          Live
        </span>
        <span
          className={`font-sans text-[10px] md:text-xs transition-opacity duration-300 truncate ${visible || reduced ? 'opacity-100' : 'opacity-0'}`}
          style={{ color: 'var(--text-secondary)' }}
        >
          {TICKER_ITEMS[reduced ? 0 : logIndex]}
        </span>
      </div>

      <div className="hidden md:flex items-center gap-5 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3 h-3" style={{ color: 'var(--accent)' }} />
          <span className="text-[10px] font-medium">Remote-first</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Activity className="w-3 h-3" style={{ color: 'var(--cyan)' }} />
          <span className="text-[10px] font-medium">Shipping weekly</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Globe className="w-3 h-3" />
          <span className="text-[10px] font-medium">Global clients</span>
        </div>
      </div>
    </div>
  );
};

export default CrewTicker;

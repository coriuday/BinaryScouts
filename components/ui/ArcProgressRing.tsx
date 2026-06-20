'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ArcProgressRingProps {
  value: number;
  max: number;
  suffix?: string;
  prefix?: string;
  label: string;
  delay?: number;
}

export default function ArcProgressRing({
  value,
  max,
  suffix = '',
  prefix = '',
  label,
  delay = 0,
}: ArcProgressRingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduced = useReducedMotion();
  const [current, setCurrent] = useState(0);

  const pct = Math.min(value / max, 1);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = circumference * pct;

  useEffect(() => {
    if (!inView || reduced) {
      if (inView) setCurrent(value);
      return;
    }
    const timeout = setTimeout(() => {
      const dur = 1600;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setCurrent(Math.round(eased * value));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timeout);
  }, [inView, value, delay, reduced]);

  return (
    <div ref={ref} className="text-center relative">
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="4"
          />
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#00d4ff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={inView ? { strokeDashoffset: circumference - strokeDash } : {}}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: delay / 1000 }}
            style={{ filter: 'drop-shadow(0 0 6px rgba(0,212,255,0.4))' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <p
            className="font-mono font-medium text-2xl tabular-nums"
            style={{ color: '#00d4ff' }}
          >
            {prefix}{current}{suffix}
          </p>
        </div>
      </div>
      <p
        className="font-sans text-xs font-medium uppercase tracking-wider"
        style={{ color: '#888' }}
      >
        {label}
      </p>
    </div>
  );
}

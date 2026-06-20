'use client';

import React, { useRef, useEffect } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface HeroDotGridProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

/**
 * CSS-based dot grid with mouse spotlight — no canvas RAF loop.
 * Mouse position is written to CSS custom properties on the container.
 */
export default function HeroDotGrid({ containerRef }: HeroDotGridProps) {
  const reduced = useReducedMotion();
  const rafRef = useRef(0);

  useEffect(() => {
    if (reduced) return;
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty('--spot-x', `${x}%`);
        el.style.setProperty('--spot-y', `${y}%`);
      });
    };

    el.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      el.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [containerRef, reduced]);

  return (
    <div className="hero-dot-grid absolute inset-0 pointer-events-none" aria-hidden="true" />
  );
}

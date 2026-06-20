'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function TypewriterText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? text : '');

  useEffect(() => {
    if (!inView || reduced) {
      if (inView) setDisplay(text);
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplay(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [inView, text, reduced]);

  return (
    <span ref={ref} className={className}>
      {display}
      {!reduced && display.length < text.length && (
        <span className="animate-blink" style={{ color: '#00d4ff' }}>|</span>
      )}
    </span>
  );
}

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>[]{}';

interface ScrambleTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  duration?: number;
  delay?: number;
}

export default function ScrambleText({
  text,
  className = '',
  style,
  duration = 1.5,
  delay = 0.3,
}: ScrambleTextProps) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? text : '');
  const started = useRef(false);

  useEffect(() => {
    if (reduced) {
      setDisplay(text);
      return;
    }
    if (started.current) return;
    started.current = true;

    const timeout = setTimeout(() => {
      const start = performance.now();
      const len = text.length;

      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        const resolved = Math.floor(progress * len);

        let out = '';
        for (let i = 0; i < len; i++) {
          if (text[i] === ' ') {
            out += ' ';
          } else if (i < resolved) {
            out += text[i];
          } else {
            out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
        }
        setDisplay(out);
        if (progress < 1) requestAnimationFrame(tick);
        else setDisplay(text);
      };
      requestAnimationFrame(tick);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [text, duration, delay, reduced]);

  return (
    <span className={className} style={style} aria-label={text}>
      {display}
    </span>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'draw' | 'glow' | 'pulse' | 'fade'>('draw');
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      onComplete();
      return;
    }
    const timers = [
      setTimeout(() => setPhase('glow'), 1200),
      setTimeout(() => setPhase('pulse'), 1500),
      setTimeout(() => setPhase('fade'), 1800),
      setTimeout(() => onComplete(), 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete, reduced]);

  if (reduced) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading BinaryScouts"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--space)',
        opacity: phase === 'fade' ? 0 : 1,
        transition: 'opacity 0.4s ease-out',
        pointerEvents: phase === 'fade' ? 'none' : 'auto',
      }}
    >
      <div
        style={{
          transform: phase === 'pulse' ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <svg
          width="120"
          height="60"
          viewBox="0 0 120 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* B letter */}
          <path
            d="M10 5 L10 55 L35 55 C50 55 55 45 55 40 C55 33 50 28 42 27 C48 26 52 21 52 16 C52 9 47 5 35 5 Z M22 13 L33 13 C39 13 42 16 42 20 C42 24 39 27 33 27 L22 27 Z M22 34 L35 34 C42 34 44 37 44 41 C44 45 42 47 35 47 L22 47 Z"
            stroke="var(--indigo)"
            strokeWidth="1.5"
            fill={phase === 'glow' || phase === 'pulse' || phase === 'fade' ? 'var(--indigo)' : 'none'}
            fillOpacity={phase === 'glow' || phase === 'pulse' || phase === 'fade' ? 0.15 : 0}
            style={{
              strokeDasharray: 400,
              strokeDashoffset: 0,
              animation: 'bs-draw 1.2s ease-in-out forwards',
              filter: phase !== 'draw' ? 'drop-shadow(0 0 8px var(--indigo))' : 'none',
              transition: 'filter 0.3s ease, fill-opacity 0.3s ease',
              ['--path-length' as string]: '400',
            }}
          />
          {/* S letter */}
          <path
            d="M65 45 C65 45 70 52 85 52 C100 52 108 45 108 38 C108 30 100 27 90 24 C80 21 75 19 75 14 C75 9 80 6 88 6 C96 6 105 10 105 15"
            stroke="var(--indigo)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: 300,
              strokeDashoffset: 0,
              animation: 'bs-draw 1.2s ease-in-out forwards',
              filter: phase !== 'draw' ? 'drop-shadow(0 0 8px var(--indigo))' : 'none',
              transition: 'filter 0.3s ease',
              ['--path-length' as string]: '300',
            }}
          />
        </svg>
      </div>
    </div>
  );
};

export default LoadingScreen;

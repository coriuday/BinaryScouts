'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/ui/Logo';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export type IntroMode = 'full' | 'brief';

interface LoadingScreenProps {
  onComplete: () => void;
  mode?: IntroMode;
}

const BINARY_COLS = [
  '01001101',
  '11010010',
  '00110101',
  '10101001',
  '01110011',
  '10010110',
  '01011010',
  '11100001',
];

const EASE = [0.16, 1, 0.3, 1] as const;

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, mode = 'full' }) => {
  const reduced = useReducedMotion();
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const particleCount = isMobile ? 8 : 14;

  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        left: `${8 + ((i * 17) % 84)}%`,
        top: `${10 + ((i * 23) % 80)}%`,
        size: 1 + (i % 3),
        delay: (i % 5) * 0.12,
        duration: 4 + (i % 4),
      })),
    [particleCount]
  );

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (reduced) {
      onComplete();
      return;
    }

    if (mode === 'brief') {
      const t = setTimeout(() => {
        setExiting(true);
        setTimeout(onComplete, 400);
      }, 50);
      return () => clearTimeout(t);
    }

    let raf = 0;
    const progressStart = setTimeout(() => {
      const start = performance.now();
      const duration = 1000;
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        setProgress(Math.round(t * 100));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, 1500);

    const exitTimer = setTimeout(() => setExiting(true), 2500);
    const doneTimer = setTimeout(onComplete, 2900);

    return () => {
      clearTimeout(progressStart);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
      cancelAnimationFrame(raf);
    };
  }, [mode, onComplete, reduced]);

  if (reduced) return null;

  // Brief mode: simple black fade
  if (mode === 'brief') {
    return (
      <motion.div
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label="Loading"
        initial={{ opacity: 1 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: 0.4, ease: EASE }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          backgroundColor: '#000',
          pointerEvents: exiting ? 'none' : 'auto',
        }}
      />
    );
  }

  const logoSize = isMobile ? 168 : 208;
  const wordmarkH = isMobile ? 28 : 36;

  return (
    <AnimatePresence>
      <motion.div
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label="Loading BinaryScouts"
        initial={{ opacity: 1 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: 0.4, ease: EASE }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          backgroundColor: '#000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          pointerEvents: exiting ? 'none' : 'auto',
        }}
      >
        {/* Soft center bloom */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            position: 'absolute',
            width: isMobile ? 280 : 420,
            height: isMobile ? 280 : 420,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,212,255,0.18) 0%, transparent 68%)',
            filter: 'blur(8px)',
            pointerEvents: 'none',
          }}
        />

        {/* Binary columns */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          {BINARY_COLS.map((col, i) => (
            <motion.div
              key={col + i}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
              style={{
                position: 'absolute',
                left: `${6 + i * 12}%`,
                top: `${8 + (i % 3) * 10}%`,
                fontFamily: 'var(--font-mono), monospace',
                fontSize: isMobile ? 9 : 11,
                letterSpacing: '0.2em',
                writingMode: 'vertical-rl',
                color: i % 2 === 0 ? 'rgba(0,212,255,0.22)' : 'rgba(148,163,184,0.14)',
                userSelect: 'none',
              }}
            >
              {col.repeat(4).split('').join(' ')}
            </motion.div>
          ))}
        </motion.div>

        {/* Floating particles */}
        {particles.map((p) => (
          <motion.span
            key={p.id}
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0.25, 0.6], y: [0, -10, 4, 0] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: 'rgba(0,212,255,0.7)',
              boxShadow: '0 0 6px rgba(0,212,255,0.5)',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Light sweep */}
        <motion.div
          aria-hidden
          initial={{ x: '-120%', opacity: 0 }}
          animate={{ x: '120%', opacity: [0, 0.8, 0] }}
          transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
          style={{
            position: 'absolute',
            top: '30%',
            left: 0,
            width: '40%',
            height: '40%',
            background:
              'linear-gradient(105deg, transparent 0%, rgba(0,212,255,0.12) 45%, rgba(255,255,255,0.2) 50%, rgba(0,212,255,0.1) 55%, transparent 100%)',
            pointerEvents: 'none',
            transform: 'skewX(-12deg)',
          }}
        />

        {/* Center stack */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: isMobile ? 16 : 20,
            padding: '0 24px',
          }}
        >
          {/* Monogram + orbit */}
          <div style={{ position: 'relative', width: logoSize + 48, height: logoSize + 48 }}>
            {/* Orbit ring */}
            <motion.svg
              aria-hidden
              viewBox="0 0 200 200"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                transform: 'rotate(-28deg)',
                overflow: 'visible',
              }}
            >
              <motion.ellipse
                cx="100"
                cy="100"
                rx="88"
                ry="52"
                fill="none"
                stroke="rgba(0,212,255,0.85)"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.65, delay: 0.85, ease: EASE }}
                style={{ filter: 'drop-shadow(0 0 6px rgba(0,212,255,0.8))' }}
              />
              {/* Bright node on orbit */}
              <motion.circle
                cx="100"
                cy="48"
                r="3.5"
                fill="#00d4ff"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.35, duration: 0.25 }}
                style={{ filter: 'drop-shadow(0 0 8px #00d4ff)' }}
              />
            </motion.svg>

            {/* Monogram */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.4, ease: EASE }}
              style={{
                position: 'absolute',
                inset: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
                overflow: 'hidden',
              }}
            >
              {/* Glow behind logo — keeps mark crisp (no filter on the asset) */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: '8%',
                  borderRadius: 20,
                  boxShadow: '0 0 36px rgba(0,212,255,0.28), 0 0 72px rgba(0,212,255,0.12)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />
              <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
                <Logo variant="icon" size={logoSize} priority crisp decorative />
              </div>
              {/* Shine across monogram */}
              <motion.div
                aria-hidden
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 0.8, delay: 1.5, ease: EASE }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 2,
                  background:
                    'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.35) 50%, transparent 65%)',
                  pointerEvents: 'none',
                }}
              />
            </motion.div>
          </div>

          {/* Wordmark + reflection */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div
              initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
              animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
              transition={{ duration: 0.7, delay: 1.35, ease: EASE }}
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              <Logo variant="wordmark" size={wordmarkH} priority crisp decorative />
              <motion.div
                aria-hidden
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 0.75, delay: 1.7, ease: EASE }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(105deg, transparent 30%, rgba(0,212,255,0.45) 50%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />
            </motion.div>

            {/* Floor reflection */}
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.28 }}
              transition={{ delay: 1.6, duration: 0.4 }}
              style={{
                marginTop: 4,
                transform: 'scaleY(-1)',
                filter: 'blur(1px)',
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
                pointerEvents: 'none',
              }}
            >
              <Logo variant="wordmark" size={wordmarkH} decorative />
            </motion.div>
          </div>

          {/* Horizontal flare */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scaleX: 0.2 }}
            animate={{ opacity: 0.9, scaleX: 1 }}
            transition={{ delay: 1.7, duration: 0.45, ease: EASE }}
            style={{
              width: isMobile ? 180 : 260,
              height: 1,
              background:
                'linear-gradient(90deg, transparent, rgba(0,212,255,0.9), rgba(255,255,255,0.85), rgba(0,212,255,0.9), transparent)',
              boxShadow: '0 0 12px rgba(0,212,255,0.7)',
            }}
          />

          {/* Progress */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.55, duration: 0.4 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              width: isMobile ? 200 : 260,
            }}
          >
            <div
              style={{
                width: '100%',
                height: 3,
                borderRadius: 999,
                background: 'rgba(255,255,255,0.08)',
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
                style={{
                  height: '100%',
                  borderRadius: 999,
                  background: 'linear-gradient(90deg, #00a8cc, #00d4ff)',
                  boxShadow: '0 0 10px rgba(0,212,255,0.8)',
                }}
              />
            </div>
            <p
              style={{
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(0,212,255,0.85)',
                margin: 0,
              }}
            >
              Initializing solutions...
            </p>
            <p
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 12,
                color: 'rgba(0,212,255,0.7)',
                margin: 0,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {progress}%
            </p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;

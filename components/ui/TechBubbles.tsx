'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const BUBBLES: {
  label: string;
  size: number;
  left: string;
  top: string;
  delay: number;
  duration: number;
  accent: string;
}[] = [
  { label: 'Next.js', size: 96, left: '12%', top: '8%', delay: 0, duration: 5.5, accent: '#00d4ff' },
  { label: 'React', size: 88, left: '48%', top: '4%', delay: 0.1, duration: 6.2, accent: '#61dafb' },
  { label: 'TypeScript', size: 104, left: '68%', top: '22%', delay: 0.15, duration: 5.8, accent: '#3178c6' },
  { label: 'Node.js', size: 92, left: '8%', top: '38%', delay: 0.2, duration: 6.5, accent: '#68a063' },
  { label: 'Python', size: 80, left: '42%', top: '36%', delay: 0.25, duration: 5.2, accent: '#ffd43b' },
  { label: 'PostgreSQL', size: 100, left: '72%', top: '52%', delay: 0.3, duration: 6.8, accent: '#336791' },
  { label: 'Supabase', size: 84, left: '22%', top: '62%', delay: 0.35, duration: 5.6, accent: '#3ecf8e' },
  { label: 'Rust', size: 76, left: '52%', top: '68%', delay: 0.4, duration: 6.1, accent: '#dea584' },
  { label: 'Docker', size: 86, left: '4%', top: '78%', delay: 0.45, duration: 5.9, accent: '#2496ed' },
  { label: 'OpenAI', size: 90, left: '58%', top: '82%', delay: 0.5, duration: 6.4, accent: '#00d4ff' },
];

const TechBubbles: React.FC = () => {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      className="relative w-full h-full min-h-[380px] max-w-[440px] ml-auto"
      aria-hidden="true"
    >
      {/* Soft bloom behind cluster */}
      <div
        style={{
          position: 'absolute',
          inset: '10% 5%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, rgba(99,102,241,0.06) 45%, transparent 70%)',
          filter: 'blur(4px)',
          pointerEvents: 'none',
        }}
      />

      {BUBBLES.map((b) => {
        const isHover = hovered === b.label;
        return (
          <motion.div
            key={b.label}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={
              reduced
                ? { opacity: 1, scale: 1, x: 0, y: 0 }
                : {
                    opacity: 1,
                    scale: isHover ? 1.06 : 1,
                    y: [0, -10, 4, 0],
                    x: [0, 6, -4, 0],
                  }
            }
            transition={
              reduced
                ? { duration: 0.4, delay: 0.8 + b.delay }
                : {
                    opacity: { duration: 0.5, delay: 0.9 + b.delay },
                    scale: { duration: 0.25 },
                    y: {
                      duration: b.duration,
                      delay: b.delay,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                    x: {
                      duration: b.duration * 1.15,
                      delay: b.delay + 0.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }
            }
            onMouseEnter={() => setHovered(b.label)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: 'absolute',
              left: b.left,
              top: b.top,
              width: b.size,
              height: b.size,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: 8,
              background: isHover
                ? `rgba(0, 212, 255, 0.12)`
                : 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: `0.5px solid ${isHover ? `${b.accent}88` : 'rgba(0, 212, 255, 0.22)'}`,
              boxShadow: isHover
                ? `0 0 28px ${b.accent}44, inset 0 1px 0 rgba(255,255,255,0.12)`
                : '0 0 20px rgba(0, 212, 255, 0.08), inset 0 1px 0 rgba(255,255,255,0.06)',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: b.size > 95 ? 12 : 11,
              fontWeight: 500,
              color: isHover ? '#e0f7ff' : 'rgba(224, 247, 255, 0.88)',
              letterSpacing: '0.02em',
              cursor: 'default',
              userSelect: 'none',
              willChange: reduced ? undefined : 'transform',
            }}
          >
            {b.label}
          </motion.div>
        );
      })}
    </div>
  );
};

export default TechBubbles;

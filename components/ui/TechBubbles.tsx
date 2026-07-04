'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Bubble = {
  label: string;
  slug: string;
  color: string; // hex without #
  size: number;
  left: string;
  top: string;
  delay: number;
  duration: number;
  ampY: number;
  ampX: number;
};

/** Spread across full right column — centers ~14%+ apart, corners filled */
const BUBBLES: Bubble[] = [
  { label: 'Next.js', slug: 'nextdotjs', color: 'FFFFFF', size: 100, left: '2%', top: '2%', delay: 0, duration: 5.8, ampY: 12, ampX: 5 },
  { label: 'React', slug: 'react', color: '61DAFB', size: 92, left: '38%', top: '0%', delay: 0.08, duration: 6.4, ampY: 10, ampX: 7 },
  { label: 'TypeScript', slug: 'typescript', color: '3178C6', size: 88, left: '72%', top: '4%', delay: 0.12, duration: 5.5, ampY: 14, ampX: 4 },
  { label: 'Node.js', slug: 'nodedotjs', color: '339933', size: 96, left: '18%', top: '22%', delay: 0.16, duration: 6.8, ampY: 11, ampX: 8 },
  { label: 'Python', slug: 'python', color: '3776AB', size: 84, left: '54%', top: '20%', delay: 0.2, duration: 5.2, ampY: 13, ampX: 6 },
  { label: 'PostgreSQL', slug: 'postgresql', color: '4169E1', size: 90, left: '82%', top: '28%', delay: 0.24, duration: 7.0, ampY: 9, ampX: 5 },
  { label: 'Supabase', slug: 'supabase', color: '3ECF8E', size: 86, left: '4%', top: '44%', delay: 0.28, duration: 5.9, ampY: 12, ampX: 7 },
  { label: 'Rust', slug: 'rust', color: 'DEA584', size: 78, left: '36%', top: '42%', delay: 0.32, duration: 6.2, ampY: 10, ampX: 9 },
  { label: 'Docker', slug: 'docker', color: '2496ED', size: 94, left: '66%', top: '46%', delay: 0.36, duration: 5.6, ampY: 14, ampX: 4 },
  { label: 'OpenAI', slug: 'openai', color: '10A37F', size: 88, left: '88%', top: '52%', delay: 0.4, duration: 6.6, ampY: 11, ampX: 6 },
  { label: 'Vercel', slug: 'vercel', color: 'FFFFFF', size: 82, left: '14%', top: '66%', delay: 0.44, duration: 5.4, ampY: 13, ampX: 5 },
  { label: 'Framer', slug: 'framer', color: '0055FF', size: 90, left: '46%', top: '64%', delay: 0.48, duration: 6.9, ampY: 10, ampX: 8 },
  { label: 'Redis', slug: 'redis', color: 'DC382D', size: 80, left: '76%', top: '70%', delay: 0.52, duration: 5.7, ampY: 12, ampX: 4 },
  { label: 'AWS', slug: 'amazonaws', color: 'FF9900', size: 86, left: '0%', top: '84%', delay: 0.56, duration: 6.3, ampY: 9, ampX: 7 },
  { label: 'Tailwind', slug: 'tailwindcss', color: '06B6D4', size: 92, left: '32%', top: '82%', delay: 0.6, duration: 5.8, ampY: 14, ampX: 5 },
  { label: 'GraphQL', slug: 'graphql', color: 'E10098', size: 84, left: '62%', top: '88%', delay: 0.64, duration: 6.5, ampY: 11, ampX: 6 },
];

function iconUrl(slug: string, color: string) {
  return `https://cdn.simpleicons.org/${slug}/${color}`;
}

const BubbleIcon: React.FC<{ slug: string; color: string; size: number }> = ({ slug, color, size }) => {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={iconUrl(slug, color)}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => setHidden(true)}
      style={{ display: 'block', flexShrink: 0 }}
    />
  );
};

const TechBubbles: React.FC = () => {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      className="relative w-full h-full min-h-[500px]"
      aria-hidden="true"
    >
      {/* Soft bloom */}
      <div
        style={{
          position: 'absolute',
          inset: '5% 0%',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse 80% 70% at 50% 45%, rgba(0,212,255,0.1) 0%, rgba(99,102,241,0.05) 40%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {BUBBLES.map((b) => {
        const isHover = hovered === b.label;
        const brand = `#${b.color}`;
        const iconPx = b.size >= 92 ? 28 : b.size >= 84 ? 24 : 20;
        const fontSize = b.size >= 92 ? 10 : 9;

        return (
          <motion.div
            key={b.label}
            initial={{ opacity: 0, scale: 0.65 }}
            animate={
              reduced
                ? { opacity: 1, scale: 1, x: 0, y: 0 }
                : {
                    opacity: 1,
                    scale: isHover ? 1.08 : 1,
                    y: [0, -b.ampY, b.ampY * 0.4, 0],
                    x: [0, b.ampX, -b.ampX * 0.6, 0],
                  }
            }
            transition={
              reduced
                ? { duration: 0.4, delay: 0.85 + b.delay }
                : {
                    opacity: { duration: 0.45, delay: 0.9 + b.delay },
                    scale: { duration: 0.22 },
                    y: {
                      duration: b.duration,
                      delay: b.delay,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                    x: {
                      duration: b.duration * (1.1 + (b.ampX % 3) * 0.08),
                      delay: b.delay + 0.15,
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
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              padding: 6,
              background: isHover
                ? `color-mix(in srgb, ${brand} 18%, rgba(10,10,15,0.85))`
                : 'rgba(10, 10, 18, 0.72)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: `1px solid ${isHover ? brand : `${brand}55`}`,
              boxShadow: isHover
                ? `0 0 32px ${brand}55, inset 0 1px 0 rgba(255,255,255,0.12)`
                : `0 0 18px ${brand}22, inset 0 1px 0 rgba(255,255,255,0.06)`,
              cursor: 'default',
              userSelect: 'none',
              willChange: reduced ? undefined : 'transform',
            }}
          >
            <BubbleIcon slug={b.slug} color={b.color} size={iconPx} />
            <span
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize,
                fontWeight: 500,
                color: isHover ? '#fff' : 'rgba(255,255,255,0.88)',
                letterSpacing: '0.01em',
                lineHeight: 1.15,
                textAlign: 'center',
                maxWidth: '90%',
              }}
            >
              {b.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TechBubbles;

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type IconId =
  | 'nextjs'
  | 'react'
  | 'typescript'
  | 'nodejs'
  | 'python'
  | 'postgresql'
  | 'supabase'
  | 'rust'
  | 'docker'
  | 'openai'
  | 'vercel'
  | 'framer'
  | 'redis'
  | 'aws'
  | 'tailwind'
  | 'graphql';

type Bubble = {
  label: string;
  icon: IconId;
  color: string;
  size: number;
  /** Center position as % of container */
  cx: number;
  cy: number;
  delay: number;
  duration: number;
  ampY: number;
  ampX: number;
};

/** 4×4 centers — translate(-50%,-50%) keeps bubbles in-bounds */
const BUBBLES: Bubble[] = [
  { label: 'Next.js', icon: 'nextjs', color: '#FFFFFF', size: 92, cx: 12, cy: 12, delay: 0, duration: 5.8, ampY: 10, ampX: 5 },
  { label: 'React', icon: 'react', color: '#61DAFB', size: 86, cx: 38, cy: 10, delay: 0.06, duration: 6.4, ampY: 12, ampX: 6 },
  { label: 'TypeScript', icon: 'typescript', color: '#3178C6', size: 88, cx: 62, cy: 12, delay: 0.1, duration: 5.5, ampY: 9, ampX: 5 },
  { label: 'Node.js', icon: 'nodejs', color: '#339933', size: 90, cx: 88, cy: 11, delay: 0.14, duration: 6.8, ampY: 11, ampX: 4 },
  { label: 'Python', icon: 'python', color: '#3776AB', size: 84, cx: 14, cy: 36, delay: 0.18, duration: 5.2, ampY: 13, ampX: 7 },
  { label: 'PostgreSQL', icon: 'postgresql', color: '#4169E1', size: 88, cx: 36, cy: 38, delay: 0.22, duration: 7.0, ampY: 10, ampX: 5 },
  { label: 'Supabase', icon: 'supabase', color: '#3ECF8E', size: 82, cx: 64, cy: 36, delay: 0.26, duration: 5.9, ampY: 12, ampX: 6 },
  { label: 'Rust', icon: 'rust', color: '#DEA584', size: 78, cx: 86, cy: 38, delay: 0.3, duration: 6.2, ampY: 9, ampX: 5 },
  { label: 'Docker', icon: 'docker', color: '#2496ED', size: 90, cx: 12, cy: 62, delay: 0.34, duration: 5.6, ampY: 11, ampX: 4 },
  { label: 'OpenAI', icon: 'openai', color: '#10A37F', size: 86, cx: 38, cy: 64, delay: 0.38, duration: 6.6, ampY: 10, ampX: 7 },
  { label: 'Vercel', icon: 'vercel', color: '#FFFFFF', size: 80, cx: 62, cy: 62, delay: 0.42, duration: 5.4, ampY: 13, ampX: 5 },
  { label: 'Framer', icon: 'framer', color: '#0055FF', size: 88, cx: 88, cy: 64, delay: 0.46, duration: 6.9, ampY: 9, ampX: 6 },
  { label: 'Redis', icon: 'redis', color: '#DC382D', size: 78, cx: 14, cy: 88, delay: 0.5, duration: 5.7, ampY: 12, ampX: 4 },
  { label: 'AWS', icon: 'aws', color: '#FF9900', size: 84, cx: 36, cy: 86, delay: 0.54, duration: 6.3, ampY: 10, ampX: 6 },
  { label: 'Tailwind', icon: 'tailwind', color: '#06B6D4', size: 90, cx: 64, cy: 88, delay: 0.58, duration: 5.8, ampY: 11, ampX: 5 },
  { label: 'GraphQL', icon: 'graphql', color: '#E10098', size: 82, cx: 86, cy: 86, delay: 0.62, duration: 6.5, ampY: 10, ampX: 4 },
];

function TechIcon({ id, color, size }: { id: IconId; color: string; size: number }) {
  const s = { width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true as const };

  switch (id) {
    case 'react':
      return (
        <svg {...s}>
          <circle cx="12" cy="12" r="2.2" fill={color} />
          <g fill="none" stroke={color} strokeWidth="1.2">
            <ellipse cx="12" cy="12" rx="10" ry="4" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
          </g>
        </svg>
      );
    case 'nextjs':
      return (
        <svg {...s}>
          <circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="1.5" />
          <path fill={color} d="M8 8v8h1.5V10.5L15.5 16H17V8h-1.5v5.5L9.5 8H8z" />
        </svg>
      );
    case 'typescript':
      return (
        <svg {...s}>
          <rect x="2" y="2" width="20" height="20" rx="2" fill={color} />
          <path fill="#0a0a0f" d="M12.5 17.5v-7H9V9h9v1.5h-3.5v7h-2z" />
        </svg>
      );
    case 'nodejs':
      return (
        <svg {...s}>
          <path
            fill={color}
            d="M12 1.5L3.5 6.5v11L12 22.5l8.5-5v-11L12 1.5zm0 2.3l6.5 3.8v7.8L12 19.2l-6.5-3.8V7.6L12 3.8z"
          />
          <path
            fill={color}
            d="M12 7.5c-1.8 0-3 1-3 2.4 0 1.6 1.2 2.1 2.4 2.5l.8.3c.7.2 1.1.4 1.1 1 0 .5-.4.9-1.3.9-1 0-1.5-.5-1.7-1.2l-1.7.3c.3 1.4 1.5 2.4 3.4 2.4 2 0 3.2-1 3.2-2.5 0-1.6-1.1-2.2-2.5-2.6l-.8-.3c-.6-.2-1-.4-1-1s.5-.8 1.2-.8c.8 0 1.2.4 1.4 1l1.6-.4c-.3-1.2-1.3-2-3-2z"
          />
        </svg>
      );
    case 'python':
      return (
        <svg {...s}>
          <path fill={color} d="M12 2C8.5 2 8 3.5 8 5v2h8V5c0-1.5-.5-3-4-3zm-2 1.5a1 1 0 110 2 1 1 0 010-2z" />
          <path
            fill={color}
            opacity="0.85"
            d="M7 7v4c0 1.5.5 2.5 4 2.5h2c2.5 0 3 .8 3 2v4c0 1.5-.5 3-4 3s-4-1.5-4-3v-2h4v.5c0 .5.2 1 1 1s1-.5 1-1v-3.5c0-1.5-.5-2.5-4-2.5H9C6.5 12 6 11 6 9.5V7h1z"
          />
          <path fill={color} d="M14 19.5a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      );
    case 'postgresql':
      return (
        <svg {...s}>
          <path
            fill={color}
            d="M12 2C7 2 4 5.5 4 10c0 3 1.5 5 3.5 6.5V20h3v-2h3v2h3v-3.5C18.5 15 20 13 20 10c0-4.5-3-8-8-8zm-2 5h4v2h-4V7zm0 4h4v2h-4v-2z"
          />
        </svg>
      );
    case 'supabase':
      return (
        <svg {...s}>
          <path fill={color} d="M12 2L4 14h7l-1 8 10-14h-7l-1-6z" />
        </svg>
      );
    case 'rust':
      return (
        <svg {...s}>
          <circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3" fill={color} />
          <circle cx="12" cy="4" r="1.5" fill={color} />
          <circle cx="12" cy="20" r="1.5" fill={color} />
          <circle cx="5" cy="8" r="1.5" fill={color} />
          <circle cx="19" cy="8" r="1.5" fill={color} />
          <circle cx="5" cy="16" r="1.5" fill={color} />
          <circle cx="19" cy="16" r="1.5" fill={color} />
        </svg>
      );
    case 'docker':
      return (
        <svg {...s}>
          <path
            fill={color}
            d="M4 13h2v2H4v-2zm3 0h2v2H7v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zM7 10h2v2H7v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zM10 7h2v2h-2V7zm3 0h2v2h-2V7z"
          />
          <path
            fill="none"
            stroke={color}
            strokeWidth="1.2"
            d="M21 14c0 2-2 4-5.5 4H5c-2 0-3-1.5-3-3 0-1.5 1-2.5 2.5-3 .5-2.5 2.5-4 5-4 2 0 3.5 1 4.5 2.5C15 10 17 11 18.5 12c1.5.5 2.5 1.5 2.5 2z"
          />
        </svg>
      );
    case 'openai':
      return (
        <svg {...s}>
          <path
            fill={color}
            d="M12 6a3 3 0 00-2.6 1.5 3 3 0 00-3.1 1.2A3 3 0 005 12a3 3 0 001.3 2.5 3 3 0 003.1 1.2A3 3 0 0012 17a3 3 0 002.6-1.3 3 3 0 003.1-1.2A3 3 0 0019 12a3 3 0 00-1.3-2.5 3 3 0 00-3.1-1.2A3 3 0 0012 6zm0 2c.6 0 1.1.3 1.4.8L12 10l-1.4-1.2A1.6 1.6 0 0112 8zm-3.2 1.2c.3-.2.6-.2.9 0L12 10.5l2.3-1.3c.3-.2.6-.2.9 0 .5.3.7.9.5 1.4L13.5 12l2.2 1.3c.2.5 0 1.1-.5 1.4-.3.2-.6.2-.9 0L12 13.5l-2.3 1.2c-.3.2-.6.2-.9 0-.5-.3-.7-.9-.5-1.4L10.5 12 8.3 10.7c-.2-.5 0-1.1.5-1.5zM12 11l-1.2.7v1.4l1.2.7 1.2-.7v-1.4L12 11z"
          />
        </svg>
      );
    case 'vercel':
      return (
        <svg {...s}>
          <path fill={color} d="M12 3L22 20H2L12 3z" />
        </svg>
      );
    case 'framer':
      return (
        <svg {...s}>
          <path fill={color} d="M6 2h12v7H12l6 7H12v6l-6-6V2z" />
        </svg>
      );
    case 'redis':
      return (
        <svg {...s}>
          <path
            fill={color}
            d="M4 8c0-1.5 3.6-3 8-3s8 1.5 8 3-3.6 3-8 3-8-1.5-8-3zm0 4c0 1.5 3.6 3 8 3s8-1.5 8-3v3c0 1.5-3.6 3-8 3s-8-1.5-8-3v-3zm0 5c0 1.5 3.6 3 8 3s8-1.5 8-3v3c0 1.5-3.6 3-8 3s-8-1.5-8-3v-3z"
          />
        </svg>
      );
    case 'aws':
      return (
        <svg {...s}>
          <path
            fill={color}
            d="M7 15.5c1.5 1.1 3.7 1.8 5.8 1.8 2.4 0 4.5-.7 5.8-1.8.3-.2.6 0 .4.3-1.4 2-4.2 3.2-7.2 3.2-2.8 0-5.4-1.1-6.9-2.9-.2-.3.1-.5.4-.3l1.7-.3z"
          />
          <path
            fill={color}
            d="M18.5 14.2c.2-.3-.1-.5-.4-.4-1.1.3-2.3.4-3.4.2-.3 0-.5-.2-.4-.4.5-1.8 2-2.7 2-2.7s-1.8.2-3.1 1.5c-.3.3-.8.2-.9-.2-.3-1.1-.4-2.4 0-3.5.1-.3.5-.3.6 0 .4 1.2 1.5 2.1 2.8 2.3 0 0-1.2-1.8-.7-3.8.1-.4.6-.5.8-.2 1.5 2.2 3.8 5.3 2.7 7.2z"
          />
        </svg>
      );
    case 'tailwind':
      return (
        <svg {...s}>
          <path
            fill={color}
            d="M12 6c-2.7 0-4.4 1.3-5 4 1-1.3 2.1-1.8 3.4-1.5.7.2 1.3.7 1.9 1.3C13.4 11 14.7 12 17 12c2.7 0 4.4-1.3 5-4-1 1.3-2.1 1.8-3.4 1.5-.7-.2-1.3-.7-1.9-1.3C15.6 7 14.3 6 12 6zM7 12c-2.7 0-4.4 1.3-5 4 1-1.3 2.1-1.8 3.4-1.5.7.2 1.3.7 1.9 1.3C8.4 17 9.7 18 12 18c2.7 0 4.4-1.3 5-4-1 1.3-2.1 1.8-3.4 1.5-.7-.2-1.3-.7-1.9-1.3C10.6 13 9.3 12 7 12z"
          />
        </svg>
      );
    case 'graphql':
      return (
        <svg {...s}>
          <path
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            d="M4.5 7.5l7.5-4.3 7.5 4.3v9l-7.5 4.3-7.5-4.3v-9z"
          />
          <circle cx="12" cy="3.5" r="1.5" fill={color} />
          <circle cx="12" cy="20.5" r="1.5" fill={color} />
          <circle cx="4.5" cy="7.5" r="1.5" fill={color} />
          <circle cx="19.5" cy="7.5" r="1.5" fill={color} />
          <circle cx="4.5" cy="16.5" r="1.5" fill={color} />
          <circle cx="19.5" cy="16.5" r="1.5" fill={color} />
        </svg>
      );
    default:
      return null;
  }
}

const TechBubbles: React.FC = () => {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative w-full h-full min-h-[520px]" aria-hidden="true">
      <div
        style={{
          position: 'absolute',
          inset: '0%',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,212,255,0.1) 0%, rgba(99,102,241,0.05) 45%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {BUBBLES.map((b) => {
        const isHover = hovered === b.label;
        const iconPx = b.size >= 90 ? 26 : b.size >= 84 ? 22 : 20;
        const fontSize = b.size >= 90 ? 10 : 9;

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
                      duration: b.duration * 1.12,
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
              left: `${b.cx}%`,
              top: `${b.cy}%`,
              width: b.size,
              height: b.size,
              marginLeft: -b.size / 2,
              marginTop: -b.size / 2,
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              padding: 6,
              background: isHover ? `${b.color}22` : 'rgba(10, 10, 18, 0.78)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: `1px solid ${isHover ? b.color : `${b.color}66`}`,
              boxShadow: isHover
                ? `0 0 32px ${b.color}55, inset 0 1px 0 rgba(255,255,255,0.12)`
                : `0 0 18px ${b.color}28, inset 0 1px 0 rgba(255,255,255,0.06)`,
              cursor: 'default',
              userSelect: 'none',
              willChange: reduced ? undefined : 'transform',
            }}
          >
            <TechIcon id={b.icon} color={b.color} size={iconPx} />
            <span
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize,
                fontWeight: 500,
                color: isHover ? '#fff' : 'rgba(255,255,255,0.9)',
                letterSpacing: '0.01em',
                lineHeight: 1.15,
                textAlign: 'center',
                maxWidth: '92%',
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

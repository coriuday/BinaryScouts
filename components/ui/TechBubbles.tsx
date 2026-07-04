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
  | 'graphql'
  | 'mongodb'
  | 'kubernetes'
  | 'prisma'
  | 'stripe'
  | 'github'
  | 'langchain';

type Bubble = {
  label: string;
  icon: IconId;
  color: string;
  size: number;
  cx: number;
  cy: number;
  delay: number;
  duration: number;
  rotateDuration: number;
  pathY: number[];
  pathX: number[];
  rotate: number[];
};

const BUBBLES: Bubble[] = [
  // Upper-right priority zone
  { label: 'Next.js', icon: 'nextjs', color: '#FFFFFF', size: 88, cx: 78, cy: 8, delay: 0, duration: 5.8, rotateDuration: 9.2, pathY: [0, -14, 6, -8, 0], pathX: [0, 9, -5, 3, 0], rotate: [0, 3, -2, 2, 0] },
  { label: 'React', icon: 'react', color: '#61DAFB', size: 82, cx: 55, cy: 18, delay: 0.4, duration: 6.4, rotateDuration: 11.5, pathY: [0, 8, -11, 4, 0], pathX: [0, -7, 11, -3, 0], rotate: [0, -3, 2, -1, 0] },
  { label: 'TypeScript', icon: 'typescript', color: '#3178C6', size: 86, cx: 91, cy: 22, delay: 0.9, duration: 5.5, rotateDuration: 8.7, pathY: [0, -9, 13, -5, 0], pathX: [0, 6, -9, 4, 0], rotate: [0, 2, -3, 1, 0] },
  { label: 'Vercel', icon: 'vercel', color: '#FFFFFF', size: 76, cx: 42, cy: 14, delay: 1.3, duration: 7.1, rotateDuration: 10.3, pathY: [0, 11, -7, 9, 0], pathX: [0, -4, 8, -6, 0], rotate: [0, -2, 3, -2, 0] },
  { label: 'LangChain', icon: 'langchain', color: '#41A688', size: 80, cx: 68, cy: 28, delay: 0.2, duration: 6.9, rotateDuration: 12.1, pathY: [0, -12, 5, -10, 0], pathX: [0, 10, -3, 7, 0], rotate: [0, 3, -1, 2, 0] },
  { label: 'GitHub', icon: 'github', color: '#FFFFFF', size: 74, cx: 18, cy: 10, delay: 1.7, duration: 5.2, rotateDuration: 9.8, pathY: [0, 7, -13, 6, 0], pathX: [0, -8, 5, -4, 0], rotate: [0, -3, 2, -3, 0] },
  { label: 'Framer', icon: 'framer', color: '#0055FF', size: 78, cx: 28, cy: 26, delay: 2.1, duration: 6.6, rotateDuration: 11.0, pathY: [0, -10, 8, -6, 0], pathX: [0, 5, -10, 6, 0], rotate: [0, 2, -2, 3, 0] },
  { label: 'Stripe', icon: 'stripe', color: '#635BFF', size: 72, cx: 85, cy: 32, delay: 0.6, duration: 4.8, rotateDuration: 8.4, pathY: [0, 9, -8, 11, 0], pathX: [0, -6, 9, -5, 0], rotate: [0, -2, 3, -1, 0] },
  // Mid scatter
  { label: 'Node.js', icon: 'nodejs', color: '#339933', size: 90, cx: 48, cy: 42, delay: 1.1, duration: 7.4, rotateDuration: 10.6, pathY: [0, -15, 7, -9, 0], pathX: [0, 8, -7, 4, 0], rotate: [0, 3, -3, 2, 0] },
  { label: 'Python', icon: 'python', color: '#3776AB', size: 84, cx: 72, cy: 48, delay: 1.5, duration: 5.9, rotateDuration: 9.5, pathY: [0, 10, -12, 5, 0], pathX: [0, -9, 6, -8, 0], rotate: [0, -2, 2, -3, 0] },
  { label: 'Docker', icon: 'docker', color: '#2496ED', size: 88, cx: 22, cy: 52, delay: 2.3, duration: 6.2, rotateDuration: 11.8, pathY: [0, -8, 14, -7, 0], pathX: [0, 11, -4, 9, 0], rotate: [0, 2, -3, 1, 0] },
  { label: 'Kubernetes', icon: 'kubernetes', color: '#326CE5', size: 80, cx: 58, cy: 58, delay: 0.8, duration: 8.1, rotateDuration: 12.4, pathY: [0, 12, -9, 8, 0], pathX: [0, -5, 10, -6, 0], rotate: [0, -3, 1, -2, 0] },
  { label: 'OpenAI', icon: 'openai', color: '#10A37F', size: 86, cx: 88, cy: 55, delay: 1.9, duration: 5.4, rotateDuration: 9.1, pathY: [0, -11, 6, -13, 0], pathX: [0, 7, -8, 5, 0], rotate: [0, 3, -2, 3, 0] },
  { label: 'Prisma', icon: 'prisma', color: '#2DD4BF', size: 76, cx: 38, cy: 65, delay: 2.5, duration: 6.7, rotateDuration: 10.9, pathY: [0, 8, -10, 7, 0], pathX: [0, -10, 4, -7, 0], rotate: [0, -1, 3, -2, 0] },
  // Lower scatter
  { label: 'PostgreSQL', icon: 'postgresql', color: '#4169E1', size: 86, cx: 65, cy: 72, delay: 0.3, duration: 7.8, rotateDuration: 11.3, pathY: [0, -13, 9, -6, 0], pathX: [0, 6, -11, 3, 0], rotate: [0, 2, -3, 2, 0] },
  { label: 'Supabase', icon: 'supabase', color: '#3ECF8E', size: 82, cx: 15, cy: 72, delay: 1.4, duration: 5.6, rotateDuration: 8.9, pathY: [0, 11, -7, 10, 0], pathX: [0, -7, 9, -4, 0], rotate: [0, -3, 2, -1, 0] },
  { label: 'MongoDB', icon: 'mongodb', color: '#47A248', size: 84, cx: 48, cy: 78, delay: 2.0, duration: 6.5, rotateDuration: 10.2, pathY: [0, -9, 12, -8, 0], pathX: [0, 9, -6, 8, 0], rotate: [0, 3, -1, 3, 0] },
  { label: 'Rust', icon: 'rust', color: '#DEA584', size: 78, cx: 82, cy: 68, delay: 0.5, duration: 8.5, rotateDuration: 12.7, pathY: [0, 7, -14, 5, 0], pathX: [0, -8, 7, -9, 0], rotate: [0, -2, 3, -3, 0] },
  { label: 'Redis', icon: 'redis', color: '#DC382D', size: 76, cx: 28, cy: 88, delay: 1.8, duration: 4.2, rotateDuration: 8.2, pathY: [0, -10, 8, -11, 0], pathX: [0, 10, -5, 6, 0], rotate: [0, 2, -2, 1, 0] },
  { label: 'AWS', icon: 'aws', color: '#FF9900', size: 82, cx: 58, cy: 90, delay: 2.2, duration: 6.0, rotateDuration: 9.6, pathY: [0, 13, -8, 9, 0], pathX: [0, -6, 11, -5, 0], rotate: [0, -3, 1, -2, 0] },
  { label: 'Tailwind', icon: 'tailwind', color: '#06B6D4', size: 88, cx: 75, cy: 85, delay: 1.0, duration: 7.2, rotateDuration: 11.6, pathY: [0, -12, 10, -7, 0], pathX: [0, 8, -9, 4, 0], rotate: [0, 3, -3, 2, 0] },
  { label: 'GraphQL', icon: 'graphql', color: '#E10098', size: 80, cx: 92, cy: 82, delay: 2.4, duration: 5.7, rotateDuration: 10.5, pathY: [0, 9, -11, 6, 0], pathX: [0, -11, 5, -7, 0], rotate: [0, -2, 2, -3, 0] },
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
    case 'mongodb':
      return (
        <svg {...s}>
          <path
            fill={color}
            d="M12 2.5c-3.5 2.5-5.5 6-5.5 10.5 0 4 2 7 5.5 9 3.5-2 5.5-5 5.5-9 0-4.5-2-8-5.5-10.5z"
          />
          <path fill={color} opacity="0.5" d="M12 5c-2 1.5-3 4-3 7 0 2.5 1 4.5 3 6 2-1.5 3-3.5 3-6 0-3-1-5.5-3-7z" />
        </svg>
      );
    case 'kubernetes':
      return (
        <svg {...s}>
          <path
            fill={color}
            d="M12 3l1.2 3.6h3.8l-3.1 2.2 1.2 3.6L12 10.2l-3.1 2.2 1.2-3.6-3.1-2.2h3.8L12 3z"
          />
          <circle cx="12" cy="12" r="8" fill="none" stroke={color} strokeWidth="1.2" />
          <path fill="none" stroke={color} strokeWidth="1" d="M12 8v8M8 12h8" />
        </svg>
      );
    case 'prisma':
      return (
        <svg {...s}>
          <path fill={color} d="M12 2L4 20h4.5l1-4h5l1 4H20L12 2zm0 6l2.5 6h-5L12 8z" />
        </svg>
      );
    case 'stripe':
      return (
        <svg {...s}>
          <path
            fill={color}
            d="M20 10.5c0-2.5-1.5-4.5-5.5-4.5-2 0-3.5.5-3.5 1.5 0 .8 1 1.2 2.5 1.5l1.5.3c3 .6 4.5 1.8 4.5 4.2 0 3-2.5 4.8-6.5 4.8-2 0-4-.3-5.5-1v-3.5c1.5 1 3.5 1.5 5.5 1.5 2 0 3-.5 3-1.5 0-.8-1-1.2-2.5-1.5l-1.5-.3c-3-.6-4.5-1.8-4.5-4.2z"
          />
        </svg>
      );
    case 'github':
      return (
        <svg {...s}>
          <path
            fill={color}
            d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.9 9.6.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.3-3.4-1.3-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.3-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1.1-2.7-.1-.3-.5-1.3.1-2.7 0 0 .9-.3 2.9 1.1.8-.2 1.7-.3 2.6-.3s1.8.1 2.6.3c2-1.4 2.9-1.1 2.9-1.1.6 1.4.2 2.4.1 2.7.7.7 1.1 1.6 1.1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7 1 .7 2v3c0 .3.2.6.7.5 4-1.3 6.9-5.1 6.9-9.6C22 6.6 17.5 2 12 2z"
          />
        </svg>
      );
    case 'langchain':
      return (
        <svg {...s}>
          <circle cx="6" cy="12" r="3" fill={color} />
          <circle cx="18" cy="12" r="3" fill={color} />
          <path fill="none" stroke={color} strokeWidth="1.5" d="M9 12h6" />
          <circle cx="12" cy="6" r="2" fill={color} opacity="0.7" />
          <circle cx="12" cy="18" r="2" fill={color} opacity="0.7" />
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
    <div className="absolute inset-0" aria-hidden="true">
      <div
        style={{
          position: 'absolute',
          inset: '0%',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse 90% 80% at 55% 35%, rgba(0,212,255,0.1) 0%, rgba(99,102,241,0.05) 45%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {BUBBLES.map((b) => {
        const isHover = hovered === b.label;
        const iconPx = b.size >= 88 ? 24 : b.size >= 82 ? 22 : 20;
        const fontSize = b.size >= 88 ? 10 : 9;

        return (
          <motion.div
            key={b.label}
            initial={{ opacity: 0, scale: 0.65 }}
            animate={
              reduced
                ? { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }
                : {
                    opacity: 1,
                    scale: isHover ? 1.08 : 1,
                    y: b.pathY,
                    x: b.pathX,
                    rotate: b.rotate,
                  }
            }
            transition={
              reduced
                ? { duration: 0.4, delay: 0.85 + b.delay }
                : {
                    opacity: { duration: 0.45, delay: 0.9 + b.delay * 0.3 },
                    scale: { duration: 0.22 },
                    y: {
                      duration: b.duration,
                      delay: b.delay,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                    x: {
                      duration: b.duration * 1.18,
                      delay: b.delay + 0.35,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                    rotate: {
                      duration: b.rotateDuration,
                      delay: b.delay + 0.5,
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

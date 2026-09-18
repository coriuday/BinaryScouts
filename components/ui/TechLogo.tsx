'use client';

import React from 'react';

export type TechLogoId =
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
  | 'kubernetes'
  | 'stripe'
  | 'github'
  | 'langchain'
  | 'whatsapp'
  | 'twilio';

/** Brand-accurate SVG marks used in the hero ticker (original inline paths). */
export function TechLogo({
  id,
  color,
  size = 18,
}: {
  id: TechLogoId;
  color: string;
  size?: number;
}) {
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
            d="M12 6a3 3 0 00-2.6 1.5 3 3 0 00-3.1 1.2A3 3 0 005 12a3 3 0 001.3 2.5 3 3 0 003.1 1.2A3 3 0 0012 17a3 3 0 002.6-1.3 3 3 0 003.1-1.2A3 3 0 0019 12a3 3 0 00-1.3-2.5 3 3 0 00-3.1-1.2A3 3 0 0012 6z"
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
            d="M7 15.5c1.5 1.1 3.7 1.8 5.8 1.8 2.4 0 4.5-.7 5.8-1.8.3-.2.6 0 .4.3-1.4 2-4.2 3.2-7.2 3.2-2.8 0-5.4-1.1-6.9-2.9-.2-.3.1-.5.4-.3z"
          />
          <path fill={color} d="M14 6l4 8h-2.2l-1.2-2.5H9.4L8.2 14H6l4-8h4zm-1.1 2.2L11 12h3.8l-1.9-3.8z" />
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
    case 'kubernetes':
      return (
        <svg {...s}>
          <path
            fill={color}
            d="M12 3l1.2 3.6h3.8l-3.1 2.2 1.2 3.6L12 10.2l-3.1 2.2 1.2-3.6-3.1-2.2h3.8L12 3z"
          />
          <circle cx="12" cy="12" r="8" fill="none" stroke={color} strokeWidth="1.2" />
        </svg>
      );
    case 'stripe':
      return (
        <svg {...s}>
          <path
            fill={color}
            d="M13.5 6c-2.8 0-4.6 1.4-4.6 3.7 0 3.6 5 3 5 4.5 0 .7-.7 1.1-1.8 1.1-1.5 0-2.8-.5-3.9-1.2v2.2c1.2.6 2.6.9 4 .9 2.9 0 4.9-1.4 4.9-3.7 0-3.9-5-3.2-5-4.5 0-.6.6-1 1.6-1 1.2 0 2.4.4 3.4 1V6.9C15.9 6.3 14.7 6 13.5 6z"
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
    case 'whatsapp':
      return (
        <svg {...s}>
          <path
            fill={color}
            d="M12 2a9.5 9.5 0 00-8.2 14.3L3 22l5.9-.8A9.5 9.5 0 1012 2zm0 1.7a7.8 7.8 0 015.6 13.3l-.3.3-3.5.5-2.4-1.3a7.7 7.7 0 01-3.6-.9l-.4-.2-3.5.5.5-3.4-.2-.4A7.8 7.8 0 0112 3.7zm-2.6 3.6c-.2 0-.5.1-.7.4-.2.3-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.6 4 3.5 2 .8 2.4.6 2.8.6.4 0 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-1.3-.6c-.1 0-.3 0-.4.1l-.6.7c-.1.1-.2.1-.4 0-.2-.1-.8-.3-1.5-.9-.5-.5-.9-1.1-1-1.3-.1-.2 0-.3.1-.4l.4-.5c.1-.1.1-.3.1-.4s0-.3-.1-.4l-1.2-2.8c-.1-.3-.3-.3-.4-.3z"
          />
        </svg>
      );
    case 'twilio':
      return (
        <svg {...s}>
          <circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="1.5" />
          <circle cx="9" cy="9" r="1.8" fill={color} />
          <circle cx="15" cy="9" r="1.8" fill={color} />
          <circle cx="9" cy="15" r="1.8" fill={color} />
          <circle cx="15" cy="15" r="1.8" fill={color} />
        </svg>
      );
    default:
      return null;
  }
}

export type TickerTech = {
  label: string;
  icon: TechLogoId;
  color: string;
};

export const TICKER_ROW_1: TickerTech[] = [
  { label: 'Next.js', icon: 'nextjs', color: '#FFFFFF' },
  { label: 'React', icon: 'react', color: '#61DAFB' },
  { label: 'TypeScript', icon: 'typescript', color: '#3178C6' },
  { label: 'WhatsApp', icon: 'whatsapp', color: '#25D366' },
  { label: 'OpenAI', icon: 'openai', color: '#10A37F' },
  { label: 'Rust', icon: 'rust', color: '#DEA584' },
  { label: 'Stripe', icon: 'stripe', color: '#635BFF' },
  { label: 'Supabase', icon: 'supabase', color: '#3ECF8E' },
  { label: 'Node.js', icon: 'nodejs', color: '#339933' },
  { label: 'Python', icon: 'python', color: '#3776AB' },
];

export const TICKER_ROW_2: TickerTech[] = [
  { label: 'LangChain', icon: 'langchain', color: '#41A688' },
  { label: 'Framer', icon: 'framer', color: '#0055FF' },
  { label: 'Docker', icon: 'docker', color: '#2496ED' },
  { label: 'Kubernetes', icon: 'kubernetes', color: '#326CE5' },
  { label: 'PostgreSQL', icon: 'postgresql', color: '#4169E1' },
  { label: 'Redis', icon: 'redis', color: '#DC382D' },
  { label: 'Vercel', icon: 'vercel', color: '#FFFFFF' },
  { label: 'Twilio', icon: 'twilio', color: '#F22F46' },
  { label: 'GitHub', icon: 'github', color: '#FFFFFF' },
  { label: 'Tailwind', icon: 'tailwind', color: '#06B6D4' },
];

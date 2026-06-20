import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './constants.tsx',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // ── Semantic theme tokens (CSS-variable backed) ──────────
        primary:        'var(--bg-primary)',
        secondary:      'var(--bg-secondary)',
        surface:        'var(--bg-tertiary)',
        canvas:         'var(--bg-canvas)',
        foreground:     'var(--text-primary)',
        'foreground-2': 'var(--text-secondary)',
        muted:          'var(--text-muted)',
        accent:         'var(--accent)',
        'accent-sub':   'var(--accent-light)',
        'bs-border':    'var(--border-default)',
        'bs-border-s':  'var(--border-subtle)',
        'bs-rose':      'var(--rose)',
        'bs-sage':      'var(--sage)',
        'bs-glass':     'var(--bg-glass)',
        // Backward compat
        'bs-cyan':      'var(--cyan)',

        // ── Brand violet palette ──────────────────────────────
        brand: {
          50:  '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },

        // ── Violet (main accent) ──────────────────────────────
        violet: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },

        // ── Rose (secondary accent) ──────────────────────────
        rose: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },

        // ── Sage (tertiary) ──────────────────────────────────
        sage: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },

        // ── Warm neutrals (canvas-matched) ───────────────────
        neutral: {
          0:   '#FFFFFF',
          50:  '#FDFCF9',
          100: '#FAF8F5',
          200: '#F5F0FF',
          300: '#EDE5FF',
          400: '#C4B5FD',
          500: '#9E9ABF',
          600: '#5B5780',
          700: '#3D3A60',
          800: '#1C1A2E',
          900: '#110E1E',
          950: '#070611',
        },
      },

      fontFamily: {
        sans:    ['var(--font-jakarta)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'JetBrains Mono', 'Consolas', 'monospace'],
      },

      backgroundImage: {
        // Atmospheric mesh gradients
        'mesh-light': [
          'radial-gradient(ellipse 80% 60% at 20% 10%, rgba(139,92,246,0.10) 0px, transparent 60%)',
          'radial-gradient(ellipse 60% 50% at 80% 80%, rgba(236,72,153,0.08) 0px, transparent 60%)',
          'radial-gradient(ellipse 50% 40% at 60% 50%, rgba(110,231,183,0.07) 0px, transparent 60%)',
        ].join(', '),
        'mesh-dark': [
          'radial-gradient(ellipse 80% 60% at 20% 10%, rgba(167,139,250,0.12) 0px, transparent 60%)',
          'radial-gradient(ellipse 60% 50% at 80% 80%, rgba(244,114,182,0.08) 0px, transparent 60%)',
          'radial-gradient(ellipse 50% 40% at 60% 50%, rgba(134,239,172,0.07) 0px, transparent 60%)',
        ].join(', '),
        // Brand gradients
        'brand-gradient':   'linear-gradient(135deg, #8B5CF6, #EC4899)',
        'brand-gradient-v': 'linear-gradient(180deg, #8B5CF6, #EC4899)',
        'dreamy-gradient':  'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 45%, #F9A8D4 100%)',
        'aurora-gradient':  'linear-gradient(135deg, #6EE7B7 0%, #8B5CF6 50%, #EC4899 100%)',
        'shine':            'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)',
      },

      animation: {
        'float':          'float 7s ease-in-out infinite',
        'float-slow':     'floatSlow 9s ease-in-out infinite',
        'float-drift':    'floatDrift 11s ease-in-out infinite',
        'shimmer':        'shimmer 2.5s linear infinite',
        'fade-up':        'fadeUp 0.6s ease-out both',
        'fade-in':        'fadeIn 0.4s ease-out both',
        'slide-in':       'slideIn 0.5s ease-out both',
        'dreamy-reveal':  'dreamyReveal 0.8s cubic-bezier(0.25,0.46,0.45,0.94) both',
        'glow-pulse':     'glowPulse 4s ease-in-out infinite',
        'soft-pulse':     'softPulse 3s ease-in-out infinite',
        'atmospheric':    'atmosphericFloat 12s ease-in-out infinite',
        'pulse-slow':     'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow':      'spin-slow 10s linear infinite',
        'orbit-a':        'orbitA 20s ease-in-out infinite',
        'orbit-b':        'orbitB 26s ease-in-out infinite',
        'blink':          'blink 1.2s ease-in-out infinite',
        'chip-float':     'chipFloat 5s ease-in-out infinite',
        'clip-reveal':    'clipReveal 0.6s cubic-bezier(0.22,1,0.36,1) both',
      },

      keyframes: {
        float:            { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        floatSlow:        { '0%, 100%': { transform: 'translateY(0) rotate(0deg)' }, '33%': { transform: 'translateY(-8px) rotate(0.8deg)' }, '66%': { transform: 'translateY(-4px) rotate(-0.5deg)' } },
        floatDrift:       { '0%, 100%': { transform: 'translate(0,0) rotate(0deg)' }, '40%': { transform: 'translate(4px,-10px) rotate(1deg)' }, '70%': { transform: 'translate(-2px,-6px) rotate(-0.5deg)' } },
        shimmer:          { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
        fadeUp:           { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:           { from: { opacity: '0' }, to: { opacity: '1' } },
        slideIn:          { from: { opacity: '0', transform: 'translateX(-20px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        dreamyReveal:     { from: { opacity: '0', transform: 'translateY(28px)', filter: 'blur(6px)' }, to: { opacity: '1', transform: 'translateY(0)', filter: 'blur(0px)' } },
        glowPulse:        { '0%, 100%': { opacity: '0.4', transform: 'scale(1)' }, '50%': { opacity: '0.9', transform: 'scale(1.06)' } },
        softPulse:        { '0%, 100%': { opacity: '0.6' }, '50%': { opacity: '1.0' } },
        atmosphericFloat: { '0%': { transform: 'translate(0,0) scale(1)' }, '25%': { transform: 'translate(3%,-4%) scale(1.05)' }, '50%': { transform: 'translate(-2%,3%) scale(0.97)' }, '75%': { transform: 'translate(4%,1%) scale(1.03)' }, '100%': { transform: 'translate(0,0) scale(1)' } },
        orbitA:           { '0%': { transform: 'translate(0,0) scale(1)' }, '33%': { transform: 'translate(5%,-6%) scale(1.06)' }, '66%': { transform: 'translate(-3%,4%) scale(0.96)' }, '100%': { transform: 'translate(0,0) scale(1)' } },
        orbitB:           { '0%': { transform: 'translate(0,0) scale(1)' }, '33%': { transform: 'translate(-6%,4%) scale(1.04)' }, '66%': { transform: 'translate(4%,-5%) scale(1.08)' }, '100%': { transform: 'translate(0,0) scale(1)' } },
        blink:            { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0' } },
        chipFloat:        { '0%, 100%': { transform: 'translateY(0) rotate(-0.5deg)' }, '50%': { transform: 'translateY(-8px) rotate(0.5deg)' } },
        clipReveal:       { from: { clipPath: 'inset(0 100% 0 0)' }, to: { clipPath: 'inset(0 0% 0 0)' } },
        'spin-slow':      { to: { transform: 'rotate(360deg)' } },
      },

      boxShadow: {
        'glass':          '0 8px 40px rgba(139,92,246,0.07), inset 0 1px 0 rgba(255,255,255,0.92)',
        'glass-dark':     '0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)',
        'brand':          '0 8px 32px rgba(139,92,246,0.26)',
        'brand-lg':       '0 16px 56px rgba(139,92,246,0.32)',
        'rose':           '0 8px 32px rgba(236,72,153,0.22)',
        'card':           '0 4px 32px rgba(28,26,46,0.05)',
        'card-hover':     '0 24px 80px rgba(139,92,246,0.14)',
        'glow-sm':        '0 0 20px rgba(139,92,246,0.28)',
        'glow':           '0 0 56px rgba(139,92,246,0.32)',
        'glow-lg':        '0 0 80px rgba(139,92,246,0.40)',
      },

      backdropBlur: {
        xs:     '4px',
        glass1: '60px',
        glass2: '24px',
        glass3: '12px',
      },

      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
};

export default config;

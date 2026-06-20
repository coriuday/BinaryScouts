'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ExternalLink, Github, Zap } from 'lucide-react';
import { type Project } from '@/lib/projects';
import { ease, dur } from '@/lib/motion';
import TiltCard from '@/components/motion/TiltCard';

function parseMetricValue(value: string): { num: number; prefix: string; suffix: string } {
  const match = value.match(/^([^0-9−-]*)([−-]?\d+\.?\d*)(.*)$/);
  if (!match) return { num: 0, prefix: '', suffix: value };
  return { prefix: match[1], num: Math.abs(parseFloat(match[2])), suffix: match[3] };
}

const CountUpMetric: React.FC<{ value: string; label: string }> = ({ value, label }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const { num, prefix, suffix } = parseMetricValue(value);
  const isNegative = value.includes('−') || value.includes('-');
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCurrent(Math.round(eased * num));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, num]);

  const display = isNegative ? `−${current}` : `${prefix}${current}${suffix}`;

  return (
    <div ref={ref} className="px-2.5 py-1.5 rounded-xl text-center"
      style={{ background: 'rgba(17,17,17,0.8)', border: '0.5px solid rgba(0,212,255,0.15)' }}>
      <p className="font-mono font-medium text-xs leading-none mb-0.5" style={{ color: '#00d4ff' }}>{display}</p>
      <p className="font-sans text-[9px] uppercase tracking-wider" style={{ color: '#555' }}>{label}</p>
    </div>
  );
};

const LiveTicker: React.FC = () => {
  const [tick, setTick] = useState(4821);
  const [ms, setMs] = useState(12);
  useEffect(() => {
    const t = setInterval(() => {
      setTick((n) => n + 1);
      setMs(Math.floor(Math.random() * 50 + 5));
    }, 3000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="mt-3 overflow-hidden h-4">
      <p className="font-mono text-[9px] whitespace-nowrap" style={{ color: '#555' }}>
        Lead #{tick.toLocaleString()} qualified · {ms}ms ago
      </p>
    </div>
  );
};

/* ── Status badge ────────────────────────────────────── */
const STATUS_CONFIG = {
  live:           { label: 'Live',        color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  'in-progress':  { label: 'In Progress', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  'coming-soon':  { label: 'Coming Soon', color: '#6B7280', bg: 'rgba(107,114,128,0.12)' },
} as const;

interface ProjectCardProps {
  project: Project;
  index?: number;
  featured?: boolean;
  showLiveTicker?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index = 0, featured = false, showLiveTicker = false }) => {
  const [hovered, setHovered] = useState(false);
  const spotRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const status = STATUS_CONFIG[project.status];

  /* Track mouse for spotlight effect */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    if (spotRef.current) {
      spotRef.current.style.setProperty('--spotlight-x', `${x}%`);
      spotRef.current.style.setProperty('--spotlight-y', `${y}%`);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: dur.medium, delay: index * 0.10, ease: ease.out }}
      style={{ willChange: 'transform, opacity' }}
    >
      <Link href={`/work/${project.slug}`} className="block group">
        <TiltCard
          className="rounded-2xl overflow-hidden flex flex-col relative"
          intensity={10}
          scale={1.015}
          style={{
            minHeight: featured ? 420 : 340,
            background: 'rgba(17,17,17,0.6)',
            backdropFilter: 'blur(12px)',
            border: '0.5px solid rgba(255,255,255,0.08)',
          }}
        >
          <div
            ref={cardRef}
            className="flex flex-col h-full"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onMouseMove={handleMouseMove}
          >
          {/* Spotlight layer */}
          <div ref={spotRef} className="card-spotlight" />

          {/* Gradient accent bar */}
          <div className="h-1.5 w-full flex-shrink-0" style={{ background: project.gradient }} />

          {/* Visual header */}
          <div
            className="relative overflow-hidden flex-shrink-0"
            style={{
              height: featured ? 200 : 140,
              background: project.gradient.replace('linear-gradient', 'linear-gradient').replace(/,\s*#/g, ', rgba(').replace(/#([A-Fa-f0-9]{6})/g, (m, hex) => {
                const r = parseInt(hex.slice(0, 2), 16);
                const g = parseInt(hex.slice(2, 4), 16);
                const b = parseInt(hex.slice(4, 6), 16);
                return `rgba(${r},${g},${b},0.10)`;
              }),
            }}
          >
            {/* Ambient orbs in header */}
            <div
              className="absolute w-40 h-40 rounded-full pointer-events-none"
              style={{
                background: project.gradient,
                opacity: 0.15,
                top: '-20%', right: '5%',
                filter: 'blur(32px)',
                animation: 'atmosphericFloat 9s ease-in-out infinite',
                willChange: 'transform',
              }}
            />
            <div
              className="absolute w-24 h-24 rounded-full pointer-events-none"
              style={{
                background: project.gradient,
                opacity: 0.10,
                bottom: '-10%', left: '10%',
                filter: 'blur(20px)',
                animation: 'atmosphericFloat 12s ease-in-out infinite reverse',
                willChange: 'transform',
              }}
            />

            {/* Category + status */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span
                className="px-3 py-1 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background: 'var(--glass-2)',
                  border: '1px solid var(--glass-border-2)',
                  color: 'var(--accent)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {project.category}
              </span>
              <span
                className="px-2.5 py-1 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                style={{ background: status.bg, color: status.color }}
              >
                {project.status === 'live' && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: status.color }} />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: status.color }} />
                  </span>
                )}
                {status.label}
              </span>
            </div>

            {/* Animated metric chips on hover */}
            <motion.div
              className="absolute bottom-4 right-4 flex gap-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: hovered ? 1 : 0.7, y: hovered ? 0 : 8 }}
              transition={{ duration: 0.25, ease: ease.out }}
            >
              {project.metrics.slice(0, 2).map((m) => (
                <CountUpMetric key={m.label} value={m.value} label={m.label} />
              ))}
            </motion.div>
          </div>

          {/* Body */}
          <div className="p-6 flex flex-col flex-1">
            {/* Tags */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {project.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full font-sans text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    background: 'var(--glass-1)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--glass-border-1)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Hook headline */}
            <div className="flex-1 mb-4">
              <h3
                className="font-display font-bold text-lg leading-snug mb-2.5 transition-transform duration-200 group-hover:translate-x-0.5"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
              >
                {project.hook}
              </h3>
              <p className="font-sans text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                {project.description}
              </p>
            </div>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {project.techStack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 rounded-full font-mono text-[10px]"
                  style={{
                    background: 'rgba(0,212,255,0.08)',
                    color: '#00d4ff',
                    border: '0.5px solid rgba(0,212,255,0.2)',
                  }}
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 4 && (
                <span className="px-2 py-1 rounded-lg font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  +{project.techStack.length - 4}
                </span>
              )}
            </div>

            {/* Footer row */}
            <div
              className="flex items-center justify-between pt-4"
              style={{ borderTop: '1px solid var(--glass-border-1)' }}
            >
              <div
                className="flex items-center gap-1.5 text-sm font-semibold transition-all duration-250 group-hover:gap-2.5"
                style={{ color: 'var(--accent)' }}
              >
                <Zap size={13} />
                <span>View Case Study</span>
                <ArrowRight
                  size={13}
                  className="transition-transform duration-200 -translate-x-1 group-hover:translate-x-0 opacity-0 group-hover:opacity-100"
                />
              </div>
              <div className="flex gap-2">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{
                      background: 'var(--glass-1)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--glass-border-1)',
                    }}
                    aria-label="GitHub"
                  >
                    <Github size={12} />
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{
                      background: 'var(--glass-1)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--glass-border-1)',
                    }}
                    aria-label="Live site"
                  >
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
            {showLiveTicker && project.status === 'live' && <LiveTicker />}
          </div>
          </div>
        </TiltCard>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;

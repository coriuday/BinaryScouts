'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ServiceCardVisualProps {
  type: string;
  hovered: boolean;
}

/* ── 01 AI Systems: neural network SVG ── */
function NeuralNetwork({ active }: { active: boolean }) {
  const nodes = [
    { x: 30, y: 50 }, { x: 70, y: 30 }, { x: 70, y: 70 },
    { x: 110, y: 40 }, { x: 110, y: 60 }, { x: 150, y: 50 },
  ];
  const edges = [[0,1],[0,2],[1,3],[1,4],[2,4],[2,3],[3,5],[4,5]];

  return (
    <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none opacity-40">
      <svg viewBox="0 0 180 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        {edges.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].x} y1={nodes[a].y}
            x2={nodes[b].x} y2={nodes[b].y}
            stroke="#00d4ff"
            strokeWidth="0.5"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: active ? 0.6 : 0.2 }}
            transition={{ duration: 0.4 }}
          />
        ))}
        {nodes.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.x} cy={n.y} r="4"
            fill="#00d4ff"
            animate={active ? { r: [4, 6, 4], opacity: [0.5, 1, 0.5] } : { r: 4, opacity: 0.4 }}
            transition={{ duration: 1.2, repeat: active ? Infinity : 0, delay: i * 0.15 }}
          />
        ))}
      </svg>
      {active && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-mono"
          style={{ background: 'rgba(0,212,255,0.1)', border: '0.5px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          3 models live
        </div>
      )}
    </div>
  );
}

/* ── 02 SaaS Dev: code editor ── */
const CODE_LINES = [
  { text: 'export async function deploy()', color: '#c678dd' },
  { text: '  const pipeline = await build()', color: '#61afef' },
  { text: '  return pipeline.scale(10)', color: '#98c379' },
];
const LANGS = ['TS', 'Rust', 'Python'];

function CodeEditor({ active }: { active: boolean }) {
  const [lines, setLines] = useState<string[]>(['', '', '']);
  const [langIdx, setLangIdx] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!active || reduced) return;
    setLines(['', '', '']);
    let lineIdx = 0;
    let charIdx = 0;
    const interval = setInterval(() => {
      if (lineIdx >= CODE_LINES.length) {
        clearInterval(interval);
        return;
      }
      const target = CODE_LINES[lineIdx].text;
      charIdx++;
      setLines((prev) => {
        const next = [...prev];
        next[lineIdx] = target.slice(0, charIdx);
        return next;
      });
      if (charIdx >= target.length) {
        lineIdx++;
        charIdx = 0;
      }
    }, 35);
    return () => clearInterval(interval);
  }, [active, reduced]);

  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setLangIdx((i) => (i + 1) % LANGS.length), 2000);
    return () => clearInterval(t);
  }, [active]);

  return (
    <div className="absolute inset-x-4 bottom-4 rounded-lg overflow-hidden pointer-events-none"
      style={{ background: 'rgba(6,6,6,0.8)', border: '0.5px solid rgba(0,212,255,0.15)' }}>
      <div className="flex items-center justify-between px-3 py-1.5"
        style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
        <div className="flex gap-1">
          {['#ff5f57','#febc2e','#28c840'].map((c) => (
            <span key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded"
          style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff' }}>
          {LANGS[langIdx]}
        </span>
      </div>
      <div className="p-3 font-mono text-[10px] leading-relaxed">
        {CODE_LINES.map((line, i) => (
          <div key={i} style={{ color: line.color }}>{lines[i]}<span className="animate-blink">|</span></div>
        ))}
      </div>
    </div>
  );
}

/* ── 03 CRM: lead funnel ── */
function LeadFunnel({ active }: { active: boolean }) {
  const stages = ['New Lead', 'Qualified', 'Closed'];
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setCount((c) => (c >= 240 ? 0 : c + 8)), 80);
    return () => clearInterval(t);
  }, [active]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-60">
      <p className="font-mono text-sm mb-3" style={{ color: '#00d4ff' }}>{count} leads/week</p>
      <div className="flex items-center gap-4">
        {stages.map((stage, i) => (
          <React.Fragment key={stage}>
            <div className="text-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1"
                style={{ border: '1px solid rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.05)' }}>
                {active && (
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{ background: ['#00d4ff','#7b00ff','#10b981'][i] }}
                    animate={{ x: [0, 20, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                  />
                )}
              </div>
              <span className="text-[8px] font-mono" style={{ color: '#666' }}>{stage}</span>
            </div>
            {i < 2 && <span style={{ color: '#333' }}>→</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ── 04 Growth: sparkline + badge ── */
function GrowthSparkline({ active }: { active: boolean }) {
  const points = [20, 35, 28, 50, 45, 70, 65, 90];
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    if (active) {
      const t = setTimeout(() => setShowBadge(true), 600);
      return () => clearTimeout(t);
    }
    setShowBadge(false);
  }, [active]);

  return (
    <div className="absolute inset-x-6 bottom-6 pointer-events-none">
      <svg viewBox="0 0 200 60" className="w-full h-16">
        <motion.polyline
          fill="none"
          stroke="#00d4ff"
          strokeWidth="2"
          points={points.map((p, i) => `${i * 28},${60 - p * 0.55}`).join(' ')}
          initial={{ pathLength: 0, opacity: 0.3 }}
          animate={{ pathLength: active ? 1 : 0.3, opacity: active ? 1 : 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <AnimatePresence>
        {showBadge && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 20 }}
            className="absolute -top-2 right-0 px-2 py-0.5 rounded-full font-mono text-xs font-bold"
            style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '0.5px solid rgba(16,185,129,0.3)' }}
          >
            +127%
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── 05 Enterprise Dashboards: mini dashboard ── */
function MiniDashboard({ active }: { active: boolean }) {
  const bars = [40, 65, 50, 80, 70, 95];
  return (
    <div className="absolute inset-4 rounded-lg pointer-events-none overflow-hidden"
      style={{ background: 'rgba(6,6,6,0.7)', border: '0.5px solid rgba(0,212,255,0.1)' }}>
      <div className="p-3 grid grid-cols-3 gap-2 h-full">
        <div className="col-span-2 flex items-end gap-1">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t"
              style={{ background: i === bars.length - 1 ? '#00d4ff' : 'rgba(0,212,255,0.2)' }}
              initial={{ height: '20%' }}
              animate={{ height: active ? `${h}%` : '20%' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            />
          ))}
        </div>
        <div className="flex items-center justify-center">
          <svg viewBox="0 0 40 40" className="w-10 h-10">
            <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
            <motion.circle
              cx="20" cy="20" r="16" fill="none" stroke="#00d4ff" strokeWidth="4"
              strokeDasharray="100" strokeDashoffset="30"
              initial={{ strokeDashoffset: 100 }}
              animate={{ strokeDashoffset: active ? 30 : 100 }}
              transition={{ duration: 0.8 }}
              transform="rotate(-90 20 20)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ── 06 Infrastructure: 3-region map ── */
const REGIONS = [
  { name: 'Mumbai', x: 35, y: 55, latency: 12 },
  { name: 'Singapore', x: 65, y: 60, latency: 8 },
  { name: 'Frankfurt', x: 48, y: 30, latency: 15 },
];

function RegionMap({ active }: { active: boolean }) {
  const [latencies, setLatencies] = useState(REGIONS.map((r) => r.latency));

  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => {
      setLatencies(REGIONS.map((r) => r.latency + Math.floor(Math.random() * 6 - 3)));
    }, 1200);
    return () => clearInterval(t);
  }, [active]);

  return (
    <div className="absolute inset-0 pointer-events-none opacity-70">
      <svg viewBox="0 0 100 70" className="w-full h-full">
        {REGIONS.map((r, i) => (
          <React.Fragment key={r.name}>
            {active && i > 0 && (
              <motion.line
                x1={REGIONS[i-1].x} y1={REGIONS[i-1].y}
                x2={r.x} y2={r.y}
                stroke="rgba(0,212,255,0.2)" strokeWidth="0.5"
                strokeDasharray="2 2"
                animate={{ strokeDashoffset: [0, -10] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
            <motion.circle
              cx={r.x} cy={r.y} r="3"
              fill="#00d4ff"
              animate={active ? { opacity: [0.4, 1, 0.4] } : {}}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
            />
            {active && (
              <motion.circle
                cx={r.x} cy={r.y} r="6"
                fill="none" stroke="#00d4ff" strokeWidth="0.5"
                animate={{ r: [3, 10], opacity: [0.6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
              />
            )}
          </React.Fragment>
        ))}
      </svg>
      <div className="absolute bottom-3 left-3 right-3 flex justify-between">
        {REGIONS.map((r, i) => (
          <span key={r.name} className="text-[8px] font-mono" style={{ color: '#666' }}>
            {r.name} <span style={{ color: '#00d4ff' }}>{latencies[i]}ms</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ServiceCardVisual({ type, hovered }: ServiceCardVisualProps) {
  switch (type) {
    case 'ai-systems': return <NeuralNetwork active={hovered} />;
    case 'saas-dev': return <CodeEditor active={hovered} />;
    case 'crm': return <LeadFunnel active={hovered} />;
    case 'growth': return <GrowthSparkline active={hovered} />;
    case 'dashboards': return <MiniDashboard active={hovered} />;
    case 'infrastructure': return <RegionMap active={hovered} />;
    default: return null;
  }
}

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAudio } from '@/components/hooks/AudioProvider';
import { Shield, Users, Terminal, Award, Eye, Code, Zap } from 'lucide-react';

interface Operator {
  codeName: string;
  role: string;
  status: string;
  signatureWeapon: string;
  intel: string;
  stats: { label: string; value: number }[];
}

const CREW: Operator[] = [
  {
    codeName: 'AGENT GREEN',
    role: 'Lead System Architect & Intruder',
    status: 'ACTIVE',
    signatureWeapon: 'Rust Gateway, Axum Router',
    intel: 'Specializes in low-latency infrastructure design, server-side code optimization, and sandbox deployment sequences. Known for keeping pipelines locked down.',
    stats: [
      { label: 'Infiltration Speed', value: 95 },
      { label: 'Integrity Rating', value: 98 },
      { label: 'Coffee Intake', value: 85 }
    ]
  },
  {
    codeName: 'AGENT ORANGE',
    role: 'PPC Commander & Ad Hijacker',
    status: 'ACTIVE',
    signatureWeapon: 'Halftone bidding scripts, SEM proxies',
    intel: 'Master of search algorithms and bid optimization pipelines. Hijacks traffic flows to route targets to client conversion paths. ROI is his primary metric.',
    stats: [
      { label: 'Infiltration Speed', value: 90 },
      { label: 'Integrity Rating', value: 88 },
      { label: 'Coffee Intake', value: 92 }
    ]
  },
  {
    codeName: 'AGENT BLUE',
    role: 'CRM Automation Sentry',
    status: 'ACTIVE',
    signatureWeapon: 'PostgreSQL queues, WhatsApp APIs',
    intel: 'Engineers leads railroads and cron webhooks that connect targets with operators. Completely replaces manual workflows with secure automated triggers.',
    stats: [
      { label: 'Infiltration Speed', value: 92 },
      { label: 'Integrity Rating', value: 96 },
      { label: 'Coffee Intake', value: 78 }
    ]
  }
];

export default function AboutPage() {
  const { playClick, playHover, playSuccess } = useAudio();
  const [activeOperator, setActiveOperator] = useState<Operator | null>(null);

  const handleOperatorClick = (op: Operator) => {
    playSuccess();
    setActiveOperator(activeOperator?.codeName === op.codeName ? null : op);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gx-black text-white font-sans selection:bg-gx-green selection:text-gx-black flex flex-col justify-between"
    >
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-4 max-w-7xl mx-auto w-full relative z-10">
        <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px] opacity-[0.02] pointer-events-none z-0" />

        {/* Page Title */}
        <div className="mb-16 border-b-4 border-gx-green pb-6 text-left">
          <span className="block text-gx-green font-display font-bold tracking-[0.2em] uppercase mb-2">
            WHO WE ARE
          </span>
          <h1 className="font-display font-bold text-5xl md:text-7xl uppercase tracking-tighter text-white leading-none">
            CREW PROTOCOL
          </h1>
        </div>

        {/* Manifesto Section */}
        <section id="manifesto" className="mb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left font-mono text-sm leading-relaxed text-gray-300">
            <h2 className="font-display font-bold text-3xl uppercase tracking-wider text-gx-orange mb-4">
              GLORYX OPERATIONAL MANIFESTO
            </h2>
            <div className="border-l-4 border-gx-green pl-6 space-y-4 text-base italic text-white/90">
              <p>
                &quot;We don&apos;t build cookie-cutter landing pages or simple newsletters. We construct high-grade digital arsenals that hijack market share.&quot;
              </p>
            </div>
            <p>
              In a digital matrix cluttered with generic agency models, GloryX operates as an elite strike squad. We combine raw creative branding, high-octane video cinematic engines, and robust code architectures.
            </p>
            <p>
              By leveraging next-generation languages like Rust, high-speed microservices in Python, and seamless Next.js server actions, we develop systems that load in bullet-time and scale without friction.
            </p>
          </div>
          <div className="lg:col-span-5 bg-gx-dark border-2 border-white/5 p-8 relative clip-corner flex flex-col justify-between min-h-[300px]">
            <div className="flex justify-between items-start mb-6">
              <Shield className="w-12 h-12 text-gx-green" />
              <span className="text-gray-600 text-3xs font-mono font-bold uppercase">SYSTEM DIRECTORY v2.5</span>
            </div>
            <div>
              <h3 className="font-display font-bold text-xl uppercase tracking-wider text-white mb-2">OPERATIONAL METRICS</h3>
              <ul className="space-y-2 text-2xs font-mono text-gray-400">
                <li className="flex justify-between border-b border-white/5 pb-1"><span>Target Retention:</span> <span className="text-gx-green font-bold">100% SECURE</span></li>
                <li className="flex justify-between border-b border-white/5 pb-1"><span>Average Load Speed:</span> <span className="text-gx-green font-bold">&lt; 0.4s</span></li>
                <li className="flex justify-between"><span>Active Missions:</span> <span className="text-gx-orange font-bold">12 SIMULTANEOUS</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Crew / Operators Grid */}
        <section className="mb-20">
          <h2 className="font-display font-bold text-4xl uppercase tracking-tighter text-white mb-8 border-b border-gx-orange/30 pb-4 text-left">
            ACTIVE SYSTEM OPERATORS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CREW.map((op) => {
              const isActive = activeOperator?.codeName === op.codeName;
              return (
                <div
                  key={op.codeName}
                  onClick={() => handleOperatorClick(op)}
                  onMouseEnter={playHover}
                  className={`border cursor-pointer transition-all duration-300 p-6 flex flex-col justify-between text-left select-none relative group clip-corner ${
                    isActive
                      ? 'border-gx-green bg-gx-green/5 shadow-[0_0_20px_rgba(121,192,67,0.15)]'
                      : 'border-white/5 bg-gx-dark hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-500 font-mono text-3xs uppercase font-bold tracking-widest">
                        AGENT DOSSIER
                      </span>
                      <span className={`px-2 py-0.5 font-mono text-3xs font-bold uppercase rounded ${
                        op.status === 'ACTIVE' ? 'bg-gx-green/10 text-gx-green border border-gx-green/20' : 'bg-gx-orange/10 text-gx-orange'
                      }`}>
                        {op.status}
                      </span>
                    </div>

                    <h3 className={`font-display font-bold text-3xl tracking-tight transition-colors ${isActive ? 'text-gx-green' : 'text-white group-hover:text-gx-green'}`}>
                      {op.codeName}
                    </h3>
                    <p className="text-gray-400 font-mono text-2xs uppercase font-bold mt-1 mb-4">
                      {op.role}
                    </p>

                    <div className="font-mono text-xs text-gray-300 space-y-4 mt-6">
                      <div className="bg-gx-black/40 p-3 border border-white/5">
                        <span className="block text-gray-500 text-3xs uppercase font-bold mb-1">SIGNATURE WEAPON</span>
                        <span className="text-white font-bold text-2xs">{op.signatureWeapon}</span>
                      </div>
                      <p className="leading-relaxed text-gray-400 text-2xs">{op.intel}</p>
                    </div>
                  </div>

                  {/* Expandable Agent Stats */}
                  <div className="mt-8 pt-4 border-t border-white/5 font-mono text-3xs">
                    {isActive ? (
                      <div className="space-y-3">
                        {op.stats.map((st) => (
                          <div key={st.label}>
                            <div className="flex justify-between text-gray-400 font-bold mb-1">
                              <span>{st.label.toUpperCase()}</span>
                              <span className="text-white">{st.value}%</span>
                            </div>
                            <div className="w-full bg-gx-black h-1.5 border border-white/5">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${st.value}%` }}
                                className="bg-gx-green h-full"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gx-green font-bold group-hover:translate-x-2 transition-transform inline-block">
                        EXAMINE OPERATOR STATS &gt;&gt;
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Press / Core Values Section */}
        <section id="press" className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="bg-gx-dark border border-white/5 p-8 clip-corner flex flex-col justify-between font-mono">
            <h3 className="font-display font-bold text-xl uppercase tracking-wider text-gx-green mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-gx-green" />
              <span>TRANSMISSION ARCHIVE (PRESS)</span>
            </h3>
            <div className="space-y-4 text-xs text-gray-400 leading-relaxed">
              <p>
                <strong className="text-white uppercase">[2025.10] DIGITAL FORBES DIAL:</strong> &quot;GloryX breaks conventions by integrating terminal interfaces into CRM flows, yielding record retention ratings for early enterprise target portfolios.&quot;
              </p>
              <p>
                <strong className="text-white uppercase">[2024.12] CYBER TECH DIGEST:</strong> &quot;The Axum Rust gateway deployed by GloryX handles high-velocity data vaults safely without the latency bloat of typical CRM configurations.&quot;
              </p>
            </div>
          </div>

          <div className="bg-gx-dark border border-white/5 p-8 clip-corner flex flex-col justify-between font-mono">
            <h3 className="font-display font-bold text-xl uppercase tracking-wider text-gx-orange mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-gx-orange" />
              <span>CORE DRILL PROTOCOLS</span>
            </h3>
            <div className="space-y-3 text-xs text-gray-400">
              <div className="flex gap-3">
                <Code className="w-5 h-5 text-gx-green flex-shrink-0" />
                <p><strong>PURE CODE EXECUTION:</strong> No bloated site builders or visual drag-and-drops. We write clean, compiled, high-efficiency systems.</p>
              </div>
              <div className="flex gap-3">
                <Zap className="w-5 h-5 text-gx-green flex-shrink-0" />
                <p><strong>SPEED DEPLOYMENT:</strong> Every milliseconds shaved off increases client conversion thresholds. High performance is non-negotiable.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </motion.div>
  );
}

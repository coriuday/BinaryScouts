'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAudio } from '@/components/hooks/AudioProvider';
import { Briefcase, Send, Terminal, Check } from 'lucide-react';

interface JobPosition {
  title: string;
  department: string;
  location: string;
  clearance: string;
  briefing: string;
}

const MISSIONS: JobPosition[] = [
  {
    title: 'Frontend UI Infiltrator',
    department: 'STEALTH OPS (REACT/NEXT.JS)',
    location: 'REMOTE // ENCRYPTED LINK',
    clearance: 'LEVEL 3 CLEARANCE',
    briefing: 'Responsible for building lightweight Next.js interfaces that render in bullet time. Must possess expert level familiarity with Framer Motion, HSL tailored themes, and interactive CRT monitors graphics.'
  },
  {
    title: 'Rust Backend Gateway Specialist',
    department: 'VAULT INFRASTRUCTURE',
    location: 'REMOTE // CHRONOS SERVER',
    clearance: 'LEVEL 5 SYSADMIN',
    briefing: 'Design low-latency API routers with Axum, manage secure thread concurrency, and audit local JSON vaults logging pipelines. Cryptographic security experience is a significant asset.'
  },
  {
    title: 'AI System Calibrator',
    department: 'FASTAPI INTEL DIVISION',
    location: 'HYBRID // SHADOW DIVISION',
    clearance: 'LEVEL 4 CLEARANCE',
    briefing: 'Fine-tune systems instructions for LLM integrations via FastAPI routing. Build offline sandboxed fallback heuristics and structured prompt compilation algorithms.'
  }
];

export default function CareersPage() {
  const { playClick, playHover, playSuccess } = useAudio();
  const [selectedMission, setSelectedMission] = useState<JobPosition | null>(null);
  const [form, setForm] = useState({ codeName: '', specialty: '', briefingDoc: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleApplyClick = (mission: JobPosition) => {
    playClick();
    setSelectedMission(mission);
    setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.codeName || !form.specialty) return;
    
    playSuccess();
    setSubmitted(true);
    setForm({ codeName: '', specialty: '', briefingDoc: '' });
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
        <div className="mb-12 border-b-4 border-gx-blue pb-6 text-left">
          <span className="block text-gx-green font-display font-bold tracking-[0.2em] uppercase mb-2">
            RECRUITING ACTIVE AGENTS
          </span>
          <h1 className="font-display font-bold text-5xl md:text-7xl uppercase tracking-tighter text-white leading-none">
            OPEN MISSIONS
          </h1>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* Mission list */}
          <div className="lg:col-span-7 space-y-6">
            {MISSIONS.map((m) => (
              <div
                key={m.title}
                onClick={() => handleApplyClick(m)}
                onMouseEnter={playHover}
                className={`border cursor-pointer transition-all duration-300 p-6 clip-corner ${
                  selectedMission?.title === m.title
                    ? 'border-gx-green bg-gx-green/5 shadow-[0_0_20px_rgba(121,192,67,0.15)]'
                    : 'border-white/5 bg-gx-dark hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-start mb-3 font-mono text-3xs font-bold text-gray-500 uppercase">
                  <span>{m.department}</span>
                  <span className="text-gx-orange">{m.clearance}</span>
                </div>

                <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-white group-hover:text-gx-green">
                  {m.title}
                </h3>
                <p className="text-gray-400 font-mono text-3xs uppercase font-bold mt-0.5 mb-4">
                  LOCATION: {m.location}
                </p>

                <p className="font-mono text-2xs text-gray-400 leading-relaxed border-l-2 border-white/10 pl-4">
                  {m.briefing}
                </p>

                <div className="mt-4 pt-3 border-t border-white/5 flex justify-end font-mono text-3xs text-gx-green font-bold uppercase">
                  <span>INFILTRATE MISSION &gt;&gt;</span>
                </div>
              </div>
            ))}
          </div>

          {/* Submission Form panel */}
          <div className="lg:col-span-5">
            <div className="bg-gx-dark border-2 border-white/10 p-6 md:p-8 clip-corner shadow-[0_0_30px_rgba(0,0,0,0.5)] font-mono text-xs min-h-[450px] flex flex-col justify-between">
              {selectedMission ? (
                submitted ? (
                  <div className="flex-grow flex flex-col items-center justify-center text-center p-6 space-y-4 animate-fade-in text-gx-green">
                    <Check className="w-16 h-16 animate-bounce" />
                    <h3 className="font-display font-bold text-2xl uppercase text-white">DOSSIER COMMITTED</h3>
                    <p className="text-2xs leading-relaxed uppercase text-gray-400">
                      Operator data logged successfully. Security signals dispatched to Sysadmin. We will establish communication if parameters match.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="border-b border-white/5 pb-4">
                      <span className="text-gx-orange text-3xs font-bold uppercase tracking-widest">TRANSMIT DOSSIER REQUST</span>
                      <h3 className="font-display font-bold text-xl text-white uppercase mt-1 leading-tight">{selectedMission.title}</h3>
                      <p className="text-gray-500 text-3xs font-bold uppercase mt-0.5">{selectedMission.clearance}</p>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-gray-500 text-3xs uppercase font-bold">OPERATOR CODENAME</label>
                      <input
                        type="text"
                        required
                        value={form.codeName}
                        onChange={(e) => setForm({ ...form, codeName: e.target.value })}
                        placeholder="E.G. AGENT SYNERGY"
                        className="w-full bg-gx-black border border-white/10 p-3 text-2xs focus:outline-none focus:border-gx-green uppercase text-white placeholder-gray-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-gray-500 text-3xs uppercase font-bold">PRIMARY SPECIALTY</label>
                      <input
                        type="text"
                        required
                        value={form.specialty}
                        onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                        placeholder="E.G. RUST GATEWAYS // TAILWIND SHADERS"
                        className="w-full bg-gx-black border border-white/10 p-3 text-2xs focus:outline-none focus:border-gx-green uppercase text-white placeholder-gray-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-gray-500 text-3xs uppercase font-bold">INTEL DOSSIER (PAST PROJECTS / PROFILE)</label>
                      <textarea
                        rows={4}
                        value={form.briefingDoc}
                        onChange={(e) => setForm({ ...form, briefingDoc: e.target.value })}
                        placeholder="PASTE INTEL / DETAILS..."
                        className="w-full bg-gx-black border border-white/10 p-3 text-2xs focus:outline-none focus:border-gx-green uppercase text-white placeholder-gray-800 font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      onMouseEnter={playHover}
                      className="w-full bg-gx-green hover:bg-white text-gx-black font-display font-bold uppercase py-3 transition-colors clip-corner text-sm flex items-center justify-center gap-2"
                    >
                      <Send size={14} />
                      <span>TRANSMIT APPLICATION</span>
                    </button>
                  </form>
                )
              ) : (
                <div className="flex flex-col items-center justify-center text-center flex-grow text-gray-500 p-8 space-y-4">
                  <Briefcase className="w-16 h-16 text-gray-700 animate-pulse" />
                  <p className="text-2xs font-bold uppercase tracking-widest">
                    SELECT A OPEN MISSION BRIEFING ON THE LEFT PORTAL TO SUBMIT YOUR INFILTRATOR DOSSIER.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </motion.div>
  );
}

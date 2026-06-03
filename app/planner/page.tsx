'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAudio } from '@/components/AudioProvider';
import { Target, Cpu, User, Play, AlertCircle, ArrowLeft, ArrowRight, Printer, CheckCircle } from 'lucide-react';

interface PlannerService {
  id: string;
  name: string;
  minPrice: number;
  description: string;
  accent: 'green' | 'orange' | 'blue';
}

const PLANNER_SERVICES: PlannerService[] = [
  { id: 'marketing', name: 'Digital Marketing Campaign', minPrice: 5000, description: 'Aggressive data-backed user acquisition and scaling.', accent: 'green' },
  { id: 'automation', name: 'Lead Flow Automation (CRM)', minPrice: 8000, description: 'Integrate CRM automation, auto-comms and WhatsApp flows.', accent: 'orange' },
  { id: 'seo', name: 'SEO Engine Conquest', minPrice: 3000, description: 'Aggressive ranking and competitor traffic displacement.', accent: 'blue' },
  { id: 'video', name: 'Cinematic Video Production', minPrice: 7000, description: 'High-production motion graphics and video storytelling.', accent: 'green' },
  { id: 'outreach', name: 'LinkedIn / B2B Autopilot', minPrice: 4000, description: 'B2B lead generation and outreach sequences on autopilot.', accent: 'orange' }
];

export default function PlannerPage() {
  const { playClick, playHover, playSuccess, playError } = useAudio();
  const [step, setStep] = useState(1);
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [budget, setBudget] = useState(15000);
  const [timeline, setTimeline] = useState('3 Months');
  const [intel, setIntel] = useState({
    codeName: '',
    corporation: '',
    email: '',
    channel: '',
    brief: ''
  });
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);
  const [showDossier, setShowDossier] = useState(false);

  // Hacking Minigame state variables
  const [isHacking, setIsHacking] = useState(false);
  const [hackedCount, setHackedCount] = useState(0);
  const [activeHackingNode, setActiveHackingNode] = useState(0);
  const [hackingTimer, setHackingTimer] = useState(15);
  const [hackLog, setHackLog] = useState<string[]>([]);
  const hackingNodes = ['A7', 'BC', '09', 'F2', 'D8', 'E6', '3A', 'B5', '7C', 'A1', 'E9', '2B', 'C6', '9E', 'FF', '1A'];

  // Hacking timer countdown loop
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (isHacking && hackingTimer > 0) {
      timerId = setTimeout(() => {
        setHackingTimer((prev) => prev - 1);
      }, 1000);
    } else if (isHacking && hackingTimer === 0) {
      playError();
      setHackedCount(0);
      setHackingTimer(15);
      setActiveHackingNode(Math.floor(Math.random() * 16));
      setHackLog((prev) => [
        ...prev,
        '[WARN] TRACE ATTEMPT DETECTED. ENCRYPTOR ROTATED SECURE KEYS. RETRY...'
      ]);
    }
    return () => clearTimeout(timerId);
  }, [isHacking, hackingTimer, playError]);

  const toggleTarget = (id: string) => {
    playClick();
    setSelectedTargets((prev) => {
      if (prev.includes(id)) {
        return prev.filter((t) => t !== id);
      } else {
        const updated = [...prev, id];
        // Auto-scale budget if it is below the minimum required price of selected options
        const minRequired = updated.reduce((sum, currentId) => {
          const service = PLANNER_SERVICES.find((s) => s.id === currentId);
          return sum + (service ? service.minPrice : 0);
        }, 0);
        if (budget < minRequired) {
          setBudget(minRequired + 2000);
        }
        return updated;
      }
    });
  };

  const handleNextStep = () => {
    if (step === 1 && selectedTargets.length === 0) {
      playError();
      alert('WARNING: SELECT AT LEAST ONE TARGET TO CONTINUE.');
      return;
    }
    if (step === 3 && (!intel.codeName || !intel.email)) {
      playError();
      alert('WARNING: OPERATOR CODE NAME AND SECURE CHANNEL ARE REQUIRED.');
      return;
    }
    playClick();
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    playClick();
    setStep((prev) => prev - 1);
  };

  // Launch intrusion minigame
  const executeHeist = () => {
    playSuccess();
    setIsHacking(true);
    setHackedCount(0);
    setHackingTimer(15);
    setActiveHackingNode(Math.floor(Math.random() * 16));
    setHackLog([
      '[SYSTEM] SECURITY FIREWALL DEPLOYED BY TARGET.',
      '[SYSTEM] BYPASS 3 SECURITY ENCRYPTION NODES TO OVERRIDE.'
    ]);
  };

  // Handle active nodes checking
  const handleNodeClick = (index: number) => {
    if (!isHacking) return;
    
    if (index === activeHackingNode) {
      const nextCount = hackedCount + 1;
      setHackedCount(nextCount);
      playSuccess();
      
      if (nextCount >= 3) {
        setIsHacking(false);
        setIsCompiling(true);
        setHackLog([]);
        
        let current = 0;
        const interval = setInterval(() => {
          current += Math.floor(Math.random() * 15) + 5;
          if (current >= 100) {
            current = 100;
            clearInterval(interval);
            setTimeout(() => {
              setIsCompiling(false);
              setShowDossier(true);
              playSuccess();
            }, 600);
          }
          setCompileProgress(current);
        }, 150);
      } else {
        let nextNode = Math.floor(Math.random() * 16);
        while (nextNode === activeHackingNode) {
          nextNode = Math.floor(Math.random() * 16);
        }
        setActiveHackingNode(nextNode);
        setHackLog((prev) => [
          ...prev,
          `[SUCCESS] SECURITY NODE BYPASSED (${nextCount}/3). ROTATING CODES...`
        ]);
      }
    } else {
      playError();
      setHackingTimer((prev) => Math.max(0, prev - 3));
      setHackLog((prev) => [
        ...prev,
        `[ALERT] SECURITY THREAT TRACED. SHIELD PENALTY DETECTED (-3 SECONDS).`
      ]);
    }
  };

  // Skip hacking minigame
  const forceBypass = () => {
    playSuccess();
    setIsHacking(false);
    setIsCompiling(true);
    setHackLog([]);
    
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 5;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsCompiling(false);
          setShowDossier(true);
          playSuccess();
        }, 600);
      }
      setCompileProgress(current);
    }, 150);
  };

  const calculatedMinRequired = selectedTargets.reduce((sum, currentId) => {
    const service = PLANNER_SERVICES.find((s) => s.id === currentId);
    return sum + (service ? service.minPrice : 0);
  }, 0);

  const handlePrint = () => {
    playClick();
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen bg-gx-black text-white font-sans selection:bg-gx-green selection:text-gx-black flex flex-col justify-between"
    >
      {/* Glitch sweep animation */}
      <motion.div
        initial={{ top: '0%' }}
        animate={{ top: '100%' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="fixed left-0 right-0 h-12 bg-gradient-to-b from-transparent via-gx-green/20 to-transparent pointer-events-none z-[100] shadow-[0_0_10px_#79c043]"
      />

      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-4 max-w-5xl mx-auto w-full relative z-10">
        
        {/* Background Grids */}
        <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px] opacity-[0.03] pointer-events-none z-0" />

        {/* Retro Intrusion Hacking Minigame */}
        {isHacking && (
          <div className="fixed inset-0 bg-gx-black/98 z-[100] flex flex-col items-center justify-center p-6 crt-screen crt-flicker">
            <div className="border-2 border-gx-orange bg-gx-dark p-6 md:p-10 max-w-md w-full relative clip-corner shadow-[0_0_40px_rgba(245,130,32,0.3)]">
              
              {/* Alert Header */}
              <div className="text-center mb-6">
                <span className="bg-gx-orange text-gx-black font-mono text-[9px] uppercase tracking-widest px-3 py-1 font-bold">
                  WARNING: INTRUSION SECURITY FIREWALL ACTIVE
                </span>
                <h2 className="font-display font-bold text-3xl md:text-4xl text-white uppercase tracking-tighter mt-3 leading-none">
                  Firewall Bypass
                </h2>
                <p className="text-gray-400 font-mono text-[10px] mt-2 uppercase">
                  Deactivate 3 Encryption Shards to secure transmission.
                </p>
              </div>

              {/* Hacking Stats Dashboard */}
              <div className="grid grid-cols-2 gap-4 mb-6 font-mono text-xs">
                <div className="bg-gx-black border border-gx-gray p-3 flex flex-col justify-center items-center">
                  <span className="text-gray-500 text-[9px] uppercase tracking-wider mb-1">BYPASS STATUS</span>
                  <span className="text-sm font-display font-bold text-gx-green">
                    {hackedCount} / 3 SHARDS
                  </span>
                </div>
                <div className="bg-gx-black border border-gx-gray p-3 flex flex-col justify-center items-center">
                  <span className="text-gray-500 text-[9px] uppercase tracking-wider mb-1">COOLDOWN TIMER</span>
                  <span className={`text-sm font-display font-bold ${hackingTimer < 5 ? 'text-red-500 animate-pulse' : 'text-gx-orange'}`}>
                    {hackingTimer} SECONDS
                  </span>
                </div>
              </div>

              {/* Grid of Nodes */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {hackingNodes.map((node, index) => {
                  const isActive = index === activeHackingNode;
                  return (
                    <button
                      key={index}
                      onClick={() => handleNodeClick(index)}
                      onMouseEnter={playHover}
                      className={`h-12 border font-mono font-bold uppercase transition-all flex items-center justify-center relative group text-xs ${
                        isActive
                          ? 'border-gx-orange bg-gx-orange/15 text-gx-orange animate-pulse shadow-[0_0_10px_rgba(245,130,32,0.4)]'
                          : 'border-white/10 bg-gx-black/40 hover:border-white/40 text-gray-400'
                      }`}
                    >
                      {node}
                      {isActive && (
                        <span className="absolute inset-0 border border-gx-orange animate-ping pointer-events-none opacity-50" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Intrusion Log Output Buffer */}
              <div className="bg-gx-black border border-gx-gray p-3 h-28 overflow-y-auto mb-6 text-gx-orange font-mono text-[9px] text-left space-y-1 select-none">
                {hackLog.map((log, i) => (
                  <div key={i} className="flex gap-1.5 leading-normal">
                    <span className="text-gx-orange/60">&gt;&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>

              {/* Actions: Admin Bypass */}
              <div className="flex gap-4">
                <button
                  onClick={forceBypass}
                  onMouseEnter={playHover}
                  className="w-full py-3 border border-red-500/20 hover:border-red-500 bg-transparent text-red-500/80 hover:text-red-500 font-display font-bold uppercase text-[10px] transition-colors clip-corner"
                >
                  Admin Force Bypass [OVERRIDE]
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Matrix-style Loader for execution */}
        {isCompiling && (
          <div className="fixed inset-0 bg-gx-black/95 z-[100] flex flex-col items-center justify-center p-6 crt-screen crt-flicker">
            <div className="text-center max-w-md w-full">
              <h2 className="font-display text-gx-green text-4xl md:text-5xl uppercase tracking-tighter mb-4 animate-pulse">
                COMPILING HEIST PLAN
              </h2>
              <div className="bg-gx-dark border border-gx-gray p-4 font-mono text-2xs text-left mb-6 text-gx-green/70 space-y-1">
                <div>[SYSTEM] INITIALIZING COMPILER PROTOCOLS...</div>
                <div>[SYSTEM] PACKAGING SERVICES AND TIMELINE TARGETS...</div>
                <div>[SYSTEM] SECURING COMM PORT SYNC TO {intel.email}...</div>
                <div>[SYSTEM] INJECTING STRATEGY COEFFICIENTS...</div>
                {compileProgress > 50 && <div>[SYSTEM] UPLOADING DOSSIER TO SAFE LOGS... [OK]</div>}
                {compileProgress === 100 && <div>[SYSTEM] OPERATION EXECUTING SUCCESSFULLY.</div>}
              </div>
              <div className="w-full h-3 border border-gx-green/30 p-0.5 bg-gx-black mb-2">
                <div
                  className="h-full bg-gx-green transition-all duration-150"
                  style={{ width: `${compileProgress}%` }}
                />
              </div>
              <div className="font-mono text-gx-green text-sm">{compileProgress}% COMPLETE</div>
            </div>
          </div>
        )}

        {/* Printable/Interactive Mission Dossier View */}
        {showDossier ? (
          <div className="bg-gx-dark border-2 border-gx-green p-8 md:p-12 shadow-2xl relative clip-corner mt-4 print:border-black print:bg-white print:text-black">
            {/* Top Operational Headers */}
            <div className="flex justify-between items-center border-b-2 border-gx-green/30 pb-6 mb-8 print:border-black">
              <div>
                <span className="block text-gx-green font-mono text-xs uppercase tracking-widest print:text-black">
                  CLASSIFIED // GLORYX OPERATION ARCHIVE
                </span>
                <h1 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-tighter text-white mt-1 print:text-black">
                  Mission Dossier
                </h1>
              </div>
              <CheckCircle className="text-gx-green w-12 h-12 print:hidden" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 font-mono text-sm leading-relaxed text-gray-300 print:text-black">
              <div>
                <h3 className="text-gx-orange font-display font-bold text-lg uppercase tracking-wide mb-3 print:text-black">
                  1. Operator Intel
                </h3>
                <div className="space-y-1">
                  <div><span className="text-gx-green print:text-black font-bold">Code Name:</span> {intel.codeName}</div>
                  {intel.corporation && <div><span className="text-gx-green print:text-black font-bold">Corporation:</span> {intel.corporation}</div>}
                  <div><span className="text-gx-green print:text-black font-bold">Secure Frequency:</span> {intel.email}</div>
                  {intel.channel && <div><span className="text-gx-green print:text-black font-bold">Comm Port:</span> {intel.channel}</div>}
                </div>
              </div>

              <div>
                <h3 className="text-gx-orange font-display font-bold text-lg uppercase tracking-wide mb-3 print:text-black">
                  2. Calibrated Target Specs
                </h3>
                <div className="space-y-1">
                  <div><span className="text-gx-green print:text-black font-bold">Operation Budget:</span> ${budget.toLocaleString()}</div>
                  <div><span className="text-gx-green print:text-black font-bold">Planned Timeline:</span> {timeline}</div>
                  <div><span className="text-gx-green print:text-black font-bold">Execution Speed:</span> Tactical Max</div>
                </div>
              </div>
            </div>

            <div className="mb-8 font-mono text-sm leading-relaxed border-t border-gx-green/20 pt-6 print:border-black text-gray-300 print:text-black">
              <h3 className="text-gx-orange font-display font-bold text-lg uppercase tracking-wide mb-3 print:text-black">
                3. Selected Targets (Weapons Selected)
              </h3>
              <ul className="list-inside list-decimal space-y-1 pl-2">
                {selectedTargets.map((tId) => {
                  const s = PLANNER_SERVICES.find((serv) => serv.id === tId);
                  return (
                    <li key={tId} className="font-bold">
                      {s?.name} <span className="text-gx-green/60 print:text-black font-normal">(Min Required: ${s?.minPrice.toLocaleString()})</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {intel.brief && (
              <div className="mb-10 font-mono text-sm leading-relaxed border-t border-gx-green/20 pt-6 print:border-black text-gray-300 print:text-black">
                <h3 className="text-gx-orange font-display font-bold text-lg uppercase tracking-wide mb-3 print:text-black">
                  4. Special Intel Instructions
                </h3>
                <p className="whitespace-pre-wrap bg-gx-black/40 p-4 border border-gx-gray italic print:border-black print:bg-white print:text-black">
                  &quot;{intel.brief}&quot;
                </p>
              </div>
            )}

            {/* Bottom Alert / Success message */}
            <div className="bg-gx-green/10 border border-gx-green p-4 font-mono text-xs text-gx-green text-center mb-8 print:border-black print:text-black">
              PROTOCAL DISPATCHED. OUR CREW HAS SECURED THE OPERATION SPECIFICATIONS AND WILL ESTABLISH CONNECTION WITHIN 24 SECURE HOURS. PREPARE THE MATRIX.
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between print:hidden">
              <Link href="/">
                <button
                  onClick={playClick}
                  onMouseEnter={playHover}
                  className="w-full sm:w-auto px-8 py-3 bg-transparent hover:bg-white border-2 border-white text-white hover:text-gx-black font-display font-bold uppercase transition-colors duration-300 clip-corner"
                >
                  Return to Base
                </button>
              </Link>
              
              <button
                onClick={handlePrint}
                onMouseEnter={playHover}
                className="w-full sm:w-auto px-8 py-3 bg-gx-green text-gx-black hover:bg-white hover:text-gx-black font-display font-bold uppercase transition-colors duration-300 flex items-center justify-center gap-2 clip-corner"
              >
                <Printer size={18} />
                <span>Print Dossier</span>
              </button>
            </div>
          </div>
        ) : (
          /* HEIST STEPS BUILDER */
          <div className="bg-gx-dark border border-gx-gray p-6 md:p-10 shadow-2xl relative clip-corner">
            {/* Steps Progress Header */}
            <div className="flex justify-between items-center border-b border-gx-green/20 pb-6 mb-8">
              <div>
                <span className="block text-gx-green font-display font-bold tracking-widest uppercase mb-1">
                  Heist Customizer
                </span>
                <h2 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-tighter leading-none">
                  Step {step} of 3
                </h2>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`w-10 h-2 transform -skew-x-12 transition-all duration-300 ${
                      step >= s ? 'bg-gx-green' : 'bg-gx-gray'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* STEP 1: SELECT TARGETS */}
            {step === 1 && (
              <div>
                <h3 className="font-display text-2xl uppercase font-bold tracking-wider mb-2 flex items-center gap-2">
                  <Target className="text-gx-green animate-pulse" />
                  <span>Select Target Operations</span>
                </h3>
                <p className="text-gray-400 font-sans text-sm mb-8">
                  Choose the components you want the GloryX crew to build, optimize, or automate. Select all that apply.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {PLANNER_SERVICES.map((s) => {
                    const selected = selectedTargets.includes(s.id);
                    return (
                      <div
                        key={s.id}
                        onClick={() => toggleTarget(s.id)}
                        onMouseEnter={playHover}
                        className={`p-5 border cursor-pointer transition-all duration-300 relative select-none group flex flex-col justify-between min-h-[140px] ${
                          selected
                            ? s.accent === 'orange'
                              ? 'border-gx-orange bg-gx-orange/5'
                              : s.accent === 'blue'
                              ? 'border-gx-blue bg-gx-blue/5'
                              : 'border-gx-green bg-gx-green/5'
                            : 'border-white/10 bg-gx-black/40 hover:border-white/40'
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-display font-bold text-xl uppercase tracking-wide group-hover:text-white">
                              {s.name}
                            </h4>
                            <div
                              className={`w-3 h-3 rounded-full ${
                                selected
                                  ? s.accent === 'orange'
                                    ? 'bg-gx-orange'
                                    : s.accent === 'blue'
                                    ? 'bg-gx-blue'
                                    : 'bg-gx-green'
                                  : 'bg-transparent border border-white/20'
                              }`}
                            />
                          </div>
                          <p className="text-gray-400 text-xs font-sans leading-relaxed">
                            {s.description}
                          </p>
                        </div>

                        <div className="mt-4 flex justify-between items-end border-t border-white/5 pt-3">
                          <span className="text-2xs text-gray-500 font-mono">ESTIMATED MIN ENTRY</span>
                          <span className="font-mono text-sm font-bold text-white">
                            ${s.minPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-gx-black p-4 border border-gx-gray flex justify-between items-center font-mono">
                  <div>
                    <span className="block text-2xs text-gray-500">WEAPONS UNLOCKED</span>
                    <span className="text-sm font-bold text-white">
                      {selectedTargets.length} TARGETS SELECTED
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-2xs text-gray-500">ESTIMATED BUDGET FLOOR</span>
                    <span className="text-xl font-bold text-gx-green font-display">
                      ${calculatedMinRequired.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: CALIBRATE GEAR */}
            {step === 2 && (
              <div>
                <h3 className="font-display text-2xl uppercase font-bold tracking-wider mb-2 flex items-center gap-2">
                  <Cpu className="text-gx-orange animate-pulse" />
                  <span>Calibrate Operational Gear</span>
                </h3>
                <p className="text-gray-400 font-sans text-sm mb-8">
                  Establish parameters for capital investment and delivery speed. We scale scope based on resource allocation.
                </p>

                {/* Capital Slider */}
                <div className="mb-10 font-mono">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <span className="block text-2xs text-gray-500 uppercase">CALIBRATE CAPITAL</span>
                      <span className="text-xs text-gx-green font-bold">ALLOCATED LOOT POOL</span>
                    </div>
                    <span className="text-3xl font-display font-bold text-white">
                      ${budget.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={Math.max(calculatedMinRequired, 2000)}
                    max={100000}
                    step={1000}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full h-2 bg-gx-gray rounded-lg appearance-none cursor-pointer accent-gx-green focus:outline-none"
                  />
                  <div className="flex justify-between text-2xs text-gray-500 mt-2">
                    <span>MIN: ${Math.max(calculatedMinRequired, 2000).toLocaleString()}</span>
                    <span>MAX: $100,000+</span>
                  </div>
                  {budget < calculatedMinRequired && (
                    <div className="mt-3 flex items-center gap-2 text-2xs text-gx-orange font-bold">
                      <AlertCircle size={14} />
                      <span>ALERT: BUDGET IS LOWER THAN MINIMUM RECOMMENDED ENTRY FOR TARGETS.</span>
                    </div>
                  )}
                </div>

                {/* Timeline Selector */}
                <div className="font-mono">
                  <span className="block text-2xs text-gray-500 uppercase mb-4">EXECUTION TIMELINE</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['1 Month', '3 Months', '6 Months', '12 Months'].map((t) => {
                      const active = timeline === t;
                      return (
                        <div
                          key={t}
                          onClick={() => {
                            playClick();
                            setTimeline(t);
                          }}
                          className={`p-4 text-center border cursor-pointer font-bold uppercase transition-all duration-300 ${
                            active
                              ? 'border-gx-green bg-gx-green/10 text-gx-green'
                              : 'border-white/10 bg-gx-black/40 hover:border-white/40 text-gray-400'
                          }`}
                        >
                          {t}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: GATHER INTEL */}
            {step === 3 && (
              <div>
                <h3 className="font-display text-2xl uppercase font-bold tracking-wider mb-2 flex items-center gap-2">
                  <User className="text-gx-blue animate-pulse" />
                  <span>Gather Operator Intel</span>
                </h3>
                <p className="text-gray-400 font-sans text-sm mb-8">
                  Establish secure frequencies for communication. GloryX crew operates under absolute secrecy and speed.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 font-mono">
                  <div>
                    <label className="block text-2xs text-gray-500 uppercase mb-2">OPERATOR CODENAME *</label>
                    <input
                      type="text"
                      placeholder="E.G. AGENT SMITH"
                      value={intel.codeName}
                      onChange={(e) => setIntel({ ...intel, codeName: e.target.value })}
                      className="w-full bg-gx-black border-2 border-white/10 p-4 text-sm focus:outline-none focus:border-gx-green uppercase placeholder-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs text-gray-500 uppercase mb-2">TARGET CORPORATION</label>
                    <input
                      type="text"
                      placeholder="E.G. MATRIX INC"
                      value={intel.corporation}
                      onChange={(e) => setIntel({ ...intel, corporation: e.target.value })}
                      className="w-full bg-gx-black border-2 border-white/10 p-4 text-sm focus:outline-none focus:border-gx-green uppercase placeholder-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs text-gray-500 uppercase mb-2">SECURE CHANNEL FREQUENCY *</label>
                    <input
                      type="email"
                      placeholder="E.G. DIRECT@EMAIL.COM"
                      value={intel.email}
                      onChange={(e) => setIntel({ ...intel, email: e.target.value })}
                      className="w-full bg-gx-black border-2 border-white/10 p-4 text-sm focus:outline-none focus:border-gx-green uppercase placeholder-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs text-gray-500 uppercase mb-2">SECONDARY FREQUENCY (TELEGRAM/DISCORD)</label>
                    <input
                      type="text"
                      placeholder="E.G. DISCORD // TELEGRAM USER"
                      value={intel.channel}
                      onChange={(e) => setIntel({ ...intel, channel: e.target.value })}
                      className="w-full bg-gx-black border-2 border-white/10 p-4 text-sm focus:outline-none focus:border-gx-green uppercase placeholder-gray-700"
                    />
                  </div>
                </div>

                <div className="font-mono">
                  <label className="block text-2xs text-gray-500 uppercase mb-2">MISSION BRIEF / ADDITIONAL INTEL</label>
                  <textarea
                    placeholder="DESCRIBE THE TARGET BOTTLENECK AND SPECIFICATIONS IN DETAIL..."
                    rows={4}
                    value={intel.brief}
                    onChange={(e) => setIntel({ ...intel, brief: e.target.value })}
                    className="w-full bg-gx-black border-2 border-white/10 p-4 text-sm focus:outline-none focus:border-gx-green uppercase placeholder-gray-700 font-mono"
                  />
                </div>
              </div>
            )}

            {/* Stepper Navigation Actions */}
            <div className="mt-12 flex justify-between border-t border-white/10 pt-6">
              {step > 1 ? (
                <button
                  onClick={handlePrevStep}
                  onMouseEnter={playHover}
                  className="px-6 py-3 bg-transparent border border-white/20 hover:border-white text-white font-display font-bold uppercase transition-colors flex items-center gap-2 clip-corner"
                >
                  <ArrowLeft size={16} />
                  <span>Previous</span>
                </button>
              ) : (
                <Link href="/">
                  <button
                    onClick={playClick}
                    onMouseEnter={playHover}
                    className="px-6 py-3 bg-transparent border border-white/20 hover:border-white text-white font-display font-bold uppercase transition-colors flex items-center gap-2 clip-corner"
                  >
                    <ArrowLeft size={16} />
                    <span>Return</span>
                  </button>
                </Link>
              )}

              {step < 3 ? (
                <button
                  onClick={handleNextStep}
                  onMouseEnter={playHover}
                  className="px-8 py-3 bg-gx-green text-gx-black hover:bg-white font-display font-bold uppercase transition-colors flex items-center gap-2 clip-corner"
                >
                  <span>Next Step</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={executeHeist}
                  onMouseEnter={playHover}
                  className="px-10 py-3 bg-gx-orange text-white hover:bg-white hover:text-gx-black font-display font-bold uppercase transition-colors flex items-center gap-2 clip-corner animate-pulse"
                >
                  <Play size={16} className="fill-current" />
                  <span>Execute Heist Plan</span>
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </motion.div>
  );
}

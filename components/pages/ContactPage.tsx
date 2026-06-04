'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAudio } from '@/components/hooks/AudioProvider';
import { Wifi, Shield, Send, Terminal, Loader2, Check } from 'lucide-react';

export default function ContactPage() {
  const { playClick, playHover, playSuccess } = useAudio();
  const [form, setForm] = useState({ codeName: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.codeName || !form.email) return;

    playClick();
    setLoading(true);
    setProgress(['INITIATING DIRECT COMS HANDSHAKE...', 'ROUTING THROUGH SECURE AXUM PORTS...']);

    // Mock progress steps
    const logs = [
      'SHIELD CRYPTO WRAPPERS INITIALIZED...',
      'DIALING SATELLITE COMS GRID...',
      'ENCRYPTING DOSSIER PAYLOAD...',
      'COMMITTING Dossier TO CORE RUST VAULT...',
      'TRANSMISSION COMPLETE.'
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setProgress((prev) => [...prev, log]);
        if (index === logs.length - 1) {
          playSuccess();
          setLoading(false);
          setComplete(true);
          setForm({ codeName: '', email: '', message: '' });
        }
      }, (index + 1) * 800);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gx-black text-white font-sans selection:bg-gx-green selection:text-gx-black flex flex-col justify-between"
    >
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-4 max-w-4xl mx-auto w-full relative z-10">
        <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px] opacity-[0.02] pointer-events-none z-0" />

        {/* Page Title */}
        <div className="mb-12 border-b-4 border-gx-green pb-6 text-left">
          <span className="block text-gx-green font-display font-bold tracking-[0.2em] uppercase mb-2">
            SECURE ENCRYPTED COMMUNICATIONS
          </span>
          <h1 className="font-display font-bold text-5xl md:text-7xl uppercase tracking-tighter text-white leading-none">
            ESTABLISH LINK
          </h1>
        </div>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left font-mono">
          
          {/* Instructions and connection status */}
          <div className="md:col-span-5 bg-gx-dark border border-white/5 p-6 clip-corner flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex justify-between items-center mb-6">
                <Wifi className="w-8 h-8 text-gx-green animate-pulse" />
                <span className="text-gray-600 text-3xs font-bold uppercase">SECURE LINK STATUS: ONLINE</span>
              </div>
              <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider mb-2">COMM TRANSCEIVER</h3>
              <p className="text-2xs text-gray-400 leading-relaxed">
                Transmit your project specs, marketing bottlenecks, or custom database targets directly to GloryX command central.
              </p>
              <p className="text-2xs text-gray-400 leading-relaxed mt-4">
                All records are logged dynamically in local gateways with cryptographic file IDs.
              </p>
            </div>
            <div className="border-t border-white/5 pt-4 mt-6 text-3xs text-gx-orange flex items-center gap-2">
              <Shield className="w-4 h-4 text-gx-orange" />
              <span>SECURE END-TO-END ENCRYPTION ACTIVE</span>
            </div>
          </div>

          {/* Transmitter Form */}
          <div className="md:col-span-7 bg-gx-dark border-2 border-white/10 p-6 md:p-8 clip-corner shadow-[0_0_40px_rgba(0,0,0,0.6)]">
            {loading || complete ? (
              <div className="min-h-[300px] flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="block text-gx-green text-3xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                    {loading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>TRANSMITTING DIRECT SIGNAL</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>LINK ESTABLISHED SUCCESSFULLY</span>
                      </>
                    )}
                  </span>
                  <div className="bg-gx-black/85 p-4 border border-white/5 text-2xs space-y-1 max-h-[220px] overflow-y-auto leading-relaxed text-gx-green">
                    {progress.map((p, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="text-gray-500 font-bold">&gt;</span>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {complete && (
                  <button
                    onClick={() => {
                      playClick();
                      setComplete(false);
                      setProgress([]);
                    }}
                    className="w-full bg-gx-green hover:bg-white text-gx-black font-display font-bold uppercase py-3 transition-colors clip-corner text-xs"
                  >
                    RESET TRANSCEIVER
                  </button>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                <div className="space-y-1">
                  <label className="block text-gray-500 text-3xs uppercase font-bold">OPERATOR CODENAME</label>
                  <input
                    type="text"
                    required
                    value={form.codeName}
                    onChange={(e) => setForm({ ...form, codeName: e.target.value })}
                    placeholder="E.G. AGENT PHOENIX"
                    className="w-full bg-gx-black border border-white/10 p-3 text-2xs focus:outline-none focus:border-gx-green uppercase text-white placeholder-gray-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-500 text-3xs uppercase font-bold">SECURE CHANNEL FREQUENCY (EMAIL)</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="E.G. CONTACT@YOURCORP.COM"
                    className="w-full bg-gx-black border border-white/10 p-3 text-2xs focus:outline-none focus:border-gx-green uppercase text-white placeholder-gray-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-500 text-3xs uppercase font-bold">SPECIAL INTEL BRIEF (MESSAGE)</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="DESCRIBE PROJECT WEAPON TARGETS AND PARAMETERS IN DETAIL..."
                    className="w-full bg-gx-black border border-white/10 p-3 text-2xs focus:outline-none focus:border-gx-green uppercase text-white placeholder-gray-800 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  onMouseEnter={playHover}
                  className="w-full bg-gx-green hover:bg-white text-gx-black font-display font-bold uppercase py-3.5 transition-colors clip-corner text-sm flex items-center justify-center gap-2"
                >
                  <Send size={14} />
                  <span>DISPATCH SIGNAL</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </main>

      <Footer />
    </motion.div>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ShieldCheck, FileText, Lock } from 'lucide-react';

interface LegalPageProps {
  title: string;
  subtitle: string;
  sections: { title: string; paragraphs: string[] }[];
}

export default function LegalPage({ title, subtitle, sections }: LegalPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gx-black text-white font-sans selection:bg-gx-green selection:text-gx-black flex flex-col justify-between"
    >
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-4 max-w-4xl mx-auto w-full relative z-10 text-left font-mono">
        <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px] opacity-[0.02] pointer-events-none z-0" />

        {/* Page Title */}
        <div className="mb-12 border-b-4 border-gx-green pb-6">
          <span className="block text-gx-green font-bold tracking-[0.2em] uppercase mb-2 text-3xs">
            SYSTEM FRAMEWORK & POLICY
          </span>
          <h1 className="font-display font-bold text-4xl md:text-6xl uppercase tracking-tighter text-white leading-none">
            {title}
          </h1>
          <p className="text-gray-500 text-3xs uppercase font-bold mt-2">
            EFFECTIVE PROTOCOL DATE: JUNE 2026 // VERSION 2.5
          </p>
        </div>

        {/* Legal terms cards stack */}
        <div className="space-y-8">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-gx-dark border border-white/5 p-6 md:p-8 clip-corner">
              <h2 className="font-display font-bold text-lg text-gx-orange uppercase tracking-wide mb-4 flex items-center gap-2">
                <span className="text-gray-600">[{idx + 1}]</span>
                <span>{section.title}</span>
              </h2>
              <div className="space-y-4 text-2xs text-gray-400 leading-relaxed font-light">
                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </motion.div>
  );
}

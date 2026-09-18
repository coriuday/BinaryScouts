'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProjectGallery from '@/components/ui/ProjectGallery';
import TeamSection from '@/components/ui/TeamSection';
import { motion } from 'framer-motion';
import { Sparkles, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ease } from '@/lib/motion';
import SectionBridge from '@/components/motion/SectionBridge';

export default function WorkPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main>
        {/* ── Hero ─────────────────────────────────────────── */}
        <section
          className="relative pt-40 pb-24 overflow-hidden"
          style={{ backgroundColor: 'var(--bg-primary)' }}
        >
          {/* Atmospheric background */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="orb absolute w-[700px] h-[700px]"
              style={{
                background: 'radial-gradient(circle, var(--orb-violet) 0%, transparent 65%)',
                top: '-15%', left: '-10%',
                filter: 'blur(90px)',
                animation: 'atmosphericFloat 18s ease-in-out infinite',
              }}
            />
            <div
              className="orb absolute w-[500px] h-[500px]"
              style={{
                background: 'radial-gradient(circle, var(--orb-rose) 0%, transparent 65%)',
                bottom: '-5%', right: '-5%',
                filter: 'blur(80px)',
                animation: 'atmosphericFloat 22s ease-in-out infinite reverse',
              }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: ease.out }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 eyebrow-badge mb-7">
                <Sparkles size={11} />
                <span>Our Work</span>
              </div>
              <h1
                className="font-display font-bold text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.02] tracking-tight mb-6"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}
              >
                Systems that{' '}
                <span className="gradient-text gradient-text-animated">speak for themselves.</span>
              </h1>
              <p
                className="font-sans text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
                style={{ color: 'var(--text-secondary)' }}
              >
                Every project is a transformation story — not just software delivered, but outcomes engineered. Here&apos;s a look at what we&apos;ve built.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact">
                  <button className="btn-primary text-base px-8 py-4 gap-2 shimmer-sweep">
                    Start a Project
                    <ArrowRight size={16} />
                  </button>
                </Link>
                <Link href="#team">
                  <button className="btn-secondary text-base px-8 py-4">
                    Meet the Team
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Stat strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-wrap items-center gap-8 mt-16 pt-10"
              style={{ borderTop: '1px solid var(--glass-border-1)' }}
            >
              {[
                { label: 'AI-native', sub: 'Systems & automation' },
                { label: 'Full-stack', sub: 'Product engineering' },
                { label: 'Partnered', sub: 'Embedded delivery' },
                { label: 'Documented', sub: 'Handoffs that last' },
              ].map(({ label, sub }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  className="flex flex-col"
                >
                  <p
                    className="font-display font-bold text-2xl leading-none mb-1"
                    style={{
                      background: 'var(--gradient-primary)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '-0.04em',
                    }}
                  >
                    {label}
                  </p>
                  <p className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>
                    {sub}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Project Gallery ───────────────────────────────── */}
        <section className="py-20 relative" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--glass-border-2), transparent)' }} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: ease.out }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
            >
              <div>
                <div className="eyebrow-badge mb-4">
                  <Zap size={11} />
                  <span>Case Studies</span>
                </div>
                <h2
                  className="font-display font-bold text-3xl md:text-4xl tracking-tight"
                  style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}
                >
                  Every project, a{' '}
                  <span className="gradient-text">transformation story.</span>
                </h2>
              </div>
            </motion.div>
            <ProjectGallery />
          </div>
        </section>

        {/* Bridge */}
        <SectionBridge hint="The people who build this" direction="dark-to-light" showLine />

        {/* ── Team Section ──────────────────────────────────── */}
        <div className="section-lazy">
          <TeamSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}

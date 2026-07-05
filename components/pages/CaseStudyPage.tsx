'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ExternalLink, Github, CheckCircle,
  Zap, Layers, TrendingUp, ChevronRight,
} from 'lucide-react';
import { type Project } from '@/lib/projects';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ease, dur } from '@/lib/motion';

/* ── Animated counter ───────────────────────────────── */
const AnimatedMetric: React.FC<{ value: string; label: string; delay?: number }> = ({
  value, label, delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: dur.base, ease: ease.out, delay }}
    className="text-center"
  >
    <p
      className="font-display font-bold text-3xl md:text-4xl leading-none mb-2"
      style={{
        background: 'var(--gradient-primary)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-0.05em',
      }}
    >
      {value}
    </p>
    <p
      className="font-sans text-xs uppercase tracking-widest font-semibold"
      style={{ color: 'var(--text-muted)' }}
    >
      {label}
    </p>
  </motion.div>
);

/* ─── Case Study Page Content ──────────────────────── */
interface CaseStudyPageProps {
  slug: string;
  project: Project;
  allProjects: Project[];
}

const CaseStudyPage: React.FC<CaseStudyPageProps> = ({ slug, project, allProjects }) => {
  const relatedProjects = allProjects.filter((p) => p.id !== project.id).slice(0, 2);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main>
        {/* ── Cinematic Hero ────────────────────────────────── */}
        <section
          className="relative pt-36 pb-20 overflow-hidden"
          style={{ backgroundColor: 'var(--bg-primary)' }}
        >
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `${project.gradient.replace('linear-gradient(135deg,', 'radial-gradient(ellipse 70% 60% at 20% 30%,').replace(/,\s*[^)]+\)/, ', transparent)')}, radial-gradient(ellipse 50% 40% at 80% 70%, var(--orb-rose), transparent)`,
              opacity: 0.5,
            }}
          />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: dur.base, ease: ease.out }}
              className="flex items-center gap-2 mb-10"
            >
              <Link
                href="/work"
                className="flex items-center gap-1.5 font-sans text-sm font-medium transition-colors duration-200 hover:text-[var(--accent)]"
                style={{ color: 'var(--text-muted)' }}
              >
                <ArrowLeft size={14} />
                Our Work
              </Link>
              <ChevronRight size={12} style={{ color: 'var(--text-muted)' }} />
              <span className="font-sans text-sm" style={{ color: 'var(--text-secondary)' }}>
                {project.category}
              </span>
            </motion.div>

            {/* Category + status */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: dur.base, ease: ease.out, delay: 0.1 }}
              className="flex items-center gap-3 mb-6"
            >
              <span
                className="px-3 py-1 rounded-full font-sans text-xs font-bold uppercase tracking-widest"
                style={{
                  background: 'var(--accent-light)',
                  color: 'var(--accent)',
                  border: '1px solid var(--glass-border-2)',
                }}
              >
                {project.category}
              </span>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full font-sans text-xs font-bold uppercase tracking-widest transition-colors duration-200"
                  style={{
                    background: 'rgba(16,185,129,0.12)',
                    color: '#10B981',
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#10B981', boxShadow: '0 0 6px #10B981' }}
                  />
                  Live Site
                  <ExternalLink size={10} />
                </a>
              )}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: dur.slow, ease: ease.out, delay: 0.15 }}
              className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight mb-6"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}
            >
              {project.hook}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: dur.medium, ease: ease.out, delay: 0.3 }}
              className="font-sans text-lg md:text-xl leading-relaxed mb-10 max-w-2xl"
              style={{ color: 'var(--text-secondary)' }}
            >
              {project.description}
            </motion.p>

            {/* Action links */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: dur.base, ease: ease.out, delay: 0.45 }}
              className="flex flex-wrap gap-3"
            >
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <button className="btn-primary text-sm px-6 py-3 gap-2 shimmer-sweep">
                    <ExternalLink size={14} />
                    Visit Live Site
                  </button>
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <button className="btn-secondary text-sm px-6 py-3 gap-2">
                    <Github size={14} />
                    View Source
                  </button>
                </a>
              )}
              <Link href="/contact">
                <button className="btn-secondary text-sm px-6 py-3 gap-2">
                  <Zap size={14} />
                  Build Something Similar
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── Metrics Strip ─────────────────────────────────── */}
        <section
          className="py-16 relative"
          style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--glass-border-1)' }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 gap-8">
              {project.metrics.map((m, i) => (
                <AnimatedMetric key={m.label} value={m.value} label={m.label} delay={i * 0.12} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Tech Stack ────────────────────────────────────── */}
        <section className="py-16 relative" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: dur.base, ease: ease.out }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Layers size={16} style={{ color: 'var(--accent)' }} />
                <h2
                  className="font-display font-bold text-xl"
                  style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
                >
                  Technology Stack
                </h2>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {project.techStack.map((tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: dur.fast, ease: ease.spring, delay: i * 0.05 }}
                    className="px-4 py-2 rounded-2xl font-mono text-sm font-medium"
                    style={{
                      background: 'var(--glass-2)',
                      color: 'var(--accent)',
                      border: '1px solid var(--glass-border-2)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Case Study Narrative ──────────────────────────── */}
        {project.caseStudy && (
          <section
            className="py-20 relative"
            style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--glass-border-1)' }}
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Problem */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: dur.medium, ease: ease.out, delay: 0 }}
                  className="glass-card rounded-3xl p-8"
                >
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}
                  >
                    <span className="text-lg">⚠️</span>
                  </div>
                  <h3
                    className="font-display font-bold text-xl mb-4"
                    style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
                  >
                    The Problem
                  </h3>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {project.caseStudy.problem}
                  </p>
                </motion.div>

                {/* Solution */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: dur.medium, ease: ease.out, delay: 0.1 }}
                  className="glass-card rounded-3xl p-8"
                >
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: 'var(--accent-light)', border: '1px solid var(--glass-border-2)' }}
                  >
                    <Zap size={16} style={{ color: 'var(--accent)' }} />
                  </div>
                  <h3
                    className="font-display font-bold text-xl mb-4"
                    style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
                  >
                    Our Solution
                  </h3>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {project.caseStudy.solution}
                  </p>
                </motion.div>

                {/* Results */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: dur.medium, ease: ease.out, delay: 0.2 }}
                  className="glass-card rounded-3xl p-8"
                >
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}
                  >
                    <TrendingUp size={16} style={{ color: '#10B981' }} />
                  </div>
                  <h3
                    className="font-display font-bold text-xl mb-4"
                    style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
                  >
                    The Results
                  </h3>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {project.caseStudy.results}
                  </p>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ───────────────────────────────────────────── */}
        <section className="py-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: dur.medium, ease: ease.out }}
              className="glass-card rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse 70% 60% at 50% 50%, var(--orb-violet), transparent)',
                  opacity: 0.5,
                }}
              />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 eyebrow-badge mb-6">
                  <CheckCircle size={11} />
                  <span>Ready to build yours?</span>
                </div>
                <h2
                  className="font-display font-bold text-3xl md:text-4xl leading-tight tracking-tight mb-4 max-w-xl mx-auto"
                  style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}
                >
                  Want a system like this?{' '}
                  <span className="gradient-text">Let&apos;s talk.</span>
                </h2>
                <p
                  className="font-sans text-base leading-relaxed mb-8 max-w-md mx-auto"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  We&apos;ll map out exactly how we&apos;d build this for your business — no pitch, no commitment.
                </p>
                <Link href="/planner">
                  <button className="btn-primary text-base px-10 py-4 gap-2 shimmer-sweep">
                    Start the Conversation
                    <ArrowLeft size={15} className="rotate-180" />
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Related Projects ──────────────────────────────── */}
        {relatedProjects.length > 0 && (
          <section
            className="py-16"
            style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--glass-border-1)' }}
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3
                className="font-display font-bold text-xl mb-8"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
              >
                More from the studio
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedProjects.map((p, i) => (
                  <Link key={p.id} href={`/work/${p.slug}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: dur.base, ease: ease.out, delay: i * 0.1 }}
                      className="glass-card-interactive rounded-2xl p-5 flex items-start gap-4"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex-shrink-0"
                        style={{ background: p.gradient }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--accent)' }}>
                          {p.category}
                        </p>
                        <p
                          className="font-display font-bold text-sm leading-snug truncate"
                          style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
                        >
                          {p.hook}
                        </p>
                      </div>
                      <ArrowLeft size={14} className="rotate-180 flex-shrink-0 mt-1" style={{ color: 'var(--text-muted)' }} />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CaseStudyPage;

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/motion/PageTransition';
import { Sparkles, Zap, ShieldCheck, Target, Users, Code, ChevronDown } from 'lucide-react';
import { getTeamMembers, type TeamMember as CmsTeamMember } from '@/lib/team';
import { ease, dur, viewport } from '@/lib/motion';

const ACCENTS = ['var(--accent)', 'var(--rose)', 'var(--sage)'];
const GRADIENTS = [
  'linear-gradient(135deg, rgba(139,92,246,0.14), rgba(167,139,250,0.05))',
  'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(244,114,182,0.05))',
  'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(110,231,183,0.05))',
];

interface DisplayMember {
  name: string;
  role: string;
  specialty: string;
  description: string;
  avatar?: string;
  stats: { label: string; value: string }[];
  accentColor: string;
  gradient: string;
}

function mapTeamMember(m: CmsTeamMember, i: number): DisplayMember {
  return {
    name: m.name,
    role: m.role,
    specialty: m.badges[0] || m.role,
    description: m.bio,
    avatar: m.avatar,
    stats: [
      { label: 'Focus', value: m.badges[0] || 'Engineering' },
      { label: 'Experience', value: `${m.experience}+ Yrs` },
      { label: 'Stack depth', value: `${m.skills.length} skills` },
    ],
    accentColor: ACCENTS[i % ACCENTS.length],
    gradient: GRADIENTS[i % GRADIENTS.length],
  };
}

const VALUES = [
  {
    icon: Code,
    label: 'Pure Engineering',
    desc: 'No templates, no shortcuts. Every system is handcrafted to specification with clean, maintainable code.',
    color: 'var(--accent)',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.14), rgba(167,139,250,0.05))',
    border: 'rgba(139,92,246,0.22)',
  },
  {
    icon: Zap,
    label: 'Speed + Precision',
    desc: 'Every millisecond shaved increases conversion. We optimise for performance at every layer of the stack.',
    color: 'var(--rose)',
    gradient: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(244,114,182,0.05))',
    border: 'rgba(236,72,153,0.20)',
  },
  {
    icon: Target,
    label: 'ROI-Obsessed',
    desc: 'Every decision is tied to measurable outcomes. We build systems that justify themselves in the numbers.',
    color: 'var(--sage)',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(110,231,183,0.05))',
    border: 'rgba(16,185,129,0.20)',
  },
  {
    icon: ShieldCheck,
    label: 'Security-First',
    desc: 'Enterprise-grade security practices baked into every architecture decision from day one.',
    color: 'var(--accent)',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.14), rgba(167,139,250,0.05))',
    border: 'rgba(139,92,246,0.22)',
  },
];

export default function AboutPage() {
  const [activeMember, setActiveMember] = useState<string | null>(null);
  const [team, setTeam] = useState<DisplayMember[]>(() => getTeamMembers().map(mapTeamMember));

  useEffect(() => {
    fetch('/api/cms/team')
      .then((r) => r.json())
      .then((d) => {
        if (d.members?.length) setTeam(d.members.map((m: CmsTeamMember, i: number) => mapTeamMember(m, i)));
      })
      .catch(() => {});
  }, []);

  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-36 pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Hero section ──────────────────────────────── */}
          <motion.div
            className="mb-24 max-w-3xl"
            initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="eyebrow-badge mb-6">
              <Users size={11} />
              <span>The Studio</span>
            </div>
            <h1
              className="font-display font-bold text-5xl md:text-7xl leading-tight tracking-tight mb-6"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.05em' }}
            >
              We build systems{' '}
              <span className="gradient-text">
                that scale.
              </span>
            </h1>
            <p
              className="font-sans text-xl leading-relaxed max-w-2xl"
              style={{ color: 'var(--text-secondary)', letterSpacing: '-0.01em' }}
            >
              BinaryScouts is an AI-native engineering studio. We partner with ambitious founders and growth-stage companies to design and build the automated, intelligent systems that power modern business operations.
            </p>
          </motion.div>

          {/* ── Manifesto glass card ──────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card rounded-[2rem] p-10 md:p-14 mb-24 relative overflow-hidden"
          >
            <div
              className="absolute inset-0 rounded-[2rem] pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 70% 60% at 30% 50%, rgba(139,92,246,0.07) 0%, transparent 70%)' }}
            />
            <div
              className="absolute inset-x-0 top-0 h-0.5 rounded-t-[2rem]"
              style={{ background: 'var(--gradient-dreamy)', opacity: 0.4 }}
            />
            <div className="max-w-3xl relative z-10">
              <p
                className="font-display font-bold text-2xl md:text-3xl leading-relaxed mb-6"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
              >
                &ldquo;In a market of generic agency models, we operate as a precision-focused engineering team. We combine creative design, intelligent automation, and robust code architectures to build systems that actually move the needle.&rdquo;
              </p>
              <p className="font-sans text-base" style={{ color: 'var(--text-secondary)' }}>
                — BinaryScouts Studio Manifesto
              </p>
            </div>
          </motion.div>

          {/* ── Team section ─────────────────────────────── */}
          <section className="mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <div className="eyebrow-badge mb-4">
                <Sparkles size={11} />
                <span>The Team</span>
              </div>
              <h2
                className="font-display font-bold text-3xl md:text-4xl"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}
              >
                The people behind{' '}
                <span className="gradient-text">the systems.</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {team.map((member, i) => {
                const isActive = activeMember === member.name;
                return (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="glass-card rounded-3xl p-7 cursor-pointer group"
                    role="button"
                    tabIndex={0}
                    aria-expanded={isActive}
                    aria-label={`${member.name} — ${isActive ? 'collapse' : 'expand'} details`}
                    onClick={() => setActiveMember(isActive ? null : member.name)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveMember(isActive ? null : member.name);
                      }
                    }}
                    style={{
                      borderColor: isActive ? member.accentColor : undefined,
                      boxShadow: isActive ? `0 0 40px ${member.accentColor}22, var(--shadow-card), var(--glass-inner)` : undefined,
                    }}
                  >
                    {/* Avatar */}
                    <div className="mb-5 flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl overflow-hidden"
                        style={{ background: member.gradient, border: `1px solid ${member.accentColor}33` }}
                      >
                        {member.avatar ? (
                          <Image
                            src={member.avatar}
                            alt={member.name}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          member.name.split(' ').map((w) => w[0]).join('').slice(0, 2)
                        )}
                      </div>
                      <div>
                        <h3
                          className="font-display font-bold text-base"
                          style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
                        >
                          {member.name}
                        </h3>
                        <p className="font-sans text-xs" style={{ color: member.accentColor }}>
                          {member.specialty}
                        </p>
                      </div>
                      <motion.div
                        className="ml-auto"
                        animate={{ rotate: isActive ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ color: 'var(--text-muted)' }}
                      >
                        <ChevronDown size={16} />
                      </motion.div>
                    </div>

                    <p className="font-sans text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)', letterSpacing: '-0.01em' }}>
                      {member.role}
                    </p>
                    <p className="font-sans text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
                      {member.description}
                    </p>

                    {/* Expandable stats */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pt-5 overflow-hidden"
                        style={{ borderTop: '1px solid var(--glass-border-1)' }}
                      >
                        <div className="grid grid-cols-3 gap-3">
                          {member.stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                              <p
                                className="font-display font-bold text-lg mb-0.5"
                                style={{
                                  background: 'var(--gradient-primary)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                  letterSpacing: '-0.04em',
                                }}
                              >
                                {stat.value}
                              </p>
                              <p className="font-sans text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                {stat.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* ── Values section ────────────────────────────── */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <div className="eyebrow-badge mb-4">
                <Sparkles size={11} />
                <span>Our Principles</span>
              </div>
              <h2
                className="font-display font-bold text-3xl md:text-4xl"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}
              >
                What we{' '}
                <span className="gradient-text">believe in.</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {VALUES.map((val, i) => (
                <motion.div
                  key={val.label}
                  initial={{ opacity: 0, y: 24, filter: 'blur(5px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                  className="glass-card rounded-3xl p-7 flex items-start gap-5 group"
                >
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: val.gradient, border: `1px solid ${val.border}` }}
                  >
                    <val.icon size={18} style={{ color: val.color }} />
                  </div>
                  <div>
                    <h4
                      className="font-display font-bold text-base mb-2"
                      style={{ color: 'var(--text-primary)', letterSpacing: '-0.025em' }}
                    >
                      {val.label}
                    </h4>
                    <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {val.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </PageTransition>
  );
}

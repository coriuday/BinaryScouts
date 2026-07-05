'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/motion/PageTransition';
import { Briefcase, Send, Sparkles, CheckCircle, Globe, Clock, Layers, Cpu, TrendingUp } from 'lucide-react';
import { ease, dur, viewport } from '@/lib/motion';

interface Role {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  accentColor: string;
  gradient: string;
  border: string;
  icon: React.ElementType;
}

const ROLES: Role[] = [
  {
    title: 'Frontend Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Build beautiful, performant interfaces using Next.js, Framer Motion, and our design system. Expert knowledge of TypeScript, CSS, and interaction engineering required.',
    accentColor: 'var(--accent)',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.14), rgba(167,139,250,0.05))',
    border: 'rgba(139,92,246,0.22)',
    icon: Layers,
  },
  {
    title: 'AI / Backend Engineer',
    department: 'Infrastructure',
    location: 'Remote',
    type: 'Full-time',
    description: 'Design scalable API gateways in Rust (Axum), integrate LLM systems via FastAPI, and maintain high-throughput data pipelines. Experience with Rust, Python, and AI systems essential.',
    accentColor: 'var(--rose)',
    gradient: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(244,114,182,0.05))',
    border: 'rgba(236,72,153,0.20)',
    icon: Cpu,
  },
  {
    title: 'Growth Engineer',
    department: 'Growth',
    location: 'Remote',
    type: 'Contract',
    description: 'Own and scale paid acquisition channels, implement analytics infrastructure, and develop conversion optimisation systems. Strong analytical mindset and paid media expertise required.',
    accentColor: 'var(--sage)',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(110,231,183,0.05))',
    border: 'rgba(16,185,129,0.20)',
    icon: TrendingUp,
  },
];

const PERKS = [
  { icon: Globe,  label: 'Fully Remote',   desc: 'Work from anywhere in the world, on your schedule.' },
  { icon: Clock,  label: 'Async Culture',   desc: 'No pointless meetings — we communicate with intent.' },
  { icon: Sparkles, label: 'Cutting-edge Projects', desc: 'Work on real AI systems and complex engineering challenges.' },
  { icon: Briefcase, label: 'Equity Options', desc: 'Share in the upside of what we\'re building together.' },
];

export default function CareersPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [form, setForm] = useState({ name: '', email: '', portfolio: '', message: '', website: '' });
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !selectedRole) return;

    setStatus('loading');
    setError('');
    const messageParts = [
      '[Careers application]',
      `Role: ${selectedRole.title}`,
      form.portfolio ? `Portfolio: ${form.portfolio}` : '',
      '',
      form.message || '(No additional message)',
    ].filter((line, i, arr) => line !== '' || i === arr.length - 2);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          name: form.name.trim(),
          email: form.email.trim(),
          company: selectedRole.title,
          message: messageParts.join('\n'),
          website: form.website,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('error');
        setError(data.error || 'Could not submit application. Please try again.');
        return;
      }
      setSubmitted(true);
      setForm({ name: '', email: '', portfolio: '', message: '', website: '' });
      setStatus('idle');
    } catch {
      setStatus('error');
      setError('Network error. Please try again.');
    }
  };

  const handleSelectRole = (role: Role) => {
    setSelectedRole(selectedRole?.title === role.title ? null : role);
    setSubmitted(false);
  };

  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-36 pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div
            className="mb-16 max-w-2xl"
            initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="eyebrow-badge mb-6">
              <Briefcase size={11} />
              <span>We&apos;re Hiring</span>
            </div>
            <h1
              className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight mb-5"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.05em' }}
            >
              Build the{' '}
              <span className="gradient-text">future</span>
              {' '}with us.
            </h1>
            <p
              className="font-sans text-xl leading-relaxed"
              style={{ color: 'var(--text-secondary)', letterSpacing: '-0.01em' }}
            >
              Join a small, focused team of engineers and creative strategists building the AI-native systems that power modern businesses.
            </p>
          </motion.div>

          {/* Perks */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {PERKS.map((perk, i) => (
              <motion.div
                key={perk.label}
                initial={{ opacity: 0, y: 16, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.07 }}
                className="glass-card rounded-2xl p-5"
              >
                <perk.icon size={18} style={{ color: 'var(--accent)', marginBottom: '0.75rem' }} />
                <h4 className="font-display font-bold text-sm mb-1" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {perk.label}
                </h4>
                <p className="font-sans text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {perk.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Open roles + Application form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Roles list */}
            <div className="lg:col-span-7 space-y-4">
              <h2
                className="font-display font-bold text-2xl md:text-3xl mb-6"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}
              >
                Open Positions
              </h2>

              {ROLES.map((role, i) => {
                const isSelected = selectedRole?.title === role.title;
                return (
                  <motion.div
                    key={role.title}
                    initial={{ opacity: 0, x: -16, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.55, delay: 0.3 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => handleSelectRole(role)}
                    className="glass-card rounded-2xl p-6 cursor-pointer group"
                    style={{
                      borderColor: isSelected ? role.accentColor : undefined,
                      boxShadow: isSelected ? `0 0 30px ${role.border}, var(--shadow-card), var(--glass-inner)` : undefined,
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: role.gradient, border: `1px solid ${role.border}` }}
                      >
                        <role.icon size={18} style={{ color: role.accentColor }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="font-sans text-[10px] font-bold uppercase tracking-wider" style={{ color: role.accentColor }}>
                            {role.department}
                          </span>
                          <span className="font-sans text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                            · {role.location} · {role.type}
                          </span>
                        </div>
                        <h3
                          className="font-display font-bold text-lg mb-2 group-hover:text-[var(--accent)] transition-colors duration-200"
                          style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
                        >
                          {role.title}
                        </h3>
                        <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {role.description}
                        </p>
                      </div>
                    </div>

                    <div
                      className="mt-4 pt-4 flex justify-end"
                      style={{ borderTop: '1px solid var(--glass-border-1)' }}
                    >
                      <span className="font-sans text-sm font-semibold" style={{ color: isSelected ? role.accentColor : 'var(--text-muted)' }}>
                        {isSelected ? 'Selected — fill in the form →' : 'Apply for this role →'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Application form panel */}
            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, x: 16, filter: 'blur(6px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="glass-card rounded-2xl overflow-hidden sticky top-32">
                <div className="h-0.5" style={{ background: 'var(--gradient-dreamy)', opacity: 0.5 }} />
                <div className="p-7">
                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-center py-10"
                      >
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                          style={{ background: 'var(--gradient-primary)' }}
                        >
                          <CheckCircle size={26} className="text-white" />
                        </motion.div>
                        <h3 className="font-display font-bold text-2xl mb-2" style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>
                          Application sent!
                        </h3>
                        <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>
                          We&apos;ll review your profile and be in touch within 3 business days.
                        </p>
                        <button
                          onClick={() => { setSubmitted(false); setSelectedRole(null); }}
                          className="btn-secondary px-6 py-2.5 text-sm mt-6"
                        >
                          Submit another application
                        </button>
                      </motion.div>
                    ) : selectedRole ? (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="mb-6">
                          <p className="font-sans text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: selectedRole.accentColor }}>
                            Applying for
                          </p>
                          <h3 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                            {selectedRole.title}
                          </h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                          <input
                            type="text"
                            name="website"
                            value={form.website}
                            onChange={(e) => setForm({ ...form, website: e.target.value })}
                            className="sr-only"
                            tabIndex={-1}
                            autoComplete="off"
                            aria-hidden
                          />
                          <div className="flex flex-col gap-1.5">
                            <label className="font-sans text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                              Full Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={form.name}
                              onChange={(e) => setForm({ ...form, name: e.target.value })}
                              placeholder="Jane Smith"
                              className="input-cinematic text-sm"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="font-sans text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                              Email Address *
                            </label>
                            <input
                              type="email"
                              required
                              value={form.email}
                              onChange={(e) => setForm({ ...form, email: e.target.value })}
                              placeholder="jane@email.com"
                              className="input-cinematic text-sm"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="font-sans text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                              Portfolio / GitHub / LinkedIn
                            </label>
                            <input
                              type="url"
                              value={form.portfolio}
                              onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
                              placeholder="https://..."
                              className="input-cinematic text-sm"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="font-sans text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                              Why BinaryScouts?
                            </label>
                            <textarea
                              rows={3}
                              value={form.message}
                              onChange={(e) => setForm({ ...form, message: e.target.value })}
                              placeholder="Tell us what excites you about this role..."
                              className="input-cinematic text-sm"
                              style={{ resize: 'vertical', minHeight: 80 }}
                            />
                          </div>

                          {error && (
                            <p role="alert" className="font-sans text-sm" style={{ color: '#f87171' }}>
                              {error}
                            </p>
                          )}

                          <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="btn-primary w-full justify-center gap-2 text-sm py-3.5 mt-2"
                            style={{ opacity: status === 'loading' ? 0.7 : 1, cursor: status === 'loading' ? 'wait' : 'pointer' }}
                          >
                            <Send size={14} />
                            {status === 'loading' ? 'Submitting…' : 'Submit Application'}
                          </button>
                        </form>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-12"
                      >
                        <Briefcase
                          size={40}
                          className="mx-auto mb-4"
                          style={{ color: 'var(--text-muted)', opacity: 0.4 }}
                        />
                        <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                          Select a role
                        </h3>
                        <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>
                          Click on a position on the left to open the application form.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </main>

      <Footer />
    </PageTransition>
  );
}

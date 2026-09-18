'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useContactInfo } from '@/components/hooks/useContactInfo';
import { ENGAGEMENT_STEPS, PROJECT_TYPES } from '@/lib/company';
import { trackEvent } from '@/lib/analytics';

export default function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const submittingRef = useRef(false);
  const { email: contactEmail } = useContactInfo();

  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    projectType: '',
    timeline: '',
    budget: '',
    message: '',
    website: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current || status === 'loading' || status === 'success') return;
    submittingRef.current = true;
    setStatus('loading');
    setErrorMsg('');
    trackEvent('cta_click', { location: 'contact_section', label: 'start_project' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          name: form.name,
          email: form.email,
          company: form.company,
          projectType: form.projectType,
          timeline: form.timeline,
          budget: form.budget,
          message: form.message,
          website: form.website,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('error');
        setErrorMsg(typeof data.error === 'string' ? data.error : 'Something went wrong. Please try again.');
        trackEvent('form_submit', { form: 'contact', status: 'error' });
        return;
      }
      setStatus('success');
      trackEvent('form_submit', { form: 'contact', status: 'success' });
      setForm({
        name: '',
        company: '',
        email: '',
        projectType: '',
        timeline: '',
        budget: '',
        message: '',
        website: '',
      });
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again or email us directly.');
      trackEvent('form_submit', { form: 'contact', status: 'error' });
    } finally {
      submittingRef.current = false;
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    padding: '12px 16px',
    color: 'var(--text-1)',
    fontFamily: 'var(--font-inter)',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--text-3)',
    marginBottom: 6,
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-24 md:py-32"
      style={{ background: 'var(--space)' }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="v2-eyebrow" style={{ marginBottom: 16 }}>
              Start a project
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-syne)',
                fontWeight: 700,
                fontSize: 'clamp(28px, 4vw, 42px)',
                color: 'var(--text-1)',
                lineHeight: 1.15,
                marginBottom: 16,
              }}
            >
              Tell us what you&apos;re building.
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 15,
                color: 'var(--text-2)',
                lineHeight: 1.7,
                marginBottom: 28,
                maxWidth: 420,
              }}
            >
              BinaryScouts is a lean engineering team. Share enough context for a useful first
              conversation — we review every request and reply with next steps.
            </p>

            <div className="mb-8 space-y-3">
              {ENGAGEMENT_STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--indigo)',
                      width: 28,
                      flexShrink: 0,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: 14,
                      color: 'var(--text-2)',
                    }}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>

            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: 'var(--text-3)' }}>
              Prefer email?{' '}
              <a
                href={`mailto:${contactEmail}`}
                className="underline underline-offset-2"
                style={{ color: 'var(--indigo)' }}
                onClick={() => trackEvent('cta_click', { location: 'contact_section', label: 'email' })}
              >
                {contactEmail}
              </a>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {status === 'success' ? (
              <div
                className="flex flex-col items-start gap-4 rounded-2xl p-8"
                style={{
                  background: 'var(--space-3)',
                  border: '0.5px solid var(--border-v2)',
                }}
                role="status"
              >
                <CheckCircle2 size={28} style={{ color: 'var(--indigo)' }} aria-hidden />
                <h3
                  style={{
                    fontFamily: 'var(--font-syne)',
                    fontWeight: 700,
                    fontSize: 22,
                    color: 'var(--text-1)',
                  }}
                >
                  Request received.
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 14,
                    color: 'var(--text-2)',
                    lineHeight: 1.6,
                  }}
                >
                  Thank you. Your project request has been received. We&apos;ll review it and get
                  back to you with next steps.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="relative space-y-4 rounded-2xl p-6 md:p-8"
                style={{
                  background: 'var(--space-3)',
                  border: '0.5px solid var(--border-v2)',
                }}
                noValidate
              >
                <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => update('website', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" style={labelStyle}>
                      Name *
                    </label>
                    <input
                      id="contact-name"
                      required
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      style={inputStyle}
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-company" style={labelStyle}>
                      Company
                    </label>
                    <input
                      id="contact-company"
                      value={form.company}
                      onChange={(e) => update('company', e.target.value)}
                      style={inputStyle}
                      autoComplete="organization"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-email" style={labelStyle}>
                    Business email *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    style={inputStyle}
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label htmlFor="contact-type" style={labelStyle}>
                    Project type
                  </label>
                  <select
                    id="contact-type"
                    value={form.projectType}
                    onChange={(e) => update('projectType', e.target.value)}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="">Select…</option>
                    {PROJECT_TYPES.map((t) => (
                      <option key={t} value={t} style={{ background: '#0a0a0f', color: '#fff' }}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-timeline" style={labelStyle}>
                      Desired timeline
                    </label>
                    <input
                      id="contact-timeline"
                      value={form.timeline}
                      onChange={(e) => update('timeline', e.target.value)}
                      placeholder="e.g. 8–12 weeks"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-budget" style={labelStyle}>
                      Approx. budget (optional)
                    </label>
                    <input
                      id="contact-budget"
                      value={form.budget}
                      onChange={(e) => update('budget', e.target.value)}
                      placeholder="Optional"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" style={labelStyle}>
                    Project description *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    placeholder="What are you building, and what problem should it solve?"
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }}
                  />
                </div>

                {status === 'error' && (
                  <p
                    role="alert"
                    style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#f87171' }}
                  >
                    {errorMsg || 'Something went wrong. Please try again or contact us directly.'}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl py-3.5 transition-opacity disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(135deg, var(--indigo), var(--cyan-v2))',
                    color: '#fff',
                    fontFamily: 'var(--font-syne)',
                    fontWeight: 700,
                    fontSize: 15,
                    border: 'none',
                    cursor: status === 'loading' ? 'wait' : 'pointer',
                  }}
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" aria-hidden />
                      Sending…
                    </>
                  ) : (
                    <>
                      Start a project
                      <ArrowUpRight
                        size={16}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden
                      />
                    </>
                  )}
                </button>

                <p
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 12,
                    color: 'var(--text-3)',
                    textAlign: 'center',
                  }}
                >
                  Custom engagements based on scope, complexity and timeline.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

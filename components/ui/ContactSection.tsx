'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', company: '', budget: '', message: '', website: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'contact', ...formData }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('error');
        setError(data.error || 'Could not send message. Please try again.');
        return;
      }
      setSubmitted(true);
      setStatus('idle');
    } catch {
      setStatus('error');
      setError('Network error. Email us at hello@binaryscouts.com.');
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden" style={{ padding: '140px 0', backgroundColor: 'var(--space)' }}>
      {/* Orbiting glow */}
      <div className="absolute pointer-events-none" style={{ width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, var(--indigo-glow) 0%, transparent 70%)', top: '20%', left: '10%', filter: 'blur(80px)', animation: 'orbit-cta-1 12s ease-in-out infinite' }} />
      <div className="absolute pointer-events-none" style={{ width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)', bottom: '10%', right: '10%', filter: 'blur(80px)', animation: 'orbit-cta-2 15s ease-in-out infinite' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left column */}
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-4">
              <span className="v2-eyebrow">START A PROJECT</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 'clamp(32px, 4vw, 54px)', color: 'var(--text-1)', lineHeight: 1.15, marginBottom: 20 }}
            >
              Ready to build<br />
              something <span className="v2-gradient-word">real?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              style={{ fontFamily: 'var(--font-inter)', fontSize: 16, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 40, maxWidth: '50ch' }}
            >
              Tell us about your project. We&apos;ll respond within 24 hours with an honest assessment — not a sales pitch.
            </motion.p>

            {/* Engagement info */}
            <div className="space-y-5">
              {[
                { label: 'Avg. Response Time', value: '<24 hours', icon: '⏱' },
                { label: 'Discovery Call', value: '30 min, free', icon: '📞' },
                { label: 'Typical Engagement', value: '$15K – $80K', icon: '💰' },
              ].map((info) => (
                <div key={info.label} className="flex items-center gap-4">
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--space-3)', border: '0.5px solid var(--border-v2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                    {info.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: 'var(--text-1)', fontWeight: 600 }}>{info.value}</div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'var(--text-3)' }}>{info.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                role="status"
                aria-live="polite"
                style={{
                  background: 'var(--space-2)',
                  border: '0.5px solid var(--border-v2)',
                  borderRadius: 20,
                  padding: 48,
                  textAlign: 'center',
                }}
              >
                <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 28, color: 'var(--text-1)', marginBottom: 12 }}>
                  Message received!
                </h3>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: 15, color: 'var(--text-2)', lineHeight: 1.6 }}>
                  We&apos;ll review your project details and respond within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ background: 'var(--space-2)', border: '0.5px solid var(--border-v2)', borderRadius: 20, padding: 'clamp(28px, 4vw, 44px)' }} noValidate={false}>
                {/* Honeypot */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}>
                  <label htmlFor="contact-website">Website</label>
                  <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={formData.website} onChange={handleChange} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="contact-name" style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'var(--text-3)', display: 'block', marginBottom: 6, fontWeight: 500 }}>Your Name *</label>
                    <input id="contact-name" name="name" value={formData.name} onChange={handleChange} required autoComplete="name" placeholder="Jane Smith" className="input-cinematic" style={{ fontSize: 14, padding: '12px 16px', borderRadius: 12 }} />
                  </div>
                  <div>
                    <label htmlFor="contact-email" style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'var(--text-3)', display: 'block', marginBottom: 6, fontWeight: 500 }}>Email *</label>
                    <input id="contact-email" name="email" type="email" value={formData.email} onChange={handleChange} required autoComplete="email" placeholder="jane@company.com" className="input-cinematic" style={{ fontSize: 14, padding: '12px 16px', borderRadius: 12 }} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="contact-company" style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'var(--text-3)', display: 'block', marginBottom: 6, fontWeight: 500 }}>Company</label>
                    <input id="contact-company" name="company" value={formData.company} onChange={handleChange} autoComplete="organization" placeholder="Company Inc." className="input-cinematic" style={{ fontSize: 14, padding: '12px 16px', borderRadius: 12 }} />
                  </div>
                  <div>
                    <label htmlFor="contact-budget" style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'var(--text-3)', display: 'block', marginBottom: 6, fontWeight: 500 }}>Budget Range</label>
                    <select id="contact-budget" name="budget" value={formData.budget} onChange={handleChange} className="select-cinematic" style={{ fontSize: 14, padding: '12px 16px', borderRadius: 12 }}>
                      <option value="">Select range...</option>
                      <option value="15k-25k">$15K – $25K</option>
                      <option value="25k-50k">$25K – $50K</option>
                      <option value="50k-80k">$50K – $80K</option>
                      <option value="80k+">$80K+</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="contact-message" style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'var(--text-3)', display: 'block', marginBottom: 6, fontWeight: 500 }}>Tell us about your project *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="What are you building? What's your timeline? What's the biggest technical challenge?"
                    className="input-cinematic"
                    style={{ fontSize: 14, padding: '12px 16px', borderRadius: 12, resize: 'vertical' }}
                  />
                </div>

                {error && (
                  <p role="alert" style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#f87171', marginBottom: 12 }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  style={{
                    width: '100%',
                    padding: '16px 24px',
                    background: 'linear-gradient(135deg, var(--indigo), var(--cyan-v2))',
                    borderRadius: 12,
                    border: 'none',
                    fontFamily: 'var(--font-inter)',
                    fontWeight: 600,
                    fontSize: 16,
                    color: '#fff',
                    cursor: status === 'loading' ? 'wait' : 'pointer',
                    opacity: status === 'loading' ? 0.75 : 1,
                  }}
                >
                  {status === 'loading' ? 'Sending…' : 'Submit Inquiry →'}
                </button>

                <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: 'var(--text-3)', textAlign: 'center', marginTop: 12 }}>
                  No spam. No generic follow-ups. Just a real response from a real engineer.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

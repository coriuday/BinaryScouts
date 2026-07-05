'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/motion/PageTransition';
import { Mail, MessageSquare, Send, Sparkles, CheckCircle, Loader2, MapPin, Clock, Phone } from 'lucide-react';
import { ease, dur, viewport } from '@/lib/motion';
import { useContactInfo } from '@/components/hooks/useContactInfo';
import { getContactEmail } from '@/lib/site-contact';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export default function ContactPage() {
  const { email: contactEmail, phoneDisplay, whatsappUrl } = useContactInfo();
  const [form, setForm] = useState({ name: '', email: '', message: '', budget: '', timeline: '', website: '' });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState('');
  const [emailDelivered, setEmailDelivered] = useState(true);

  const INFO_CARDS = useMemo(
    () => [
      {
        icon: Mail,
        title: 'Email',
        value: contactEmail,
        href: `mailto:${contactEmail}`,
        sub: 'Usually responds within 4 hours',
        gradient: 'linear-gradient(135deg, rgba(139,92,246,0.14), rgba(167,139,250,0.05))',
        iconColor: 'var(--accent)',
        border: 'rgba(139,92,246,0.22)',
      },
      {
        icon: Phone,
        title: 'WhatsApp',
        value: phoneDisplay,
        href: whatsappUrl,
        sub: 'Chat with us instantly',
        gradient: 'linear-gradient(135deg, rgba(37,211,102,0.14), rgba(16,185,129,0.05))',
        iconColor: '#25D366',
        border: 'rgba(37,211,102,0.25)',
      },
      {
        icon: Clock,
        title: 'Availability',
        value: 'Mon – Fri, 9am – 6pm IST',
        sub: 'Emergency support available',
        gradient: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(244,114,182,0.05))',
        iconColor: 'var(--rose)',
        border: 'rgba(236,72,153,0.20)',
      },
      {
        icon: MapPin,
        title: 'Studio',
        value: 'Remote-first, globally distributed',
        sub: 'Serving clients worldwide',
        gradient: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(110,231,183,0.05))',
        iconColor: 'var(--sage)',
        border: 'rgba(16,185,129,0.20)',
      },
    ],
    [contactEmail, phoneDisplay, whatsappUrl]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'contact', ...form }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('error');
        setError(data.error || 'Could not send message.');
        return;
      }
      setEmailDelivered(data.delivered !== false);
      setStatus('success');
    } catch {
      setStatus('error');
      setError(`Network error. Email ${getContactEmail()}.`);
    }
  };

  return (
    <PageTransition>
      <Navbar />

      <main className="flex-grow pt-36 pb-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div
            className="mb-16 max-w-2xl"
            initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="eyebrow-badge mb-6">
              <MessageSquare size={11} />
              <span>Get in Touch</span>
            </div>
            <h1
              className="font-display font-bold text-5xl md:text-6xl tracking-tight mb-5"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.05em' }}
            >
              Let&apos;s build something{' '}
              <span className="gradient-text">remarkable.</span>
            </h1>
            <p
              className="font-sans text-lg leading-relaxed"
              style={{ color: 'var(--text-secondary)', letterSpacing: '-0.01em' }}
            >
              Tell us about your project and we&apos;ll get back to you with a tailored strategy within one business day.
            </p>
          </motion.div>

          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {INFO_CARDS.map((card, i) => {
              const inner = (
                <>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: card.gradient, border: `1px solid ${card.border}` }}
                  >
                    <card.icon size={16} style={{ color: card.iconColor }} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-sans text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>
                      {card.title}
                    </p>
                    <p className="font-sans text-sm font-semibold truncate" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                      {card.value}
                    </p>
                    <p className="font-sans text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {card.sub}
                    </p>
                  </div>
                </>
              );
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="glass-card rounded-2xl p-5 flex items-center gap-4"
                >
                  {'href' in card && card.href ? (
                    <a
                      href={card.href}
                      target={card.href.startsWith('http') ? '_blank' : undefined}
                      rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-4 w-full no-underline"
                      style={{ color: 'inherit' }}
                    >
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Main form card */}
          <motion.div
            initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card rounded-[2rem] overflow-hidden"
          >
            {/* Gradient top highlight */}
            <div
              className="h-0.5 w-full"
              style={{ background: 'var(--gradient-dreamy)', opacity: 0.5 }}
            />

            <div className="p-8 md:p-12 relative overflow-hidden">
              {/* Inner radial gradient */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 20%, rgba(139,92,246,0.06) 0%, transparent 70%)' }}
              />

              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  /* Success state */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center py-12 relative z-10"
                  >
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                      style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-brand)' }}
                    >
                      <CheckCircle size={32} className="text-white" />
                    </motion.div>
                    <h3
                      className="font-display font-bold text-3xl mb-3"
                      style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}
                    >
                      {emailDelivered ? 'Message sent!' : 'Message saved!'}
                    </h3>
                    <p className="font-sans text-lg" style={{ color: 'var(--text-secondary)' }}>
                      {emailDelivered
                        ? "We'll be in touch within one business day with a tailored response."
                        : "We've saved your message and will follow up within one business day."}
                    </p>
                    <button
                      onClick={() => { setStatus('idle'); setError(''); setForm({ name: '', email: '', message: '', budget: '', timeline: '', website: '' }); }}
                      className="btn-secondary px-8 py-3 text-sm mt-8"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  /* Form */
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div aria-hidden="true" className="sr-only">
                      <label htmlFor="page-contact-website">Website</label>
                      <input id="page-contact-website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="page-contact-name" className="font-sans text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        Your Name *
                      </label>
                      <input
                        id="page-contact-name"
                        type="text"
                        required
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Jane Smith"
                        className="input-cinematic"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="page-contact-email" className="font-sans text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        Email Address *
                      </label>
                      <input
                        id="page-contact-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="jane@company.com"
                        className="input-cinematic"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="page-contact-budget" className="font-sans text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        Budget (INR)
                      </label>
                      <input
                        id="page-contact-budget"
                        type="text"
                        value={form.budget}
                        onChange={(e) => setForm({ ...form, budget: e.target.value })}
                        placeholder="e.g. ₹5,00,000 or 10 lakhs"
                        className="input-cinematic"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="page-contact-timeline" className="font-sans text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        Expected Timeline
                      </label>
                      <input
                        id="page-contact-timeline"
                        type="text"
                        value={form.timeline}
                        onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                        placeholder="e.g. 3 months, 6 weeks"
                        className="input-cinematic"
                      />
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-2">
                      <label htmlFor="page-contact-message" className="font-sans text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        Tell Us About Your Project *
                      </label>
                      <textarea
                        id="page-contact-message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Describe what you're building, what problem you're solving, and what success looks like..."
                        className="input-cinematic"
                        style={{ resize: 'vertical', minHeight: 120 }}
                      />
                    </div>

                    {error && (
                      <p role="alert" className="md:col-span-2 font-sans text-sm" style={{ color: '#f87171' }}>{error}</p>
                    )}

                    {/* Submit */}
                    <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>
                        No commitment required. We&apos;ll respond within one business day.
                      </p>
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="btn-primary text-base px-8 py-4 gap-2 whitespace-nowrap flex-shrink-0"
                        style={{ opacity: status === 'loading' ? 0.7 : 1 }}
                      >
                        {status === 'loading' ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={15} />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Alternative CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 text-center"
          >
            <p className="font-sans text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
              Prefer a direct conversation?
            </p>
            <a href="/planner">
              <button className="btn-primary text-base px-8 py-3.5 gap-2">
                <Sparkles size={15} />
                Book a Free 30-Min Strategy Call
              </button>
            </a>
          </motion.div>

        </div>
      </main>

      <Footer />
    </PageTransition>
  );
}

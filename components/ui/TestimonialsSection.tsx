'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { reviewInitials, type Review } from '@/lib/review-types';

type DisplayReview = Pick<Review, 'id' | 'name' | 'role' | 'company' | 'quote' | 'stars'>;

function duplicateForLoop<T>(items: T[]): T[] {
  return items.length > 0 ? [...items, ...items] : [];
}

function reviewCardKey(t: DisplayReview, prefix: string, index: number): string {
  return t.id ? `${prefix}-${t.id}-${index}` : `${prefix}-${t.name}-${t.quote.slice(0, 20)}-${index}`;
}

const TestimonialCard: React.FC<{ t: DisplayReview }> = ({ t }) => {
  const initials = reviewInitials(t.name);
  const roleLine = [t.role, t.company].filter(Boolean).join(', ');

  return (
    <div
      style={{
        background: 'var(--space-3)',
        border: '0.5px solid var(--border-strong-v2)',
        borderRadius: 16,
        padding: '26px 30px',
        minWidth: 340,
        maxWidth: 340,
        flexShrink: 0,
      }}
    >
      <div style={{ color: 'var(--amber)', fontSize: 13, letterSpacing: 2, marginBottom: 12 }}>
        {'★'.repeat(t.stars)}
      </div>
      <p style={{ fontFamily: 'var(--font-inter)', fontWeight: 400, fontSize: 15, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 16 }}>
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--indigo), var(--purple))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: 14,
            color: '#fff',
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-inter)', fontWeight: 600, fontSize: 14, color: 'var(--text-1)' }}>{t.name}</div>
          {roleLine && (
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'var(--text-3)' }}>{roleLine}</div>
          )}
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection: React.FC = () => {
  const [reviews, setReviews] = useState<DisplayReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', role: '', company: '', quote: '', stars: 5, website: '' });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');

  const loadReviews = () => {
    fetch('/api/reviews')
      .then((r) => r.json())
      .then((data) => setReviews(data.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');
    setSubmitError('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitStatus('error');
        setSubmitError(data.error || 'Could not submit review.');
        return;
      }
      setSubmitStatus('success');
      setForm({ name: '', role: '', company: '', quote: '', stars: 5, website: '' });
    } catch {
      setSubmitStatus('error');
      setSubmitError('Network error. Please try again.');
    }
  };

  const hasReviews = reviews.length > 0;
  const useTicker = reviews.length >= 3;
  const splitAt = Math.ceil(reviews.length / 2);
  const row1 = duplicateForLoop(reviews.slice(0, splitAt));
  const row2 = duplicateForLoop(reviews.slice(splitAt));

  return (
    <section style={{ backgroundColor: 'var(--space-2)', padding: '140px 0', overflow: 'hidden' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-4">
          <span className="v2-eyebrow">CLIENT FEEDBACK</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 'clamp(32px, 4vw, 54px)', color: 'var(--text-1)', lineHeight: 1.15, marginBottom: 24 }}
        >
          What founders say<br />
          after we <span className="v2-gradient-word">deliver.</span>
        </motion.h2>

        {!loading && !hasReviews && (
          <div
            style={{
              background: 'var(--space-3)',
              border: '0.5px solid var(--border-v2)',
              borderRadius: 16,
              padding: '28px 32px',
              maxWidth: 560,
              marginBottom: 8,
            }}
          >
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 16, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 8 }}>
              Client reviews appear here after verification. We don&apos;t publish placeholder testimonials.
            </p>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: 'var(--text-3)', lineHeight: 1.55 }}>
              Worked with us? Share your experience below — honest feedback helps the next founder decide.
            </p>
          </div>
        )}
      </div>

      {hasReviews && !useTicker && (
        <div className="flex flex-wrap justify-center gap-5 mb-12 px-4 sm:px-6 lg:px-8">
          {reviews.map((t, i) => (
            <TestimonialCard key={reviewCardKey(t, 'static', i)} t={t} />
          ))}
        </div>
      )}

      {hasReviews && useTicker && (
        <>
          <div className="v2-ticker-row mb-4" style={{ overflow: 'hidden' }}>
            <div
              className="v2-ticker-track flex gap-5"
              style={{
                animation: 'scroll-testimonial 55s linear infinite',
                width: 'max-content',
              }}
            >
              {row1.map((t, i) => (
                <TestimonialCard key={reviewCardKey(t, 'r1', i)} t={t} />
              ))}
            </div>
          </div>
          {row2.length > 0 && (
            <div className="v2-ticker-row mb-12" style={{ overflow: 'hidden' }}>
              <div
                className="v2-ticker-track flex gap-5"
                style={{
                  animation: 'scroll-testimonial-reverse 55s linear infinite',
                  width: 'max-content',
                }}
              >
                {row2.map((t, i) => (
                  <TestimonialCard key={reviewCardKey(t, 'r2', i)} t={t} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Review submit form */}
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'var(--space-3)',
            border: '0.5px solid var(--border-v2)',
            borderRadius: 20,
            padding: 'clamp(24px, 4vw, 36px)',
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: 20, color: 'var(--text-1)', marginBottom: 16 }}>
            Share your experience
          </h3>

          {submitStatus === 'success' ? (
            <p role="status" style={{ fontFamily: 'var(--font-inter)', fontSize: 15, color: 'var(--emerald)', lineHeight: 1.6 }}>
              Thank you! Your review will appear after verification.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}>
                <input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="review-name" style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Your Name *</label>
                  <input id="review-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Smith" className="input-cinematic w-full" style={{ fontSize: 14, padding: '10px 14px', borderRadius: 10 }} />
                </div>
                <div>
                  <label htmlFor="review-role" style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Role</label>
                  <input id="review-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="CTO" className="input-cinematic w-full" style={{ fontSize: 14, padding: '10px 14px', borderRadius: 10 }} />
                </div>
              </div>

              <div>
                <label htmlFor="review-company" style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Company</label>
                <input id="review-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Your company" className="input-cinematic w-full" style={{ fontSize: 14, padding: '10px 14px', borderRadius: 10 }} />
              </div>

              <div>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'var(--text-3)', display: 'block', marginBottom: 8 }}>Rating *</span>
                <div className="flex gap-2" role="group" aria-label="Star rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setForm({ ...form, stars: n })}
                      aria-label={`${n} stars`}
                      style={{
                        fontSize: 22,
                        color: n <= form.stars ? 'var(--amber)' : 'var(--text-3)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        lineHeight: 1,
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="review-quote" style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Your Review *</label>
                <textarea
                  id="review-quote"
                  required
                  minLength={20}
                  maxLength={500}
                  rows={4}
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                  placeholder="Tell others about your experience working with BinaryScouts..."
                  className="input-cinematic w-full"
                  style={{ fontSize: 14, padding: '10px 14px', borderRadius: 10, resize: 'vertical' }}
                />
              </div>

              {submitError && (
                <p role="alert" style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#f87171' }}>{submitError}</p>
              )}

              <button
                type="submit"
                disabled={submitStatus === 'loading'}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  background: 'linear-gradient(135deg, var(--indigo), var(--cyan-v2))',
                  borderRadius: 12,
                  border: 'none',
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 600,
                  fontSize: 15,
                  color: '#fff',
                  cursor: submitStatus === 'loading' ? 'wait' : 'pointer',
                  opacity: submitStatus === 'loading' ? 0.75 : 1,
                }}
              >
                {submitStatus === 'loading' ? 'Submitting…' : 'Submit Review'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

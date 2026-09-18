'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import { getFeaturedProjects, type Project } from '@/lib/projects';
import SitePreview from '@/components/ui/SitePreview';
import { useFocusTrap } from '@/hooks/useFocusTrap';

const ACCENTS = [
  { accent: '#00d4ff', accentBg: 'rgba(0,212,255,0.08)' },
  { accent: '#a78bfa', accentBg: 'rgba(167,139,250,0.08)' },
];

function projectAccent(index: number) {
  return ACCENTS[index % ACCENTS.length];
}

/* ── Case Study Card ─────────────────────────────────── */
const CaseStudyCard: React.FC<{
  project: Project;
  index: number;
  onOpen: () => void;
}> = ({ project, index, onOpen }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const { accent, accentBg } = projectAccent(index);

  return (
    <motion.div
      ref={ref}
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        background: 'var(--space-3)',
        border: '0.5px solid var(--border-v2)',
        borderRadius: 20,
        overflow: 'hidden',
        display: 'flex',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, border-color 0.3s ease',
      }}
      className="flex-col md:flex-row"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.01)';
        e.currentTarget.style.borderColor = `${accent}55`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.borderColor = 'var(--border-v2)';
      }}
    >
      <div
        className="w-full md:w-[38%] relative"
        style={{ minHeight: 200, background: accentBg }}
      >
        <SitePreview
          url={project.liveUrl}
          title={project.title}
          accent={accent}
          gradient={project.gradient}
        />
      </div>

      <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
        <span
          style={{
            background: accentBg,
            border: `0.5px solid ${accent}40`,
            borderRadius: 6,
            padding: '4px 10px',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: accent,
            width: 'fit-content',
            marginBottom: 12,
          }}
        >
          {project.category}
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: 'clamp(20px, 2.5vw, 28px)',
            color: 'var(--text-1)',
            lineHeight: 1.25,
            marginBottom: 10,
          }}
        >
          {project.hook}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 14,
            color: 'var(--text-2)',
            lineHeight: 1.6,
            marginBottom: 16,
          }}
        >
          {project.description}
        </p>
        <div className="flex flex-wrap gap-4 mb-4">
          {project.metrics.slice(0, 3).map((m) => (
            <div key={m.label}>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 16,
                  fontWeight: 600,
                  color: accent,
                }}
              >
                {m.value}
              </p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: 'var(--text-3)' }}>
                {m.label}
              </p>
            </div>
          ))}
        </div>
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: accent, fontWeight: 600 }}>
          View details →
        </span>
      </div>
    </motion.div>
  );
};

/* ── Toast-style project popup ───────────────────────── */
const ProjectToast: React.FC<{
  project: Project;
  index: number;
  onClose: () => void;
}> = ({ project, index, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const { accent, accentBg } = projectAccent(index);
  useFocusTrap(true, panelRef);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-toast-title"
        tabIndex={-1}
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 460,
          maxHeight: 'min(85vh, 640px)',
          overflowY: 'auto',
          background: 'var(--space-2)',
          border: '0.5px solid rgba(0,212,255,0.22)',
          borderRadius: 20,
          boxShadow: '0 24px 80px rgba(0,0,0,0.55), 0 0 40px rgba(0,212,255,0.12)',
          padding: '24px 22px 20px',
          outline: 'none',
          marginBottom: 8,
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <span
            style={{
              background: accentBg,
              border: `0.5px solid ${accent}40`,
              borderRadius: 6,
              padding: '4px 10px',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: accent,
            }}
          >
            {project.category}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              border: '0.5px solid var(--border-v2)',
              background: 'var(--space-3)',
              color: 'var(--text-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {project.liveUrl && (
          <div style={{ marginBottom: 16 }}>
            <SitePreview
              url={project.liveUrl}
              title={project.title}
              accent={accent}
              gradient={project.gradient}
              compact
            />
          </div>
        )}

        <h2
          id="project-toast-title"
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: 22,
            color: 'var(--text-1)',
            lineHeight: 1.25,
            marginBottom: 8,
          }}
        >
          {project.title}
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 14,
            color: 'var(--text-2)',
            lineHeight: 1.6,
            marginBottom: 16,
          }}
        >
          {project.description}
        </p>

        {/* Metrics */}
        <div
          className="grid grid-cols-3 gap-2 mb-4"
          style={{
            background: 'var(--space-3)',
            borderRadius: 12,
            padding: 12,
            border: '0.5px solid var(--border-v2)',
          }}
        >
          {project.metrics.slice(0, 3).map((m) => (
            <div key={m.label} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color: accent }}>
                {m.value}
              </p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: 'var(--text-3)' }}>
                {m.label}
              </p>
            </div>
          ))}
        </div>

        {project.caseStudy && (
          <div className="mb-4 space-y-3">
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--text-3)',
                  marginBottom: 4,
                }}
              >
                Challenge
              </p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55 }}>
                {project.caseStudy.problem}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--text-3)',
                  marginBottom: 4,
                }}
              >
                What we built
              </p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55 }}>
                {project.caseStudy.solution}
              </p>
            </div>
          </div>
        )}

        {/* Tech pills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.techStack.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                padding: '4px 8px',
                borderRadius: 999,
                background: accentBg,
                color: accent,
                border: `0.5px solid ${accent}33`,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px 16px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #00a8cc, #00d4ff)',
                color: '#001a22',
                fontFamily: 'var(--font-inter)',
                fontWeight: 600,
                fontSize: 14,
                textDecoration: 'none',
                boxShadow: '0 0 20px rgba(0,212,255,0.25)',
              }}
            >
              Visit live site
              <ExternalLink size={15} />
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              border: '0.5px solid var(--border-v2)',
              background: 'var(--space-3)',
              color: 'var(--text-2)',
              fontFamily: 'var(--font-inter)',
              fontWeight: 500,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── Case Studies Section ────────────────────────────── */
const CaseStudiesNew: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(() => getFeaturedProjects());
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/cms/projects?featured=true')
      .then((r) => r.json())
      .then((d) => {
        if (d.projects?.length) setProjects(d.projects);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="work" style={{ backgroundColor: 'var(--space-2)', padding: '140px 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <span className="v2-eyebrow">CLIENT WORK</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: 'clamp(32px, 4vw, 54px)',
            color: 'var(--text-1)',
            lineHeight: 1.15,
            marginBottom: 48,
          }}
        >
          Two shipped products.
          <br />
          <span className="v2-gradient-word">Real</span> systems.
        </motion.h2>

        <div className="space-y-6">
          {projects.map((project, i) => (
            <CaseStudyCard
              key={project.id}
              project={project}
              index={i}
              onOpen={() => setActiveIdx(i)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeIdx !== null && projects[activeIdx] && (
          <ProjectToast
            project={projects[activeIdx]}
            index={activeIdx}
            onClose={() => setActiveIdx(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default CaseStudiesNew;

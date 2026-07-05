'use client';

import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { PROJECT_CATEGORIES, type Project, type ProjectStatus } from '@/lib/projects';
import SitePreview from '@/components/ui/SitePreview';

const GRADIENTS = [
  'linear-gradient(135deg, #00D4FF, #6366f1)',
  'linear-gradient(135deg, #6366f1, #a78bfa)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #10b981, #06b6d4)',
  'linear-gradient(135deg, #ec4899, #8b5cf6)',
];

type Props = {
  project?: Project | null;
  onClose: () => void;
  onSaved: (project: Project) => void;
};

const emptyProject = (): Partial<Project> & { slug: string; title: string } => ({
  slug: '',
  title: '',
  category: 'Web Platform',
  status: 'live',
  hook: '',
  description: '',
  caseStudy: { problem: '', solution: '', results: '' },
  techStack: [],
  tags: [],
  metrics: [{ value: '', label: '' }],
  liveUrl: '',
  githubUrl: '',
  images: [],
  gradient: GRADIENTS[0],
  featured: false,
  order: 0,
});

const ProjectFormModal: React.FC<Props> = ({ project, onClose, onSaved }) => {
  const isEdit = Boolean(project?.id);
  const [form, setForm] = useState(() => (project ? { ...project } : emptyProject()));
  const [techInput, setTechInput] = useState(project?.techStack?.join(', ') ?? '');
  const [tagsInput, setTagsInput] = useState(project?.tags?.join(', ') ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = <K extends keyof Project>(key: K, val: Project[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      techStack: techInput.split(',').map((s) => s.trim()).filter(Boolean),
      tags: tagsInput.split(',').map((s) => s.trim()).filter(Boolean),
      metrics: (form.metrics ?? []).filter((m) => m.value || m.label),
    };

    try {
      const url = isEdit ? `/api/admin/projects/${project!.id}` : '/api/admin/projects';
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Save failed');
        return;
      }
      onSaved(data.project);
      onClose();
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-6"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border-1)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
            {isEdit ? 'Edit Project' : 'Add Project'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--glass-2)' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="font-sans text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Title *</span>
              <input required value={form.title ?? ''} onChange={(e) => set('title', e.target.value)} className="admin-input" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-sans text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Slug *</span>
              <input required value={form.slug ?? ''} onChange={(e) => set('slug', e.target.value)} className="admin-input" placeholder="my-project" />
            </label>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <label className="flex flex-col gap-1">
              <span className="font-sans text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Category</span>
              <select value={form.category ?? ''} onChange={(e) => set('category', e.target.value)} className="admin-input">
                {PROJECT_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-sans text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Status</span>
              <select value={form.status ?? 'live'} onChange={(e) => set('status', e.target.value as ProjectStatus)} className="admin-input">
                <option value="live">Live</option>
                <option value="in-progress">In Progress</option>
                <option value="coming-soon">Coming Soon</option>
                <option value="draft">Draft</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-sans text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Sort Order</span>
              <input type="number" value={form.order ?? 0} onChange={(e) => set('order', Number(e.target.value))} className="admin-input" />
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="font-sans text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Hook</span>
            <input value={form.hook ?? ''} onChange={(e) => set('hook', e.target.value)} className="admin-input" />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-sans text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Description</span>
            <textarea value={form.description ?? ''} onChange={(e) => set('description', e.target.value)} rows={3} className="admin-input" />
          </label>

          <div className="grid grid-cols-1 gap-3 p-4 rounded-2xl" style={{ background: 'var(--glass-1)' }}>
            <p className="font-sans text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Case Study</p>
            {(['problem', 'solution', 'results'] as const).map((key) => (
              <label key={key} className="flex flex-col gap-1">
                <span className="font-sans text-xs capitalize" style={{ color: 'var(--text-muted)' }}>{key}</span>
                <textarea
                  value={form.caseStudy?.[key] ?? ''}
                  onChange={(e) => set('caseStudy', { ...form.caseStudy!, [key]: e.target.value })}
                  rows={2}
                  className="admin-input"
                />
              </label>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="font-sans text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Tech Stack (comma-separated)</span>
              <input value={techInput} onChange={(e) => setTechInput(e.target.value)} className="admin-input" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-sans text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Tags</span>
              <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="admin-input" />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="font-sans text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Live URL</span>
              <input value={form.liveUrl ?? ''} onChange={(e) => set('liveUrl', e.target.value)} className="admin-input" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-sans text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>GitHub URL</span>
              <input value={form.githubUrl ?? ''} onChange={(e) => set('githubUrl', e.target.value)} className="admin-input" />
            </label>
          </div>

          <div>
            <span className="font-sans text-xs font-semibold block mb-2" style={{ color: 'var(--text-muted)' }}>Gradient</span>
            <div className="flex gap-2 flex-wrap">
              {GRADIENTS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => set('gradient', g)}
                  className="w-10 h-10 rounded-xl"
                  style={{
                    background: g,
                    outline: form.gradient === g ? '2px solid var(--accent)' : 'none',
                    outlineOffset: 2,
                  }}
                />
              ))}
            </div>
          </div>

          {form.liveUrl && (
            <div className="h-40 rounded-xl overflow-hidden">
              <SitePreview url={form.liveUrl} title={form.title ?? ''} accent="#00d4ff" gradient={form.gradient ?? GRADIENTS[0]} />
            </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured ?? false} onChange={(e) => set('featured', e.target.checked)} />
            <span className="font-sans text-sm" style={{ color: 'var(--text-secondary)' }}>Featured on homepage</span>
          </label>

          {error && <p className="font-sans text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary px-5 py-2.5 text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary px-5 py-2.5 text-sm gap-2">
              <Save size={14} />
              {saving ? 'Saving…' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;

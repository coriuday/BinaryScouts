'use client';

import React, { useState } from 'react';
import { X, Save, Upload } from 'lucide-react';
import type { DbTeamMember } from '@/lib/cms/types';
import FlipCard from '@/components/ui/FlipCard';
import { teamMemberToFlipCard } from '@/lib/cms/types';

type Props = {
  member?: DbTeamMember | null;
  onClose: () => void;
  onSaved: () => void;
};

const emptyMember = (): Record<string, unknown> => ({
  name: '',
  username: '',
  titles: [],
  role: '',
  bio: '',
  image_url: '',
  stats: [{ label: 'Focus', value: '' }],
  skills: [],
  social_links: {},
  badges: [],
  experience: 0,
  projects_shipped: 0,
  sort_order: 0,
  show_on_homepage: true,
});

const TeamFormModal: React.FC<Props> = ({ member, onClose, onSaved }) => {
  const isEdit = Boolean(member?.id);
  const [form, setForm] = useState<Record<string, unknown>>(member ? { ...member } : emptyMember());
  const [titlesInput, setTitlesInput] = useState((member?.titles ?? []).join(', '));
  const [badgesInput, setBadgesInput] = useState((member?.badges ?? []).join(', '));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const set = (key: string, val: unknown) => setForm((f) => ({ ...f, [key]: val }));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.url) set('image_url', data.url);
      else setError(data.error || 'Upload failed');
    } catch {
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      titles: titlesInput.split(',').map((s) => s.trim()).filter(Boolean),
      badges: badgesInput.split(',').map((s) => s.trim()).filter(Boolean),
      social_links: {
        github: (form.social_links as { github?: string })?.github ?? '',
        linkedin: (form.social_links as { linkedin?: string })?.linkedin ?? '',
        twitter: (form.social_links as { twitter?: string })?.twitter ?? '',
      },
    };

    try {
      const url = isEdit ? `/api/admin/team/${member!.id}` : '/api/admin/team';
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
      onSaved();
      onClose();
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const previewRow = {
    id: member?.id ?? 'preview',
    name: String(form.name ?? ''),
    username: String(form.username ?? ''),
    titles: titlesInput.split(',').map((s) => s.trim()).filter(Boolean),
    role: String(form.role ?? ''),
    bio: String(form.bio ?? ''),
    image_url: String(form.image_url ?? ''),
    stats: (form.stats as { label: string; value: string }[]) ?? [],
    skills: [],
    social_links: form.social_links as { github?: string; linkedin?: string; twitter?: string },
    badges: [],
    experience: 0,
    projects_shipped: 0,
    sort_order: 0,
    show_on_homepage: true,
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-6"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border-1)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
            {isEdit ? 'Edit Team Member' : 'Add Team Member'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--glass-2)' }}>
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              <span className="font-sans text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Name *</span>
              <input required value={String(form.name ?? '')} onChange={(e) => set('name', e.target.value)} className="admin-input" />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="font-sans text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Username</span>
                <input value={String(form.username ?? '')} onChange={(e) => set('username', e.target.value)} className="admin-input" placeholder="@handle" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-sans text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Role</span>
                <input value={String(form.role ?? '')} onChange={(e) => set('role', e.target.value)} className="admin-input" />
              </label>
            </div>

            <label className="flex flex-col gap-1">
              <span className="font-sans text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Titles (comma-separated)</span>
              <input value={titlesInput} onChange={(e) => setTitlesInput(e.target.value)} className="admin-input" placeholder="Co-Founder, Lead Developer" />
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-sans text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Bio</span>
              <textarea value={String(form.bio ?? '')} onChange={(e) => set('bio', e.target.value)} rows={3} className="admin-input" />
            </label>

            <div>
              <span className="font-sans text-xs font-semibold block mb-2" style={{ color: 'var(--text-muted)' }}>Photo</span>
              <div className="flex items-center gap-3">
                <label className="btn-secondary text-sm px-4 py-2 gap-2 cursor-pointer">
                  <Upload size={14} />
                  {uploading ? 'Uploading…' : 'Upload'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </label>
                <input
                  value={String(form.image_url ?? '')}
                  onChange={(e) => set('image_url', e.target.value)}
                  className="admin-input flex-1"
                  placeholder="/team/photo.jpg or URL"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <label className="flex flex-col gap-1">
                <span className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>GitHub</span>
                <input
                  value={(form.social_links as { github?: string })?.github ?? ''}
                  onChange={(e) => set('social_links', { ...(form.social_links as object), github: e.target.value })}
                  className="admin-input"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>LinkedIn</span>
                <input
                  value={(form.social_links as { linkedin?: string })?.linkedin ?? ''}
                  onChange={(e) => set('social_links', { ...(form.social_links as object), linkedin: e.target.value })}
                  className="admin-input"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>Twitter</span>
                <input
                  value={(form.social_links as { twitter?: string })?.twitter ?? ''}
                  onChange={(e) => set('social_links', { ...(form.social_links as object), twitter: e.target.value })}
                  className="admin-input"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1">
              <span className="font-sans text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Badges</span>
              <input value={badgesInput} onChange={(e) => setBadgesInput(e.target.value)} className="admin-input" />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>Sort Order</span>
                <input type="number" value={Number(form.sort_order ?? 0)} onChange={(e) => set('sort_order', Number(e.target.value))} className="admin-input" />
              </label>
              <label className="flex items-center gap-2 cursor-pointer mt-6">
                <input type="checkbox" checked={Boolean(form.show_on_homepage)} onChange={(e) => set('show_on_homepage', e.target.checked)} />
                <span className="font-sans text-sm" style={{ color: 'var(--text-secondary)' }}>Show on homepage</span>
              </label>
            </div>

            {error && <p className="font-sans text-sm text-red-500">{error}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} className="btn-secondary px-5 py-2.5 text-sm">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary px-5 py-2.5 text-sm gap-2">
                <Save size={14} />
                {saving ? 'Saving…' : 'Save Member'}
              </button>
            </div>
          </form>

          <div className="flex flex-col items-center justify-center">
            <p className="font-sans text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>Flip Card Preview</p>
            {previewRow.name ? (
              <FlipCard data={teamMemberToFlipCard(previewRow as DbTeamMember)} index={0} />
            ) : (
              <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>Enter a name to preview</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamFormModal;

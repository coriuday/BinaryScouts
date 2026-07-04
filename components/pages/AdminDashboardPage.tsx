'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderOpen, Users, LogOut, Plus, Edit3, Trash2,
  ExternalLink, Sparkles, ChevronRight, X, CheckCircle, Save,
  Globe, TrendingUp, Zap,
} from 'lucide-react';
import {
  PROJECTS, type Project, type ProjectStatus, PROJECT_CATEGORIES,
} from '@/lib/projects';
import { TEAM_MEMBERS, type TeamMember } from '@/lib/team';
import { adminLogout } from '@/lib/admin-auth';
import { ease, dur } from '@/lib/motion';
import Logo from '@/components/ui/Logo';

/* ── Sidebar nav item ─────────────────────────────── */
const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}> = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl font-sans text-sm font-medium transition-all duration-200"
    style={{
      color: active ? '#fff' : 'var(--text-secondary)',
      background: active ? 'var(--gradient-primary)' : 'transparent',
    }}
    onMouseEnter={(e) => !active && (e.currentTarget.style.background = 'var(--glass-1)')}
    onMouseLeave={(e) => !active && (e.currentTarget.style.background = 'transparent')}
  >
    {icon}
    <span className="flex-1 text-left">{label}</span>
    {badge !== undefined && (
      <span
        className="text-xs font-bold px-2 py-0.5 rounded-full"
        style={{
          background: active ? 'rgba(255,255,255,0.25)' : 'var(--accent-light)',
          color: active ? '#fff' : 'var(--accent)',
        }}
      >
        {badge}
      </span>
    )}
  </button>
);

/* ── Status badge ─────────────────────────────────── */
const StatusBadge: React.FC<{ status: ProjectStatus }> = ({ status }) => {
  const cfg = {
    live:          { label: 'Live',        color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
    'in-progress': { label: 'In Progress', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
    'coming-soon': { label: 'Coming Soon', color: '#6B7280', bg: 'rgba(107,114,128,0.12)' },
  }[status];

  return (
    <span
      className="px-2.5 py-1 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
};

/* ── Project row ──────────────────────────────────── */
const ProjectRow: React.FC<{ project: Project; onEdit: () => void }> = ({ project, onEdit }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group"
    style={{ border: '1px solid var(--glass-border-1)', background: 'var(--glass-1)' }}
    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--glass-border-2)')}
    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--glass-border-1)')}
  >
    {/* Color swatch */}
    <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ background: project.gradient }} />

    {/* Info */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-0.5">
        <p className="font-display font-bold text-sm truncate" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {project.title}
        </p>
        {project.featured && (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
            Featured
          </span>
        )}
      </div>
      <p className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>
        {project.category} · {project.techStack.slice(0, 3).join(', ')}
      </p>
    </div>

    <StatusBadge status={project.status} />

    {/* Actions */}
    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
          style={{ background: 'var(--glass-2)', color: 'var(--text-muted)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <ExternalLink size={12} />
        </a>
      )}
      <button
        onClick={onEdit}
        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
        style={{ background: 'var(--glass-2)', color: 'var(--text-muted)' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
      >
        <Edit3 size={12} />
      </button>
    </div>
  </motion.div>
);

/* ── Stat card ────────────────────────────────────── */
const StatCard: React.FC<{
  icon: React.ReactNode;
  value: string | number;
  label: string;
  gradient?: string;
}> = ({ icon, value, label, gradient }) => (
  <div
    className="glass-card rounded-2xl p-5 flex items-center gap-4"
    style={{ background: 'var(--glass-2)' }}
  >
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: gradient || 'var(--accent-light)' }}
    >
      {icon}
    </div>
    <div>
      <p
        className="font-display font-bold text-2xl leading-none mb-1"
        style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}
      >
        {value}
      </p>
      <p className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════
   ADMIN DASHBOARD
══════════════════════════════════════════════════ */
const AdminDashboardPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'team'>('overview');
  const [projects] = useState<Project[]>(PROJECTS);
  const [team] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleLogout = useCallback(async () => {
    await adminLogout();
    router.replace('/admin/login');
    router.refresh();
  }, [router]);

  const liveProjects = projects.filter((p) => p.status === 'live').length;
  const featuredProjects = projects.filter((p) => p.featured).length;

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: 'var(--bg-canvas)' }}
    >
      {/* Read-only notice — CMS writes not yet persisted */}
      <div
        className="fixed top-0 left-0 right-0 z-50 px-4 py-2 text-center text-xs font-sans"
        style={{ background: 'rgba(0,212,255,0.12)', color: '#00d4ff', borderBottom: '1px solid rgba(0,212,255,0.2)' }}
        role="status"
      >
        Admin is read-only. Project and team data is served from source files — edits are not saved.
      </div>
      {/* ── Sidebar ──────────────────────────────────── */}
      <aside
        className="w-64 flex-shrink-0 flex flex-col p-4 relative pt-12"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRight: '1px solid var(--glass-border-1)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-2 py-3 mb-6">
          <Logo variant="icon" size={32} decorative />
          <div className="min-w-0">
            <Logo variant="wordmark" size={14} />
            <p className="font-sans text-[10px] mt-1" style={{ color: 'var(--accent)' }}>Admin Studio</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1.5 flex-1">
          <NavItem
            icon={<LayoutDashboard size={15} />}
            label="Overview"
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          />
          <NavItem
            icon={<FolderOpen size={15} />}
            label="Projects"
            active={activeTab === 'projects'}
            onClick={() => setActiveTab('projects')}
            badge={projects.length}
          />
          <NavItem
            icon={<Users size={15} />}
            label="Team"
            active={activeTab === 'team'}
            onClick={() => setActiveTab('team')}
            badge={team.length}
          />
        </nav>

        {/* Visit site + logout */}
        <div className="flex flex-col gap-2 mt-4 pt-4" style={{ borderTop: '1px solid var(--glass-border-1)' }}>
          <a href="/" target="_blank" rel="noopener noreferrer">
            <button
              className="flex items-center gap-2.5 w-full px-4 py-3 rounded-2xl font-sans text-sm font-medium transition-all duration-200"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--glass-1)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <Globe size={15} />
              Visit Site
              <ExternalLink size={11} className="ml-auto opacity-50" />
            </button>
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-4 py-3 rounded-2xl font-sans text-sm font-medium transition-all duration-200"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#EF4444'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────── */}
      <main className="flex-1 overflow-auto p-8 pt-14">
        <AnimatePresence mode="wait">

          {/* OVERVIEW ─────────────────────────────────── */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: dur.base, ease: ease.out }}
            >
              <div className="mb-8">
                <h1
                  className="font-display font-bold text-3xl mb-1.5"
                  style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}
                >
                  Studio Overview
                </h1>
                <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>
                  Content management for BinaryScouts
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <StatCard
                  icon={<FolderOpen size={18} style={{ color: 'var(--accent)' }} />}
                  value={projects.length}
                  label="Total Projects"
                />
                <StatCard
                  icon={<Zap size={18} style={{ color: '#10B981' }} />}
                  value={liveProjects}
                  label="Live Projects"
                  gradient="rgba(16,185,129,0.12)"
                />
                <StatCard
                  icon={<Sparkles size={18} style={{ color: '#F59E0B' }} />}
                  value={featuredProjects}
                  label="Featured"
                  gradient="rgba(245,158,11,0.12)"
                />
                <StatCard
                  icon={<Users size={18} style={{ color: 'var(--rose)' }} />}
                  value={team.length}
                  label="Team Members"
                  gradient="var(--rose-light)"
                />
              </div>

              {/* Quick links */}
              <div
                className="glass-card rounded-3xl p-6"
                style={{ background: 'var(--glass-1)' }}
              >
                <h2 className="font-display font-bold text-lg mb-5" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Manage Projects', icon: <FolderOpen size={15} />, tab: 'projects' as const, color: 'var(--accent)' },
                    { label: 'Manage Team', icon: <Users size={15} />, tab: 'team' as const, color: 'var(--rose)' },
                    { label: 'View Live Site', icon: <Globe size={15} />, href: '/', color: '#10B981' },
                  ].map((item) => (
                    item.href ? (
                      <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                        <button
                          className="flex items-center gap-3 w-full px-5 py-4 rounded-2xl font-sans text-sm font-semibold transition-all duration-200"
                          style={{ background: 'var(--glass-2)', border: '1px solid var(--glass-border-1)', color: item.color }}
                          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--glass-border-2)')}
                          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--glass-border-1)')}
                        >
                          {item.icon}
                          {item.label}
                          <ChevronRight size={13} className="ml-auto opacity-50" />
                        </button>
                      </a>
                    ) : (
                      <button
                        key={item.label}
                        onClick={() => item.tab && setActiveTab(item.tab)}
                        className="flex items-center gap-3 w-full px-5 py-4 rounded-2xl font-sans text-sm font-semibold transition-all duration-200"
                        style={{ background: 'var(--glass-2)', border: '1px solid var(--glass-border-1)', color: item.color }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--glass-border-2)')}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--glass-border-1)')}
                      >
                        {item.icon}
                        {item.label}
                        <ChevronRight size={13} className="ml-auto opacity-50" />
                      </button>
                    )
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* PROJECTS ────────────────────────────────── */}
          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: dur.base, ease: ease.out }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-display font-bold text-3xl mb-1" style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>
                    Projects
                  </h1>
                  <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>
                    {projects.length} total · {liveProjects} live
                  </p>
                </div>
                <button className="btn-primary text-sm px-5 py-2.5 gap-2">
                  <Plus size={14} />
                  Add Project
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {projects.map((project) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
                    onEdit={() => setEditingProject(project)}
                  />
                ))}
              </div>

              <div
                className="mt-8 p-5 rounded-2xl"
                style={{ background: 'var(--accent-light)', border: '1px solid var(--glass-border-2)' }}
              >
                <p className="font-sans text-sm" style={{ color: 'var(--accent)' }}>
                  💡 <strong>Note:</strong> To add or edit projects, update the data in{' '}
                  <code className="font-mono text-xs px-1 py-0.5 rounded" style={{ background: 'var(--glass-2)' }}>
                    lib/projects.ts
                  </code>
                  . A full CRUD admin with persistent storage is planned for the next phase.
                </p>
              </div>
            </motion.div>
          )}

          {/* TEAM ────────────────────────────────────── */}
          {activeTab === 'team' && (
            <motion.div
              key="team"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: dur.base, ease: ease.out }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-display font-bold text-3xl mb-1" style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>
                    Team
                  </h1>
                  <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>
                    {team.length} members
                  </p>
                </div>
                <button className="btn-primary text-sm px-5 py-2.5 gap-2">
                  <Plus size={14} />
                  Add Member
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {team.map((member) => {
                  const initials = member.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-4 p-5 rounded-2xl"
                      style={{ border: '1px solid var(--glass-border-1)', background: 'var(--glass-1)' }}
                    >
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 font-display font-bold text-sm text-white"
                        style={{ background: 'var(--gradient-primary)' }}
                      >
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-sm mb-0.5" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                          {member.name}
                        </p>
                        <p className="font-sans text-xs" style={{ color: 'var(--accent)' }}>
                          {member.role}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {member.badges.slice(0, 3).map((b) => (
                            <span key={b} className="px-2 py-0.5 rounded-md font-sans text-[9px] font-bold uppercase tracking-wider" style={{ background: 'var(--glass-2)', color: 'var(--text-muted)', border: '1px solid var(--glass-border-1)' }}>
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
                          style={{ background: 'var(--glass-2)', color: 'var(--text-muted)' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                        >
                          <Edit3 size={12} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div
                className="mt-8 p-5 rounded-2xl"
                style={{ background: 'var(--accent-light)', border: '1px solid var(--glass-border-2)' }}
              >
                <p className="font-sans text-sm" style={{ color: 'var(--accent)' }}>
                  💡 <strong>Note:</strong> To add or edit team members, update the data in{' '}
                  <code className="font-mono text-xs px-1 py-0.5 rounded" style={{ background: 'var(--glass-2)' }}>
                    lib/team.ts
                  </code>
                  . Full CRUD admin is planned for the next phase.
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboardPage;

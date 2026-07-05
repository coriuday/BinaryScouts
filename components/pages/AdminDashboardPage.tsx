'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderOpen, Users, LogOut, Plus, Edit3, Trash2,
  ExternalLink, Sparkles, ChevronRight, X, CheckCircle, Save,
  Globe, Zap, MessageSquare, Inbox, Settings,
} from 'lucide-react';
import { PROJECT_CATEGORIES, type Project, type ProjectStatus } from '@/lib/projects';
import type { Review } from '@/lib/review-types';
import type { DbTeamMember, DbContactLead, HeroStats, ContactEngagement, ContactInfo } from '@/lib/cms/types';
import { DEFAULT_CONTACT_INFO } from '@/lib/site-contact';
import { adminLogout } from '@/lib/admin-auth';
import { ease, dur } from '@/lib/motion';
import Logo from '@/components/ui/Logo';
import ProjectFormModal from '@/components/admin/ProjectFormModal';
import TeamFormModal from '@/components/admin/TeamFormModal';

type Tab = 'overview' | 'projects' | 'team' | 'reviews' | 'leads' | 'settings';

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
    {badge !== undefined && badge > 0 && (
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

const StatusBadge: React.FC<{ status: ProjectStatus }> = ({ status }) => {
  const cfg = {
    live: { label: 'Live', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
    'in-progress': { label: 'In Progress', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
    'coming-soon': { label: 'Coming Soon', color: '#6B7280', bg: 'rgba(107,114,128,0.12)' },
    draft: { label: 'Draft', color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' },
  }[status] ?? { label: status, color: '#6B7280', bg: 'rgba(107,114,128,0.12)' };

  return (
    <span
      className="px-2.5 py-1 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  value: string | number;
  label: string;
  gradient?: string;
}> = ({ icon, value, label, gradient }) => (
  <div className="glass-card rounded-2xl p-5 flex items-center gap-4" style={{ background: 'var(--glass-2)' }}>
    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: gradient || 'var(--accent-light)' }}>
      {icon}
    </div>
    <div>
      <p className="font-display font-bold text-2xl leading-none mb-1" style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>
        {value}
      </p>
      <p className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
    </div>
  </div>
);

const AdminDashboardPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [projects, setProjects] = useState<Project[]>([]);
  const [team, setTeam] = useState<DbTeamMember[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [leads, setLeads] = useState<DbContactLead[]>([]);
  const [heroStats, setHeroStats] = useState<HeroStats>({ systemsBuilt: 15, revenueLabel: '₹1M+ INR', clientRetention: 98, avgRating: 4.9 });
  const [contactEngagement, setContactEngagement] = useState<ContactEngagement>({ typicalRange: '₹10L – ₹50L', responseTime: '<24 hours', discoveryCall: '30 min, free' });
  const [contactInfo, setContactInfo] = useState<ContactInfo>(DEFAULT_CONTACT_INFO);
  const [loading, setLoading] = useState({ projects: false, team: false, reviews: false, leads: false, settings: false });
  const [editingProject, setEditingProject] = useState<Project | null | undefined>(undefined);
  const [editingMember, setEditingMember] = useState<DbTeamMember | null | undefined>(undefined);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [cmsError, setCmsError] = useState('');

  const pendingReviews = reviews.filter((r) => r.status === 'pending').length;
  const unreadLeads = leads.filter((l) => !l.read).length;

  const loadProjects = useCallback(async () => {
    setLoading((s) => ({ ...s, projects: true }));
    try {
      const res = await fetch('/api/admin/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
        setCmsError('');
      } else if (res.status === 401) router.replace('/admin/login');
    } catch {
      setCmsError('Could not load projects');
    } finally {
      setLoading((s) => ({ ...s, projects: false }));
    }
  }, [router]);

  const loadTeam = useCallback(async () => {
    setLoading((s) => ({ ...s, team: true }));
    try {
      const res = await fetch('/api/admin/team');
      if (res.ok) {
        const data = await res.json();
        setTeam(data.team || []);
      }
    } finally {
      setLoading((s) => ({ ...s, team: false }));
    }
  }, []);

  const loadReviews = useCallback(async () => {
    setLoading((s) => ({ ...s, reviews: true }));
    try {
      const res = await fetch('/api/admin/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } finally {
      setLoading((s) => ({ ...s, reviews: false }));
    }
  }, []);

  const loadLeads = useCallback(async () => {
    setLoading((s) => ({ ...s, leads: true }));
    try {
      const res = await fetch('/api/admin/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } finally {
      setLoading((s) => ({ ...s, leads: false }));
    }
  }, []);

  const loadSettings = useCallback(async () => {
    setLoading((s) => ({ ...s, settings: true }));
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.heroStats) setHeroStats(data.heroStats);
        if (data.contactEngagement) setContactEngagement(data.contactEngagement);
        if (data.contactInfo) setContactInfo(data.contactInfo);
      }
    } finally {
      setLoading((s) => ({ ...s, settings: false }));
    }
  }, []);

  useEffect(() => {
    loadProjects();
    loadTeam();
    loadReviews();
    loadLeads();
    loadSettings();
  }, [loadProjects, loadTeam, loadReviews, loadLeads, loadSettings]);

  const handleDeleteProject = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
    if (res.ok) await loadProjects();
  };

  const handleReviewAction = async (id: string, status: 'approved' | 'rejected') => {
    const res = await fetch('/api/admin/reviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) await loadReviews();
  };

  const handleMarkLeadRead = async (id: string) => {
    await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, read: true }),
    });
    await loadLeads();
  };

  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    const res = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ heroStats, contactEngagement, contactInfo }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.heroStats) setHeroStats(data.heroStats);
      if (data.contactEngagement) setContactEngagement(data.contactEngagement);
      if (data.contactInfo) setContactInfo(data.contactInfo);
    }
    setSettingsSaving(false);
  };

  const handleLogout = useCallback(async () => {
    await adminLogout();
    router.replace('/admin/login');
    router.refresh();
  }, [router]);

  const liveProjects = projects.filter((p) => p.status === 'live').length;
  const featuredProjects = projects.filter((p) => p.featured).length;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-canvas)' }}>
      {cmsError && (
        <div
          className="fixed top-0 left-0 right-0 z-50 px-4 py-2 text-center text-xs font-sans"
          style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B', borderBottom: '1px solid rgba(245,158,11,0.2)' }}
        >
          {cmsError} — Configure Supabase env vars and run the migration + seed script.
        </div>
      )}

      <aside
        className="w-64 flex-shrink-0 flex flex-col p-4 relative"
        style={{ backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--glass-border-1)' }}
      >
        <div className="flex items-center gap-2.5 px-2 py-3 mb-6">
          <Logo variant="icon" size={32} decorative />
          <div className="min-w-0">
            <Logo variant="wordmark" size={14} />
            <p className="font-sans text-[10px] mt-1" style={{ color: 'var(--accent)' }}>Admin Studio</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1">
          <NavItem icon={<LayoutDashboard size={15} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <NavItem icon={<FolderOpen size={15} />} label="Projects" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} badge={projects.length} />
          <NavItem icon={<Users size={15} />} label="Team" active={activeTab === 'team'} onClick={() => setActiveTab('team')} badge={team.length} />
          <NavItem icon={<MessageSquare size={15} />} label="Reviews" active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} badge={pendingReviews} />
          <NavItem icon={<Inbox size={15} />} label="Leads" active={activeTab === 'leads'} onClick={() => setActiveTab('leads')} badge={unreadLeads} />
          <NavItem icon={<Settings size={15} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

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

      <main className="flex-1 overflow-auto p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: dur.base, ease: ease.out }}>
              <div className="mb-8">
                <h1 className="font-display font-bold text-3xl mb-1.5" style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>Studio Overview</h1>
                <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>Manage website content — changes reflect live on the site</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <StatCard icon={<FolderOpen size={18} style={{ color: 'var(--accent)' }} />} value={projects.length} label="Total Projects" />
                <StatCard icon={<Zap size={18} style={{ color: '#10B981' }} />} value={liveProjects} label="Live Projects" gradient="rgba(16,185,129,0.12)" />
                <StatCard icon={<Sparkles size={18} style={{ color: '#F59E0B' }} />} value={featuredProjects} label="Featured" gradient="rgba(245,158,11,0.12)" />
                <StatCard icon={<Users size={18} style={{ color: 'var(--rose)' }} />} value={team.length} label="Team Members" gradient="var(--rose-light)" />
              </div>
              <div className="glass-card rounded-3xl p-6" style={{ background: 'var(--glass-1)' }}>
                <h2 className="font-display font-bold text-lg mb-5" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Manage Projects', icon: <FolderOpen size={15} />, tab: 'projects' as const, color: 'var(--accent)' },
                    { label: 'Manage Team', icon: <Users size={15} />, tab: 'team' as const, color: 'var(--rose)' },
                    { label: 'Moderate Reviews', icon: <MessageSquare size={15} />, tab: 'reviews' as const, color: '#F59E0B' },
                    { label: 'View Leads', icon: <Inbox size={15} />, tab: 'leads' as const, color: '#6366f1' },
                    { label: 'Site Settings', icon: <Settings size={15} />, tab: 'settings' as const, color: '#10B981' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setActiveTab(item.tab)}
                      className="flex items-center gap-3 w-full px-5 py-4 rounded-2xl font-sans text-sm font-semibold transition-all duration-200"
                      style={{ background: 'var(--glass-2)', border: '1px solid var(--glass-border-1)', color: item.color }}
                    >
                      {item.icon}
                      {item.label}
                      <ChevronRight size={13} className="ml-auto opacity-50" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div key="projects" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: dur.base, ease: ease.out }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-display font-bold text-3xl mb-1" style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>Projects</h1>
                  <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>{projects.length} total · {liveProjects} live</p>
                </div>
                <button onClick={() => setEditingProject(null)} className="btn-primary text-sm px-5 py-2.5 gap-2">
                  <Plus size={14} />
                  Add Project
                </button>
              </div>
              {loading.projects ? (
                <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>Loading…</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center gap-4 p-4 rounded-2xl group"
                      style={{ border: '1px solid var(--glass-border-1)', background: 'var(--glass-1)' }}
                    >
                      <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ background: project.gradient }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-display font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{project.title}</p>
                          {project.featured && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>Featured</span>
                          )}
                        </div>
                        <p className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>{project.category} · {project.techStack.slice(0, 3).join(', ')}</p>
                      </div>
                      <StatusBadge status={project.status} />
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--glass-2)' }}>
                            <ExternalLink size={12} />
                          </a>
                        )}
                        <button onClick={() => setEditingProject(project)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--glass-2)' }}>
                          <Edit3 size={12} />
                        </button>
                        <button onClick={() => handleDeleteProject(project.id, project.title)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444' }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'team' && (
            <motion.div key="team" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: dur.base, ease: ease.out }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-display font-bold text-3xl mb-1" style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>Team</h1>
                  <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>{team.length} members</p>
                </div>
                <button onClick={() => setEditingMember(null)} className="btn-primary text-sm px-5 py-2.5 gap-2">
                  <Plus size={14} />
                  Add Member
                </button>
              </div>
              {loading.team ? (
                <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>Loading…</p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {team.map((member) => {
                    const initials = member.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
                    return (
                      <div key={member.id} className="flex items-center gap-4 p-5 rounded-2xl group" style={{ border: '1px solid var(--glass-border-1)', background: 'var(--glass-1)' }}>
                        {member.image_url ? (
                          <img src={member.image_url} alt="" className="w-12 h-12 rounded-2xl object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 font-display font-bold text-sm text-white" style={{ background: 'var(--gradient-primary)' }}>
                            {initials}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-display font-bold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>{member.name}</p>
                          <p className="font-sans text-xs" style={{ color: 'var(--accent)' }}>{member.role}</p>
                          {member.show_on_homepage && (
                            <span className="font-sans text-[9px] uppercase tracking-wider mt-1 inline-block" style={{ color: 'var(--text-muted)' }}>On homepage</span>
                          )}
                        </div>
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setEditingMember(member)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--glass-2)' }}>
                            <Edit3 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div key="reviews" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: dur.base, ease: ease.out }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-display font-bold text-3xl mb-1" style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>Client Reviews</h1>
                  <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>
                    {pendingReviews} pending · {reviews.filter((r) => r.status === 'approved').length} approved
                  </p>
                </div>
                <button onClick={loadReviews} className="btn-secondary text-sm px-5 py-2.5">Refresh</button>
              </div>
              {loading.reviews ? (
                <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>Loading…</p>
              ) : reviews.length === 0 ? (
                <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>No reviews yet.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-5 rounded-2xl" style={{ border: '1px solid var(--glass-border-1)', background: 'var(--glass-1)' }}>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <p className="font-display font-bold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>{review.name}</p>
                          <p className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>
                            {[review.role, review.company].filter(Boolean).join(' · ') || 'No role listed'}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full font-sans text-[10px] font-bold uppercase" style={{
                          background: review.status === 'approved' ? 'rgba(16,185,129,0.12)' : review.status === 'pending' ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)',
                          color: review.status === 'approved' ? '#10B981' : review.status === 'pending' ? '#F59E0B' : '#EF4444',
                        }}>
                          {review.status}
                        </span>
                      </div>
                      <p style={{ color: 'var(--amber)', fontSize: 12, marginBottom: 8 }}>{'★'.repeat(review.stars)}</p>
                      <p className="font-sans text-sm mb-4" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>&ldquo;{review.quote}&rdquo;</p>
                      {review.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleReviewAction(review.id, 'approved')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-sans text-xs font-semibold" style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>
                            <CheckCircle size={12} /> Approve
                          </button>
                          <button onClick={() => handleReviewAction(review.id, 'rejected')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-sans text-xs font-semibold" style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444' }}>
                            <X size={12} /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'leads' && (
            <motion.div key="leads" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: dur.base, ease: ease.out }}>
              <div className="mb-8">
                <h1 className="font-display font-bold text-3xl mb-1" style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>Leads Inbox</h1>
                <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>{unreadLeads} unread · {leads.length} total</p>
              </div>
              {loading.leads ? (
                <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>Loading…</p>
              ) : leads.length === 0 ? (
                <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>No leads yet. Contact form submissions appear here when Supabase is configured.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-5 rounded-2xl"
                      style={{
                        border: `1px solid ${lead.read ? 'var(--glass-border-1)' : 'var(--accent)'}`,
                        background: lead.read ? 'var(--glass-1)' : 'var(--accent-light)',
                        opacity: lead.read ? 0.85 : 1,
                      }}
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <p className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                            {lead.type === 'newsletter' ? 'Newsletter' : lead.name || 'Contact'}
                          </p>
                          <p className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>{lead.email}</p>
                        </div>
                        <span className="font-sans text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                          {new Date(lead.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {lead.company && <p className="font-sans text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Company: {lead.company}</p>}
                      {lead.budget && <p className="font-sans text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Budget: {lead.budget}</p>}
                      {lead.timeline && <p className="font-sans text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Timeline: {lead.timeline}</p>}
                      {lead.message && <p className="font-sans text-sm mt-2" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{lead.message}</p>}
                      {!lead.read && (
                        <button onClick={() => handleMarkLeadRead(lead.id)} className="mt-3 font-sans text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                          Mark as read
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: dur.base, ease: ease.out }}>
              <div className="mb-8">
                <h1 className="font-display font-bold text-3xl mb-1" style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>Site Settings</h1>
                <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>Hero stats and contact engagement copy</p>
              </div>
              <div className="max-w-xl flex flex-col gap-6">
                <div className="p-6 rounded-2xl" style={{ background: 'var(--glass-1)', border: '1px solid var(--glass-border-1)' }}>
                  <h2 className="font-display font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Hero Stats</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1">
                      <span className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>Systems Built</span>
                      <input type="number" className="admin-input" value={heroStats.systemsBuilt} onChange={(e) => setHeroStats((s) => ({ ...s, systemsBuilt: Number(e.target.value) }))} />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>Revenue Label</span>
                      <input className="admin-input" value={heroStats.revenueLabel} onChange={(e) => setHeroStats((s) => ({ ...s, revenueLabel: e.target.value }))} placeholder="₹1M+ INR" />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>Client Retention %</span>
                      <input type="number" className="admin-input" value={heroStats.clientRetention} onChange={(e) => setHeroStats((s) => ({ ...s, clientRetention: Number(e.target.value) }))} />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>Avg Rating</span>
                      <input type="number" step="0.1" className="admin-input" value={heroStats.avgRating} onChange={(e) => setHeroStats((s) => ({ ...s, avgRating: Number(e.target.value) }))} />
                    </label>
                  </div>
                </div>
                <div className="p-6 rounded-2xl" style={{ background: 'var(--glass-1)', border: '1px solid var(--glass-border-1)' }}>
                  <h2 className="font-display font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Contact Info</h2>
                  <label className="flex flex-col gap-1 mb-4">
                    <span className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>Email</span>
                    <input className="admin-input" value={contactInfo.email} onChange={(e) => setContactInfo((s) => ({ ...s, email: e.target.value }))} />
                  </label>
                  <label className="flex flex-col gap-1 mb-4">
                    <span className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>Phone display</span>
                    <input className="admin-input" value={contactInfo.phoneDisplay} onChange={(e) => setContactInfo((s) => ({ ...s, phoneDisplay: e.target.value }))} placeholder="+91 63014 64708" />
                  </label>
                  <label className="flex flex-col gap-1 mb-4">
                    <span className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>WhatsApp number (E.164, no +)</span>
                    <input className="admin-input" value={contactInfo.whatsappE164} onChange={(e) => setContactInfo((s) => ({ ...s, whatsappE164: e.target.value.replace(/\D/g, '') }))} placeholder="916301464708" />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>WhatsApp pre-filled message</span>
                    <textarea className="admin-input min-h-[80px]" value={contactInfo.whatsappMessage} onChange={(e) => setContactInfo((s) => ({ ...s, whatsappMessage: e.target.value }))} />
                  </label>
                </div>
                <div className="p-6 rounded-2xl" style={{ background: 'var(--glass-1)', border: '1px solid var(--glass-border-1)' }}>
                  <h2 className="font-display font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Contact Engagement</h2>
                  <label className="flex flex-col gap-1 mb-4">
                    <span className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>Typical Engagement Range</span>
                    <input className="admin-input" value={contactEngagement.typicalRange} onChange={(e) => setContactEngagement((s) => ({ ...s, typicalRange: e.target.value }))} />
                  </label>
                  <label className="flex flex-col gap-1 mb-4">
                    <span className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>Response Time</span>
                    <input className="admin-input" value={contactEngagement.responseTime} onChange={(e) => setContactEngagement((s) => ({ ...s, responseTime: e.target.value }))} />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>Discovery Call</span>
                    <input className="admin-input" value={contactEngagement.discoveryCall} onChange={(e) => setContactEngagement((s) => ({ ...s, discoveryCall: e.target.value }))} />
                  </label>
                </div>
                <button onClick={handleSaveSettings} disabled={settingsSaving} className="btn-primary text-sm px-5 py-2.5 gap-2 self-start">
                  <Save size={14} />
                  {settingsSaving ? 'Saving…' : 'Save Settings'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {editingProject !== undefined && (
        <ProjectFormModal
          project={editingProject}
          onClose={() => setEditingProject(undefined)}
          onSaved={(p) => {
            setProjects((prev) => {
              const idx = prev.findIndex((x) => x.id === p.id);
              if (idx >= 0) {
                const next = [...prev];
                next[idx] = p;
                return next;
              }
              return [...prev, p];
            });
            loadProjects();
          }}
        />
      )}

      {editingMember !== undefined && (
        <TeamFormModal
          member={editingMember}
          onClose={() => setEditingMember(undefined)}
          onSaved={loadTeam}
        />
      )}
    </div>
  );
};

export default AdminDashboardPage;

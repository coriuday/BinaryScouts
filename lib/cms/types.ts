import type { Project, ProjectMetric, ProjectStatus } from '@/lib/projects';
import type { FlipCardData } from '@/lib/flip-team';
import type { TeamMember, TeamSkill } from '@/lib/team';
import type { Review } from '@/lib/review-types';

export type DbProject = {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: string;
  hook: string;
  description: string;
  case_study: { problem: string; solution: string; results: string } | null;
  tech_stack: string[];
  tags: string[];
  metrics: ProjectMetric[];
  live_url: string | null;
  github_url: string | null;
  images: string[];
  gradient: string;
  featured: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type DbTeamMember = {
  id: string;
  name: string;
  username: string;
  titles: string[];
  role: string;
  bio: string;
  image_url: string;
  stats: { label: string; value: string }[];
  skills: TeamSkill[];
  social_links: { github?: string; linkedin?: string; twitter?: string };
  badges: string[];
  experience: number;
  projects_shipped: number;
  sort_order: number;
  show_on_homepage: boolean;
};

export type DbReview = {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  stars: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

export type DbContactLead = {
  id: string;
  type: 'contact' | 'newsletter';
  name: string | null;
  email: string;
  company: string | null;
  budget: string | null;
  timeline: string | null;
  message: string | null;
  read: boolean;
  created_at: string;
};

export type HeroStats = {
  systemsBuilt: number;
  revenueLabel: string;
  clientRetention: number;
  avgRating: number;
};

export type ContactEngagement = {
  typicalRange: string;
  responseTime: string;
  discoveryCall: string;
};

export type ContactInfo = {
  email: string;
  whatsappE164: string;
  whatsappMessage: string;
  phoneDisplay: string;
};

export function mapDbProject(row: DbProject): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    status: row.status as ProjectStatus,
    hook: row.hook,
    description: row.description,
    caseStudy: row.case_study ?? undefined,
    techStack: row.tech_stack ?? [],
    tags: row.tags ?? [],
    metrics: row.metrics ?? [],
    liveUrl: row.live_url ?? undefined,
    githubUrl: row.github_url ?? undefined,
    images: row.images ?? [],
    gradient: row.gradient,
    featured: row.featured,
    order: row.sort_order,
  };
}

export function projectToDb(p: Partial<Project> & { slug: string; title: string }): Partial<DbProject> {
  return {
    slug: p.slug,
    title: p.title,
    category: p.category ?? 'Web Platform',
    status: p.status ?? 'live',
    hook: p.hook ?? '',
    description: p.description ?? '',
    case_study: p.caseStudy ?? null,
    tech_stack: p.techStack ?? [],
    tags: p.tags ?? [],
    metrics: p.metrics ?? [],
    live_url: p.liveUrl ?? null,
    github_url: p.githubUrl ?? null,
    images: p.images ?? [],
    gradient: p.gradient ?? 'linear-gradient(135deg, #6366f1, #a78bfa)',
    featured: p.featured ?? false,
    sort_order: p.order ?? 0,
  };
}

export function projectPartialToDb(p: Partial<Project>): Partial<DbProject> {
  const row: Partial<DbProject> = {};
  if (p.slug !== undefined) row.slug = p.slug;
  if (p.title !== undefined) row.title = p.title;
  if (p.category !== undefined) row.category = p.category;
  if (p.status !== undefined) row.status = p.status;
  if (p.hook !== undefined) row.hook = p.hook;
  if (p.description !== undefined) row.description = p.description;
  if (p.caseStudy !== undefined) row.case_study = p.caseStudy ?? null;
  if (p.techStack !== undefined) row.tech_stack = p.techStack;
  if (p.tags !== undefined) row.tags = p.tags;
  if (p.metrics !== undefined) row.metrics = p.metrics;
  if (p.liveUrl !== undefined) row.live_url = p.liveUrl ?? null;
  if (p.githubUrl !== undefined) row.github_url = p.githubUrl ?? null;
  if (p.images !== undefined) row.images = p.images;
  if (p.gradient !== undefined) row.gradient = p.gradient;
  if (p.featured !== undefined) row.featured = p.featured;
  if (p.order !== undefined) row.sort_order = p.order;
  return row;
}

export function mapDbTeamMember(row: DbTeamMember): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    bio: row.bio,
    avatar: row.image_url || undefined,
    skills: row.skills ?? [],
    socials: row.social_links ?? {},
    badges: row.badges ?? [],
    experience: row.experience,
    projectsShipped: row.projects_shipped,
  };
}

export function teamMemberToFlipCard(row: DbTeamMember): FlipCardData {
  return {
    name: row.name,
    username: row.username,
    titles: row.titles ?? [],
    role: row.role,
    image: row.image_url,
    bio: row.bio,
    stats: row.stats ?? [],
    socialLinks: row.social_links ?? {},
  };
}

export function mapDbReview(row: DbReview): Review {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    company: row.company,
    quote: row.quote,
    stars: row.stars,
    status: row.status,
    createdAt: row.created_at,
  };
}

export const DEFAULT_HERO_STATS: HeroStats = {
  systemsBuilt: 0,
  revenueLabel: '—',
  clientRetention: 0,
  avgRating: 0,
};

export const DEFAULT_CONTACT_ENGAGEMENT: ContactEngagement = {
  typicalRange: 'Scoped per engagement',
  responseTime: '<24 hours',
  discoveryCall: '30 min, free',
};

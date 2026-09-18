/**
 * BinaryScouts — Project Data Store
 *
 * Single source of truth for portfolio / case study projects.
 */

export type ProjectStatus = 'live' | 'in-progress' | 'coming-soon' | 'draft';

export interface ProjectMetric {
  value: string;
  label: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: ProjectStatus;
  /** One-liner emotional narrative */
  hook: string;
  /** Full teaser paragraph */
  description: string;
  /** Long-form case study — problem, solution, results */
  caseStudy?: {
    problem: string;
    solution: string;
    results: string;
  };
  techStack: string[];
  tags: string[];
  metrics: ProjectMetric[];
  liveUrl?: string;
  githubUrl?: string;
  /** Paths relative to /public, or absolute URLs */
  images: string[];
  /** CSS gradient string for card accent */
  gradient: string;
  /** Whether to show on the homepage */
  featured: boolean;
  /** Sort order — lower is higher priority */
  order: number;
}

/* ─── Live Projects ────────────────────────────────────────── */
export const PROJECTS: Project[] = [
  {
    id: '1',
    slug: 'jobsrow',
    title: 'Jobsrow',
    category: 'SaaS Product',
    status: 'live',
    hook: 'Find your row in the workforce — a modern job discovery platform.',
    description:
      'Jobsrow is a full-stack workforce platform that helps people discover roles and navigate their career path with a clean, product-grade web experience.',
    caseStudy: {
      problem:
        'Job seekers were stuck between cluttered boards and outdated listings. Employers needed a clearer way to reach the right talent without friction.',
      solution:
        'We designed and built Jobsrow as a modern web product — fast search, clear listings, and a focused UX that prioritizes discovery and conversion over noise.',
      results:
        'Production system delivered and live at jobsrow.com — a full-stack product BinaryScouts engineered end-to-end.',
    },
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Vercel'],
    tags: ['SaaS', 'Full Stack', 'Product'],
    metrics: [
      { value: 'Live', label: 'Production' },
      { value: 'Full', label: 'Stack build' },
      { value: 'UX', label: 'First focus' },
    ],
    liveUrl: 'https://jobsrow.com/',
    images: [],
    gradient: 'linear-gradient(135deg, #00D4FF, #6366f1)',
    featured: true,
    order: 1,
  },
  {
    id: '2',
    slug: 'mvr-consultants',
    title: 'MVR Consultants',
    category: 'Web Platform',
    status: 'live',
    hook: 'Study abroad, visas, and scholarships — guidance that scales globally.',
    description:
      'MVR Consultants is an education consultancy platform covering admissions, visas, scholarships, and student tools — built to convert visitors into consultations.',
    caseStudy: {
      problem:
        'Students needed trusted guidance across destinations, universities, and visas, but fragmented information made it hard to take the next step.',
      solution:
        'We delivered a marketing and tools-forward website: destinations, services, scholarships, and clear CTAs for consultations — optimized for trust and lead capture.',
      results:
        'Production website delivered and live at mvrconsultants.org — a polished presence for an education consultancy.',
    },
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'SEO', 'Vercel'],
    tags: ['Web Platform', 'Education', 'Growth'],
    metrics: [
      { value: 'Live', label: 'Production' },
      { value: 'Lead', label: 'Capture UX' },
      { value: 'SEO', label: 'Structured' },
    ],
    liveUrl: 'https://www.mvrconsultants.org/',
    images: [],
    gradient: 'linear-gradient(135deg, #6366f1, #a78bfa)',
    featured: true,
    order: 2,
  },
];

/* ─── Helpers ──────────────────────────────────────────────── */
export function getFeaturedProjects(): Project[] {
  return PROJECTS.filter((p) => p.featured).sort((a, b) => a.order - b.order);
}

export function getAllProjects(): Project[] {
  return [...PROJECTS].sort((a, b) => a.order - b.order);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getProjectsByCategory(category: string): Project[] {
  if (category === 'All') return getAllProjects();
  return PROJECTS.filter((p) => p.category === category || p.tags.includes(category)).sort(
    (a, b) => a.order - b.order
  );
}

export const PROJECT_CATEGORIES = [
  'All',
  'SaaS Product',
  'Web Platform',
] as const;

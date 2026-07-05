/**
 * BinaryScouts — Team Data Store
 *
 * Profiles of the developers and specialists working at BinaryScouts.
 * Admin UI can extend this; TeamSection reads from it.
 */

export interface TeamSkill {
  name: string;
  /** Proficiency 0–100 */
  level: number;
  /** Category for grouping */
  category: 'frontend' | 'backend' | 'ai' | 'design' | 'devops' | 'other';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  /** Optional avatar image path */
  avatar?: string;
  skills: TeamSkill[];
  socials?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  /** Highlight badges shown on card */
  badges: string[];
  /** Years of experience */
  experience: number;
  /** Projects shipped */
  projectsShipped: number;
}

/* ─── Team Members ─────────────────────────────────────────── */
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Mohammad Raashad',
    role: 'Founder · Manager',
    bio: 'Founder and manager overseeing delivery, client operations, and Python-based backend systems that power BinaryScouts projects.',
    avatar: '/team/mohammad-raashad.jpg',
    skills: [
      { name: 'Python', level: 90, category: 'backend' },
      { name: 'Django', level: 85, category: 'backend' },
      { name: 'PostgreSQL', level: 82, category: 'backend' },
      { name: 'Project Management', level: 92, category: 'other' },
      { name: 'Client Operations', level: 90, category: 'other' },
      { name: 'REST APIs', level: 84, category: 'backend' },
    ],
    socials: {
      linkedin: 'https://www.linkedin.com/in/mohammed-raashad/',
    },
    badges: ['Founder', 'Manager', 'Python'],
    experience: 4,
    projectsShipped: 20,
  },
  {
    id: '2',
    name: 'Uday Kumar Kori',
    role: 'Co-Founder · Lead & Senior Developer',
    bio: 'Full-stack and AI systems builder. Co-founder leading architecture, ML pipelines, and production-grade applications at BinaryScouts.',
    avatar: '/team/uday-kori.jpg',
    skills: [
      { name: 'Next.js', level: 94, category: 'frontend' },
      { name: 'TypeScript', level: 92, category: 'frontend' },
      { name: 'React', level: 93, category: 'frontend' },
      { name: 'Python', level: 90, category: 'ai' },
      { name: 'LangChain', level: 88, category: 'ai' },
      { name: 'OpenAI / GPT-4', level: 90, category: 'ai' },
      { name: 'Node.js', level: 88, category: 'backend' },
      { name: 'PostgreSQL', level: 85, category: 'backend' },
    ],
    socials: {
      github: 'https://github.com/coriuday',
      linkedin: 'https://www.linkedin.com/in/uday-kumar-kori-784678210',
    },
    badges: ['Co-Founder', 'AI Systems', 'Full Stack'],
    experience: 5,
    projectsShipped: 50,
  },
  {
    id: '3',
    name: 'Ashish Kumar',
    role: 'Junior Developer · Generative AI Full Stack',
    bio: 'Generative AI full-stack developer shipping TypeScript, Next.js, Python, and modern ML-integrated products at BinaryScouts.',
    avatar: '/team/ashish-kumar.jpg',
    skills: [
      { name: 'TypeScript', level: 88, category: 'frontend' },
      { name: 'React', level: 86, category: 'frontend' },
      { name: 'Next.js', level: 85, category: 'frontend' },
      { name: 'Python', level: 84, category: 'backend' },
      { name: 'FastAPI', level: 82, category: 'backend' },
      { name: 'OpenAI API', level: 86, category: 'ai' },
      { name: 'Docker', level: 78, category: 'devops' },
      { name: 'PostgreSQL', level: 80, category: 'backend' },
    ],
    socials: {
      github: 'https://github.com/ashuisalluneed',
    },
    badges: ['Gen AI', 'Full Stack', 'Next.js'],
    experience: 2,
    projectsShipped: 8,
  },
];

/* ─── Helpers ──────────────────────────────────────────────── */
export function getTeamMembers(): TeamMember[] {
  return TEAM_MEMBERS;
}

export const SKILL_CATEGORY_COLORS: Record<TeamSkill['category'], string> = {
  frontend: '#8B5CF6',
  backend:  '#10B981',
  ai:       '#F59E0B',
  design:   '#EC4899',
  devops:   '#3B82F6',
  other:    '#6B7280',
};

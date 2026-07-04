/**
 * BinaryScouts — Flip card team data for homepage Team section
 */

export interface FlipCardData {
  name: string;
  username: string;
  titles: string[];
  role: string;
  image: string;
  bio: string;
  stats: { label: string; value: string }[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export const FLIP_TEAM_MEMBERS: FlipCardData[] = [
  {
    name: 'Uday Kumar Kori',
    username: '@coriuday',
    titles: ['Co-Founder', 'Lead & Senior Developer'],
    role: 'AI Engineer / Full Stack Developer',
    image: '/team/uday-kori.jpg',
    bio: 'Full-stack and AI systems builder. Co-founder leading architecture, ML pipelines, and production-grade applications at BinaryScouts.',
    stats: [
      { label: 'Repos', value: '20+' },
      { label: 'Projects', value: '50+' },
      { label: 'Experience', value: '5+ Yrs' },
    ],
    socialLinks: {
      github: 'https://github.com/coriuday',
      linkedin: 'https://www.linkedin.com/in/uday-kumar-kori-784678210',
    },
  },
  {
    name: 'Ashish Kumar',
    username: '@ashuisalluneed',
    titles: ['Junior Developer'],
    role: 'Generative AI Full Stack Developer',
    image: '/team/ashish-kumar.jpg',
    bio: 'Generative AI full-stack developer shipping TypeScript, Next.js, Python, and modern ML-integrated products at BinaryScouts.',
    stats: [
      { label: 'Repos', value: '4+' },
      { label: 'Stack', value: 'Full Stack' },
      { label: 'Focus', value: 'Gen AI' },
    ],
    socialLinks: {
      github: 'https://github.com/ashuisalluneed',
    },
  },
  {
    name: 'Mohammad Raashad',
    username: '@mohammed-raashad',
    titles: ['Founder', 'Manager'],
    role: 'Manager / Python Developer',
    image: '/team/mohammad-raashad.jpg',
    bio: 'Founder and manager overseeing delivery, client operations, and Python-based backend systems that power BinaryScouts projects.',
    stats: [
      { label: 'Role', value: 'Founder' },
      { label: 'Stack', value: 'Python' },
      { label: 'Focus', value: 'Manager' },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/mohammed-raashad/',
    },
  },
];

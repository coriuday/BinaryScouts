import { ServiceItem, NavItem, FeatureItem } from './types';
import { Zap, BarChart3, ShieldCheck, Layers } from 'lucide-react';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Games', href: '/games' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
];

export const SERVICES: ServiceItem[] = [
  {
    id: '0',
    title: 'Web Development',
    description: 'Building clean, compiled, high-performance systems and interactive layouts.',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
    featured: true,
    gridSpan: 'md:col-span-2'
  },
  {
    id: '1',
    title: 'Digital Marketing',
    description: 'Dominate the market with data-driven campaigns that hit harder.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
    gridSpan: 'md:col-span-1'
  },
  {
    id: '2',
    title: 'Business Automation',
    subtitle: 'Streamline',
    description: 'Automate the boring stuff. Focus on the kill.',
    imageUrl: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=2070&auto=format&fit=crop',
    gridSpan: 'md:col-span-1'
  },
  {
    id: '3',
    title: 'SEO Optimization',
    description: 'Rank first. Disappear the competition.',
    imageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2076&auto=format&fit=crop',
    gridSpan: 'md:col-span-1'
  },
  {
    id: '4',
    title: 'Motion Graphics',
    description: 'Visuals that move at the speed of light.',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
    gridSpan: 'md:col-span-1'
  },
  {
    id: '5',
    title: 'Video Production',
    description: 'Cinematic storytelling for the digital age.',
    imageUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=2000&auto=format&fit=crop',
    videoIcon: true,
    gridSpan: 'md:col-span-1 md:row-span-2'
  },
  {
    id: '6',
    title: 'Social Media',
    description: 'Engage. Enrage. Expand.',
    imageUrl: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1974&auto=format&fit=crop',
    gridSpan: 'md:col-span-1'
  },
  {
    id: '7',
    title: 'LinkedIn Auto',
    description: 'B2B connections on autopilot.',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop',
    gridSpan: 'md:col-span-1'
  },
  {
    id: '8',
    title: 'Graphic Design',
    description: 'Aesthetics that define your brand identity.',
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b7993143a4d?q=80&w=2070&auto=format&fit=crop',
    gridSpan: 'md:col-span-1'
  },
  {
    id: '9',
    title: 'WhatsApp Auto',
    description: 'Direct communication, instantly scalable.',
    imageUrl: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=2070&auto=format&fit=crop',
    gridSpan: 'md:col-span-1'
  }
];

export const FEATURES: FeatureItem[] = [
  { icon: Zap, title: 'Speed Optimized', color: 'orange' },
  { icon: BarChart3, title: 'Data Driven', color: 'green' },
  { icon: ShieldCheck, title: 'Secure Systems', color: 'blue' },
  { icon: Layers, title: 'Full Scale', color: 'green' },
];
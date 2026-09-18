import type { Metadata } from 'next';
import AboutPage from '@/components/pages/AboutPage';
import { getSiteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Meet BinaryScouts — an AI-native engineering studio building systems that outlast the engagement.',
  alternates: { canonical: `${getSiteUrl()}/about` },
};

export default function Page() {
  return <AboutPage />;
}

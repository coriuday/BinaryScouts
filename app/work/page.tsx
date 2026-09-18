import type { Metadata } from 'next';
import WorkPage from '@/components/pages/WorkPage';
import { getSiteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Our Work',
  description:
    'Case studies and project showcases from BinaryScouts — AI automation, SaaS, dashboards, and growth engineering.',
  alternates: { canonical: `${getSiteUrl()}/work` },
};

export default function Page() {
  return <WorkPage />;
}

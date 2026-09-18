import type { Metadata } from 'next';
import CareersPage from '@/components/pages/CareersPage';
import { getSiteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Careers',
  description:
    'Join BinaryScouts. Open roles for engineers who care about shipping durable product systems.',
  alternates: { canonical: `${getSiteUrl()}/careers` },
};

export default function Page() {
  return <CareersPage />;
}

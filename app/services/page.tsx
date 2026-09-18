import type { Metadata } from 'next';
import ServicesPage from '@/components/pages/ServicesPage';
import { getSiteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'AI systems, SaaS development, CRM automation, growth engineering, dashboards, and DevOps from BinaryScouts.',
  alternates: { canonical: `${getSiteUrl()}/services` },
};

export default function Page() {
  return <ServicesPage />;
}

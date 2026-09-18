import type { Metadata } from 'next';
import PlannerPage from '@/components/pages/PlannerPage';
import { getSiteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Project Planner',
  description:
    'Scope your next engagement with BinaryScouts — share goals, constraints, and timeline for a tailored plan.',
  alternates: { canonical: `${getSiteUrl()}/planner` },
};

export default function Page() {
  return <PlannerPage />;
}

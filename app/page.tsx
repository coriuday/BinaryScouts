import type { Metadata } from 'next';
import HomePage from '@/components/pages/HomePage';
import { getSiteUrl } from '@/lib/site';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  alternates: { canonical: siteUrl },
};

export default function Page() {
  return <HomePage />;
}

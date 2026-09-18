import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Website and engagement conditions for BinaryScouts.',
  alternates: { canonical: `${getSiteUrl()}/terms` },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

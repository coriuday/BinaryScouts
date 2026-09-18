import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How BinaryScouts collects, uses, and protects information submitted through our site.',
  alternates: { canonical: `${getSiteUrl()}/privacy` },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}

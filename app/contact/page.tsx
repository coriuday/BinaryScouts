import type { Metadata } from 'next';
import ContactPage from '@/components/pages/ContactPage';
import { getSiteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Start a discovery call with BinaryScouts. Tell us what you are building — we respond within one business day.',
  alternates: { canonical: `${getSiteUrl()}/contact` },
};

export default function Page() {
  return <ContactPage />;
}

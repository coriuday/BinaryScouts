'use client';

import { useMemo } from 'react';
import LegalPage from '@/components/pages/LegalPage';
import { useContactInfo } from '@/components/hooks/useContactInfo';

export default function Page() {
  const { email: contactEmail } = useContactInfo();

  const sections = useMemo(
    () => [
      {
        title: 'What we collect',
        paragraphs: [
          'When you use our contact form, newsletter signup, or project planner, we collect the information you submit — typically your name, email address, company, and project details.',
          'We also store basic technical data such as IP address and submission time to prevent abuse and improve reliability.',
        ],
      },
      {
        title: 'How we use your data',
        paragraphs: [
          'We use submitted information only to respond to inquiries, evaluate project fit, and send newsletters you explicitly subscribed to.',
          'We do not sell, rent, or share your personal information with third parties for marketing.',
        ],
      },
      {
        title: 'Storage and security',
        paragraphs: [
          'Form submissions are stored securely on our servers (and optionally emailed to our team via a transactional email provider when configured).',
          'Public traffic to the website is served over HTTPS. Internal services communicate on private networks and are not exposed to the public internet.',
        ],
      },
      {
        title: 'Cookies and preferences',
        paragraphs: [
          'We use localStorage and cookies for theme preferences, session settings, and (for admin users only) authenticated sessions.',
          'These preferences stay on your device or in secure httpOnly cookies and are not used for advertising tracking.',
        ],
      },
      {
        title: 'Contact',
        paragraphs: [
          `For privacy requests, email ${contactEmail}. We will respond within a reasonable timeframe.`,
        ],
      },
    ],
    [contactEmail]
  );

  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="How we handle your information"
      sections={sections}
    />
  );
}

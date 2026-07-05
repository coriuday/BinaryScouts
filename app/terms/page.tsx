'use client';

import { useMemo } from 'react';
import LegalPage from '@/components/pages/LegalPage';
import { useContactInfo } from '@/components/hooks/useContactInfo';

export default function Page() {
  const { email: contactEmail } = useContactInfo();

  const sections = useMemo(
    () => [
      {
        title: 'Acceptance of terms',
        paragraphs: [
          'By using the BinaryScouts website and related tools (including the project planner and AI terminal), you agree to these terms.',
          'If you do not agree, please do not use the site.',
        ],
      },
      {
        title: 'Services and estimates',
        paragraphs: [
          'Content on this site describes our capabilities and past work. Strategy outputs from the planner or AI assistant are for planning purposes only and do not guarantee commercial results.',
          'Project scope, pricing, and timelines are confirmed only in a written agreement.',
        ],
      },
      {
        title: 'Acceptable use',
        paragraphs: [
          'You may not attempt to disrupt, overload, or reverse-engineer our systems, or submit malicious content through forms or APIs.',
          'We may rate-limit or block abusive traffic to protect the service.',
        ],
      },
      {
        title: 'Intellectual property',
        paragraphs: [
          'Site design, branding, and original content are owned by BinaryScouts unless otherwise noted. You may not copy or redistribute them without permission.',
          'You retain ownership of materials you submit; you grant us a limited license to use them to respond to your inquiry.',
        ],
      },
      {
        title: 'Contact',
        paragraphs: [`Questions about these terms: ${contactEmail}.`],
      },
    ],
    [contactEmail]
  );

  return (
    <LegalPage
      title="Terms of Service"
      subtitle="Website and engagement conditions"
      sections={sections}
    />
  );
}

'use client';

import React from 'react';
import LegalPage from '@/components/pages/LegalPage';

const TERMS_SECTIONS = [
  {
    title: 'OPERATOR SYSTEM ENGAGEMENT',
    paragraphs: [
      'By engaging with the GloryX digital agency website and submitting target briefs through the Heist Planner interface, you agree to comply with standard security procedures and avoid malicious script injection attempts against our console ports.',
      'Our AI strategist (G.L.O.R.Y. AI) operates with structured prompts. While we strive for extreme precision, strategy blueprints are for planning purposes and do not represent guaranteed commercial revenue metrics.'
    ]
  },
  {
    title: 'VAULT INFILTRATION CONDITIONS',
    paragraphs: [
      'Any attempts to reverse-engineer backend APIs, bypass hacking minigames (unless using authorized Sysadmin force-bypass overrides), or download vault directories without credentials will result in immediate signal lockout.'
    ]
  },
  {
    title: 'INTELLECTUAL PROPERTIES',
    paragraphs: [
      'The graphics, code, halftone designs, layout configurations, and sound chirps contained within the GloryX portal are protected by proprietary licensing models. Authorized operators are granted a limited license to review released briefs for educational usage.'
    ]
  }
];

export default function Page() {
  return (
    <LegalPage
      title="TERMS OF SERVICE"
      subtitle="SYSTEM HARDWARE USE CONDITIONS"
      sections={TERMS_SECTIONS}
    />
  );
}

'use client';

import React from 'react';
import LegalPage from '@/components/pages/LegalPage';

const PRIVACY_SECTIONS = [
  {
    title: 'DATA VAULT COMS INTEGRITY',
    paragraphs: [
      'GloryX Digital Agency prioritizes client records security. All details submitted via the Heist Planner or contact forms are logged within locally-stored JSON files inside the Rust Axum Gateway ("vault/"). We do not sell, rent, or lease your strategic operator details to third-party tracking conglomerates.',
      'Data logs committed to the local vault are retained solely for project assessment, strategy compiling, and direct secure transmission follow-ups.'
    ]
  },
  {
    title: 'ENCRYPTION LOGS',
    paragraphs: [
      'We run active SSL encryption layers on all server proxy pathways. Communication between our client-side Next.js route proxies, the Rust API Gateway gateway, and the Python FastAPI microservices is fully isolated from external networks.',
      'Your email channel is only used to send back customized PDF briefs, target logs, or to check schedule parameters.'
    ]
  },
  {
    title: 'COOKIES & STATE PREFERENCES',
    paragraphs: [
      'We utilize localStorage parameters to cache browser settings for the CRT Monitor scanline overlay, theme color palettes, and Custom Crosshair state. These elements are kept strictly client-side to maintain system integrity.'
    ]
  }
];

export default function Page() {
  return (
    <LegalPage
      title="PRIVACY POLICY"
      subtitle="SYSTEM VAULT & RECORDS POLICY"
      sections={PRIVACY_SECTIONS}
    />
  );
}

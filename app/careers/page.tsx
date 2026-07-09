'use client';

import React, { Suspense } from 'react';
import CareersPage from '@/components/pages/CareersPage';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CareersPage />
    </Suspense>
  );
}

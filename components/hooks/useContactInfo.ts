'use client';

import { useEffect, useState } from 'react';
import {
  DEFAULT_CONTACT_INFO,
  mergeContactInfo,
  type ContactInfo,
  whatsAppUrlFromInfo,
} from '@/lib/site-contact';

export function useContactInfo() {
  const [info, setInfo] = useState<ContactInfo>(DEFAULT_CONTACT_INFO);

  useEffect(() => {
    fetch('/api/cms/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.contactInfo) setInfo(mergeContactInfo(d.contactInfo));
      })
      .catch(() => {});
  }, []);

  return {
    email: info.email,
    phoneDisplay: info.phoneDisplay,
    whatsappUrl: whatsAppUrlFromInfo(info),
    info,
  };
}

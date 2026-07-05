'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  DEFAULT_CONTACT_INFO,
  mergeContactInfo,
  type ContactInfo,
  whatsAppUrlFromInfo,
} from '@/lib/site-contact';

export type ContactInfoValue = {
  email: string;
  phoneDisplay: string;
  whatsappUrl: string;
  info: ContactInfo;
};

const ContactInfoContext = createContext<ContactInfoValue | null>(null);

function toValue(info: ContactInfo): ContactInfoValue {
  return {
    email: info.email,
    phoneDisplay: info.phoneDisplay,
    whatsappUrl: whatsAppUrlFromInfo(info),
    info,
  };
}

export function ContactInfoProvider({ children }: { children: ReactNode }) {
  const [info, setInfo] = useState<ContactInfo>(DEFAULT_CONTACT_INFO);

  useEffect(() => {
    fetch('/api/cms/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.contactInfo) setInfo(mergeContactInfo(d.contactInfo));
      })
      .catch(() => {});
  }, []);

  return (
    <ContactInfoContext.Provider value={toValue(info)}>{children}</ContactInfoContext.Provider>
  );
}

export function useContactInfo(): ContactInfoValue {
  const ctx = useContext(ContactInfoContext);
  if (ctx) return ctx;
  return toValue(DEFAULT_CONTACT_INFO);
}

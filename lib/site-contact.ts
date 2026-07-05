/** Central contact + WhatsApp config (env overrides with safe defaults). */

export const DEFAULT_CONTACT_EMAIL = 'thebinaryscouts@gmail.com';
export const DEFAULT_WHATSAPP_E164 = '916301464708';
export const DEFAULT_WHATSAPP_MESSAGE =
  "Hi BinaryScouts! I'd like to discuss a project with you.";
export const DEFAULT_PHONE_DISPLAY = '+91 63014 64708';

export type ContactInfo = {
  email: string;
  whatsappE164: string;
  whatsappMessage: string;
  phoneDisplay: string;
};

export const DEFAULT_CONTACT_INFO: ContactInfo = {
  email: DEFAULT_CONTACT_EMAIL,
  whatsappE164: DEFAULT_WHATSAPP_E164,
  whatsappMessage: DEFAULT_WHATSAPP_MESSAGE,
  phoneDisplay: DEFAULT_PHONE_DISPLAY,
};

export function getContactEmail(): string {
  return (
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
    process.env.CONTACT_TO_EMAIL?.trim() ||
    DEFAULT_CONTACT_EMAIL
  );
}

export function getWhatsAppE164(): string {
  const raw =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || DEFAULT_WHATSAPP_E164;
  return raw.replace(/\D/g, '');
}

export function getWhatsAppMessage(): string {
  return (
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE?.trim() || DEFAULT_WHATSAPP_MESSAGE
  );
}

export function getPhoneDisplay(): string {
  return DEFAULT_PHONE_DISPLAY;
}

export function getWhatsAppUrl(message?: string): string {
  const text = encodeURIComponent(message ?? getWhatsAppMessage());
  return `https://wa.me/${getWhatsAppE164()}?text=${text}`;
}

export function getContactInfo(): ContactInfo {
  return {
    email: getContactEmail(),
    whatsappE164: getWhatsAppE164(),
    whatsappMessage: getWhatsAppMessage(),
    phoneDisplay: getPhoneDisplay(),
  };
}

export function mergeContactInfo(partial?: Partial<ContactInfo> | null): ContactInfo {
  const base = getContactInfo();
  if (!partial) return base;
  return {
    email: partial.email?.trim() || base.email,
    whatsappE164: partial.whatsappE164?.replace(/\D/g, '') || base.whatsappE164,
    whatsappMessage: partial.whatsappMessage?.trim() || base.whatsappMessage,
    phoneDisplay: partial.phoneDisplay?.trim() || base.phoneDisplay,
  };
}

export function whatsAppUrlFromInfo(info: ContactInfo, message?: string): string {
  const text = encodeURIComponent(message ?? info.whatsappMessage);
  return `https://wa.me/${info.whatsappE164.replace(/\D/g, '')}?text=${text}`;
}

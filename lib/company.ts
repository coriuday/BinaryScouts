/**
 * Official company information.
 * Only populate fields that are real and verified.
 * Empty / undefined fields must never be rendered in the UI.
 */

export type CompanyRegistration = {
  legalName?: string;
  registrationNumber?: string;
  gstin?: string;
  registeredOffice?: string;
  companyLinkedIn?: string;
  companyEmail?: string;
};

/** Populate when official registrations / company page exist. */
export const COMPANY_REGISTRATION: CompanyRegistration = {
  // legalName: '…',
  // registrationNumber: '…',
  // gstin: '…',
  // registeredOffice: '…',
  // companyLinkedIn: 'https://www.linkedin.com/company/…',
  // companyEmail: 'hello@binaryscouts.com',
};

export function getFilledCompanyFields(): { label: string; value: string }[] {
  const r = COMPANY_REGISTRATION;
  const rows: { label: string; value: string }[] = [];
  if (r.legalName?.trim()) rows.push({ label: 'Legal name', value: r.legalName.trim() });
  if (r.registrationNumber?.trim()) rows.push({ label: 'Registration', value: r.registrationNumber.trim() });
  if (r.gstin?.trim()) rows.push({ label: 'GSTIN', value: r.gstin.trim() });
  if (r.registeredOffice?.trim()) rows.push({ label: 'Registered office', value: r.registeredOffice.trim() });
  return rows;
}

export const COMPANY_POSITIONING =
  'A lean technology startup building production software, AI systems, SaaS products, and business automation.';

export const ENGAGEMENT_STEPS = [
  'Submit project details',
  'We review requirements',
  'Discovery call (30 min)',
  'Scope & technical approach',
  'Proposal & kickoff',
] as const;

export const PROJECT_TYPES = [
  'AI / automation',
  'SaaS / web product',
  'CRM / workflows',
  'Dashboard / internal tools',
  'Website / platform',
  'Other / not sure yet',
] as const;

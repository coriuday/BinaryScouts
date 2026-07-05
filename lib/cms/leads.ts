import { createServiceClient } from '@/lib/supabase/server';
import type { DbContactLead } from '@/lib/cms/types';

export async function saveContactLead(lead: {
  type: 'contact' | 'newsletter';
  name?: string;
  email: string;
  company?: string;
  budget?: string;
  timeline?: string;
  message?: string;
}): Promise<boolean> {
  const db = createServiceClient();
  if (!db) return false;

  const { error } = await db.from('contact_leads').insert({
    type: lead.type,
    name: lead.name ?? null,
    email: lead.email,
    company: lead.company ?? null,
    budget: lead.budget ?? null,
    timeline: lead.timeline ?? null,
    message: lead.message ?? null,
  });
  return !error;
}

export async function getContactLeads(): Promise<DbContactLead[]> {
  const db = createServiceClient();
  if (!db) return [];

  const { data, error } = await db.from('contact_leads').select('*').order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as DbContactLead[];
}

export async function markLeadRead(id: string, read = true): Promise<boolean> {
  const db = createServiceClient();
  if (!db) return false;
  const { error } = await db.from('contact_leads').update({ read }).eq('id', id);
  return !error;
}

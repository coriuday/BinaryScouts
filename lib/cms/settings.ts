import { createServiceClient } from '@/lib/supabase/server';
import {
  DEFAULT_CONTACT_ENGAGEMENT,
  DEFAULT_HERO_STATS,
  type ContactEngagement,
  type ContactInfo,
  type HeroStats,
} from '@/lib/cms/types';
import { DEFAULT_CONTACT_INFO } from '@/lib/site-contact';

export type { HeroStats, ContactEngagement, ContactInfo };

export async function getHeroStats(): Promise<HeroStats> {
  const db = createServiceClient();
  if (!db) return DEFAULT_HERO_STATS;

  const { data } = await db.from('site_settings').select('value').eq('key', 'hero_stats').maybeSingle();
  if (!data?.value) return DEFAULT_HERO_STATS;
  return { ...DEFAULT_HERO_STATS, ...(data.value as HeroStats) };
}

export async function getContactEngagement(): Promise<ContactEngagement> {
  const db = createServiceClient();
  if (!db) return DEFAULT_CONTACT_ENGAGEMENT;

  const { data } = await db.from('site_settings').select('value').eq('key', 'contact_engagement').maybeSingle();
  if (!data?.value) return DEFAULT_CONTACT_ENGAGEMENT;
  const merged = { ...DEFAULT_CONTACT_ENGAGEMENT, ...(data.value as ContactEngagement) };
  // Replace known legacy placeholder ranges that overstated pricing.
  const legacyRanges = new Set(['₹10L – ₹50L', '₹10L - ₹50L', '₹10L–₹50L']);
  if (legacyRanges.has(merged.typicalRange.trim())) {
    merged.typicalRange = DEFAULT_CONTACT_ENGAGEMENT.typicalRange;
  }
  return merged;
}

export async function getContactInfo(): Promise<ContactInfo> {
  const db = createServiceClient();
  if (!db) return DEFAULT_CONTACT_INFO;

  const { data } = await db.from('site_settings').select('value').eq('key', 'contact_info').maybeSingle();
  if (!data?.value) return DEFAULT_CONTACT_INFO;
  return { ...DEFAULT_CONTACT_INFO, ...(data.value as ContactInfo) };
}

export async function getSiteSettings(): Promise<{
  heroStats: HeroStats;
  contactEngagement: ContactEngagement;
  contactInfo: ContactInfo;
}> {
  const [heroStats, contactEngagement, contactInfo] = await Promise.all([
    getHeroStats(),
    getContactEngagement(),
    getContactInfo(),
  ]);
  return { heroStats, contactEngagement, contactInfo };
}

export async function updateSiteSetting(key: string, value: Record<string, unknown>): Promise<boolean> {
  const db = createServiceClient();
  if (!db) return false;

  const { error } = await db
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  return !error;
}

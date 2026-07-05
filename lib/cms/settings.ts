import { createServiceClient } from '@/lib/supabase/server';
import {
  DEFAULT_CONTACT_ENGAGEMENT,
  DEFAULT_HERO_STATS,
  type ContactEngagement,
  type HeroStats,
} from '@/lib/cms/types';

export type { HeroStats, ContactEngagement };

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
  return { ...DEFAULT_CONTACT_ENGAGEMENT, ...(data.value as ContactEngagement) };
}

export async function getSiteSettings(): Promise<{ heroStats: HeroStats; contactEngagement: ContactEngagement }> {
  const [heroStats, contactEngagement] = await Promise.all([getHeroStats(), getContactEngagement()]);
  return { heroStats, contactEngagement };
}

export async function updateSiteSetting(key: string, value: Record<string, unknown>): Promise<boolean> {
  const db = createServiceClient();
  if (!db) return false;

  const { error } = await db
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  return !error;
}

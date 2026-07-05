import { NextResponse } from 'next/server';
import { requireAdmin, revalidateCms } from '@/lib/admin-guard';
import { getSiteSettings, updateSiteSetting } from '@/lib/cms/settings';
import type { ContactEngagement, ContactInfo, HeroStats } from '@/lib/cms/types';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PATCH(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: { heroStats?: HeroStats; contactEngagement?: ContactEngagement; contactInfo?: ContactInfo };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (body.heroStats) {
    const ok = await updateSiteSetting('hero_stats', body.heroStats as unknown as Record<string, unknown>);
    if (!ok) return NextResponse.json({ error: 'Failed to save hero stats' }, { status: 500 });
  }
  if (body.contactEngagement) {
    const ok = await updateSiteSetting('contact_engagement', body.contactEngagement as unknown as Record<string, unknown>);
    if (!ok) return NextResponse.json({ error: 'Failed to save contact settings' }, { status: 500 });
  }

  if (body.contactInfo) {
    const ok = await updateSiteSetting('contact_info', body.contactInfo as unknown as Record<string, unknown>);
    if (!ok) return NextResponse.json({ error: 'Failed to save contact info' }, { status: 500 });
  }

  revalidateCms();
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

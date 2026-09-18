import { NextResponse } from 'next/server';
import { requireAdmin, revalidateCms } from '@/lib/admin-guard';
import { getContactEngagement, getContactInfo, updateSiteSetting } from '@/lib/cms/settings';
import type { ContactEngagement, ContactInfo } from '@/lib/cms/types';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const [contactEngagement, contactInfo] = await Promise.all([
    getContactEngagement(),
    getContactInfo(),
  ]);
  return NextResponse.json({ contactEngagement, contactInfo });
}

export async function PATCH(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: { contactEngagement?: ContactEngagement; contactInfo?: ContactInfo };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // hero_stats intentionally not writable — vanity metrics are not shown on the public site.
  if (body.contactEngagement) {
    const ok = await updateSiteSetting('contact_engagement', body.contactEngagement as unknown as Record<string, unknown>);
    if (!ok) return NextResponse.json({ error: 'Failed to save contact settings' }, { status: 500 });
  }

  if (body.contactInfo) {
    const ok = await updateSiteSetting('contact_info', body.contactInfo as unknown as Record<string, unknown>);
    if (!ok) return NextResponse.json({ error: 'Failed to save contact info' }, { status: 500 });
  }

  revalidateCms();
  const [contactEngagement, contactInfo] = await Promise.all([
    getContactEngagement(),
    getContactInfo(),
  ]);
  return NextResponse.json({ contactEngagement, contactInfo });
}

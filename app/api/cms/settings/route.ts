import { NextResponse } from 'next/server';
import { getContactEngagement, getContactInfo } from '@/lib/cms/settings';

/** Public settings — engagement + contact only. Vanity heroStats are never exposed. */
export async function GET() {
  try {
    const [contactEngagement, contactInfo] = await Promise.all([
      getContactEngagement(),
      getContactInfo(),
    ]);
    return NextResponse.json({ contactEngagement, contactInfo });
  } catch (e) {
    console.error('CMS settings fetch failed', e);
    return NextResponse.json({ contactEngagement: null, contactInfo: null }, { status: 500 });
  }
}

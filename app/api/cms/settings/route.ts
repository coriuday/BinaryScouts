import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/cms/settings';

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (e) {
    console.error('CMS settings fetch failed', e);
    return NextResponse.json({ heroStats: null, contactEngagement: null }, { status: 500 });
  }
}

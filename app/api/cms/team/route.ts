import { NextResponse } from 'next/server';
import { getHomepageTeam, getTeamMembersCms } from '@/lib/cms/team';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const homepage = searchParams.get('homepage') === 'true';

  try {
    if (homepage) {
      const team = await getHomepageTeam();
      return NextResponse.json({ team });
    }
    const members = await getTeamMembersCms();
    return NextResponse.json({ members });
  } catch (e) {
    console.error('CMS team fetch failed', e);
    return NextResponse.json({ team: [], members: [] }, { status: 500 });
  }
}

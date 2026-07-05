import { NextResponse } from 'next/server';
import { getAllProjects, getFeaturedProjects } from '@/lib/cms/projects';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const featured = searchParams.get('featured') === 'true';

  try {
    const projects = featured ? await getFeaturedProjects() : await getAllProjects();
    return NextResponse.json({ projects });
  } catch (e) {
    console.error('CMS projects fetch failed', e);
    return NextResponse.json({ projects: [] }, { status: 500 });
  }
}

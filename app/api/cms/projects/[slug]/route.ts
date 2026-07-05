import { NextResponse } from 'next/server';
import { getProjectBySlug } from '@/lib/cms/projects';

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const project = await getProjectBySlug(slug);
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ project });
  } catch (e) {
    console.error('CMS project fetch failed', e);
    return NextResponse.json({ error: 'Failed to load project' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { requireAdmin, revalidateCms } from '@/lib/admin-guard';
import { getAllProjectsAdmin, createProject, type Project } from '@/lib/cms/projects';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const projects = await getAllProjectsAdmin();
  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: Partial<Project> & { slug: string; title: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.slug?.trim() || !body.title?.trim()) {
    return NextResponse.json({ error: 'slug and title required' }, { status: 400 });
  }

  const project = await createProject(body);
  if (!project) {
    return NextResponse.json({ error: 'Could not create project. Is Supabase configured?' }, { status: 500 });
  }

  revalidateCms();
  return NextResponse.json({ project });
}

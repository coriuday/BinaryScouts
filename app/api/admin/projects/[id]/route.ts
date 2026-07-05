import { NextResponse } from 'next/server';
import { requireAdmin, revalidateCms } from '@/lib/admin-guard';
import { updateProject, deleteProject, type Project } from '@/lib/cms/projects';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  let body: Partial<Project>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const project = await updateProject(id, body);
  if (!project) {
    return NextResponse.json({ error: 'Could not update project' }, { status: 500 });
  }

  revalidateCms();
  return NextResponse.json({ project });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const ok = await deleteProject(id);
  if (!ok) {
    return NextResponse.json({ error: 'Could not delete project' }, { status: 500 });
  }

  revalidateCms();
  return NextResponse.json({ ok: true });
}

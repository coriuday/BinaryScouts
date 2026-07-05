import { NextResponse } from 'next/server';
import { requireAdmin, revalidateCms } from '@/lib/admin-guard';
import { updateTeamMember, deleteTeamMember, type TeamMemberInput } from '@/lib/cms/team';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  let body: Partial<TeamMemberInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const member = await updateTeamMember(id, body);
  if (!member) {
    return NextResponse.json({ error: 'Could not update team member' }, { status: 500 });
  }

  revalidateCms();
  return NextResponse.json({ member });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const ok = await deleteTeamMember(id);
  if (!ok) {
    return NextResponse.json({ error: 'Could not delete team member' }, { status: 500 });
  }

  revalidateCms();
  return NextResponse.json({ ok: true });
}

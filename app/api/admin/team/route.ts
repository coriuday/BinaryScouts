import { NextResponse } from 'next/server';
import { requireAdmin, revalidateCms } from '@/lib/admin-guard';
import { getAllTeamAdmin, createTeamMember, type TeamMemberInput } from '@/lib/cms/team';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const team = await getAllTeamAdmin();
  return NextResponse.json({ team });
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: TeamMemberInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.name?.trim()) {
    return NextResponse.json({ error: 'name required' }, { status: 400 });
  }

  const member = await createTeamMember(body);
  if (!member) {
    return NextResponse.json({ error: 'Could not create team member' }, { status: 500 });
  }

  revalidateCms();
  return NextResponse.json({ member });
}

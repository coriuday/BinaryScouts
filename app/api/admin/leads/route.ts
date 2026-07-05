import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-guard';
import { getContactLeads, markLeadRead } from '@/lib/cms/leads';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const leads = await getContactLeads();
  return NextResponse.json({ leads });
}

export async function PATCH(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: { id: string; read?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const ok = await markLeadRead(body.id, body.read ?? true);
  if (!ok) return NextResponse.json({ error: 'Could not update lead' }, { status: 500 });
  return NextResponse.json({ ok: true });
}

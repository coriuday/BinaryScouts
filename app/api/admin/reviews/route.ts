import { NextResponse } from 'next/server';
import { requireAdmin, revalidateCms } from '@/lib/admin-guard';
import { getAllReviewsAdmin, updateReviewStatus, deleteReview } from '@/lib/cms/reviews';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const reviews = await getAllReviewsAdmin();
    return NextResponse.json({ reviews });
  } catch (e) {
    console.error('Failed to load admin reviews', e);
    return NextResponse.json({ error: 'Could not load reviews' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: { id?: string; status?: 'approved' | 'rejected' };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { id, status } = body;
  if (!id || (status !== 'approved' && status !== 'rejected')) {
    return NextResponse.json({ error: 'id and status (approved|rejected) required' }, { status: 400 });
  }

  const updated = await updateReviewStatus(id, status);
  if (!updated) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }

  revalidateCms();
  return NextResponse.json({ ok: true, review: updated });
}

export async function DELETE(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: { id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 });
  }

  const ok = await deleteReview(body.id);
  if (!ok) {
    return NextResponse.json({ error: 'Could not delete review' }, { status: 500 });
  }

  revalidateCms();
  return NextResponse.json({ ok: true });
}

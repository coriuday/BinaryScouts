import { createServiceClient } from '@/lib/supabase/server';
import { getApprovedReviews as getFsApproved, saveReview as saveFsReview, updateReviewStatus as updateFsStatus, getAllReviews as getFsAll } from '@/lib/reviews';
import { mapDbReview, type DbReview } from '@/lib/cms/types';
import type { Review } from '@/lib/review-types';

export async function getApprovedReviews(): Promise<Review[]> {
  const db = createServiceClient();
  if (!db) return getFsApproved();

  const { data, error } = await db
    .from('reviews')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) {
    return getFsApproved();
  }
  return (data as DbReview[]).map(mapDbReview);
}

export async function getAllReviewsAdmin(): Promise<Review[]> {
  const db = createServiceClient();
  if (!db) return getFsAll();

  const { data, error } = await db.from('reviews').select('*').order('created_at', { ascending: false });
  if (error) return getFsAll();
  return (data as DbReview[]).map(mapDbReview);
}

export async function submitReview(input: {
  name: string;
  role: string;
  company: string;
  quote: string;
  stars: number;
}): Promise<boolean> {
  const db = createServiceClient();
  if (!db) {
    const review: Review = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ...input,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    await saveFsReview(review);
    return true;
  }

  const { error } = await db.from('reviews').insert({
    name: input.name,
    role: input.role,
    company: input.company,
    quote: input.quote,
    stars: input.stars,
    status: 'pending',
  });
  return !error;
}

export async function updateReviewStatus(id: string, status: 'approved' | 'rejected'): Promise<Review | null> {
  const db = createServiceClient();
  if (!db) {
    await updateFsStatus(id, status);
    const all = await getFsAll();
    return all.find((r) => r.id === id) ?? null;
  }

  const { data, error } = await db.from('reviews').update({ status }).eq('id', id).select().single();
  if (error || !data) return null;
  return mapDbReview(data as DbReview);
}

export async function deleteReview(id: string): Promise<boolean> {
  const db = createServiceClient();
  if (!db) return false;
  const { error } = await db.from('reviews').delete().eq('id', id);
  return !error;
}

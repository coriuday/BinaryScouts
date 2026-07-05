import { mkdir, readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import type { Review } from '@/lib/review-types';

export type { Review } from '@/lib/review-types';
export { reviewInitials } from '@/lib/review-types';

const REVIEWS_DIR = path.join(process.cwd(), 'data', 'reviews');

async function ensureDir() {
  await mkdir(REVIEWS_DIR, { recursive: true });
}

async function readAllReviews(): Promise<Review[]> {
  await ensureDir();
  let files: string[];
  try {
    files = await readdir(REVIEWS_DIR);
  } catch {
    return [];
  }
  const reviews: Review[] = [];
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    try {
      const raw = await readFile(path.join(REVIEWS_DIR, file), 'utf8');
      reviews.push(JSON.parse(raw) as Review);
    } catch {
      // skip corrupt files
    }
  }
  return reviews.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getApprovedReviews(): Promise<Review[]> {
  const all = await readAllReviews();
  return all.filter((r) => r.status === 'approved');
}

export async function getPendingReviews(): Promise<Review[]> {
  const all = await readAllReviews();
  return all.filter((r) => r.status === 'pending');
}

export async function getAllReviews(): Promise<Review[]> {
  return readAllReviews();
}

export async function saveReview(review: Review): Promise<void> {
  await ensureDir();
  const file = path.join(REVIEWS_DIR, `${review.id}.json`);
  await writeFile(file, JSON.stringify(review, null, 2), 'utf8');
}

export async function updateReviewStatus(
  id: string,
  status: 'approved' | 'rejected'
): Promise<Review | null> {
  const file = path.join(REVIEWS_DIR, `${id}.json`);
  let review: Review;
  try {
    const raw = await readFile(file, 'utf8');
    review = JSON.parse(raw) as Review;
  } catch {
    return null;
  }
  review.status = status;
  await writeFile(file, JSON.stringify(review, null, 2), 'utf8');
  return review;
}

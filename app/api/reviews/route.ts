import { NextResponse } from 'next/server';
import { clientIp, rateLimitAsync } from '@/lib/rate-limit';
import { getApprovedReviews, submitReview } from '@/lib/cms/reviews';

type ReviewBody = {
  name?: string;
  role?: string;
  company?: string;
  quote?: string;
  stars?: number;
  website?: string;
};

export async function GET() {
  try {
    const reviews = await getApprovedReviews();
    return NextResponse.json({ reviews });
  } catch (e) {
    console.error('Failed to load reviews', e);
    return NextResponse.json({ reviews: [] });
  }
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limited = await rateLimitAsync(`reviews:${ip}`, 3, 60 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Too many review submissions. Please try again later.' },
      { status: 429 }
    );
  }

  let body: ReviewBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const name = (body.name || '').trim();
  const quote = (body.quote || '').trim();
  const role = (body.role || '').trim().slice(0, 80);
  const company = (body.company || '').trim().slice(0, 80);
  const stars = Number(body.stars);

  if (!name || name.length > 80) {
    return NextResponse.json({ error: 'Name is required (max 80 chars)' }, { status: 400 });
  }
  if (!quote || quote.length < 20 || quote.length > 500) {
    return NextResponse.json(
      { error: 'Review must be between 20 and 500 characters' },
      { status: 400 }
    );
  }
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    return NextResponse.json({ error: 'Please select a rating from 1 to 5 stars' }, { status: 400 });
  }

  const ok = await submitReview({ name, role, company, quote, stars });
  if (!ok) {
    return NextResponse.json({ error: 'Could not save review' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

import { NextResponse } from 'next/server';
import { clientIp, rateLimitAsync } from '@/lib/rate-limit';
import { getRustHeistUrl } from '@/lib/rust-api';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BRIEF = 4000;
const MAX_TARGETS = 12;

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limited = await rateLimitAsync(`heist:${ip}`, 10, 60 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Try again later.' },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > 40_000) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const codeName = String(body.codeName || '').trim().slice(0, 80);
  const corporation = String(body.corporation || '').trim().slice(0, 120);
  const email = String(body.email || '').trim().toLowerCase();
  const channel = String(body.channel || '').trim().slice(0, 40);
  const brief = String(body.brief || '').trim().slice(0, MAX_BRIEF);
  const timeline = String(body.timeline || '').trim().slice(0, 40);
  const budget = Number(body.budget);
  const targets = Array.isArray(body.targets)
    ? body.targets.map((t) => String(t).slice(0, 60)).slice(0, MAX_TARGETS)
    : [];

  if (!codeName || !email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: 'Valid codeName and email are required' },
      { status: 400 }
    );
  }
  if (!Number.isFinite(budget) || budget < 0 || budget > 10_000_000) {
    return NextResponse.json({ error: 'Invalid budget' }, { status: 400 });
  }

  const payload = {
    codeName,
    corporation,
    email,
    channel,
    brief,
    targets,
    budget: Math.round(budget),
    timeline,
  };

  try {
    const rustUrl = getRustHeistUrl();
    const response = await fetch(rustUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.INTERNAL_API_KEY
          ? { 'x-internal-key': process.env.INTERNAL_API_KEY }
          : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Rust API Gateway error:', response.status);
      return NextResponse.json(
        { error: 'Unable to process brief right now' },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      heistCode: data.heistCode,
      status: data.status,
      blueprint: typeof data.blueprint === 'string' ? data.blueprint.slice(0, 20_000) : '',
    });
  } catch (error) {
    console.error('Heist Proxy API error:', error);
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503 }
    );
  }
}

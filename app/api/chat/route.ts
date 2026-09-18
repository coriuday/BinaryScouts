import { NextResponse } from 'next/server';
import { clientIp, rateLimitAsync } from '@/lib/rate-limit';
import { getRustChatUrl } from '@/lib/rust-api';

const MAX_MESSAGE = 2000;
const MAX_HISTORY = 20;
const MAX_HISTORY_TEXT = 1500;

type ChatMessage = { role?: string; text?: string };

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limited = await rateLimitAsync(`chat:${ip}`, 30, 60 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { text: 'RATE LIMIT REACHED. TRY AGAIN SHORTLY.' },
      { status: 429 }
    );
  }

  let body: { message?: string; history?: ChatMessage[] };
  try {
    const text = await req.text();
    if (text.length > 50_000) {
      return NextResponse.json({ text: 'PAYLOAD TOO LARGE.' }, { status: 413 });
    }
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ text: 'INVALID REQUEST.' }, { status: 400 });
  }

  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!message || message.length > MAX_MESSAGE) {
    return NextResponse.json(
      { text: 'MESSAGE REQUIRED (MAX 2000 CHARS).' },
      { status: 400 }
    );
  }

  const history = Array.isArray(body.history)
    ? body.history.slice(-MAX_HISTORY).map((m) => ({
        role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
        text: String(m.text || '').slice(0, MAX_HISTORY_TEXT),
      }))
    : [];

  try {
    const rustUrl = getRustChatUrl();
    const response = await fetch(rustUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.INTERNAL_API_KEY
          ? { 'x-internal-key': process.env.INTERNAL_API_KEY }
          : {}),
      },
      body: JSON.stringify({ message, history }),
    });

    if (!response.ok) {
      console.warn('Rust Backend API error:', response.status);
      return NextResponse.json({
        text: 'VAULT SECURED. SYSTEM ENCOUNTERED AN ERROR COMMUNICATING WITH CORE ROUTER.',
      });
    }

    const data = await response.json();
    return NextResponse.json({
      text: typeof data.text === 'string' ? data.text.slice(0, 8000) : 'NO RESPONSE.',
    });
  } catch (error) {
    console.error('Chat Proxy API Error:', error);
    return NextResponse.json({
      text: 'ERROR: LINK TEMPORARILY INTERRUPTED. SYSTEM RUNNING IN SAFE MODE.',
    });
  }
}

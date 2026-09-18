import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { clientIp, rateLimitAsync } from '@/lib/rate-limit';
import { saveContactLead } from '@/lib/cms/leads';
import { sendContactNotification } from '@/lib/contact-email';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE = 5000;
const MAX_NAME = 120;

type ContactBody = {
  type?: 'contact' | 'newsletter';
  name?: string;
  email?: string;
  company?: string;
  budget?: string;
  timeline?: string;
  projectType?: string;
  message?: string;
  website?: string; // honeypot
};

async function persistLead(filename: string, data: Record<string, unknown>) {
  const dir = path.join(process.cwd(), 'data', filename.includes('newsletter') ? 'newsletter' : 'contacts');
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.json`);
  await writeFile(file, JSON.stringify(data, null, 2), 'utf8');
  return file;
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limited = await rateLimitAsync(`contact:${ip}`, 8, 60 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429 }
    );
  }

  let body: ContactBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Honeypot — bots fill hidden fields
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const type = body.type === 'newsletter' ? 'newsletter' : 'contact';
  const email = (body.email || '').trim().toLowerCase();

  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
  }

  if (type === 'newsletter') {
    const record = {
      type,
      email,
      ip,
      receivedAt: new Date().toISOString(),
    };
    try {
      await persistLead('newsletter', record);
      await saveContactLead({ type: 'newsletter', email });
    } catch (e) {
      console.error('Failed to persist newsletter lead', e);
      return NextResponse.json({ error: 'Could not save subscription' }, { status: 500 });
    }
    const emailResult = await sendContactNotification({
      subject: `Newsletter signup: ${email}`,
      text: `New newsletter subscription\nEmail: ${email}\nIP: ${ip}`,
      replyTo: email,
    });
    return NextResponse.json({
      ok: true,
      delivered: emailResult.delivered,
      ...(emailResult.error && !emailResult.delivered ? { emailError: emailResult.error } : {}),
    });
  }

  const name = (body.name || '').trim();
  const message = (body.message || '').trim();
  const company = (body.company || '').trim().slice(0, 200);
  const budget = (body.budget || '').trim().slice(0, 120);
  const timeline = (body.timeline || '').trim().slice(0, 120);
  const projectType = (body.projectType || '').trim().slice(0, 120);

  if (!name || name.length > MAX_NAME) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }
  if (!message || message.length > MAX_MESSAGE) {
    return NextResponse.json({ error: 'Message is required (max 5000 chars)' }, { status: 400 });
  }

  const record = {
    type: 'contact',
    name,
    email,
    company,
    budget,
    timeline,
    projectType,
    message,
    ip,
    receivedAt: new Date().toISOString(),
  };

  try {
    await persistLead('contact', record);
    await saveContactLead({
      type: 'contact',
      name,
      email,
      company,
      budget,
      timeline,
      message: projectType ? `[${projectType}] ${message}` : message,
    });
  } catch (e) {
    console.error('Failed to persist contact lead', e);
    return NextResponse.json({ error: 'Could not save message' }, { status: 500 });
  }

  const emailResult = await sendContactNotification({
    subject: `Contact form: ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      company ? `Company: ${company}` : '',
      projectType ? `Project type: ${projectType}` : '',
      budget ? `Budget: ${budget}` : '',
      timeline ? `Timeline: ${timeline}` : '',
      '',
      message,
    ]
      .filter(Boolean)
      .join('\n'),
    replyTo: email,
  });

  return NextResponse.json({
    ok: true,
    delivered: emailResult.delivered,
    ...(emailResult.error && !emailResult.delivered ? { emailError: emailResult.error } : {}),
  });
}

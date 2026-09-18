import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-guard';
import { createServiceClient } from '@/lib/supabase/server';
import { clientIp, rateLimitAsync } from '@/lib/rate-limit';

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const ip = clientIp(req);
  const limited = await rateLimitAsync(`upload:${ip}`, 20, 60 * 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: 'Too many uploads' }, { status: 429 });
  }

  const db = createServiceClient();
  if (!db) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'file required' }, { status: 400 });
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'Max 5MB' }, { status: 400 });
  }

  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await db.storage.from('team-photos').upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    console.error('Upload failed', error);
    return NextResponse.json({ error: 'Upload failed. Ensure team-photos bucket exists.' }, { status: 500 });
  }

  const { data: urlData } = db.storage.from('team-photos').getPublicUrl(path);
  return NextResponse.json({ url: urlData.publicUrl });
}

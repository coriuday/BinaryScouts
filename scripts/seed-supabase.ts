/**
 * One-time seed: imports static projects + team into Supabase.
 * Run: npm run seed
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
import { readFileSync, existsSync, readdirSync } from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { PROJECTS } from '../lib/projects';
import { TEAM_MEMBERS } from '../lib/team';
import { FLIP_TEAM_MEMBERS } from '../lib/flip-team';
import { DEFAULT_CONTACT_ENGAGEMENT, DEFAULT_HERO_STATS } from '../lib/cms/types';
import { DEFAULT_CONTACT_INFO } from '../lib/site-contact';

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

async function main() {
  loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
  }

  const db = createClient(url, key, { auth: { persistSession: false } });

  console.log('Seeding projects…');
  for (const p of PROJECTS) {
    const row = {
      slug: p.slug,
      title: p.title,
      category: p.category,
      status: p.status,
      hook: p.hook,
      description: p.description,
      case_study: p.caseStudy ?? null,
      tech_stack: p.techStack,
      tags: p.tags,
      metrics: p.metrics,
      live_url: p.liveUrl ?? null,
      github_url: p.githubUrl ?? null,
      images: p.images,
      gradient: p.gradient,
      featured: p.featured,
      sort_order: p.order,
    };
    const { error } = await db.from('projects').upsert(row, { onConflict: 'slug' });
    if (error) console.error(`  project ${p.slug}:`, error.message);
    else console.log(`  ✓ ${p.title}`);
  }

  console.log('Seeding team…');
  for (let i = 0; i < TEAM_MEMBERS.length; i++) {
    const m = TEAM_MEMBERS[i];
    const flip = FLIP_TEAM_MEMBERS[i];
    const row = {
      name: m.name,
      username: flip?.username ?? '',
      titles: flip?.titles ?? [],
      role: m.role,
      bio: m.bio,
      image_url: m.avatar ?? flip?.image ?? '',
      stats: flip?.stats ?? [],
      skills: m.skills,
      social_links: m.socials ?? {},
      badges: m.badges,
      experience: m.experience,
      projects_shipped: m.projectsShipped,
      sort_order: i,
      show_on_homepage: true,
    };
    const { data: existing } = await db.from('team_members').select('id').eq('name', m.name).maybeSingle();
    if (existing?.id) {
      const { error } = await db.from('team_members').update(row).eq('id', existing.id);
      if (error) console.error(`  team ${m.name}:`, error.message);
      else console.log(`  ✓ updated ${m.name}`);
    } else {
      const { error } = await db.from('team_members').insert(row);
      if (error) console.error(`  team ${m.name}:`, error.message);
      else console.log(`  ✓ ${m.name}`);
    }
  }

  console.log('Seeding site settings…');
  await db.from('site_settings').upsert([
    { key: 'hero_stats', value: DEFAULT_HERO_STATS },
    { key: 'contact_engagement', value: DEFAULT_CONTACT_ENGAGEMENT },
    { key: 'contact_info', value: DEFAULT_CONTACT_INFO },
  ]);

  const reviewsDir = path.join(process.cwd(), 'data', 'reviews');
  if (existsSync(reviewsDir)) {
    console.log('Migrating filesystem reviews…');
    const files = readdirSync(reviewsDir).filter((f) => f.endsWith('.json'));
    for (const file of files) {
      try {
        const review = JSON.parse(readFileSync(path.join(reviewsDir, file), 'utf8'));
        const { error } = await db.from('reviews').upsert({
          id: review.id,
          name: review.name,
          role: review.role ?? '',
          company: review.company ?? '',
          quote: review.quote,
          stars: review.stars ?? 5,
          status: review.status ?? 'pending',
          created_at: review.createdAt ?? new Date().toISOString(),
        });
        if (!error) console.log(`  ✓ review ${review.name}`);
      } catch {
        // skip invalid files
      }
    }
  }

  console.log('\nDone. Create a public "team-photos" storage bucket in Supabase if not exists.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

-- BinaryScouts CMS schema — run in Supabase SQL Editor

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Web Platform',
  status TEXT NOT NULL DEFAULT 'live' CHECK (status IN ('live', 'in-progress', 'coming-soon', 'draft')),
  hook TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  case_study JSONB,
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  metrics JSONB NOT NULL DEFAULT '[]',
  live_url TEXT,
  github_url TEXT,
  images TEXT[] NOT NULL DEFAULT '{}',
  gradient TEXT NOT NULL DEFAULT 'linear-gradient(135deg, #6366f1, #a78bfa)',
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Team members (unified flip card + profile)
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  username TEXT NOT NULL DEFAULT '',
  titles TEXT[] NOT NULL DEFAULT '{}',
  role TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  stats JSONB NOT NULL DEFAULT '[]',
  skills JSONB NOT NULL DEFAULT '[]',
  social_links JSONB NOT NULL DEFAULT '{}',
  badges TEXT[] NOT NULL DEFAULT '{}',
  experience INTEGER NOT NULL DEFAULT 0,
  projects_shipped INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  show_on_homepage BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  quote TEXT NOT NULL,
  stars INTEGER NOT NULL DEFAULT 5 CHECK (stars >= 1 AND stars <= 5),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contact leads
CREATE TABLE IF NOT EXISTS contact_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL DEFAULT 'contact' CHECK (type IN ('contact', 'newsletter')),
  name TEXT,
  email TEXT NOT NULL,
  company TEXT,
  budget TEXT,
  timeline TEXT,
  message TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Site settings (key-value)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured, sort_order);
CREATE INDEX IF NOT EXISTS idx_team_sort ON team_members(sort_order);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_created ON contact_leads(created_at DESC);

-- RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies (non-draft projects, homepage team, approved reviews, settings)
CREATE POLICY "public_read_projects" ON projects FOR SELECT
  USING (status != 'draft');

CREATE POLICY "public_read_team" ON team_members FOR SELECT
  USING (true);

CREATE POLICY "public_read_approved_reviews" ON reviews FOR SELECT
  USING (status = 'approved');

CREATE POLICY "public_read_settings" ON site_settings FOR SELECT
  USING (true);

-- Public insert for reviews and contact leads
CREATE POLICY "public_insert_reviews" ON reviews FOR INSERT
  WITH CHECK (status = 'pending');

CREATE POLICY "public_insert_leads" ON contact_leads FOR INSERT
  WITH CHECK (true);

-- Storage bucket for team photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('team-photos', 'team-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Default site settings
INSERT INTO site_settings (key, value) VALUES
  ('hero_stats', '{"systemsBuilt": 0, "revenueLabel": "—", "clientRetention": 0, "avgRating": 0}'),
  ('contact_engagement', '{"typicalRange": "Scoped per engagement", "responseTime": "<24 hours", "discoveryCall": "30 min, free"}')
ON CONFLICT (key) DO NOTHING;

-- ClawVerse Initial Schema
-- Run this in the Supabase SQL Editor

-- === Skills ===
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  source TEXT NOT NULL, -- 'ClawHub', 'GitHub', 'Community'
  source_url TEXT,
  category TEXT,
  security TEXT DEFAULT 'unreviewed', -- verified/reviewed/unreviewed/flagged/blocked
  permissions TEXT[] DEFAULT '{}',
  platforms TEXT[] DEFAULT '{}',
  installs INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  virustotal_status TEXT,
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_skills_slug ON skills(slug);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_security ON skills(security);
CREATE INDEX IF NOT EXISTS idx_skills_source ON skills(source);
CREATE INDEX IF NOT EXISTS idx_skills_search ON skills USING GIN(search_vector);

-- === Projects ===
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  layer TEXT NOT NULL, -- 'core', 'social', 'collab', 'trust', 'experimental'
  url TEXT,
  github_url TEXT,
  github_stars INTEGER,
  is_official BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active', -- 'active', 'viral', 'research', 'inactive'
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_layer ON projects(layer);
CREATE INDEX IF NOT EXISTS idx_projects_search ON projects USING GIN(search_vector);

-- === Deploy Options ===
CREATE TABLE IF NOT EXISTS deploy_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  url TEXT,
  skill_level INTEGER, -- 1-4
  cost TEXT,
  setup_time TEXT,
  security TEXT,
  scalability TEXT,
  best_for TEXT,
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_deploy_slug ON deploy_options(slug);

-- === User Submissions ===
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'skill', 'project', 'deploy', 'security_report'
  name TEXT NOT NULL,
  url TEXT,
  description TEXT,
  category TEXT,
  severity TEXT, -- for security reports: 'low', 'medium', 'high', 'critical'
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  submitted_by UUID REFERENCES auth.users(id),
  submitted_email TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_type ON submissions(type);

-- === Reviews ===
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type TEXT NOT NULL, -- 'skill', 'project', 'deploy'
  target_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_target ON reviews(target_type, target_id);

-- === Pulse (News Feed) ===
CREATE TABLE IF NOT EXISTS pulse_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag TEXT NOT NULL, -- 'security', 'release', 'trending', 'new', 'partner', 'event'
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  published_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pulse_tag ON pulse_items(tag);
CREATE INDEX IF NOT EXISTS idx_pulse_date ON pulse_items(published_at DESC);

-- === Row Level Security ===

-- Skills: public read, service role write
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "skills_public_read" ON skills FOR SELECT USING (true);
CREATE POLICY "skills_service_write" ON skills FOR ALL USING (auth.role() = 'service_role');

-- Projects: public read, service role write
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects_public_read" ON projects FOR SELECT USING (true);
CREATE POLICY "projects_service_write" ON projects FOR ALL USING (auth.role() = 'service_role');

-- Deploy options: public read, service role write
ALTER TABLE deploy_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deploy_public_read" ON deploy_options FOR SELECT USING (true);
CREATE POLICY "deploy_service_write" ON deploy_options FOR ALL USING (auth.role() = 'service_role');

-- Submissions: authenticated users can insert, service role manages
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "submissions_insert" ON submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "submissions_read_own" ON submissions FOR SELECT USING (
  submitted_by = auth.uid() OR auth.role() = 'service_role'
);
CREATE POLICY "submissions_service_manage" ON submissions FOR ALL USING (auth.role() = 'service_role');

-- Reviews: public read, authenticated insert
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_auth_insert" ON reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "reviews_service_manage" ON reviews FOR ALL USING (auth.role() = 'service_role');

-- Pulse: public read, service role write
ALTER TABLE pulse_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pulse_public_read" ON pulse_items FOR SELECT USING (true);
CREATE POLICY "pulse_service_write" ON pulse_items FOR ALL USING (auth.role() = 'service_role');

-- === Updated At Trigger ===
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Metrics and tracking tables
-- Run this after 004_reviews_target_id_text.sql

CREATE TABLE IF NOT EXISTS project_growth_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  stars INTEGER NOT NULL CHECK (stars >= 0),
  source TEXT NOT NULL DEFAULT 'github-api',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (project_id, snapshot_date, source)
);

CREATE INDEX IF NOT EXISTS idx_project_growth_project_date
  ON project_growth_snapshots(project_id, snapshot_date DESC);

ALTER TABLE project_growth_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "project_growth_service_manage"
  ON project_growth_snapshots
  FOR ALL
  USING (auth.role() = 'service_role');
CREATE POLICY "project_growth_public_read"
  ON project_growth_snapshots
  FOR SELECT
  USING (true);


CREATE TABLE IF NOT EXISTS page_view_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  target_type TEXT,
  target_slug TEXT,
  user_agent TEXT,
  referer TEXT,
  ip_hash TEXT,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_view_events_path_date
  ON page_view_events(path, viewed_at DESC);

ALTER TABLE page_view_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "page_views_service_manage"
  ON page_view_events
  FOR ALL
  USING (auth.role() = 'service_role');
CREATE POLICY "page_views_public_read"
  ON page_view_events
  FOR SELECT
  USING (true);
CREATE POLICY "page_views_insert"
  ON page_view_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

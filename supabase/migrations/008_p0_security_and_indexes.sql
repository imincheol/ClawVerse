-- P0 Migration: Security fixes, cascade triggers, and composite indexes

-- ============================================================
-- P0-1: Reviews RLS — enforce user_id = auth.uid() on INSERT
-- ============================================================
DROP POLICY IF EXISTS "reviews_auth_insert" ON reviews;
CREATE POLICY "reviews_auth_insert" ON reviews FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- ============================================================
-- P0-2: Cascade cleanup triggers for skill/project deletion
-- ============================================================

-- When a skill is deleted, clean up related reviews and pulse items
CREATE OR REPLACE FUNCTION cascade_skill_delete()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM reviews WHERE target_type = 'skill' AND target_id = OLD.slug;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_skill_cascade_delete
  BEFORE DELETE ON skills
  FOR EACH ROW EXECUTE FUNCTION cascade_skill_delete();

-- When a project is deleted, clean up related reviews
CREATE OR REPLACE FUNCTION cascade_project_delete()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM reviews WHERE target_type = 'project' AND target_id = OLD.slug;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_project_cascade_delete
  BEFORE DELETE ON projects
  FOR EACH ROW EXECUTE FUNCTION cascade_project_delete();

-- When a deploy option is deleted, clean up related reviews
CREATE OR REPLACE FUNCTION cascade_deploy_delete()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM reviews WHERE target_type = 'deploy' AND target_id = OLD.slug;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_deploy_cascade_delete
  BEFORE DELETE ON deploy_options
  FOR EACH ROW EXECUTE FUNCTION cascade_deploy_delete();

-- ============================================================
-- P0-3: Composite indexes for common query patterns
-- ============================================================

-- Skills: category + security (filtered listings)
CREATE INDEX IF NOT EXISTS idx_skills_category_security ON skills(category, security);

-- Skills: source + security (source-filtered views)
CREATE INDEX IF NOT EXISTS idx_skills_source_security ON skills(source, security);

-- Skills: installs desc (popular skills sort)
CREATE INDEX IF NOT EXISTS idx_skills_installs_desc ON skills(installs DESC);

-- Skills: rating desc (top-rated sort)
CREATE INDEX IF NOT EXISTS idx_skills_rating_desc ON skills(rating DESC);

-- Projects: layer + status (filtered project listings)
CREATE INDEX IF NOT EXISTS idx_projects_layer_status ON projects(layer, status);

-- Projects: stars desc (popular projects sort)
CREATE INDEX IF NOT EXISTS idx_projects_stars_desc ON projects(github_stars DESC NULLS LAST);

-- Reviews: target lookup composite (already exists as idx_reviews_target, but add user_id)
CREATE INDEX IF NOT EXISTS idx_reviews_target_user ON reviews(target_type, target_id, user_id);

-- Submissions: status + type (admin moderation queue)
CREATE INDEX IF NOT EXISTS idx_submissions_status_type ON submissions(status, type);

-- Pulse: tag + date (filtered news feed)
CREATE INDEX IF NOT EXISTS idx_pulse_tag_date ON pulse_items(tag, published_at DESC);

-- Deploy options: skill_level (level filter)
CREATE INDEX IF NOT EXISTS idx_deploy_skill_level ON deploy_options(skill_level);

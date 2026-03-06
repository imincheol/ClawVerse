-- Migration 006: Sync schema with TypeScript data layer
-- Adds missing columns to match the expanded Skill, DeployOption, and PulseItem types.
-- Also adds performance indexes identified during the system audit.

-- === Skills: add columns for protocols, lastUpdated, maintainerActivity, sources, githubUrl ===
ALTER TABLE skills ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS protocols TEXT[] DEFAULT '{}';
ALTER TABLE skills ADD COLUMN IF NOT EXISTS last_updated DATE;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS maintainer_activity TEXT DEFAULT 'active';
ALTER TABLE skills ADD COLUMN IF NOT EXISTS sources JSONB DEFAULT '[]';

-- === Deploy Options: add columns for features, setupSteps, alternatives ===
ALTER TABLE deploy_options ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT '{}';
ALTER TABLE deploy_options ADD COLUMN IF NOT EXISTS setup_steps TEXT[] DEFAULT '{}';
ALTER TABLE deploy_options ADD COLUMN IF NOT EXISTS alternatives TEXT[] DEFAULT '{}';

-- === Pulse Items: add columns for source attribution ===
ALTER TABLE pulse_items ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE pulse_items ADD COLUMN IF NOT EXISTS source_url TEXT;

-- === Performance indexes ===
CREATE INDEX IF NOT EXISTS idx_skills_installs ON skills(installs DESC);
CREATE INDEX IF NOT EXISTS idx_skills_rating ON skills(rating DESC);
CREATE INDEX IF NOT EXISTS idx_skills_created ON skills(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_stars ON projects(github_stars DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_projects_official ON projects(is_official);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_pulse_tag_date ON pulse_items(tag, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_deploy_level ON deploy_options(skill_level);

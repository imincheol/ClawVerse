-- Phase 4: Community Features Schema
-- Run after 001_initial_schema.sql

-- === User Profiles ===
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  github_username TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_username ON user_profiles(username);

-- === Review Votes ===
CREATE TABLE IF NOT EXISTS review_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote TEXT NOT NULL CHECK (vote IN ('helpful', 'not_helpful')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(review_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_review_votes_review ON review_votes(review_id);

-- === User Stacks ===
CREATE TABLE IF NOT EXISTS user_stacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_stacks_user ON user_stacks(user_id);

CREATE TABLE IF NOT EXISTS stack_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stack_id UUID NOT NULL REFERENCES user_stacks(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('skill', 'project')),
  item_slug TEXT NOT NULL,
  note TEXT,
  added_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(stack_id, item_type, item_slug)
);

CREATE INDEX IF NOT EXISTS idx_stack_items_stack ON stack_items(stack_id);

-- === Weekly Picks ===
CREATE TABLE IF NOT EXISTS weekly_picks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type TEXT NOT NULL CHECK (item_type IN ('skill', 'project')),
  item_slug TEXT NOT NULL,
  pick_reason TEXT,
  week_start DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_weekly_picks_week ON weekly_picks(week_start DESC);

-- === Newsletter Subscribers ===
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- === RLS Policies ===

-- User Profiles: public read, own write
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_public_read" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "profiles_own_write" ON user_profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_own_update" ON user_profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "profiles_service_manage" ON user_profiles FOR ALL USING (auth.role() = 'service_role');

-- Review Votes: public read counts, authenticated vote
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "votes_public_read" ON review_votes FOR SELECT USING (true);
CREATE POLICY "votes_auth_insert" ON review_votes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "votes_own_delete" ON review_votes FOR DELETE USING (user_id = auth.uid());
CREATE POLICY "votes_service_manage" ON review_votes FOR ALL USING (auth.role() = 'service_role');

-- User Stacks: public read (if is_public), own write
ALTER TABLE user_stacks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stacks_public_read" ON user_stacks FOR SELECT USING (is_public OR user_id = auth.uid());
CREATE POLICY "stacks_own_write" ON user_stacks FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "stacks_own_update" ON user_stacks FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "stacks_own_delete" ON user_stacks FOR DELETE USING (user_id = auth.uid());
CREATE POLICY "stacks_service_manage" ON user_stacks FOR ALL USING (auth.role() = 'service_role');

-- Stack Items: inherit from parent stack
ALTER TABLE stack_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stack_items_public_read" ON stack_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_stacks WHERE id = stack_id AND (is_public OR user_id = auth.uid()))
);
CREATE POLICY "stack_items_own_write" ON stack_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM user_stacks WHERE id = stack_id AND user_id = auth.uid())
);
CREATE POLICY "stack_items_own_delete" ON stack_items FOR DELETE USING (
  EXISTS (SELECT 1 FROM user_stacks WHERE id = stack_id AND user_id = auth.uid())
);
CREATE POLICY "stack_items_service_manage" ON stack_items FOR ALL USING (auth.role() = 'service_role');

-- Weekly Picks: public read, service role write
ALTER TABLE weekly_picks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "picks_public_read" ON weekly_picks FOR SELECT USING (true);
CREATE POLICY "picks_service_write" ON weekly_picks FOR ALL USING (auth.role() = 'service_role');

-- Newsletter: service role only
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "newsletter_service_manage" ON newsletter_subscribers FOR ALL USING (auth.role() = 'service_role');

-- === Triggers ===
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER stacks_updated_at
  BEFORE UPDATE ON user_stacks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

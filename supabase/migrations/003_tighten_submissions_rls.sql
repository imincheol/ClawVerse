-- Tighten submissions RLS: require authentication for inserts
-- and auto-set submitted_by to the authenticated user's ID.

-- Drop the overly permissive insert policy
DROP POLICY IF EXISTS submissions_insert ON submissions;

-- Require authenticated user for inserts
CREATE POLICY submissions_insert ON submissions
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Set default for submitted_by to the current user's ID
ALTER TABLE submissions
  ALTER COLUMN submitted_by SET DEFAULT auth.uid();

-- Allow anon inserts to newsletter_subscribers (for newsletter signup without login)
DROP POLICY IF EXISTS newsletter_subscribers_insert ON newsletter_subscribers;

CREATE POLICY newsletter_subscribers_insert ON newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

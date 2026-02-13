-- Align reviews target_id with application usage (slug string)
-- Previous schema used UUID, but app stores skill/project slugs.

ALTER TABLE reviews
  ALTER COLUMN target_id TYPE TEXT
  USING target_id::text;

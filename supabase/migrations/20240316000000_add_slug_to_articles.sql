-- Add slug column to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create a function to generate slugs
CREATE OR REPLACE FUNCTION generate_slug(title TEXT) RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Update existing articles with slugs
UPDATE articles 
SET slug = generate_slug(title)
WHERE slug IS NULL;

-- Make slug column unique
ALTER TABLE articles ADD CONSTRAINT articles_slug_key UNIQUE (slug); 
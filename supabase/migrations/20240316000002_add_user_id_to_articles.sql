-- Add user_id column to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Update existing articles to have the admin user_id
UPDATE articles 
SET user_id = '48d8cd94-8cd3-45a7-9c6c-b62aafa8fa3b' 
WHERE user_id IS NULL; 
-- Enable RLS on articles table
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create policies for articles table
-- Allow anyone to read articles
CREATE POLICY "Allow public read access to articles"
ON articles FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert articles
CREATE POLICY "Allow authenticated users to insert articles"
ON articles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = '48d8cd94-8cd3-45a7-9c6c-b62aafa8fa3b');

-- Allow authenticated users to update their own articles
CREATE POLICY "Allow authenticated users to update articles"
ON articles FOR UPDATE
TO authenticated
USING (auth.uid() = '48d8cd94-8cd3-45a7-9c6c-b62aafa8fa3b')
WITH CHECK (auth.uid() = '48d8cd94-8cd3-45a7-9c6c-b62aafa8fa3b');

-- Allow authenticated users to delete their own articles
CREATE POLICY "Allow authenticated users to delete articles"
ON articles FOR DELETE
TO authenticated
USING (auth.uid() = '48d8cd94-8cd3-45a7-9c6c-b62aafa8fa3b'); 
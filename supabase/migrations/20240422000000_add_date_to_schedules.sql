-- Add date column to schedules table
ALTER TABLE schedules
ADD COLUMN date DATE;

-- Add comment to the column
COMMENT ON COLUMN schedules.date IS 'The date of the schedule';

-- Drop existing policies if they exist
DO $$ 
BEGIN
    -- Drop read policy if exists
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'schedules' 
        AND policyname = 'Enable read access for all users'
    ) THEN
        DROP POLICY "Enable read access for all users" ON schedules;
    END IF;

    -- Drop insert policy if exists
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'schedules' 
        AND policyname = 'Enable insert for authenticated users only'
    ) THEN
        DROP POLICY "Enable insert for authenticated users only" ON schedules;
    END IF;

    -- Drop update policy if exists
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'schedules' 
        AND policyname = 'Enable update for authenticated users only'
    ) THEN
        DROP POLICY "Enable update for authenticated users only" ON schedules;
    END IF;
END $$;

-- Create new policies
CREATE POLICY "Enable read access for all users" ON schedules
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON schedules
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON schedules
    FOR UPDATE
    USING (auth.role() = 'authenticated'); 
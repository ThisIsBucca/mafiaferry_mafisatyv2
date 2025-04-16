-- Enable RLS on analytics tables
ALTER TABLE analytics_pageviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics_pageviews
CREATE POLICY "Enable insert for all users" ON analytics_pageviews
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON analytics_pageviews
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for analytics_events
CREATE POLICY "Enable insert for all users" ON analytics_events
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON analytics_events
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for analytics_sessions
CREATE POLICY "Enable insert for all users" ON analytics_sessions
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON analytics_sessions
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_analytics_pageviews_user_id ON analytics_pageviews(user_id);
CREATE INDEX idx_analytics_pageviews_created_at ON analytics_pageviews(created_at);

CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

CREATE INDEX idx_analytics_sessions_user_id ON analytics_sessions(user_id);
CREATE INDEX idx_analytics_sessions_created_at ON analytics_sessions(created_at); 
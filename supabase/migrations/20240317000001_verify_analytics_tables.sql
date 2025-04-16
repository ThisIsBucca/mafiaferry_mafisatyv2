-- Verify analytics tables exist
DO $$
BEGIN
    -- Check if tables exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'analytics_pageviews') THEN
        RAISE EXCEPTION 'analytics_pageviews table does not exist';
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'analytics_events') THEN
        RAISE EXCEPTION 'analytics_events table does not exist';
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'analytics_sessions') THEN
        RAISE EXCEPTION 'analytics_sessions table does not exist';
    END IF;

    -- Check RLS policies
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'analytics_pageviews') THEN
        RAISE EXCEPTION 'RLS policies not set for analytics_pageviews';
    END IF;

    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'analytics_events') THEN
        RAISE EXCEPTION 'RLS policies not set for analytics_events';
    END IF;

    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'analytics_sessions') THEN
        RAISE EXCEPTION 'RLS policies not set for analytics_sessions';
    END IF;

    -- Check indexes
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_analytics_pageviews_user_id') THEN
        RAISE EXCEPTION 'Index not found for analytics_pageviews user_id';
    END IF;

    IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_analytics_events_user_id') THEN
        RAISE EXCEPTION 'Index not found for analytics_events user_id';
    END IF;

    IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_analytics_sessions_user_id') THEN
        RAISE EXCEPTION 'Index not found for analytics_sessions user_id';
    END IF;

    RAISE NOTICE 'All analytics tables and configurations are properly set up';
END $$; 
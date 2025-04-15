-- Create analytics tables
create table public.analytics_pageviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  page_path text not null,
  referrer text,
  user_agent text,
  device_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.analytics_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  event_type text not null,
  event_data jsonb,
  page_path text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.analytics_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  session_start timestamp with time zone not null,
  session_end timestamp with time zone,
  duration_seconds integer,
  page_count integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.analytics_pageviews enable row level security;
alter table public.analytics_events enable row level security;
alter table public.analytics_sessions enable row level security;

-- Create policies
create policy "Enable read access for authenticated users" on public.analytics_pageviews
  for select to authenticated using (true);

create policy "Enable read access for authenticated users" on public.analytics_events
  for select to authenticated using (true);

create policy "Enable read access for authenticated users" on public.analytics_sessions
  for select to authenticated using (true);

-- Create indexes
create index idx_analytics_pageviews_user_id on public.analytics_pageviews(user_id);
create index idx_analytics_pageviews_created_at on public.analytics_pageviews(created_at);
create index idx_analytics_events_user_id on public.analytics_events(user_id);
create index idx_analytics_events_created_at on public.analytics_events(created_at);
create index idx_analytics_sessions_user_id on public.analytics_sessions(user_id); 
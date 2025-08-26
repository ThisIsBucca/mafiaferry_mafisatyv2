-- Create a table for advertisement products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price text not null,
  image_url text not null,
  description text,
  phone text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Index for ordering
create index if not exists idx_products_created_at on public.products(created_at desc);

-- Run this in Supabase SQL Editor to create the leads table.
-- Project: https://supabase.com/dashboard/project/lreayrvngzhvhcgmazcg

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  project_slug text not null,
  name text not null,
  phone text not null,
  email text,
  notes text,
  source text
);

-- Optional: enable RLS. The API uses the service role key so it bypasses RLS.
-- This prevents any accidental client-side access if you ever use the anon key.
alter table leads enable row level security;

create policy "No public read on leads"
  on leads for select
  using (false);

create policy "No public update or delete on leads"
  on leads for all
  using (false);

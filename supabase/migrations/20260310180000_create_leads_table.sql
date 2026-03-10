-- Beitlee leads table for landing page form submissions
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

alter table leads enable row level security;

create policy "No public read on leads"
  on leads for select
  using (false);

create policy "No public update or delete on leads"
  on leads for all
  using (false);

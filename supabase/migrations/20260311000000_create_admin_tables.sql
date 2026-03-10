-- Admin panel: page settings overrides, page visits, button clicks
-- Run via: supabase db push (or SQL Editor)

-- Per-slug phone/WhatsApp overrides (admin-editable)
create table if not exists page_settings (
  project_slug text primary key,
  phone text,
  whatsapp_number text,
  updated_at timestamptz default now()
);

alter table page_settings enable row level security;

create policy "No public access on page_settings"
  on page_settings for all
  using (false);

-- Page visit tracking (analytics)
create table if not exists page_visits (
  id uuid primary key default gen_random_uuid(),
  project_slug text not null,
  visited_at timestamptz default now(),
  utm_source text,
  utm_campaign text,
  referrer text
);

alter table page_visits enable row level security;

create policy "No public access on page_visits"
  on page_visits for all
  using (false);

-- Button click tracking (analytics)
create table if not exists button_clicks (
  id uuid primary key default gen_random_uuid(),
  project_slug text not null,
  button_id text not null,
  clicked_at timestamptz default now()
);

alter table button_clicks enable row level security;

create policy "No public access on button_clicks"
  on button_clicks for all
  using (false);

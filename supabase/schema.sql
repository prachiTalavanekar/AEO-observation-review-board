
create extension if not exists "pgcrypto";

create table if not exists observations (
  id               uuid primary key default gen_random_uuid(),
  brand_name       text not null,
  website_url      text not null,
  target_query     text not null,
  ai_surface       text not null check (ai_surface in ('ChatGPT', 'Gemini', 'Claude', 'Perplexity')),
  observed_answer  text not null,
  competitor_names text[] not null default '{}',
  internal_note    text not null default '',
  created_at       timestamptz not null default now()
);

-- Index for dashboard search by brand name
create index if not exists idx_observations_brand_name
  on observations (lower(brand_name));

-- Index for ordering by creation date
create index if not exists idx_observations_created_at
  on observations (created_at desc);

-- ============================================================
-- Table: action_items
-- ============================================================
create table if not exists action_items (
  id             uuid primary key default gen_random_uuid(),
  observation_id uuid not null references observations (id) on delete cascade,
  title          text not null,
  status         text not null default 'todo' check (status in ('todo', 'done')),
  created_at     timestamptz not null default now()
);

-- Index for fast lookup of action items per observation
create index if not exists idx_action_items_observation_id
  on action_items (observation_id);

-- ============================================================
-- Row Level Security (RLS)
-- Disable for now — enable and add policies when you add auth
-- ============================================================
alter table observations disable row level security;
alter table action_items disable row level security;


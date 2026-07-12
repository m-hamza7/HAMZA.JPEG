-- ═══════════════════════════════════════════════════════════════════════════════
-- Hmza Gallery — Database Migration (v1 MVP)
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── Enable UUID generation ───────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── photos table ─────────────────────────────────────────────────────────────
create table if not exists public.photos (
  id           uuid         primary key default uuid_generate_v4(),
  filename     text         not null,
  storage_path text         not null unique,
  public_url   text         not null,
  category     text         not null,
  created_at   timestamptz  not null default now()
);

-- ─── Index for fast "newest first" queries ────────────────────────────────────
create index if not exists photos_created_at_desc
  on public.photos (created_at desc);

-- ─── Row-Level Security ───────────────────────────────────────────────────────
-- The backend uses the SERVICE_ROLE key which bypasses RLS.
-- Enable RLS so anon/authenticated roles cannot access the table directly.
alter table public.photos enable row level security;

-- Optional: allow public read-only access if you ever expose Supabase directly
-- from the frontend (not needed for the current architecture).
-- create policy "Public read" on public.photos
--   for select using (true);

-- ─── Storage bucket ───────────────────────────────────────────────────────────
-- Create the "portfolio" bucket via Dashboard → Storage → New Bucket
-- OR uncomment the lines below and run them (requires the storage extension).
--
-- insert into storage.buckets (id, name, public)
-- values ('portfolio', 'portfolio', true)
-- on conflict (id) do nothing;

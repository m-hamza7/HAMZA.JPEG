-- ============================================================
-- Gallery Automation — Supabase Migration
-- Run this once in: Supabase Dashboard → SQL Editor
-- Safe to re-run (all statements use IF NOT EXISTS)
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Table: photos
-- ============================================================
CREATE TABLE IF NOT EXISTS public.photos (
  id           uuid         PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename     text         NOT NULL,
  storage_path text         NOT NULL UNIQUE,
  public_url   text         NOT NULL,
  category     text         NOT NULL,
  created_at   timestamptz  NOT NULL DEFAULT now()
);

-- Index for fast newest-first retrieval (GET /photos)
CREATE INDEX IF NOT EXISTS photos_created_at_desc
  ON public.photos (created_at DESC);

-- ============================================================
-- Phase 2: Featured stories columns
-- Safe to run on an existing table (IF NOT EXISTS / IF NOT NULL check handled by PG)
-- ============================================================
ALTER TABLE public.photos
  ADD COLUMN IF NOT EXISTS is_featured          boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS caption              text,
  ADD COLUMN IF NOT EXISTS story                text,
  ADD COLUMN IF NOT EXISTS sort_order           integer,
  ADD COLUMN IF NOT EXISTS featured_sort_order  integer;

-- ============================================================
-- Row Level Security
-- Backend uses service-role key → bypasses RLS
-- Direct anonymous/authenticated client access is blocked
-- ============================================================
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- DELHI NEWS LIVE — SUPABASE DATABASE SCHEMA & RESTRICTED RLS POLICIES
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
-- =============================================================================

-- 1. Create Articles Table
CREATE TABLE IF NOT EXISTS public.articles (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    headline TEXT NOT NULL,
    standfirst TEXT,
    section TEXT DEFAULT 'Nation',
    body TEXT,
    image_url TEXT,
    image_caption TEXT,
    author_name TEXT DEFAULT 'SYED WAJID',
    placement TEXT DEFAULT 'col3',
    sort_order INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT true,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Interviews / Video Clippings Table
CREATE TABLE IF NOT EXISTS public.interviews (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    guest TEXT,
    description TEXT,
    video_url TEXT,
    thumbnail TEXT,
    date TEXT,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Settings Table (Front page furniture & site config)
CREATE TABLE IF NOT EXISTS public.settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    paper_name TEXT DEFAULT 'Delhi News Live',
    tagline TEXT DEFAULT 'National English Daily',
    edition_line TEXT DEFAULT 'METRO CITY',
    website_line TEXT DEFAULT 'www.delhinewslive.in',
    rni_line TEXT DEFAULT 'RNI : DELENG2016/66892',
    masthead_url TEXT DEFAULT 'assets/logo.jpg',
    interviews_visible BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert Default Settings Row if not exists
INSERT INTO public.settings (id, paper_name, tagline, edition_line, website_line, rni_line, masthead_url, interviews_visible)
VALUES (1, 'Delhi News Live', 'National English Daily', 'METRO CITY', 'www.delhinewslive.in', 'RNI : DELENG2016/66892', 'assets/logo.jpg', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES — RESTRICTED TO AUTHENTICATED ADMINS
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Clean up any legacy permissive policies
DROP POLICY IF EXISTS "Allow full access to articles" ON public.articles;
DROP POLICY IF EXISTS "Allow full access to interviews" ON public.interviews;
DROP POLICY IF EXISTS "Allow full access to settings" ON public.settings;
DROP POLICY IF EXISTS "Public can read articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated users can manage articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated users can insert articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated users can update articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated users can delete articles" ON public.articles;

-- -----------------------------------------------------------------------------
-- ARTICLES POLICIES
-- -----------------------------------------------------------------------------

-- Public Read: Anonymous visitors can view articles
CREATE POLICY "Public can read articles"
    ON public.articles FOR SELECT
    USING (true);

-- Admin Insert: Only authenticated users can write new stories
CREATE POLICY "Authenticated admin can insert articles"
    ON public.articles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

-- Admin Update: Only authenticated users can update stories
CREATE POLICY "Authenticated admin can update articles"
    ON public.articles FOR UPDATE
    TO authenticated
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Admin Delete: Only authenticated users can delete stories
CREATE POLICY "Authenticated admin can delete articles"
    ON public.articles FOR DELETE
    TO authenticated
    USING (auth.uid() IS NOT NULL);

-- -----------------------------------------------------------------------------
-- INTERVIEWS POLICIES
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can read interviews" ON public.interviews;
DROP POLICY IF EXISTS "Authenticated admin can insert interviews" ON public.interviews;
DROP POLICY IF EXISTS "Authenticated admin can update interviews" ON public.interviews;
DROP POLICY IF EXISTS "Authenticated admin can delete interviews" ON public.interviews;

-- Public Read: Anyone can view video clips
CREATE POLICY "Public can read interviews"
    ON public.interviews FOR SELECT
    USING (true);

-- Admin Write: Only authenticated users can insert, update, or delete interview clips
CREATE POLICY "Authenticated admin can insert interviews"
    ON public.interviews FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated admin can update interviews"
    ON public.interviews FOR UPDATE
    TO authenticated
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated admin can delete interviews"
    ON public.interviews FOR DELETE
    TO authenticated
    USING (auth.uid() IS NOT NULL);

-- -----------------------------------------------------------------------------
-- SETTINGS POLICIES
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can read settings" ON public.settings;
DROP POLICY IF EXISTS "Authenticated admin can update settings" ON public.settings;

-- Public Read: Anyone can view site configuration / front-page furniture
CREATE POLICY "Public can read settings"
    ON public.settings FOR SELECT
    USING (true);

-- Admin Write: Only authenticated users can update site furniture / visibility
CREATE POLICY "Authenticated admin can update settings"
    ON public.settings FOR ALL
    TO authenticated
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- =============================================================================
-- REALTIME REPLICATION (Instant multi-device broadcast)
-- =============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.interviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;

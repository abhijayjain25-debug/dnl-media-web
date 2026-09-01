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
    image_layout TEXT DEFAULT 'top',
    is_breaking BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
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
    date_mode TEXT DEFAULT 'auto',
    custom_date TEXT DEFAULT '',
    masthead_url TEXT DEFAULT 'assets/logo.jpg',
    interviews_visible BOOLEAN DEFAULT true,
    editor_name TEXT DEFAULT 'SYED WAJID',
    editor_title TEXT DEFAULT 'Executive Editor',
    editor_bio TEXT DEFAULT 'is a seasoned and veteran journalist with an experience of more than two decades. Writing with a flair and passion; crime and politics have been his forte. He has written more than 15000 pieces comprising articles, reports, features and editorials in the past 25 years.

Syed Wajid popularly known as Sufi, is a PIB accredited journalist who has contributed to various media houses including The Hindu, Times of India, Hindustan Times, National Herald, Uday India, Loksatya and Face Group.

He has been working as an executive editor for Delhi News Live, an English daily.

Besides, he has been editing several other english magazines and periodicals as well.',
    editor_instagram TEXT DEFAULT 'https://instagram.com',
    editor_twitter TEXT DEFAULT 'https://twitter.com',
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Schema Migration Helpers (if updating an existing database)
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS image_layout TEXT DEFAULT 'top';
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS is_breaking BOOLEAN DEFAULT false;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS rni_line TEXT DEFAULT 'RNI : DELENG2016/66892';
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS date_mode TEXT DEFAULT 'auto';
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS custom_date TEXT DEFAULT '';
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS editor_name TEXT DEFAULT 'SYED WAJID';
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS editor_title TEXT DEFAULT 'Executive Editor';
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS editor_bio TEXT DEFAULT 'is a seasoned and veteran journalist with an experience of more than two decades. Writing with a flair and passion; crime and politics have been his forte. He has written more than 15000 pieces comprising articles, reports, features and editorials in the past 25 years.

Syed Wajid popularly known as Sufi, is a PIB accredited journalist who has contributed to various media houses including The Hindu, Times of India, Hindustan Times, National Herald, Uday India, Loksatya and Face Group.

He has been working as an executive editor for Delhi News Live, an English daily.

Besides, he has been editing several other english magazines and periodicals as well.';
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS editor_instagram TEXT DEFAULT 'https://instagram.com';
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS editor_twitter TEXT DEFAULT 'https://twitter.com';

-- Insert Default Settings Row if not exists
INSERT INTO public.settings (id, paper_name, tagline, edition_line, website_line, rni_line, date_mode, custom_date, masthead_url, interviews_visible, editor_name, editor_title, editor_bio, editor_instagram, editor_twitter)
VALUES (1, 'Delhi News Live', 'National English Daily', 'METRO CITY', 'www.delhinewslive.in', 'RNI : DELENG2016/66892', 'auto', '', 'assets/logo.jpg', true, 'SYED WAJID', 'Executive Editor', 'is a seasoned and veteran journalist with an experience of more than two decades. Writing with a flair and passion; crime and politics have been his forte. He has written more than 15000 pieces comprising articles, reports, features and editorials in the past 25 years.

Syed Wajid popularly known as Sufi, is a PIB accredited journalist who has contributed to various media houses including The Hindu, Times of India, Hindustan Times, National Herald, Uday India, Loksatya and Face Group.

He has been working as an executive editor for Delhi News Live, an English daily.

Besides, he has been editing several other english magazines and periodicals as well.', 'https://instagram.com', 'https://twitter.com')
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

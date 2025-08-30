-- Fix songs table RLS policies
-- First, check if table exists and create if needed
CREATE TABLE IF NOT EXISTS public.songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    artist TEXT NOT NULL,
    duration INTEGER NOT NULL,
    file_url TEXT NOT NULL,
    cover_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on songs table
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Songs are viewable by everyone" ON public.songs;
DROP POLICY IF EXISTS "Admin can insert songs" ON public.songs;
DROP POLICY IF EXISTS "Admin can update songs" ON public.songs;
DROP POLICY IF EXISTS "Admin can delete songs" ON public.songs;

-- Create new policies
-- Everyone can read songs
CREATE POLICY "Songs are viewable by everyone" ON public.songs
    FOR SELECT USING (true);

-- Only admin can insert songs
CREATE POLICY "Admin can insert songs" ON public.songs
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'email' = 'ilyastorunn@outlook.com'
    );

-- Only admin can update songs
CREATE POLICY "Admin can update songs" ON public.songs
    FOR UPDATE USING (
        auth.jwt() ->> 'email' = 'ilyastorunn@outlook.com'
    );

-- Only admin can delete songs
CREATE POLICY "Admin can delete songs" ON public.songs
    FOR DELETE USING (
        auth.jwt() ->> 'email' = 'ilyastorunn@outlook.com'
    );

-- Migration: Make artist column nullable in songs table
-- This allows songs to be uploaded without an artist name

-- First, drop any existing constraints that might prevent the change
ALTER TABLE public.songs ALTER COLUMN artist DROP NOT NULL;

-- Update existing songs that might have empty strings to NULL
UPDATE public.songs SET artist = NULL WHERE artist = '';

-- Add a comment to document the change
COMMENT ON COLUMN public.songs.artist IS 'Artist name (optional) - can be NULL for instrumental tracks or tracks without artist info';

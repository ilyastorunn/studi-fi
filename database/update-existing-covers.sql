-- Migration: Update existing songs to use default cover.jpeg
-- This ensures all songs have a consistent cover image

-- Update songs that have no cover or use the old artworks file
UPDATE public.songs 
SET cover_url = '/cover.jpeg' 
WHERE cover_url IS NULL 
   OR cover_url = '/artworks-oDOPZzziMpEO5irq-3elwrg-t500x500.jpg'
   OR cover_url = '';

-- Add a comment to document the change
COMMENT ON COLUMN public.songs.cover_url IS 'Cover image URL - defaults to /cover.jpeg if not specified';

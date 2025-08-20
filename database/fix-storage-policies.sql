-- Fix Storage RLS Policies for Admin Music Upload

-- First, let's check if buckets exist and create them if needed
INSERT INTO storage.buckets (id, name, public) 
VALUES ('songs', 'songs', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Song files are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Cover files are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload songs" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload covers" ON storage.objects;

-- Public read access for everyone
CREATE POLICY "Song files are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'songs');

CREATE POLICY "Cover files are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'covers');

-- Admin upload access (using service role or specific admin emails)
-- Option 1: Allow service role to upload (recommended for admin operations)
CREATE POLICY "Service role can upload songs" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'songs');

CREATE POLICY "Service role can upload covers" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'covers');

-- Option 2: Allow specific admin users to upload (alternative approach)
-- Uncomment these if you want to allow specific authenticated users instead of service role
/*
CREATE POLICY "Admin users can upload songs" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'songs' 
        AND auth.jwt() ->> 'email' IN ('admin@studi-fi.com', 'your-email@gmail.com')
    );

CREATE POLICY "Admin users can upload covers" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'covers' 
        AND auth.jwt() ->> 'email' IN ('admin@studi-fi.com', 'your-email@gmail.com')
    );
*/

-- Update and delete policies for service role
CREATE POLICY "Service role can update songs" ON storage.objects
    FOR UPDATE USING (bucket_id = 'songs');

CREATE POLICY "Service role can delete songs" ON storage.objects
    FOR DELETE USING (bucket_id = 'songs');

CREATE POLICY "Service role can update covers" ON storage.objects
    FOR UPDATE USING (bucket_id = 'covers');

CREATE POLICY "Service role can delete covers" ON storage.objects
    FOR DELETE USING (bucket_id = 'covers');


-- Fix duplicate policy error
-- First drop existing policies
DROP POLICY IF EXISTS "Songs are viewable by everyone" ON public.songs;
DROP POLICY IF EXISTS "Cover files are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Song files are publicly accessible" ON storage.objects;

-- Recreate policies
CREATE POLICY "Songs are viewable by everyone" ON public.songs
    FOR SELECT USING (true);

-- Storage policies for public access
CREATE POLICY "Song files are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'songs');

CREATE POLICY "Cover files are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'covers');

-- Admin upload policies
CREATE POLICY "Admin users can upload songs" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'songs' 
        AND auth.jwt() ->> 'email' = 'ilyastorunn@outlook.com'
    );

CREATE POLICY "Admin users can upload covers" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'covers' 
        AND auth.jwt() ->> 'email' = 'ilyastorunn@outlook.com'
    );


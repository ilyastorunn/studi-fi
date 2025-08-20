-- Enable RLS (Row Level Security)
-- Note: auth.users already has RLS enabled by default

-- Songs table (admin only can insert via service role)
CREATE TABLE IF NOT EXISTS public.songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    artist TEXT NOT NULL,
    duration INTEGER NOT NULL, -- in seconds
    file_url TEXT NOT NULL,
    cover_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions table (for tracking study time)
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    duration INTEGER NOT NULL, -- in seconds
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on tables
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Songs table
-- Everyone can read songs, but only service role (admin) can write
CREATE POLICY "Songs are viewable by everyone" ON public.songs
    FOR SELECT USING (true);

-- No INSERT/UPDATE/DELETE policies for songs - only service role can modify

-- RLS Policies for User Sessions
-- Users can only see and insert their own sessions
CREATE POLICY "Users can view own sessions" ON public.user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.user_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.user_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Storage bucket for music files (if not exists)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('songs', 'songs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage bucket for cover images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for songs bucket
-- Anyone can view files, only service role can upload
CREATE POLICY "Song files are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'songs');

CREATE POLICY "Cover files are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'covers');

-- Update trigger for songs table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON public.songs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample songs (you can run this manually or replace with your songs)
-- This uses placeholder URLs - you'll need to upload actual files to storage
/*
INSERT INTO public.songs (name, artist, duration, file_url, cover_url) VALUES
('Midnight Coffee', 'Lo-fi Collective', 223, 'https://your-project.supabase.co/storage/v1/object/public/songs/lofi1.mp3', 'https://your-project.supabase.co/storage/v1/object/public/covers/cover1.jpg'),
('Focus Beats', 'Lo-fi Dreams', 200, 'https://your-project.supabase.co/storage/v1/object/public/songs/lofi2.mp3', 'https://your-project.supabase.co/storage/v1/object/public/covers/cover1.jpg');
*/

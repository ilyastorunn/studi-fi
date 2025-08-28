'use client';

import { useEffect, Suspense } from 'react';
import { Background } from '@/components/Layout/Background';
import { Header } from '@/components/Layout/Header';
import { TimerCard } from '@/components/Timer/TimerCard';
import { PlayerCard } from '@/components/Player/PlayerCard';
import { useTimer } from '@/hooks/useTimer';
import { useAudio } from '@/hooks/useAudio';
import { useMusicStore } from '@/stores/musicStore';
import { usePlayerStore } from '@/stores/playerStore';

export default function Home() {
  // Initialize hooks
  useTimer();
  useAudio();
  
  // Initialize music store
  const { fetchSongs } = useMusicStore();
  const { updatePlaylistFromSupabase } = usePlayerStore();
  
  useEffect(() => {
    // Fetch songs from Supabase on app load
    fetchSongs().then(() => {
      // Update player playlist if songs are available
      const musicStore = useMusicStore.getState();
      if (musicStore.songs.length > 0) {
        updatePlaylistFromSupabase();
      }
    }).catch(() => {
      // Silently fail - will use default playlist
    });
  }, [fetchSongs, updatePlaylistFromSupabase]);

  return (
    <main className="min-h-screen relative">
      {/* Background */}
      <Background />
      
      {/* Header */}
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
      </Suspense>
      
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen pt-20 pb-8 px-4 space-y-8">
        {/* Timer and Player cards temporarily hidden for design adjustments */}
        {/* <TimerCard /> */}
        {/* <PlayerCard /> */}
      </div>

      {/* Bottom Cards */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
           style={{ paddingBottom: '20px' }}>
        {/* Player Card - 465x160px */}
        <PlayerCard />

        {/* Timer Card - 672x240px, 24px gap above */}
        <div style={{ marginTop: '24px' }}>
          <TimerCard />
        </div>
      </div>
    </main>
  );
}
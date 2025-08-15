'use client';

import { Background } from '@/components/Layout/Background';
import { Header } from '@/components/Layout/Header';
import { TimerCard } from '@/components/Timer/TimerCard';
import { PlayerCard } from '@/components/Player/PlayerCard';
import { useTimer } from '@/hooks/useTimer';
import { useAudio } from '@/hooks/useAudio';

export default function Home() {
  // Initialize hooks
  useTimer();
  useAudio();

  return (
    <main className="min-h-screen relative">
      {/* Background */}
      <Background />
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen pt-20 pb-8 px-4 space-y-8">
        {/* Timer Card */}
        <TimerCard />
        
        {/* Player Card */}
        <PlayerCard />
      </div>
    </main>
  );
}
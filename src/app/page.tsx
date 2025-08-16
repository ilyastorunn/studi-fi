'use client';

import { Background } from '@/components/Layout/Background';
import { Header } from '@/components/Layout/Header';
import { TimerCard } from '@/components/Timer/TimerCard';
import { PlayerCard } from '@/components/Player/PlayerCard';
import { useTimer } from '@/hooks/useTimer';
// import { useAudio } from '@/hooks/useAudio';

export default function Home() {
  // Initialize hooks
  useTimer();

  return (
    <main className="min-h-screen relative">
      {/* Background */}
      <Background />
      
      {/* Header */}
      <Header />
      
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
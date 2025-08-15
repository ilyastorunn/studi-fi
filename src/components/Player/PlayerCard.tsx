'use client';

import { usePlayerStore } from '@/stores/playerStore';
import { PlayerControls } from './PlayerControls';
import { ProgressBar } from './ProgressBar';
import { Card } from '@/components/ui/card';
import { Music } from 'lucide-react';

export function PlayerCard() {
  const {
    currentTrack,
    isPlaying,
    progress,
    currentTime,
    duration,
    playlist,
    play,
    pause,
    toggle,
    next,
    previous,
  } = usePlayerStore();

  const currentSong = playlist[currentTrack];

  // Format time as M:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (newProgress: number) => {
    // This would be implemented with actual audio player
    console.log('Seek to:', newProgress);
  };

  return (
    <Card className="player-card glass-card p-6">
      <div className="flex items-center space-x-4 h-full">
        {/* Album Art */}
        <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 flex-shrink-0">
          {/* Placeholder album art */}
          <Music className="w-8 h-8 text-[var(--text-primary)]/50" />
        </div>

        {/* Song Info & Controls */}
        <div className="flex-1 min-w-0">
          {/* Song Information */}
          <div className="mb-3">
            <h3 className="text-base font-medium text-[var(--text-primary)] truncate">
              {currentSong?.title || 'No track selected'}
            </h3>
            <p className="text-sm text-[var(--text-primary)]/70 truncate">
              {currentSong?.artist || 'Unknown artist'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <ProgressBar
              progress={progress}
              onSeek={handleSeek}
            />
          </div>

          {/* Time Display */}
          <div className="flex justify-between items-center text-xs text-[var(--text-primary)]/60 mb-3">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration || currentSong?.duration || 0)}</span>
          </div>

          {/* Player Controls */}
          <PlayerControls
            isPlaying={isPlaying}
            onPlayPause={toggle}
            onPrevious={previous}
            onNext={next}
          />
        </div>
      </div>
    </Card>
  );
}

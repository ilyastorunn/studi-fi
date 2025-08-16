'use client';

import { useState } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import Image from 'next/image';

export function PlayerCard() {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [volume, setVolume] = useState(70);
  
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

  const handleSeek = (value: number[]) => {
    // This would be implemented with actual audio player
    console.log('Seek to:', value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  return (
    <div 
      className="w-[465px] h-[160px] p-6 flex relative"
      style={{
        backgroundColor: 'rgba(234, 234, 242, 0.3)',
        backdropFilter: 'blur(10px)',
        borderRadius: '50px',
      }}
    >
      {/* Cover Photo - Sol kenarda 24px uzaklıkta */}
      <div className="flex-shrink-0">
        <Image
          src="/artworks-oDOPZzziMpEO5irq-3elwrg-t500x500.jpg"
          alt="Album Cover"
          width={110}
          height={110}
          className="rounded-3xl object-cover"
        />
      </div>

      {/* Orta Kısım - Song Info & Controls */}
      <div className="flex-1 flex flex-col justify-between ml-4">
        {/* Song Info - Cover'ın üstüne hizalı */}
        <div>
          <h3 className="text-base font-medium text-[#15142F] leading-tight">
            Midnight Lofi Dreams
          </h3>
          <p className="text-sm text-[#15142F]/70">
            Chill Collective
          </p>
        </div>

        {/* Player Controls */}
        <div className="flex items-center space-x-3">
          {/* Previous Button */}
          <Button
            onClick={previous}
            size="sm"
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-[#15142F] border-none shadow-sm flex items-center justify-center"
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          {/* Play/Pause Button - Daha büyük */}
          <Button
            onClick={toggle}
            size="sm"
            className="w-10 h-10 rounded-full bg-[#0E3C1D] hover:bg-[#0E3C1D]/80 text-white shadow-lg flex items-center justify-center"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </Button>

          {/* Next Button */}
          <Button
            onClick={next}
            size="sm"
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-[#15142F] border-none shadow-sm flex items-center justify-center"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Sağ Kısım - Time & Progress & Volume */}
      <div className="flex flex-col justify-between items-end ml-4 min-w-0">
        {/* Time Display */}
        <div className="text-sm text-[#15142F]/70 font-medium">
          {formatTime(currentTime || 65)}/{formatTime(duration || currentSong?.duration || 243)}
        </div>

        {/* Progress Bar */}
        <div className="w-20 mb-2">
          <Slider
            value={[progress]}
            onValueChange={handleSeek}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* Volume Control */}
        <div className="relative">
          <Button
            size="sm"
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-[#15142F] border-none shadow-sm flex items-center justify-center"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <Volume2 className="w-4 h-4" />
          </Button>

          {/* Volume Slider - Hover'da görünür */}
          {showVolumeSlider && (
            <div 
              className="absolute bottom-full right-0 mb-2 bg-black/80 backdrop-blur-sm rounded-lg p-2"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <div className="w-16 h-20 flex items-center justify-center">
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  orientation="vertical"
                  className="h-16"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

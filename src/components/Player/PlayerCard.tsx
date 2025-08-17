'use client';

import { useState } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
import { useAudio } from '@/hooks/useAudio';
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
    currentTime,
    duration,
    playlist,
    toggle,
    next,
    previous,
    setVolume: setStoreVolume,
  } = usePlayerStore();

  const { isLoading } = useAudio();

  const currentSong = playlist[currentTrack];

  // Format time as M:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };



  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setStoreVolume(newVolume / 100); // Store expects 0-1 range
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
          src={currentSong?.cover || "/artworks-oDOPZzziMpEO5irq-3elwrg-t500x500.jpg"}
          alt={`${currentSong?.title || 'Track'} Cover`}
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
            {currentSong?.title || 'No Track'}
          </h3>
          <p className="text-sm text-[#15142F]/70">
            {currentSong?.artist || 'Unknown Artist'}
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
            disabled={isLoading}
            className="w-10 h-10 rounded-full bg-[#8A4FFF] hover:bg-[#8A4FFF]/80 text-[#15142F] shadow-lg flex items-center justify-center disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-[#15142F] border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
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
          {formatTime(currentTime || 0)}/{formatTime(duration || currentSong?.duration || 0)}
        </div>



        {/* Volume Control with Horizontal Slider */}
        <div 
          className="relative flex items-center w-28 h-10 justify-end"
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          {/* Horizontal Volume Bar - Shows on hover, extends to next button */}
          {showVolumeSlider && (
            <div className="absolute left-0 right-10 h-full flex items-center">
              {/* Actual bar with bigger hit area */}
              <div className="w-full h-2 bg-white/30 rounded-full relative">
                {/* Volume Fill */}
                <div 
                  className="h-full bg-[#8A4FFF] rounded-full transition-all duration-200"
                  style={{ width: `${volume}%` }}
                />
                {/* Invisible slider for interaction */}
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="absolute inset-0 w-full volume-slider cursor-pointer"
                />
              </div>
            </div>
          )}
          
          <Button
            size="sm"
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-[#15142F] border-none shadow-sm flex items-center justify-center transition-colors relative z-10"
          >
            <Volume2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

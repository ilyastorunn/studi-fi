'use client';

import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onVolumeClick?: () => void;
  disabled?: boolean;
}

export function PlayerControls({
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  onVolumeClick,
  disabled = false
}: PlayerControlsProps) {
  return (
    <div className="flex items-center justify-center space-x-3">
      {/* Previous Track */}
      <Button
        onClick={onPrevious}
        size="sm"
        variant="ghost"
        disabled={disabled}
        className="btn-small bg-white/10 text-[var(--text-primary)] hover:bg-white/20 border border-white/20"
      >
        <SkipBack className="w-4 h-4" />
      </Button>

      {/* Play/Pause */}
      <Button
        onClick={onPlayPause}
        size="sm"
        disabled={disabled}
        className={`
          btn-primary flex items-center justify-center
          ${isPlaying 
            ? 'bg-[var(--accent-green)] hover:bg-[var(--accent-green)]/80' 
            : 'bg-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/80'
          }
          text-white shadow-lg
        `}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5 ml-0.5" />
        )}
      </Button>

      {/* Next Track */}
      <Button
        onClick={onNext}
        size="sm"
        variant="ghost"
        disabled={disabled}
        className="btn-small bg-white/10 text-[var(--text-primary)] hover:bg-white/20 border border-white/20"
      >
        <SkipForward className="w-4 h-4" />
      </Button>

      {/* Volume */}
      <Button
        onClick={onVolumeClick}
        size="sm"
        variant="ghost"
        disabled={disabled}
        className="btn-icon bg-white/10 text-[var(--text-primary)] hover:bg-white/20 border border-white/20"
      >
        <Volume2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import { usePlayerStore } from '@/stores/playerStore';

export function useAudio() {
  const soundRef = useRef<Howl | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    currentTrack,
    isPlaying,
    volume,
    playlist,
    play,
    pause,
    next,
    setCurrentTime,
    setDuration,
  } = usePlayerStore();

  const currentSong = playlist[currentTrack];

  // Initialize or change track
  useEffect(() => {
    if (!currentSong) return;

    setIsLoading(true);
    setError(null);

    // Cleanup previous sound
    if (soundRef.current) {
      soundRef.current.unload();
    }

    // For demo purposes, we'll create a mock audio player
    // In a real app, you would load actual audio files
    const mockDuration = currentSong.duration;
    setDuration(mockDuration);

    // Create real Howl instance with actual audio files
    try {
      soundRef.current = new Howl({
        src: [currentSong.src],
        html5: true,
        volume: volume,
        preload: true,
        onload: () => {
          setIsLoading(false);
          const actualDuration = soundRef.current?.duration() || mockDuration;
          setDuration(actualDuration);
          console.log(`Audio loaded: ${currentSong.title} - Duration: ${actualDuration}s`);
          
          // Auto-play if isPlaying is true
          if (isPlaying && soundRef.current) {
            soundRef.current.play();
          }
        },
        onloaderror: (id, error) => {
          console.error('Audio load error:', error);
          setError(`Failed to load: ${currentSong.title}`);
          setIsLoading(false);
          // Fall back to placeholder duration
          setDuration(mockDuration);
        },
        onplay: () => {
          console.log(`Playing: ${currentSong.title}`);
          // Start progress tracking
          updateProgress();
        },
        onpause: () => {
          console.log(`Paused: ${currentSong.title}`);
        },
        onend: () => {
          console.log(`Ended: ${currentSong.title} - Auto-playing next`);
          // Auto-play next track
          next();
        },
        onstop: () => {
          console.log(`Stopped: ${currentSong.title}`);
        }
      });

    } catch (err) {
      console.error('Howler initialization error:', err);
      setError('Audio player not supported');
      setIsLoading(false);
      setDuration(mockDuration);
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, [currentTrack, currentSong]);

  // Real audio progress tracking
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateProgress = () => {
    if (!soundRef.current || !isPlaying) return;

    try {
      const seek = soundRef.current.seek();
      const currentTime = typeof seek === 'number' ? seek : 0;
      setCurrentTime(currentTime);

      if (isPlaying && soundRef.current.playing()) {
        requestAnimationFrame(updateProgress);
      }
    } catch (error) {
      console.error('Progress update error:', error);
    }
  };

  // Handle play/pause changes
  useEffect(() => {
    if (soundRef.current && soundRef.current.state() === 'loaded') {
      if (isPlaying) {
        soundRef.current.play();
      } else {
        soundRef.current.pause();
      }
    } else if (isPlaying && !soundRef.current) {
      // If no sound loaded yet but play is requested, show loading
      setIsLoading(true);
    }
  }, [isPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume);
    }
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, []);

  return {
    isLoading,
    seek: (time: number) => {
      if (soundRef.current && soundRef.current.state() === 'loaded') {
        try {
          soundRef.current.seek(time);
          setCurrentTime(time);
          console.log(`Seeked to: ${time}s`);
        } catch (error) {
          console.error('Seek error:', error);
        }
      } else {
        console.warn('Audio not loaded, cannot seek');
      }
    },
  };
}

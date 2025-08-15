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

    // Create mock Howl instance (since we don't have real audio files)
    try {
      soundRef.current = new Howl({
        src: [currentSong.src],
        html5: true,
        volume: volume,
        onload: () => {
          setIsLoading(false);
          setDuration(soundRef.current?.duration() || mockDuration);
        },
        onloaderror: () => {
          setError('Failed to load audio');
          setIsLoading(false);
          // Fall back to mock functionality
          setDuration(mockDuration);
        },
        onplay: () => {
          // Start progress tracking
          updateProgress();
        },
        onend: () => {
          // Auto-play next track
          next();
        },
      });

      // If the file doesn't exist, we'll simulate playback
      if (isPlaying) {
        // Simulate loading time
        setTimeout(() => {
          setIsLoading(false);
          setDuration(mockDuration);
          if (isPlaying) {
            simulatePlayback();
          }
        }, 500);
      }

    } catch (err) {
      setError('Audio not supported');
      setIsLoading(false);
      // Fall back to mock functionality
      setDuration(mockDuration);
      if (isPlaying) {
        simulatePlayback();
      }
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, [currentTrack, currentSong]);

  // Mock playback simulation for demo
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const simulatePlayback = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    let currentTime = 0;
    const duration = currentSong?.duration || 180;

    progressIntervalRef.current = setInterval(() => {
      if (isPlaying && currentTime < duration) {
        currentTime += 1;
        setCurrentTime(currentTime);
      } else if (currentTime >= duration) {
        next();
      }
    }, 1000);
  };

  const updateProgress = () => {
    if (!soundRef.current || !isPlaying) return;

    const seek = soundRef.current.seek();
    setCurrentTime(typeof seek === 'number' ? seek : 0);

    if (isPlaying) {
      requestAnimationFrame(updateProgress);
    }
  };

  // Handle play/pause changes
  useEffect(() => {
    if (!soundRef.current && isPlaying) {
      simulatePlayback();
      return;
    }

    if (soundRef.current) {
      if (isPlaying) {
        soundRef.current.play();
      } else {
        soundRef.current.pause();
      }
    } else if (isPlaying) {
      simulatePlayback();
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
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
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  return {
    isLoading,
    error,
    seek: (time: number) => {
      if (soundRef.current) {
        soundRef.current.seek(time);
      }
      setCurrentTime(time);
    },
  };
}

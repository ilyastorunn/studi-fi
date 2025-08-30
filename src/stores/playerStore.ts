import { create } from 'zustand';
import { PLAYLIST, VOLUME_DEFAULT, type Track } from '@/lib/constants';
import { useMusicStore } from './musicStore';
import type { Song } from '@/lib/supabase';

// Convert Supabase Song to Track format
function convertSongToTrack(song: Song): Track {
  return {
    id: song.id,
    title: song.name,
    artist: song.artist || 'Unknown Artist', // Handle undefined case
    duration: song.duration,
    src: song.file_url,
    cover: song.cover_url || '/cover.jpeg'
  };
}

interface PlayerStore {
  // State
  currentTrack: number;
  isPlaying: boolean;
  volume: number;
  progress: number; // 0-100
  duration: number; // seconds
  currentTime: number; // seconds
  playlist: Track[];
  useSupabaseSongs: boolean;
  
  // Actions
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setTrack: (index: number) => void;
  updatePlaylistFromSupabase: () => void;
  toggleSupabaseSongs: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  // Initial state
  currentTrack: 0,
  isPlaying: true, // Auto-play on load
  volume: VOLUME_DEFAULT,
  progress: 0,
  duration: 0,
  currentTime: 0,
  playlist: PLAYLIST as unknown as Track[],
  useSupabaseSongs: false,

  // Play current track
  play: () => {
    set({ isPlaying: true });
  },

  // Pause current track
  pause: () => {
    set({ isPlaying: false });
  },

  // Toggle play/pause
  toggle: () => {
    const { isPlaying } = get();
    set({ isPlaying: !isPlaying });
  },

  // Next track
  next: () => {
    const { currentTrack, playlist, isPlaying } = get();
    const nextTrack = (currentTrack + 1) % playlist.length;
    set({ 
      currentTrack: nextTrack,
      progress: 0,
      currentTime: 0,
      isPlaying // Preserve playing state
    });
  },

  // Previous track
  previous: () => {
    const { currentTrack, playlist, isPlaying } = get();
    const prevTrack = currentTrack === 0 ? playlist.length - 1 : currentTrack - 1;
    set({ 
      currentTrack: prevTrack,
      progress: 0,
      currentTime: 0,
      isPlaying // Preserve playing state
    });
  },

  // Set volume (0-1)
  setVolume: (volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    set({ volume: clampedVolume });
  },

  // Set progress (0-100)
  setProgress: (progress: number) => {
    const clampedProgress = Math.max(0, Math.min(100, progress));
    set({ progress: clampedProgress });
  },

  // Set current time in seconds
  setCurrentTime: (time: number) => {
    const { duration } = get();
    const progress = duration > 0 ? (time / duration) * 100 : 0;
    set({ 
      currentTime: time,
      progress 
    });
  },

  // Set track duration
  setDuration: (duration: number) => {
    set({ duration });
  },

  // Set specific track
  setTrack: (index: number) => {
    const { playlist } = get();
    if (index >= 0 && index < playlist.length) {
      set({ 
        currentTrack: index,
        progress: 0,
        currentTime: 0
      });
    }
  },

  // Update playlist from Supabase songs
  updatePlaylistFromSupabase: () => {
    const musicStore = useMusicStore.getState();
    if (musicStore.songs.length > 0) {
      const supabasePlaylist = musicStore.songs.map(convertSongToTrack);
      set({ 
        playlist: supabasePlaylist,
        currentTrack: 0,
        progress: 0,
        currentTime: 0,
        useSupabaseSongs: true
      });
    }
  },

  // Toggle between default and Supabase songs
  toggleSupabaseSongs: () => {
    const { useSupabaseSongs } = get();
    if (useSupabaseSongs) {
      // Switch back to default playlist
      set({ 
        playlist: PLAYLIST as unknown as Track[],
        currentTrack: 0,
        progress: 0,
        currentTime: 0,
        useSupabaseSongs: false
      });
    } else {
      // Switch to Supabase songs
      get().updatePlaylistFromSupabase();
    }
  },
}));

import { create } from 'zustand';
import { adminHelpers } from '@/lib/admin';
import type { Song } from '@/lib/supabase';

interface MusicStore {
  // State
  songs: Song[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchSongs: () => Promise<void>;
  addSong: (song: Song) => void;
  removeSong: (songId: string) => void;
  clearError: () => void;
}

export const useMusicStore = create<MusicStore>((set) => ({
  // Initial state
  songs: [],
  isLoading: false,
  error: null,

  // Fetch all songs from Supabase
  fetchSongs: async () => {
    try {
      set({ isLoading: true, error: null });
      const songs = await adminHelpers.getAllSongs();
      set({ songs, isLoading: false });
    } catch (error: unknown) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch songs',
        isLoading: false 
      });
    }
  },

  // Add a new song to the store
  addSong: (song: Song) => {
    set((state) => ({
      songs: [song, ...state.songs]
    }));
  },

  // Remove a song from the store
  removeSong: (songId: string) => {
    set((state) => ({
      songs: state.songs.filter(song => song.id !== songId)
    }));
  },

  // Clear error message
  clearError: () => {
    set({ error: null });
  },
}));

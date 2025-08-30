/**
 * Constants for the studi-fi application
 */

// Timer presets in minutes
export const TIMER_PRESETS = [
  { label: '25min', value: 25 },
  { label: '50min', value: 50 },
  { label: '90min', value: 90 },
  { label: '∞', value: -1 }, // Infinity mode
] as const;

// Timer states
export const TIMER_STATES = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  COMPLETED: 'completed',
} as const;

// Default timer duration (25 minutes - Pomodoro)
export const DEFAULT_TIMER_DURATION = 25 * 60; // 25 minutes in seconds

// Audio player constants
export const VOLUME_DEFAULT = 0.7;
export const VOLUME_STEP = 0.1;

// Notification settings
export const NOTIFICATION_TITLE = 'studi-fi';
export const NOTIFICATION_BODY = 'Focus session completed! Time for a break.';

// Design system breakpoints
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
} as const;

// Lo-fi playlist (actual tracks)
export const PLAYLIST = [
  {
    id: 'lofi1',
    title: 'Lofi Study Session',
    artist: 'Chill Collective',
    duration: 180, // Will be auto-detected
    src: '/lofi1.mp3',
    cover: '/cover.jpeg'
  },
  {
    id: 'lofi2',
    title: 'Focus Beats',
    artist: 'Lo-fi Dreams',
    duration: 200, // Will be auto-detected
    src: '/lofi2.mp3',
    cover: '/cover.jpeg'
  }
] as const;

export type TimerState = typeof TIMER_STATES[keyof typeof TIMER_STATES];

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  src: string;
  cover: string;
}

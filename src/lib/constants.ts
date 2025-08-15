/**
 * Constants for the studi-fi application
 */

// Timer presets in minutes
export const TIMER_PRESETS = [
  { label: '60 min', value: 60 },
  { label: '40 min', value: 40 },
  { label: '25 min', value: 25 },
  { label: '20 min', value: 20 },
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

// Lo-fi playlist (placeholder tracks)
export const PLAYLIST = [
  {
    id: 'track1',
    title: 'Midnight Coffee',
    artist: 'Lo-fi Collective',
    duration: 223, // seconds
    src: '/audio/midnight-coffee.mp3',
    cover: '/images/covers/cover1.jpg'
  },
  {
    id: 'track2',
    title: 'Study Vibes',
    artist: 'Chill Beats',
    duration: 187,
    src: '/audio/study-vibes.mp3',
    cover: '/images/covers/cover2.jpg'
  },
  {
    id: 'track3',
    title: 'Focus Flow',
    artist: 'Ambient Dreams',
    duration: 205,
    src: '/audio/focus-flow.mp3',
    cover: '/images/covers/cover3.jpg'
  }
] as const;

export type TimerState = typeof TIMER_STATES[keyof typeof TIMER_STATES];
export type Track = typeof PLAYLIST[number];

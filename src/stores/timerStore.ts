import { create } from 'zustand';
import { TIMER_STATES, DEFAULT_TIMER_DURATION, type TimerState } from '@/lib/constants';

interface TimerStore {
  // State
  timeLeft: number;
  duration: number;
  state: TimerState;
  sessionCount: number;
  isCustomTimeInputMode: boolean;
  
  // Actions
  setDuration: (minutes: number) => void;
  setCustomTime: (hours: number, minutes: number, seconds: number) => void;
  toggleCustomTimeInput: () => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  tick: () => void;
  complete: () => void;
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  // Initial state
  timeLeft: DEFAULT_TIMER_DURATION,
  duration: DEFAULT_TIMER_DURATION,
  state: TIMER_STATES.IDLE,
  sessionCount: 0,
  isCustomTimeInputMode: false,

  // Set timer duration (convert minutes to seconds)
  setDuration: (minutes: number) => {
    if (minutes === -1) {
      // Infinity mode - start from 0 and count up
      set({ 
        duration: -1, // Keep -1 to identify infinity mode
        timeLeft: 0, // Start from 0 for infinity mode
        state: TIMER_STATES.IDLE 
      });
    } else {
      const duration = minutes * 60;
      set({ 
        duration, 
        timeLeft: duration,
        state: TIMER_STATES.IDLE 
      });
    }
  },

  // Set custom time (convert hours, minutes, seconds to total seconds)
  setCustomTime: (hours: number, minutes: number, seconds: number) => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    set({ 
      duration: totalSeconds,
      timeLeft: totalSeconds,
      state: TIMER_STATES.IDLE,
      isCustomTimeInputMode: false
    });
  },

  // Toggle custom time input mode
  toggleCustomTimeInput: () => {
    const { state } = get();
    // Only allow toggle if timer is not running
    if (state !== TIMER_STATES.RUNNING) {
      set({ isCustomTimeInputMode: !get().isCustomTimeInputMode });
    }
  },

  // Start timer
  start: () => {
    set({ state: TIMER_STATES.RUNNING });
  },

  // Pause timer
  pause: () => {
    set({ state: TIMER_STATES.PAUSED });
  },

  // Resume timer
  resume: () => {
    set({ state: TIMER_STATES.RUNNING });
  },

  // Reset timer
  reset: () => {
    const { duration } = get();
    if (duration === -1) {
      // Infinity mode - reset to 0
      set({ 
        timeLeft: 0,
        state: TIMER_STATES.IDLE 
      });
    } else {
      // Normal mode - reset to original duration
      set({ 
        timeLeft: duration,
        state: TIMER_STATES.IDLE 
      });
    }
  },

  // Tick (decrement time for normal timers, increment for infinity mode)
  tick: () => {
    const { timeLeft, state, duration } = get();
    
    if (state !== TIMER_STATES.RUNNING) return;
    
    if (duration === -1) {
      // Infinity mode - count up
      set({ timeLeft: timeLeft + 1 });
    } else {
      // Normal mode - count down
      if (timeLeft <= 1) {
        get().complete();
      } else {
        set({ timeLeft: timeLeft - 1 });
      }
    }
  },

  // Complete timer
  complete: () => {
    const { sessionCount } = get();
    set({ 
      state: TIMER_STATES.COMPLETED,
      timeLeft: 0,
      sessionCount: sessionCount + 1
    });
  },
}));

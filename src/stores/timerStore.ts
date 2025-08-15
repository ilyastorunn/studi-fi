import { create } from 'zustand';
import { TIMER_STATES, DEFAULT_TIMER_DURATION, type TimerState } from '@/lib/constants';

interface TimerStore {
  // State
  timeLeft: number;
  duration: number;
  state: TimerState;
  sessionCount: number;
  
  // Actions
  setDuration: (minutes: number) => void;
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

  // Set timer duration (convert minutes to seconds)
  setDuration: (minutes: number) => {
    const duration = minutes * 60;
    set({ 
      duration, 
      timeLeft: duration,
      state: TIMER_STATES.IDLE 
    });
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
    set({ 
      timeLeft: duration,
      state: TIMER_STATES.IDLE 
    });
  },

  // Tick (decrement time)
  tick: () => {
    const { timeLeft, state } = get();
    
    if (state !== TIMER_STATES.RUNNING) return;
    
    if (timeLeft <= 1) {
      get().complete();
    } else {
      set({ timeLeft: timeLeft - 1 });
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

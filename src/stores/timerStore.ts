import { create } from 'zustand';
import { TIMER_STATES, DEFAULT_TIMER_DURATION, type TimerState } from '@/lib/constants';
import { useStatsStore } from './statsStore';

interface TimerStore {
  // State
  timeLeft: number;
  duration: number;
  state: TimerState;
  sessionCount: number;
  isCustomTimeInputMode: boolean;
  sessionStartTime: number | null; // Timestamp when session started
  totalStudiedToday: number; // Total studied in seconds today
  
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
  recordCurrentSession: () => Promise<void>;
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  // Initial state
  timeLeft: DEFAULT_TIMER_DURATION,
  duration: DEFAULT_TIMER_DURATION,
  state: TIMER_STATES.IDLE,
  sessionCount: 0,
  isCustomTimeInputMode: false,
  sessionStartTime: null,
  totalStudiedToday: 0,

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
    set({ 
      state: TIMER_STATES.RUNNING,
      sessionStartTime: Date.now()
    });
  },

  // Pause timer
  pause: () => {
    const state = get();
    if (state.sessionStartTime) {
      // Record the time studied so far in this session
      get().recordCurrentSession();
    }
    set({ 
      state: TIMER_STATES.PAUSED,
      sessionStartTime: null
    });
  },

  // Resume timer
  resume: () => {
    set({ 
      state: TIMER_STATES.RUNNING,
      sessionStartTime: Date.now()
    });
  },

  // Reset timer
  reset: () => {
    const state = get();
    
    // Record current session if timer was running
    if (state.state === TIMER_STATES.RUNNING && state.sessionStartTime) {
      get().recordCurrentSession();
    }
    
    const { duration } = get();
    if (duration === -1) {
      // Infinity mode - reset to 0
      set({ 
        timeLeft: 0,
        state: TIMER_STATES.IDLE,
        sessionStartTime: null
      });
    } else {
      // Normal mode - reset to original duration
      set({ 
        timeLeft: duration,
        state: TIMER_STATES.IDLE,
        sessionStartTime: null
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
    const state = get();
    
    // Record the session when completing
    if (state.sessionStartTime) {
      get().recordCurrentSession();
    }
    
    const { sessionCount } = get();
    set({ 
      state: TIMER_STATES.COMPLETED,
      timeLeft: 0,
      sessionCount: sessionCount + 1,
      sessionStartTime: null
    });
  },

  // Record current study session
  recordCurrentSession: async () => {
    const state = get();
    
    if (!state.sessionStartTime) return;
    
    const now = Date.now();
    const studiedTime = Math.floor((now - state.sessionStartTime) / 1000); // Convert to seconds
    
    if (studiedTime > 0) {
      try {
        // Use stats store to record the session
        await useStatsStore.getState().recordStudySession(studiedTime);
        
        // Update total studied today
        set((prevState) => ({
          totalStudiedToday: prevState.totalStudiedToday + studiedTime
        }));
        
      } catch (error) {
        console.error('Failed to record study session:', error);
      }
    }
  },
}));

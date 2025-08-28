'use client';

import { useEffect, useRef } from 'react';
import { useTimerStore } from '@/stores/timerStore';
import { TIMER_STATES, NOTIFICATION_TITLE, NOTIFICATION_BODY } from '@/lib/constants';

export function useTimer() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { state, tick } = useTimerStore();

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  // Timer interval effect
  useEffect(() => {
    if (state === TIMER_STATES.RUNNING) {
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state, tick]);

  // Handle completion notifications
  useEffect(() => {
    if (state === TIMER_STATES.COMPLETED) {
      // Show browser notification
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(NOTIFICATION_TITLE, {
            body: NOTIFICATION_BODY,
            icon: '/favicon.ico',
          });
        }
      }

      // Play completion sound (optional)
      if (typeof window !== 'undefined') {
        try {
          const audio = new Audio('/sounds/completion.mp3');
          audio.volume = 0.5;
          audio.play().catch(() => {
            // Ignore audio play errors (autoplay restrictions)
          });
        } catch {
          // Ignore audio errors
        }
      }
    }
  }, [state]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
}

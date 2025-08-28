'use client';

import { useState, useRef, useEffect } from 'react';
import { useTimerStore } from '@/stores/timerStore';

interface TimerDisplayProps {
  timeLeft: number; // in seconds
}

export function TimerDisplay({ timeLeft }: TimerDisplayProps) {
  const { isCustomTimeInputMode, setCustomTime, toggleCustomTimeInput } = useTimerStore();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  
  const hoursRef = useRef<HTMLInputElement>(null);
  const minutesRef = useRef<HTMLInputElement>(null);
  const secondsRef = useRef<HTMLInputElement>(null);

  // Format time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Initialize input values from current timeLeft when entering input mode
  useEffect(() => {
    if (isCustomTimeInputMode) {
      const h = Math.floor(timeLeft / 3600);
      const m = Math.floor((timeLeft % 3600) / 60);
      const s = timeLeft % 60;
      setHours(h);
      setMinutes(m);
      setSeconds(s);
      // Focus on hours input
      setTimeout(() => hoursRef.current?.focus(), 0);
    }
  }, [isCustomTimeInputMode, timeLeft]);

  // Handle input submission
  const handleSubmit = () => {
    setCustomTime(hours, minutes, seconds);
  };

  // Handle cancel - exit input mode without saving
  const handleCancel = () => {
    toggleCustomTimeInput();
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Handle input change and auto-move to next field
  const handleInputChange = (
    value: string, 
    setter: (value: number) => void, 
    max: number,
    nextRef?: React.RefObject<HTMLInputElement | null>
  ) => {
    // Allow empty values during editing
    if (value === '') {
      setter(0);
      return;
    }
    
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= max) {
      setter(numValue);
      
      // Auto-move to next field when user types 2 digits
      if (value.length === 2 && nextRef?.current) {
        nextRef.current.focus();
      }
    }
  };

  if (isCustomTimeInputMode) {
    return (
      <div className="timer-display flex items-center justify-center text-6xl font-medium text-[#15142F] opacity-80">
        <input
          ref={hoursRef}
          type="number"
          value={hours}
          onChange={(e) => handleInputChange(e.target.value, setHours, 23, minutesRef)}
          onKeyDown={handleKeyPress}
          className="w-24 text-center bg-transparent border-b-2 border-[#15142F]/30 focus:border-[#8A4FFF] outline-none text-6xl font-medium text-[#15142F] opacity-80 appearance-none"
          min="0"
          max="23"
          placeholder="00"
          style={{ 
            MozAppearance: 'textfield',
            WebkitAppearance: 'none'
          }}
        />
        <span className="mx-2">:</span>
        <input
          ref={minutesRef}
          type="number"
          value={minutes}
          onChange={(e) => handleInputChange(e.target.value, setMinutes, 59, secondsRef)}
          onKeyDown={handleKeyPress}
          className="w-24 text-center bg-transparent border-b-2 border-[#15142F]/30 focus:border-[#8A4FFF] outline-none text-6xl font-medium text-[#15142F] opacity-80 appearance-none"
          min="0"
          max="59"
          placeholder="00"
          style={{ 
            MozAppearance: 'textfield',
            WebkitAppearance: 'none'
          }}
        />
        <span className="mx-2">:</span>
        <input
          ref={secondsRef}
          type="number"
          value={seconds}
          onChange={(e) => handleInputChange(e.target.value, setSeconds, 59)}
          onKeyDown={handleKeyPress}
          className="w-24 text-center bg-transparent border-b-2 border-[#15142F]/30 focus:border-[#8A4FFF] outline-none text-6xl font-medium text-[#15142F] opacity-80 appearance-none"
          min="0"
          max="59"
          placeholder="00"
          style={{ 
            MozAppearance: 'textfield',
            WebkitAppearance: 'none'
          }}
        />
      </div>
    );
  }

  return (
    <div className="timer-display text-6xl font-medium text-[#15142F] opacity-80">
      {formatTime(timeLeft)}
    </div>
  );
}

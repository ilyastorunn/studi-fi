'use client';

import { useTimerStore } from '@/stores/timerStore';
import { TIMER_STATES } from '@/lib/constants';
import { TimerDisplay } from './TimerDisplay';
import { TimerPresets } from './TimerPresets';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function TimerCard() {
  const {
    timeLeft,
    duration,
    state,
    sessionCount,
    setDuration,
    start,
    pause,
    resume,
    reset,
  } = useTimerStore();

  const isRunning = state === TIMER_STATES.RUNNING;
  const isPaused = state === TIMER_STATES.PAUSED;
  const isCompleted = state === TIMER_STATES.COMPLETED;
  const isIdle = state === TIMER_STATES.IDLE;

  const handlePlayPause = () => {
    if (isRunning) {
      pause();
    } else if (isPaused) {
      resume();
    } else if (isIdle || isCompleted) {
      start();
    }
  };

  const handleReset = () => {
    reset();
  };

  const handlePresetSelect = (minutes: number) => {
    if (!isRunning) {
      setDuration(minutes);
    }
  };

  return (
    <Card className="timer-card glass-card p-8 flex flex-col items-center justify-center space-y-6">
      {/* Timer Display */}
      <TimerDisplay timeLeft={timeLeft} />

      {/* Control Buttons */}
      <div className="flex items-center space-x-4">
        {/* Play/Pause Button */}
        <Button
          onClick={handlePlayPause}
          size="lg"
          className={`
            btn-secondary flex items-center justify-center
            ${isRunning || isPaused 
              ? 'bg-[var(--accent-green)] hover:bg-[var(--accent-green)]/80' 
              : 'bg-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/80'
            }
            text-white shadow-lg
          `}
        >
          {isRunning ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </Button>

        {/* Reset Button */}
        <Button
          onClick={handleReset}
          size="lg"
          variant="outline"
          className="btn-secondary bg-white/20 text-[var(--text-primary)] border-white/30 hover:bg-white/30"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>

        {/* Completion Indicator */}
        {isCompleted && (
          <Button
            size="lg"
            className="btn-secondary bg-[var(--accent-green)] text-white"
            disabled
          >
            <CheckCircle className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Timer Presets */}
      <div className="w-full max-w-sm">
        <TimerPresets
          onPresetSelect={handlePresetSelect}
          selectedDuration={duration}
          disabled={isRunning}
        />
      </div>

      {/* Session Counter */}
      {sessionCount > 0 && (
        <div className="text-sm text-[var(--text-primary)]/70 font-medium">
          Sessions completed: {sessionCount}
        </div>
      )}

      {/* Status Text */}
      <div className="text-sm text-[var(--text-primary)]/70 font-medium">
        {isRunning && 'Focus time is running...'}
        {isPaused && 'Timer paused'}
        {isCompleted && 'Great work! Take a break.'}
        {isIdle && 'Ready to focus?'}
      </div>
    </Card>
  );
}

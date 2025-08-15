'use client';

interface TimerDisplayProps {
  timeLeft: number; // in seconds
}

export function TimerDisplay({ timeLeft }: TimerDisplayProps) {
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center">
      <div className="timer-display">
        {formatTime(timeLeft)}
      </div>
    </div>
  );
}

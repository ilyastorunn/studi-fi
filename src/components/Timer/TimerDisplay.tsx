'use client';

interface TimerDisplayProps {
  timeLeft: number; // in seconds
}

export function TimerDisplay({ timeLeft }: TimerDisplayProps) {
  // Format time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
    // style="font-family:var(--font-comfortaa);font-size:18px;color:#15142F;font-weight:600"
     className="timer-display text-6xl font-medium text-[#15142F] opacity-80">
      {formatTime(timeLeft)}
    </div>
  );
}

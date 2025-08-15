'use client';

interface ProgressBarProps {
  progress: number; // 0-100
  onSeek?: (progress: number) => void;
  disabled?: boolean;
}

export function ProgressBar({ progress, onSeek, disabled = false }: ProgressBarProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !onSeek) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * 100;
    onSeek(Math.max(0, Math.min(100, newProgress)));
  };

  return (
    <div
      className={`
        w-full h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer
        ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:h-1.5 transition-all duration-200'}
      `}
      onClick={handleClick}
    >
      <div
        className="h-full bg-[var(--accent-purple)] rounded-full transition-all duration-200"
        style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
      />
    </div>
  );
}

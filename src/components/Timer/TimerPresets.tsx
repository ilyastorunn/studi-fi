'use client';

import { TIMER_PRESETS } from '@/lib/constants';
import { Button } from '@/components/ui/button';

interface TimerPresetsProps {
  onPresetSelect: (minutes: number) => void;
  selectedDuration: number; // in seconds
  disabled?: boolean;
}

export function TimerPresets({ onPresetSelect, selectedDuration, disabled = false }: TimerPresetsProps) {
  const selectedMinutes = selectedDuration / 60;

  return (
    <div className="space-y-3">
      {/* Preset Buttons Grid */}
      <div className="grid grid-cols-2 gap-3">
        {TIMER_PRESETS.map((preset) => (
          <Button
            key={preset.value}
            variant={selectedMinutes === preset.value ? "default" : "outline"}
            size="sm"
            onClick={() => onPresetSelect(preset.value)}
            disabled={disabled}
            className={`
              h-12 rounded-full text-sm font-medium transition-all duration-200
              ${selectedMinutes === preset.value 
                ? 'bg-[var(--accent-purple)] text-white shadow-lg' 
                : 'bg-white/20 text-[var(--text-primary)] border-white/30 hover:bg-white/30'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Custom Time Button */}
      <Button
        variant="outline"
        size="sm"
        disabled={disabled}
        className="w-full h-12 rounded-full text-sm font-medium bg-white/10 text-[var(--text-primary)] border-white/30 hover:bg-white/20 transition-all duration-200"
      >
        set custom time
      </Button>
    </div>
  );
}

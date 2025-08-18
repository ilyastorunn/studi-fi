"use client";

import { useTimerStore } from "@/stores/timerStore";
import { TIMER_STATES, TIMER_PRESETS } from "@/lib/constants";
import { TimerDisplay } from "./TimerDisplay";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

export function TimerCard() {
  const {
    timeLeft,
    duration,
    state,
    isCustomTimeInputMode,
    setDuration,
    toggleCustomTimeInput,
    start,
    pause,
    resume,
    reset,
  } = useTimerStore();

  const isRunning = state === TIMER_STATES.RUNNING;
  const isPaused = state === TIMER_STATES.PAUSED;

  const handleReset = () => {
    reset();
  };

  const handlePresetSelect = (minutes: number) => {
    if (!isRunning) {
      setDuration(minutes);
    }
  };

  const selectedMinutes = duration === -1 ? -1 : duration / 60;

  return (
    <div
      className="w-[672px] h-[240px] p-6 flex"
      style={{
        backgroundColor: "rgba(234, 234, 242, 0.3)",
        backdropFilter: "blur(10px)",
        borderRadius: "50px",
      }}
    >
      {/* Sol Taraf - Timer Display ve Control Buttons */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        {/* Timer Display */}
        <div className="flex items-center justify-center">
          <TimerDisplay timeLeft={timeLeft} />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-4">
          {/* Start Button */}
          <Button
            onClick={isRunning ? pause : (isPaused ? resume : start)}
            size="lg"
            className="w-12 h-12 rounded-full bg-[#0E3C1D] hover:bg-[#0E3C1D]/80 text-white shadow-lg flex items-center justify-center"
          >
            {isRunning ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </Button>

          {/* Stop Button */}
          <Button
            onClick={handleReset}
            size="lg"
            className="w-12 h-12 rounded-full bg-[#491615] hover:bg-[#491615]/80 text-white shadow-lg flex items-center justify-center"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Sağ Taraf - Preset Buttons */}
      <div className="flex-1 flex flex-col justify-center space-y-4 pl-6">
        {/* Preset Buttons Grid - 2x2 */}
        <div className="grid grid-cols-2 gap-3">
          {TIMER_PRESETS.map((preset) => (
            <Button
              key={preset.value}
              variant="outline"
              onClick={() => handlePresetSelect(preset.value)}
              disabled={isRunning}
              className={`
                h-12 rounded-xl text-sm font-medium transition-all duration-200
                backdrop-blur-md bg-[#15142F]/25 text-[#15142F] border-none hover:bg-[#15142F]/50
                ${
                  selectedMinutes === preset.value
                    ? "ring-1 ring-[#8A4FFF]"
                    : ""
                }
                ${isRunning ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {/* Custom Time Button - Full Width */}
        <Button
          variant="outline"
          disabled={isRunning}
          onClick={toggleCustomTimeInput}
          className={`w-full h-12 rounded-xl text-sm border-none font-medium backdrop-blur-md bg-[#15142F]/25 text-[#15142F] border-white/30 hover:bg-[#15142F]/50 transition-all duration-200 ${
            isCustomTimeInputMode ? "ring-1 ring-[#8A4FFF]" : ""
          }`}
        >
          {isCustomTimeInputMode ? "cancel" : "set custom time"}
        </Button>
      </div>
    </div>
  );
}

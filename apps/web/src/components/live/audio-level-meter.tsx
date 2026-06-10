"use client";

interface AudioLevelMeterProps {
  level: number;
  isSilent: boolean;
  silenceDuration?: number;
  silenceThreshold?: number;
}

export function AudioLevelMeter({
  level,
  isSilent,
  silenceDuration = 0,
  silenceThreshold = 45000,
}: AudioLevelMeterProps) {
  const bars = 28;
  const activeBars = Math.round(level * bars);
  const silenceRemaining = Math.max(0, Math.ceil((silenceThreshold - silenceDuration) / 1000));

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-[2px] h-10 justify-center">
        {Array.from({ length: bars }).map((_, i) => {
          const isActive = i < activeBars;
          const barHeight = 25 + (i / bars) * 75;
          
          const hue = isSilent ? 0 : 270 + (i / bars) * 50;
          const saturation = isActive ? 75 : 15;
          const lightness = isActive ? 50 + (i / bars) * 15 : 22;
          
          return (
            <div
              key={i}
              className="w-[3px] rounded-full transition-all duration-75"
              style={{
                height: `${barHeight}%`,
                backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
                boxShadow: isActive && !isSilent
                  ? `0 0 ${2 + level * 8}px hsla(${hue}, 75%, 55%, 0.35)`
                  : 'none',
              }}
            />
          );
        })}
      </div>

      {isSilent && silenceDuration > 0 && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
            <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium text-red-400 font-mono">
              {silenceRemaining}s until auto-stop
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

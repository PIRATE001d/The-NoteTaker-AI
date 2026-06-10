"use client";

interface WaveformVisualizerProps {
  level: number;
  isActive: boolean;
}

export function WaveformVisualizer({ level, isActive }: WaveformVisualizerProps) {
  const bars = 48;
  
  return (
    <div className="flex items-center justify-center gap-[2px] h-20">
      {Array.from({ length: bars }).map((_, i) => {
        const distance = Math.abs(i - bars / 2) / (bars / 2);
        const baseHeight = 15 + (1 - distance * distance) * 70;
        const activeHeight = baseHeight * (0.2 + level * 0.8);
        const height = isActive ? activeHeight : 8;
        
        const hue = isActive ? 270 + (i / bars) * 40 : 270;
        const saturation = isActive ? 70 + level * 20 : 15;
        const lightness = isActive ? 45 + level * 25 : 25;
        const opacity = isActive ? 0.5 + level * 0.5 : 0.2;
        
        return (
          <div
            key={i}
            className="w-[3px] rounded-full transition-all duration-75"
            style={{
              height: `${height}%`,
              backgroundColor: `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`,
              boxShadow: isActive && level > 0.25 
                ? `0 0 ${3 + level * 10}px hsla(${hue}, ${saturation}%, ${lightness}%, 0.4)` 
                : 'none',
            }}
          />
        );
      })}
    </div>
  );
}

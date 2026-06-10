"use client";

interface WaveformVisualizerProps {
  level: number;
  isActive: boolean;
}

export function WaveformVisualizer({ level, isActive }: WaveformVisualizerProps) {
  const bars = 40;
  
  return (
    <div className="flex items-center justify-center gap-[2px] h-20">
      {Array.from({ length: bars }).map((_, i) => {
        const distance = Math.abs(i - bars / 2) / (bars / 2);
        const baseHeight = 20 + (1 - distance) * 60;
        const activeHeight = baseHeight * (0.3 + level * 0.7);
        const height = isActive ? activeHeight : 15;
        
        const hue = isActive ? 190 + (i / bars) * 30 : 220;
        const saturation = isActive ? 80 : 20;
        const lightness = isActive ? 50 + level * 20 : 30;
        const opacity = isActive ? 0.6 + level * 0.4 : 0.3;
        
        return (
          <div
            key={i}
            className="w-1 rounded-full transition-all duration-75"
            style={{
              height: `${height}%`,
              backgroundColor: `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`,
              boxShadow: isActive && level > 0.3 
                ? `0 0 ${4 + level * 8}px hsla(${hue}, ${saturation}%, ${lightness}%, 0.5)` 
                : 'none',
            }}
          />
        );
      })}
    </div>
  );
}

"use client";

type SessionState = "idle" | "recording" | "processing" | "completed";

interface StatusIndicatorProps {
  state: SessionState;
}

export function StatusIndicator({ state }: StatusIndicatorProps) {
  const config = {
    idle: {
      label: "Ready",
      color: "bg-muted-foreground",
      textColor: "text-muted-foreground",
      borderColor: "border-border/60",
      bgColor: "bg-secondary/50",
    },
    recording: {
      label: "Recording",
      color: "bg-red-500",
      textColor: "text-red-400",
      borderColor: "border-red-500/30",
      bgColor: "bg-red-500/10",
    },
    processing: {
      label: "Processing",
      color: "bg-violet-500",
      textColor: "text-violet-400",
      borderColor: "border-violet-500/30",
      bgColor: "bg-violet-500/10",
    },
    completed: {
      label: "Completed",
      color: "bg-emerald-500",
      textColor: "text-emerald-400",
      borderColor: "border-emerald-500/30",
      bgColor: "bg-emerald-500/10",
    },
  };

  const { label, color, textColor, borderColor, bgColor } = config[state];

  return (
    <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border ${borderColor} ${bgColor} backdrop-blur-sm`}>
      <div className="relative">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        {(state === "recording" || state === "processing") && (
          <div className={`absolute inset-0 w-2 h-2 rounded-full ${color} animate-ping opacity-75`} />
        )}
      </div>
      <span className={`text-xs font-semibold ${textColor} uppercase tracking-wider`}>{label}</span>
    </div>
  );
}

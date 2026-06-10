"use client";

type SessionState = "idle" | "recording" | "processing" | "completed";

interface StatusIndicatorProps {
  state: SessionState;
}

export function StatusIndicator({ state }: StatusIndicatorProps) {
  const config = {
    idle: {
      label: "Ready",
      color: "bg-slate-500",
      textColor: "text-slate-400",
      borderColor: "border-slate-700/50",
      bgColor: "bg-slate-800/50",
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
      color: "bg-purple-500",
      textColor: "text-purple-400",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/10",
    },
    completed: {
      label: "Completed",
      color: "bg-green-500",
      textColor: "text-green-400",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/10",
    },
  };

  const { label, color, textColor, borderColor, bgColor } = config[state];

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${borderColor} ${bgColor} backdrop-blur-sm`}>
      <div className="relative">
        <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
        {(state === "recording" || state === "processing") && (
          <div className={`absolute inset-0 w-2.5 h-2.5 rounded-full ${color} animate-ping opacity-75`} />
        )}
      </div>
      <span className={`text-sm font-medium ${textColor}`}>{label}</span>
    </div>
  );
}

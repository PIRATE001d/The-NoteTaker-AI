"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TranscriptEntry {
  text: string;
  source: "mic" | "tab";
  timestamp: number;
  isFinal: boolean;
}

interface LiveTranscriptProps {
  entries: TranscriptEntry[];
  interimText?: string;
}

export function LiveTranscript({ entries, interimText = "" }: LiveTranscriptProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, interimText]);

  return (
    <div className="h-full flex flex-col glass-card rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 border border-violet-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Live Transcript</h3>
            <p className="text-[11px] text-muted-foreground">{entries.length} segment{entries.length !== 1 ? 's' : ''} captured</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span className="text-[10px] font-semibold text-violet-400 uppercase tracking-wider">Meeting</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
            <span className="text-[10px] font-semibold text-fuchsia-400 uppercase tracking-wider">You</span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div ref={scrollRef} className="p-6 space-y-4 min-h-[500px]">
          {entries.length === 0 && !interimText && (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <div className="relative mb-5">
                <div className="w-16 h-16 rounded-2xl bg-secondary border border-border/40 flex items-center justify-center">
                  <svg className="w-8 h-8 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">Waiting for speech...</p>
              <p className="text-muted-foreground/50 text-xs mt-1">Start recording to capture audio</p>
            </div>
          )}

          {entries.map((entry, i) => (
            <div 
              key={i} 
              className="flex gap-3.5 items-start group animate-in fade-in slide-in-from-bottom-2 duration-300"
              style={{ animationDelay: `${Math.min(i * 50, 500)}ms` }}
            >
              <div className={`mt-1.5 shrink-0 w-2 h-2 rounded-full ${
                entry.source === "mic" 
                  ? "bg-fuchsia-400 shadow-sm shadow-fuchsia-400/50" 
                  : "bg-violet-400 shadow-sm shadow-violet-400/50"
              }`} />
              <div className="flex-1 min-w-0">
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                  entry.source === "mic" ? "text-fuchsia-400/70" : "text-violet-400/70"
                }`}>
                  {entry.source === "mic" ? "You" : "Meeting"}
                </span>
                <p className="text-foreground text-sm leading-relaxed mt-0.5 font-medium">
                  {entry.text}
                </p>
              </div>
              <span className="text-[10px] text-muted-foreground/50 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0">
                {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          ))}

          {interimText && (
            <div className="flex gap-3.5 items-start opacity-50">
              <div className="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-fuchsia-400/50 animate-pulse" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-fuchsia-400/50">
                  You
                </span>
                <p className="text-muted-foreground text-sm leading-relaxed mt-0.5 italic">
                  {interimText}
                </p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

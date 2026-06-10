"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLiveSession } from "@/hooks/use-live-session";
import { AudioLevelMeter } from "@/components/live/audio-level-meter";
import { LiveTranscript } from "@/components/live/live-transcript";
import { WaveformVisualizer } from "@/components/live/waveform-visualizer";
import { StatusIndicator } from "@/components/live/status-indicator";

export default function LiveSessionPage() {
  const {
    state,
    transcript,
    audioLevel,
    silenceDuration,
    isSilent,
    start,
    stop,
  } = useLiveSession();

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-10 animate-in fade-in slide-in-from-top-2 duration-700">
          <Link href="/" className="inline-flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-secondary border border-border/60 flex items-center justify-center group-hover:bg-violet-500/10 group-hover:border-violet-500/30 transition-all duration-300">
              <svg className="w-4 h-4 text-muted-foreground group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="text-sm font-medium">Back</span>
          </Link>
          
          <StatusIndicator state={state} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
            <div>
              <h1 className="text-3xl font-bold tracking-tight gradient-text">
                Live Session
              </h1>
              <p className="text-muted-foreground mt-1.5 text-sm">
                Capture and transcribe meeting audio in real-time
              </p>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border/30 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Audio Input</span>
                {state === "recording" && (
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                    </span>
                    <span className="text-[10px] text-red-400 font-semibold uppercase tracking-wider">Live</span>
                  </div>
                )}
              </div>
              
              <div className="p-5 space-y-5">
                <WaveformVisualizer 
                  level={audioLevel} 
                  isActive={state === "recording"} 
                />
                
                <AudioLevelMeter 
                  level={audioLevel}
                  isSilent={isSilent}
                  silenceDuration={silenceDuration}
                  silenceThreshold={45000}
                />
              </div>
            </div>

            <div className="space-y-4">
              {state === "idle" && (
                <div className="space-y-4">
                  <div className="glass-card rounded-2xl p-5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">Ready to Record</h3>
                        <p className="text-xs text-muted-foreground">Share a browser tab with audio to begin</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={start} 
                    size="lg" 
                    className="w-full h-14 text-base font-semibold rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/20 transition-all duration-300 hover:shadow-violet-500/30 hover:scale-[1.02] active:scale-[0.98] text-white border-0"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    Start Recording
                  </Button>
                </div>
              )}

              {state === "recording" && (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-red-500/5 border border-red-500/20 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-lg shadow-red-500/50" />
                      </span>
                      <span className="font-semibold text-red-400 text-sm">Recording in progress</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Auto-stops after 45 seconds of silence
                    </p>
                    {isSilent && silenceDuration > 0 && (
                      <div className="mt-3 pt-3 border-t border-red-500/10">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Silence detected</span>
                          <span className="text-red-400 font-mono font-semibold bg-red-500/10 px-2 py-0.5 rounded-md">
                            {Math.max(0, Math.ceil((45000 - silenceDuration) / 1000))}s
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={stop} 
                    variant="destructive"
                    size="lg" 
                    className="w-full h-14 text-base font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                    </svg>
                    Stop Recording
                  </Button>
                </div>
              )}

              {state === "processing" && (
                <div className="glass-card rounded-2xl p-6 text-center space-y-5 border-glow">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 animate-spin opacity-20 blur-sm" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" />
                    <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
                      <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Processing with AI</h3>
                    <p className="text-sm text-muted-foreground mt-1">Extracting insights from your recording...</p>
                  </div>
                </div>
              )}

              {state === "completed" && (
                <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-6 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground">Redirecting to your session...</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-8 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
            <LiveTranscript entries={transcript} />
          </div>
        </div>
      </div>
    </div>
  );
}

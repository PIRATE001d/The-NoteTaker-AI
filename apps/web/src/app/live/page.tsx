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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            <span className="font-medium">Back</span>
          </Link>
          
          <StatusIndicator state={state} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Live Session
              </h1>
              <p className="text-slate-500 mt-2 text-sm">
                Capture meeting audio in real-time
              </p>
            </div>

            {/* Audio Visualizer */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 pointer-events-none" />
              
              <div className="relative space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Audio Input</span>
                  {state === "recording" && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs text-red-400 font-medium">LIVE</span>
                    </div>
                  )}
                </div>
                
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

            {/* Controls */}
            <div className="space-y-4">
              {state === "idle" && (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm">Ready to Record</h3>
                        <p className="text-xs text-slate-400">Share a tab with audio</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={start} 
                    size="lg" 
                    className="w-full h-14 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
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
                  <div className="rounded-2xl bg-red-500/10 border border-red-500/30 backdrop-blur-sm p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50" />
                      <span className="font-semibold text-red-400">Recording</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Auto-stops after 45s of silence
                    </p>
                    {isSilent && silenceDuration > 0 && (
                      <div className="mt-3 pt-3 border-t border-red-500/20">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Silence detected</span>
                          <span className="text-red-400 font-mono font-medium">
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
                    className="w-full h-14 text-base font-semibold rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
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
                <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 backdrop-blur-sm p-6 text-center space-y-4">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-spin opacity-20" />
                    <div className="absolute inset-2 rounded-full bg-slate-900 flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Processing with AI</h3>
                    <p className="text-sm text-slate-400 mt-1">Generating insights...</p>
                  </div>
                </div>
              )}

              {state === "completed" && (
                <div className="rounded-2xl bg-green-500/10 border border-green-500/30 backdrop-blur-sm p-6 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-400">Redirecting to session...</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Transcript */}
          <div className="lg:col-span-2">
            <LiveTranscript entries={transcript} />
          </div>
        </div>
      </div>
    </div>
  );
}

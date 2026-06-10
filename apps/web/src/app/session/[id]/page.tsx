"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SessionTask {
  task: string;
  owner: string;
  status: string;
}

interface SessionData {
  id: string;
  title: string;
  created_at: string;
  transcript: string | null;
  summary: string | null;
  tasks: SessionTask[];
  decisions: string[];
}

export default function SessionPage() {
  const params = useParams();
  const [data, setData] = useState<SessionData | null>(null);

  useEffect(() => {
    if (params.id) {
      fetch(`http://localhost:8000/api/v1/sessions/${params.id}`)
        .then(res => res.json())
        .then(setData)
        .catch(console.error);
    }
  }, [params.id]);

  if (!data) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <p className="text-slate-400 animate-pulse">Loading intelligence report...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                {data.title}
              </h1>
              <div className="flex items-center gap-3 mt-3">
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                  {new Date(data.created_at).toLocaleDateString()}
                </Badge>
                <span className="text-slate-500 text-sm">
                  {new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Summary & Decisions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary */}
            <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700/50 bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="font-semibold text-white">Executive Summary</h2>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-300 leading-relaxed">
                  {data.summary || <span className="text-slate-500 italic">No summary generated.</span>}
                </p>
              </div>
            </div>

            {/* Decisions */}
            <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700/50 bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="font-semibold text-white">Key Decisions</h2>
                  </div>
                  <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                    {data.decisions?.length || 0}
                  </Badge>
                </div>
              </div>
              <div className="p-6">
                {data.decisions && data.decisions.length > 0 ? (
                  <ul className="space-y-3">
                    {data.decisions.map((decision: string, i: number) => (
                      <li key={i} className="flex gap-3 items-start group">
                        <div className="mt-1.5 w-2 h-2 rounded-full bg-indigo-400 shrink-0 group-hover:scale-125 transition-transform shadow-sm shadow-indigo-400/50" />
                        <span className="text-slate-300 text-sm leading-relaxed">{decision}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 italic text-sm">No key decisions identified.</p>
                )}
              </div>
            </div>

            {/* Transcript */}
            <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-500/5 to-slate-600/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                  </div>
                  <h2 className="font-semibold text-white">Full Transcript</h2>
                </div>
              </div>
              <ScrollArea className="h-[400px]">
                <div className="p-6 font-mono text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                  {data.transcript || 'No transcript available.'}
                </div>
              </ScrollArea>
            </div>
          </div>
          
          {/* Right - Action Items */}
          <div>
            <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm overflow-hidden sticky top-8">
              <div className="px-6 py-4 border-b border-slate-700/50 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h2 className="font-semibold text-white">Action Items</h2>
                  </div>
                  <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                    {data.tasks?.length || 0}
                  </Badge>
                </div>
              </div>
              <ScrollArea className="h-[600px]">
                <div className="p-4 space-y-3">
                  {data.tasks && data.tasks.length > 0 ? (
                    data.tasks.map((task: SessionTask, i: number) => (
                      <div key={i} className="group p-4 rounded-xl bg-slate-700/30 border border-slate-700/50 hover:border-amber-500/30 hover:bg-slate-700/50 transition-all">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 w-4 h-4 rounded border-2 border-slate-600 group-hover:border-amber-400/50 transition-colors shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-200 leading-tight">{task.task}</p>
                            {task.owner && (
                              <div className="mt-2">
                                <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-amber-400/80 border-amber-500/20 bg-amber-500/5">
                                  {task.owner}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-slate-500 text-sm italic">No tasks identified.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

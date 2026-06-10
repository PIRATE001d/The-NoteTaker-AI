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
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-5 animate-in fade-in duration-500">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" />
          <div className="absolute inset-2 rounded-full bg-secondary flex items-center justify-center">
            <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">Loading intelligence report...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="animate-in fade-in slide-in-from-top-2 duration-700">
          <Link href="/" className="inline-flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors group mb-8">
            <div className="w-8 h-8 rounded-lg bg-secondary border border-border/60 flex items-center justify-center group-hover:bg-violet-500/10 group-hover:border-violet-500/30 transition-all duration-300">
              <svg className="w-4 h-4 text-muted-foreground group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
          
          <div className="flex items-start gap-4 mb-10">
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight gradient-text">
                {data.title}
              </h1>
              <div className="flex items-center gap-3 mt-3">
                <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20 rounded-lg text-xs">
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(data.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </Badge>
                <span className="text-muted-foreground text-sm">
                  {new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-card rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
              <div className="px-6 py-4 border-b border-border/30 bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="font-semibold text-foreground">Executive Summary</h2>
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {data.summary || <span className="italic text-muted-foreground/60">No summary generated.</span>}
                </p>
              </div>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
              <div className="px-6 py-4 border-b border-border/30 bg-gradient-to-r from-indigo-500/5 to-violet-500/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="font-semibold text-foreground">Key Decisions</h2>
                  </div>
                  <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 rounded-lg">
                    {data.decisions?.length || 0}
                  </Badge>
                </div>
              </div>
              <div className="p-6">
                {data.decisions && data.decisions.length > 0 ? (
                  <ul className="space-y-4">
                    {data.decisions.map((decision: string, i: number) => (
                      <li key={i} className="flex gap-3.5 items-start group">
                        <div className="mt-2 w-2 h-2 rounded-full bg-indigo-400 shrink-0 shadow-sm shadow-indigo-400/50 group-hover:scale-125 transition-transform duration-300" />
                        <span className="text-muted-foreground text-sm leading-relaxed">{decision}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground/60 italic text-sm">No key decisions identified.</p>
                )}
              </div>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
              <div className="px-6 py-4 border-b border-border/30 bg-gradient-to-r from-secondary/50 to-secondary/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary border border-border/60 flex items-center justify-center">
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                  </div>
                  <h2 className="font-semibold text-foreground">Full Transcript</h2>
                </div>
              </div>
              <ScrollArea className="h-[400px]">
                <div className="p-6 font-mono text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {data.transcript || 'No transcript available.'}
                </div>
              </ScrollArea>
            </div>
          </div>
          
          <div className="lg:col-span-4 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
            <div className="glass-card rounded-2xl overflow-hidden sticky top-8">
              <div className="px-6 py-4 border-b border-border/30 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h2 className="font-semibold text-foreground">Action Items</h2>
                  </div>
                  <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 rounded-lg">
                    {data.tasks?.length || 0}
                  </Badge>
                </div>
              </div>
              <ScrollArea className="h-[600px]">
                <div className="p-4 space-y-3">
                  {data.tasks && data.tasks.length > 0 ? (
                    data.tasks.map((task: SessionTask, i: number) => (
                      <div key={i} className="group p-4 rounded-xl bg-secondary/30 border border-border/30 hover:border-amber-500/20 hover:bg-secondary/50 transition-all duration-300">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 w-4 h-4 rounded border-2 border-border group-hover:border-amber-400/50 transition-colors duration-300 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground leading-snug">{task.task}</p>
                            {task.owner && (
                              <div className="mt-2.5">
                                <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-amber-400/80 border-amber-500/20 bg-amber-500/5 rounded-md">
                                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  {task.owner}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-secondary/50 border border-border/30 flex items-center justify-center mb-3">
                        <svg className="w-5 h-5 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <p className="text-muted-foreground/60 text-sm italic">No tasks identified.</p>
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

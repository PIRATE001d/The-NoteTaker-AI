"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SessionSummary {
  id: string;
  title: string;
  created_at: string;
  status: string;
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/sessions/')
      .then(res => res.json())
      .then(data => {
        setSessions(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-6 py-10 max-w-7xl">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 animate-in fade-in slide-in-from-top-2 duration-700">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20 glow-violet">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 blur-lg -z-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight gradient-text">
                Noter AI
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">Intelligent Meeting Assistant</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Link href="/live">
              <Button 
                size="lg" 
                variant="outline"
                className="h-11 px-5 rounded-xl border-border/60 bg-secondary/50 hover:bg-secondary text-foreground backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:border-violet-500/30"
              >
                <span className="relative flex h-2.5 w-2.5 mr-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
                Live Session
              </Button>
            </Link>
            <Link href="/upload">
              <Button 
                size="lg" 
                className="h-11 px-5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/20 transition-all duration-300 hover:shadow-violet-500/30 hover:scale-[1.02] active:scale-[0.98] text-white border-0"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Audio
              </Button>
            </Link>
          </div>
        </header>
        
        <section className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">Recent Sessions</h2>
              <p className="text-sm text-muted-foreground mt-1">Your transcribed meetings and insights</p>
            </div>
            {sessions.length > 0 && (
              <Badge variant="secondary" className="bg-secondary border-border/60 text-muted-foreground rounded-lg px-3 py-1">
                {sessions.length} session{sessions.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-44 rounded-2xl glass-card animate-pulse" />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="flex flex-col items-center justify-center py-24 text-center px-6">
                <div className="relative mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 flex items-center justify-center">
                    <svg className="w-10 h-10 text-violet-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 blur-xl -z-10" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No sessions yet</h3>
                <p className="text-muted-foreground mb-10 max-w-sm text-sm leading-relaxed">
                  Start a live session to capture meeting audio in real-time, or upload an existing recording for AI-powered transcription and analysis.
                </p>
                <div className="flex gap-3">
                  <Link href="/live">
                    <Button 
                      variant="outline"
                      className="h-11 px-5 rounded-xl border-border/60 bg-secondary/50 hover:bg-secondary text-foreground transition-all hover:border-violet-500/30"
                    >
                      <span className="relative flex h-2 w-2 mr-2">
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                      </span>
                      Start Live Session
                    </Button>
                  </Link>
                  <Link href="/upload">
                    <Button 
                      variant="outline"
                      className="h-11 px-5 rounded-xl border-border/60 bg-secondary/50 hover:bg-secondary text-foreground transition-all hover:border-violet-500/30"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload Audio
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {sessions.map((session, index) => (
                <Link 
                  href={`/session/${session.id}`} 
                  key={session.id} 
                  className="group"
                >
                  <div 
                    className={`h-full glass-card glass-card-hover rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-2 duration-500`}
                    style={{ animationDelay: `${Math.min(index * 75, 600)}ms` }}
                  >
                    <div className="flex items-start justify-between mb-5">
                      <Badge 
                        variant={session.status === 'completed' ? 'default' : 'secondary'}
                        className={`text-[10px] uppercase tracking-wider font-semibold rounded-lg px-2.5 py-1 ${
                          session.status === 'completed' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : session.status === 'recording'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                        }`}
                      >
                        {session.status === 'completed' && (
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {session.status === 'recording' && (
                          <span className="relative flex h-1.5 w-1.5 mr-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                          </span>
                        )}
                        {session.status}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {new Date(session.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-foreground text-sm leading-snug mb-4 line-clamp-2 group-hover:text-violet-300 transition-colors duration-300">
                      {session.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(session.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    <div className="mt-5 pt-4 border-t border-border/30 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">View insights</span>
                      <svg className="w-4 h-4 text-muted-foreground group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

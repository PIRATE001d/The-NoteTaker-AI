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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-6 py-12 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                The Noter AI
              </h1>
            </div>
            <p className="text-slate-400 text-lg">Your intelligent meeting assistant</p>
          </div>
          
          <div className="flex gap-3">
            <Link href="/live">
              <Button 
                size="lg" 
                variant="outline"
                className="h-12 px-6 rounded-xl border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white backdrop-blur-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="w-4 h-4 mr-2 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="6" />
                </svg>
                Live Session
              </Button>
            </Link>
            <Link href="/upload">
              <Button 
                size="lg" 
                className="h-12 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Audio
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Sessions Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-white">Recent Sessions</h2>
            {sessions.length > 0 && (
              <Badge variant="secondary" className="bg-slate-800 border-slate-700 text-slate-300">
                {sessions.length} total
              </Badge>
            )}
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-40 rounded-2xl bg-slate-800/50 border border-slate-700/50 animate-pulse" />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="rounded-2xl bg-slate-800/30 border border-dashed border-slate-700/50 backdrop-blur-sm">
              <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-blue-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No sessions yet</h3>
                <p className="text-slate-400 mb-8 max-w-sm">
                  Start a live session to capture meeting audio in real-time, or upload an audio file for transcription.
                </p>
                <div className="flex gap-3">
                  <Link href="/live">
                    <Button 
                      variant="outline"
                      className="h-11 px-5 rounded-xl border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white"
                    >
                      <svg className="w-4 h-4 mr-2 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="6" />
                      </svg>
                      Start Live Session
                    </Button>
                  </Link>
                  <Link href="/upload">
                    <Button 
                      variant="outline"
                      className="h-11 px-5 rounded-xl border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white"
                    >
                      Upload Audio
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map(session => (
                <Link 
                  href={`/session/${session.id}`} 
                  key={session.id} 
                  className="group"
                >
                  <div className="h-full rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm p-5 transition-all duration-300 hover:bg-slate-800/80 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 hover:scale-[1.02] active:scale-[0.98]">
                    <div className="flex items-start justify-between mb-4">
                      <Badge 
                        variant={session.status === 'completed' ? 'default' : 'secondary'}
                        className={`text-[10px] uppercase tracking-wider font-semibold ${
                          session.status === 'completed' 
                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                            : session.status === 'recording'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        }`}
                      >
                        {session.status === 'completed' && (
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {session.status}
                      </Badge>
                      <span className="text-xs text-slate-500 font-mono">
                        {new Date(session.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-white text-sm leading-tight mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors">
                      {session.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(session.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

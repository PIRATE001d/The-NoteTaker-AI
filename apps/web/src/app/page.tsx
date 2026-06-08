"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const [sessions, setSessions] = useState<any[]>([]);
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
    <div className="container mx-auto p-8 max-w-5xl">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">The Noter AI</h1>
          <p className="text-muted-foreground mt-2">Your intelligent audio transcription and meeting assistant.</p>
        </div>
        <Link href="/upload">
          <Button size="lg" className="font-semibold rounded-full px-6 shadow-md">
            + New Audio Session
          </Button>
        </Link>
      </div>
      
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight border-b pb-4">Recent Sessions</h2>
        
        {loading ? (
          <div className="text-muted-foreground animate-pulse">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">No sessions yet</h3>
              <p className="text-muted-foreground mt-1 mb-4">Upload an audio file to generate your first intelligent summary.</p>
              <Link href="/upload">
                <Button variant="outline">Upload Audio</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map(session => (
              <Link href={`/session/${session.id}`} key={session.id} className="transition-transform hover:scale-[1.02] active:scale-[0.98]">
                <Card className="h-full hover:border-primary/50 cursor-pointer shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="capitalize text-xs font-medium">
                        {session.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-medium">
                        {new Date(session.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <CardTitle className="text-lg leading-tight truncate" title={session.title}>
                      {session.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs">
                      {new Date(session.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

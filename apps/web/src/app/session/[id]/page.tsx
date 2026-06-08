"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

export default function SessionPage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (params.id) {
      fetch(`http://localhost:8000/api/v1/sessions/${params.id}`)
        .then(res => res.json())
        .then(setData)
        .catch(console.error);
    }
  }, [params.id]);

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground animate-pulse">
      Loading your intelligence report...
    </div>
  );

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4 -ml-4 text-muted-foreground hover:text-primary">
            ← Back to Dashboard
          </Button>
        </Link>
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-3xl font-extrabold tracking-tight">{data.title}</h1>
          <Badge variant="outline" className="bg-primary/5 text-primary">
            {new Date(data.created_at).toLocaleDateString()}
          </Badge>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 h-12 w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger 
            value="overview" 
            className="rounded-none border-b-2 border-transparent px-6 py-3 font-semibold data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Intelligence Overview
          </TabsTrigger>
          <TabsTrigger 
            value="transcript"
            className="rounded-none border-b-2 border-transparent px-6 py-3 font-semibold data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Full Transcript
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="shadow-sm border-t-4 border-t-primary/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">Executive Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                    {data.summary || <span className="text-muted-foreground italic">No summary generated.</span>}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-t-4 border-t-blue-500/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center gap-2">
                    Key Decisions
                    <Badge variant="secondary" className="rounded-full bg-blue-100 text-blue-800">{data.decisions?.length || 0}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data.decisions && data.decisions.length > 0 ? (
                    <ul className="space-y-3">
                      {data.decisions.map((decision: string, i: number) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span className="text-gray-700 leading-snug">{decision}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">No key decisions identified.</span>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="shadow-sm border-t-4 border-t-orange-500/60 sticky top-8">
                <CardHeader className="pb-3 bg-muted/20">
                  <CardTitle className="text-lg flex items-center gap-2">
                    Action Items
                    <Badge variant="secondary" className="rounded-full bg-orange-100 text-orange-800">{data.tasks?.length || 0}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    <div className="p-4 space-y-4">
                      {data.tasks && data.tasks.length > 0 ? (
                        data.tasks.map((task: any, i: number) => (
                          <div key={i} className="group relative p-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-sm border-2 border-muted-foreground/30 group-hover:border-primary/50 transition-colors" />
                              <div className="flex-1 space-y-1.5">
                                <p className="text-sm font-medium leading-tight">{task.task}</p>
                                {task.owner && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/50 border-none">
                                      {task.owner}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground text-center py-8 italic">
                          No tasks identified in this session.
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transcript" className="mt-0 outline-none">
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <ScrollArea className="h-[700px] w-full rounded-md bg-slate-50/50">
                <div className="p-8 font-mono text-sm leading-relaxed text-slate-800 whitespace-pre-wrap max-w-4xl mx-auto">
                  {data.transcript || 'No transcript available.'}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

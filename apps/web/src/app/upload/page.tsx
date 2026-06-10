"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/api/v1/transcripts/upload-audio', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.session_id) {
        router.push(`/session/${data.session_id}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-6 py-10 max-w-2xl">
        <div className="animate-in fade-in slide-in-from-top-2 duration-700">
          <Link href="/" className="inline-flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors group mb-10">
            <div className="w-8 h-8 rounded-lg bg-secondary border border-border/60 flex items-center justify-center group-hover:bg-violet-500/10 group-hover:border-violet-500/30 transition-all duration-300">
              <svg className="w-4 h-4 text-muted-foreground group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="text-sm font-medium">Back</span>
          </Link>
          
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight gradient-text">
              Upload Audio
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">Transcribe and analyze your meeting recordings with AI</p>
          </div>
        </div>
        
        <form onSubmit={handleUpload} className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-150">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative rounded-2xl border-2 border-dashed transition-all duration-500 overflow-hidden ${
              dragActive
                ? 'border-violet-500 bg-violet-500/5 shadow-lg shadow-violet-500/10'
                : file
                ? 'border-emerald-500/40 bg-emerald-500/5'
                : 'border-border/60 bg-secondary/30 hover:border-border hover:bg-secondary/50'
            }`}
          >
            {dragActive && (
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 pointer-events-none" />
            )}
            
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center relative">
              {file ? (
                <>
                  <div className="relative mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="absolute -inset-1 rounded-2xl bg-emerald-500/10 blur-lg -z-10" />
                  </div>
                  <p className="text-foreground font-semibold mb-1 text-lg">{file.name}</p>
                  <p className="text-muted-foreground text-sm mb-5">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2 decoration-border hover:decoration-foreground"
                  >
                    Choose a different file
                  </button>
                </>
              ) : (
                <>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 ${
                    dragActive 
                      ? 'bg-violet-500/15 border border-violet-500/30 scale-110' 
                      : 'bg-secondary border border-border/60'
                  }`}>
                    <svg className={`w-8 h-8 transition-all duration-500 ${dragActive ? 'text-violet-400 scale-110' : 'text-muted-foreground'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-foreground font-semibold mb-1 text-lg">
                    {dragActive ? 'Drop your file here' : 'Drag & drop audio file'}
                  </p>
                  <p className="text-muted-foreground text-sm mb-6">or click to browse your files</p>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="sr-only"
                    />
                    <span className="inline-flex items-center px-5 py-2.5 rounded-xl bg-secondary border border-border/60 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/80 hover:border-border transition-all duration-300">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Browse Files
                    </span>
                  </label>
                </>
              )}
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={!file || loading} 
            className="w-full h-14 mt-6 text-base font-semibold rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/20 transition-all duration-300 hover:shadow-violet-500/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none text-white border-0"
          >
            {loading ? (
              <span className="flex items-center gap-2.5">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing with AI...
              </span>
            ) : (
              <span className="flex items-center gap-2.5">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Upload & Transcribe
              </span>
            )}
          </Button>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Secure processing
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Whisper.cpp powered
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Gemini AI analysis
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

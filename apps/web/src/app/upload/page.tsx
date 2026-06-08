"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="container mx-auto p-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-8">Upload Audio</h1>
      
      <form onSubmit={handleUpload} className="space-y-6">
        <div className="border-2 border-dashed rounded-lg p-12 text-center">
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mb-4"
          />
        </div>
        
        <Button type="submit" disabled={!file || loading} className="w-full">
          {loading ? 'Processing...' : 'Upload & Transcribe'}
        </Button>
      </form>
    </div>
  );
}

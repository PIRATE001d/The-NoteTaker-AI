"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSpeechRecognition } from "./use-speech-recognition";
import { useSilenceDetector } from "./use-silence-detector";

type SessionState = "idle" | "recording" | "processing" | "completed";

interface TranscriptEntry {
  text: string;
  source: "mic" | "tab";
  timestamp: number;
  isFinal: boolean;
}

interface LiveSessionResult {
  state: SessionState;
  sessionId: string | null;
  transcript: TranscriptEntry[];
  audioLevel: number;
  silenceDuration: number;
  isSilent: boolean;
  start: () => Promise<void>;
  stop: () => Promise<void>;
}

export function useLiveSession(): LiveSessionResult {
  const router = useRouter();
  const [state, setState] = useState<SessionState>("idle");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const stopRef = useRef<(() => Promise<void>) | undefined>(undefined);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const chunkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioBufferRef = useRef<Float32Array[]>([]);
  const sampleRateRef = useRef(16000);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

  const speech = useSpeechRecognition();

  const handleSilenceReached = useCallback(() => {
    stopRef.current?.();
  }, []);

  const silenceDetector = useSilenceDetector(
    audioLevel,
    0.05,
    45000,
    handleSilenceReached
  );

  useEffect(() => {
    if (speech.finalTranscript) {
      const entries = speech.finalTranscript.split(" ").filter(Boolean);
      const newEntries: TranscriptEntry[] = entries.map((text) => ({
        text,
        source: "mic" as const,
        timestamp: Date.now(),
        isFinal: true,
      }));
      setTranscript((prev) => [...prev, ...newEntries]);
    }
  }, [speech.finalTranscript]);

  const sendAudioChunk = useCallback((base64Audio: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("Sending audio chunk, size:", base64Audio.length);
      wsRef.current.send(
        JSON.stringify({
          type: "audio_chunk",
          data: base64Audio,
        })
      );
    } else {
      console.warn("WebSocket not ready, dropping chunk");
    }
  }, []);

  const startAudioCapture = useCallback(async () => {
    try {
      console.log("Starting audio capture...");
      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 16000,
        },
        video: true,
      });

      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        throw new Error("No audio track found. Make sure to share a tab with audio.");
      }

      console.log("Audio track found:", audioTracks[0].label);

      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.stop();
      }

      const audioStream = new MediaStream(audioTracks);
      streamRef.current = audioStream;

      const audioContext = new AudioContext({ sampleRate: 16000 });
      sampleRateRef.current = audioContext.sampleRate;
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(audioStream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      source.connect(analyser);

      const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
      scriptProcessorRef.current = scriptProcessor;
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);

      scriptProcessor.onaudioprocess = (event) => {
        const inputData = event.inputBuffer.getChannelData(0);
        const audioData = new Float32Array(inputData.length);
        audioData.set(inputData);
        audioBufferRef.current.push(audioData);
      };

      const updateLevel = () => {
        if (!analyserRef.current) return;

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setAudioLevel(average / 255);

        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();

      chunkIntervalRef.current = setInterval(() => {
        if (audioBufferRef.current.length > 0) {
          const totalLength = audioBufferRef.current.reduce(
            (sum, buf) => sum + buf.length,
            0
          );
          const mergedBuffer = new Float32Array(totalLength);
          let offset = 0;
          for (const buf of audioBufferRef.current) {
            mergedBuffer.set(buf, offset);
            offset += buf.length;
          }

          const wavBlob = floatToWav(mergedBuffer, sampleRateRef.current);
          const reader = new FileReader();
          reader.onloadend = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            const uint8Array = new Uint8Array(arrayBuffer);
            let binary = "";
            for (let i = 0; i < uint8Array.length; i++) {
              binary += String.fromCharCode(uint8Array[i]);
            }
            const base64 = btoa(binary);
            sendAudioChunk(base64);
          };
          reader.readAsArrayBuffer(wavBlob);

          audioBufferRef.current = [];
        }
      }, 5000);

      console.log("Audio capture started successfully");
    } catch (error) {
      console.error("Failed to start audio capture:", error);
      throw error;
    }
  }, [sendAudioChunk]);

  const stopAudioCapture = useCallback(() => {
    console.log("Stopping audio capture...");
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (chunkIntervalRef.current) {
      clearInterval(chunkIntervalRef.current);
      chunkIntervalRef.current = null;
    }

    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    audioBufferRef.current = [];
    setAudioLevel(0);
    
    console.log("Audio capture stopped");
  }, []);

  useEffect(() => {
    return () => {
      stopAudioCapture();
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [stopAudioCapture]);

  const start = useCallback(async () => {
    try {
      console.log("Starting live session via WebSocket...");
      setTranscript([]);
      setState("recording");
      
      const ws = new WebSocket("ws://localhost:8000/api/v1/live-session/ws");
      wsRef.current = ws;
      
      ws.onopen = () => {
        console.log("WebSocket connected, waiting for session_started...");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("WebSocket message:", data);

        if (data.type === "session_started") {
          setSessionId(data.session_id);
          console.log("Session started:", data.session_id);
          
          speech.start();
          startAudioCapture();
        } else if (data.type === "transcript") {
          setTranscript((prev) => [
            ...prev,
            {
              text: data.text,
              source: data.source || "tab",
              timestamp: Date.now(),
              isFinal: true,
            },
          ]);
        } else if (data.type === "status") {
          if (data.state === "processing") {
            setState("processing");
          }
        } else if (data.type === "completed") {
          console.log("Session completed:", data.session_id);
          setState("completed");
          setTimeout(() => {
            router.push(`/session/${data.session_id}`);
          }, 1000);
        } else if (data.type === "error") {
          console.error("WebSocket error from server:", data.message);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket closed");
        wsRef.current = null;
      };
      
      console.log("Live session started successfully");
    } catch (error) {
      console.error("Failed to start live session:", error);
    }
  }, [speech, startAudioCapture, router]);

  const stop = useCallback(async () => {
    console.log("Stopping live session...");
    
    speech.stop();
    stopAudioCapture();
    
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log("Sending stop message via WebSocket");
      ws.send(JSON.stringify({ type: "stop" }));
      
      setState("processing");
    } else {
      console.warn("WebSocket not open, cannot send stop");
    }
  }, [speech, stopAudioCapture]);

  stopRef.current = stop;

  useEffect(() => {
    return () => {
      stopAudioCapture();
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [stopAudioCapture]);

  return {
    state,
    sessionId,
    transcript,
    audioLevel,
    silenceDuration: silenceDetector.silenceDuration,
    isSilent: silenceDetector.isSilent,
    start,
    stop,
  };
}

function floatToWav(float32Array: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + float32Array.length * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + float32Array.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, float32Array.length * 2, true);

  let offset = 44;
  for (let i = 0; i < float32Array.length; i++) {
    const sample = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    offset += 2;
  }

  return new Blob([buffer], { type: "audio/wav" });
}

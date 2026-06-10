"use client";

import { useState, useRef, useCallback } from "react";

interface AudioCaptureResult {
  audioLevel: number;
  isCapturing: boolean;
  startCapture: () => Promise<void>;
  stopCapture: () => void;
  getAudioChunk: () => string | null;
}

export function useAudioCapture(
  onChunkReady?: (base64Audio: string) => void
): AudioCaptureResult {
  const [audioLevel, setAudioLevel] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const chunkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioBufferRef = useRef<Float32Array[]>([]);
  const sampleRateRef = useRef(16000);

  const startCapture = useCallback(async () => {
    try {
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
            const base64 = btoa(String.fromCharCode(...uint8Array));
            onChunkReady?.(base64);
          };
          reader.readAsArrayBuffer(wavBlob);

          audioBufferRef.current = [];
        }
      }, 5000);

      setIsCapturing(true);
    } catch (error) {
      console.error("Failed to start audio capture:", error);
      throw error;
    }
  }, [onChunkReady]);

  const stopCapture = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (chunkIntervalRef.current) {
      clearInterval(chunkIntervalRef.current);
      chunkIntervalRef.current = null;
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
    setIsCapturing(false);
    setAudioLevel(0);
  }, []);

  const getAudioChunk = useCallback((): string | null => {
    if (audioBufferRef.current.length === 0) return null;

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
    reader.readAsArrayBuffer(wavBlob);

    audioBufferRef.current = [];

    return null;
  }, []);

  return {
    audioLevel,
    isCapturing,
    startCapture,
    stopCapture,
    getAudioChunk,
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

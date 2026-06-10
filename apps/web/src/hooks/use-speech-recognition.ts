"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface UseSpeechRecognitionReturn {
  interimTranscript: string;
  finalTranscript: string;
  isListening: boolean;
  isSupported: boolean;
  isAvailable: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const isListeningRef = useRef(false);
  const errorCountRef = useRef(0);
  const maxErrorsRef = useRef(3);
  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognitionCtor =
      (window as unknown as Record<string, new () => SpeechRecognitionInstance>).SpeechRecognition ||
      (window as unknown as Record<string, new () => SpeechRecognitionInstance>).webkitSpeechRecognition;

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      errorCountRef.current = 0;
      
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + " ";
        } else {
          interim += transcript;
        }
      }

      if (final) {
        setFinalTranscript((prev) => prev + final);
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.warn("Speech recognition error:", event.error);
      
      if (event.error === "network" || event.error === "service-not-allowed") {
        errorCountRef.current += 1;
        
        if (errorCountRef.current >= maxErrorsRef.current) {
          console.warn("Speech recognition disabled: too many network errors");
          setIsAvailable(false);
          setIsListening(false);
          isListeningRef.current = false;
          return;
        }
      }
      
      if (event.error !== "no-speech" && event.error !== "aborted") {
        setIsListening(false);
        isListeningRef.current = false;
      }
    };

    recognition.onend = () => {
      if (recognitionRef.current && isListeningRef.current && isAvailable) {
        try {
          recognition.start();
        } catch {
          setIsListening(false);
          isListeningRef.current = false;
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [isSupported, isAvailable]);

  const start = useCallback(() => {
    if (!recognitionRef.current || !isAvailable) return;
    setFinalTranscript("");
    setInterimTranscript("");
    errorCountRef.current = 0;
    try {
      recognitionRef.current.start();
      setIsListening(true);
      isListeningRef.current = true;
    } catch (err) {
      console.warn("Failed to start speech recognition:", err);
      setIsAvailable(false);
    }
  }, [isAvailable]);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsListening(false);
    isListeningRef.current = false;
    setInterimTranscript("");
  }, []);

  const reset = useCallback(() => {
    setFinalTranscript("");
    setInterimTranscript("");
  }, []);

  return {
    interimTranscript,
    finalTranscript,
    isListening,
    isSupported,
    isAvailable,
    start,
    stop,
    reset,
  };
}

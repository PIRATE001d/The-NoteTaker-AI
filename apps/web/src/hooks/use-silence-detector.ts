"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface SilenceDetectorResult {
  silenceDuration: number;
  isSilent: boolean;
  reset: () => void;
}

export function useSilenceDetector(
  audioLevel: number,
  threshold: number = 0.05,
  silenceTimeout: number = 45000,
  onSilenceReached?: () => void
): SilenceDetectorResult {
  const [silenceDuration, setSilenceDuration] = useState(0);
  const [isSilent, setIsSilent] = useState(false);
  const silenceStartRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (audioLevel > threshold) {
      silenceStartRef.current = null;
      setIsSilent(false);
      setSilenceDuration(0);
      hasTriggeredRef.current = false;
    } else {
      if (silenceStartRef.current === null) {
        silenceStartRef.current = Date.now();
      }

      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          if (silenceStartRef.current) {
            const elapsed = Date.now() - silenceStartRef.current;
            setSilenceDuration(elapsed);
            setIsSilent(true);

            if (elapsed >= silenceTimeout && !hasTriggeredRef.current) {
              hasTriggeredRef.current = true;
              onSilenceReached?.();
            }
          }
        }, 100);
      }
    }

    return () => {
      if (intervalRef.current && silenceStartRef.current === null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [audioLevel, threshold, silenceTimeout, onSilenceReached]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const reset = useCallback(() => {
    silenceStartRef.current = null;
    setSilenceDuration(0);
    setIsSilent(false);
    hasTriggeredRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  return {
    silenceDuration,
    isSilent,
    reset,
  };
}

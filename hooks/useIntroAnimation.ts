"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRive } from "@rive-app/react-canvas";

interface UseIntroAnimationOptions {
  src?: string;
  durationMs?: number; // Fallback duration in ms (default 2800ms)
  exitDurationMs?: number; // Exit transition duration (default 700ms)
  skipDelayMs?: number; // Delay before skip button shows (default 1000ms)
  sessionKey?: string; // Session storage key
}

export function useIntroAnimation({
  src = "/animations/maploadingscreen.riv",
  durationMs = 2800,
  exitDurationMs = 700,
  skipDelayMs = 1000,
  sessionKey = "hasSeenIntro",
}: UseIntroAnimationOptions = {}) {
  const [shouldShow, setShouldShow] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [riveLoaded, setRiveLoaded] = useState(false);
  const [riveError, setRiveError] = useState(false);

  const exitTimerRef = useRef<NodeJS.Timeout | null>(null);
  const completeRef = useRef(false);

  // 1. SessionStorage check on mount
  useEffect(() => {
    try {
      const hasSeen = sessionStorage.getItem(sessionKey);
      if (hasSeen === "true") {
        setShouldShow(false);
        setIsLoading(false);
      } else {
        setShouldShow(true);
      }
    } catch {
      // Fallback if sessionStorage is disabled/blocked
      setShouldShow(true);
    }
  }, [sessionKey]);

  // 2. Trigger Exit Animation
  const triggerExit = useCallback(() => {
    if (completeRef.current) return;
    completeRef.current = true;

    setProgress(100);
    setIsExiting(true);

    exitTimerRef.current = setTimeout(() => {
      setIsLoading(false);
      try {
        sessionStorage.setItem(sessionKey, "true");
      } catch {}
    }, exitDurationMs);
  }, [exitDurationMs, sessionKey]);

  // 3. Setup Rive Canvas Hook
  const { rive, RiveComponent } = useRive({
    src,
    autoplay: true,
    onLoad: () => {
      setRiveLoaded(true);
    },
    onLoadError: () => {
      setRiveError(true);
    },
  });

  // 4. Listen to Rive Events or Fallback Timer
  useEffect(() => {
    if (!shouldShow || !isLoading || completeRef.current) return;

    // Show skip button after skipDelayMs
    const skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, skipDelayMs);

    // Progress Bar Fill Interval
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(Math.round((elapsed / durationMs) * 100), 99);
      setProgress(currentProgress);
    }, 30);

    // Fallback or Duration Complete Timer
    const durationTimer = setTimeout(() => {
      clearInterval(progressInterval);
      triggerExit();
    }, durationMs);

    return () => {
      clearTimeout(skipTimer);
      clearInterval(progressInterval);
      clearTimeout(durationTimer);
    };
  }, [shouldShow, isLoading, durationMs, skipDelayMs, triggerExit]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, []);

  return {
    shouldShow,
    isLoading,
    isExiting,
    progress,
    showSkip,
    riveLoaded,
    riveError,
    RiveComponent,
    triggerExit,
  };
}

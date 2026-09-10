"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  useRive,
  useStateMachineInput,
  StateMachineInput,
  Layout,
  Fit,
  Alignment,
} from "@rive-app/react-canvas";

/**
 * TODO: SESUAIKAN DURASI ANIMASI ROKET / REVEAL DI RIVE (dalam milidetik).
 * Setelah durasi ini selesai (animasi mencapai frame akhir / layar hitam),
 * hook akan otomatis memicu triggerExit() untuk keluar dari intro.
 */
export const ROCKET_ANIMATION_DURATION_MS = 2800;

interface UseRiveIntroOptions {
  src?: string;
  sessionKey?: string;
  exitDurationMs?: number;
}

export function useRiveIntro({
  src = "/animations/maploadingscreen.riv",
  sessionKey = "hasSeenRiveIntro",
  exitDurationMs = 700,
}: UseRiveIntroOptions = {}) {
  const [mounted, setMounted] = useState(false);
  const [shouldShow, setShouldShow] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isLaunched, setIsLaunched] = useState(false);
  const [riveError, setRiveError] = useState(false);

  const autoExitTimerRef = useRef<NodeJS.Timeout | null>(null);

  const STATE_MACHINE_NAME = "State Machine 1";

  const FALLBACK_PATHS = [
    src,
    "/animations/maploadingscreen.riv",
    "/maploadingscreen.riv",
    "/9603-18296-maploadingscreen.riv",
    "/animations/9603-18296-maploadingscreen.riv",
  ];
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const activeSrc = FALLBACK_PATHS[currentPathIndex] || src;

  // 1. Session Storage check & Mounted state
  useEffect(() => {
    setMounted(true);
    try {
      const hasSeen = sessionStorage.getItem(sessionKey);
      if (hasSeen === "true") {
        setShouldShow(false);
        setIsLoading(false);
      } else {
        setShouldShow(true);
      }
    } catch {
      setShouldShow(true);
    }
  }, [sessionKey]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (autoExitTimerRef.current) {
        clearTimeout(autoExitTimerRef.current);
      }
    };
  }, []);

  // 2. Setup Rive Canvas with Fit.Cover Layout & "State Machine 1"
  const { rive, RiveComponent } = useRive({
    src: activeSrc,
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
    onLoadError: () => {
      if (currentPathIndex < FALLBACK_PATHS.length - 1) {
        setCurrentPathIndex((prev) => prev + 1);
      } else {
        setRiveError(true);
      }
    },
  });

  // 3. Connect Inputs from "State Machine 1"
  const inputStartLaunching = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "StartLaunching"
  );
  const inputOnButtonHover = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "OnButtonHover"
  );
  const inputOnButtonExit = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "OnButtonExit"
  );

  // Helper function safely firing Trigger or setting Boolean
  const fireInput = (input: StateMachineInput | null) => {
    if (!input) return;
    if (typeof input.fire === "function") {
      input.fire();
    } else if ("value" in input) {
      input.value = true;
      setTimeout(() => {
        if (input && "value" in input) input.value = false;
      }, 150);
    }
  };

  // 4. Action Handlers
  const handleButtonHover = useCallback(() => {
    fireInput(inputOnButtonHover);
  }, [inputOnButtonHover]);

  const handleButtonExit = useCallback(() => {
    fireInput(inputOnButtonExit);
  }, [inputOnButtonExit]);

  const triggerExit = useCallback(() => {
    if (autoExitTimerRef.current) {
      clearTimeout(autoExitTimerRef.current);
    }
    setIsExiting(true);
    try {
      sessionStorage.setItem(sessionKey, "true");
    } catch {}

    // Setelah exitDurationMs, set isLoading false agar parent & state konsisten
    setTimeout(() => {
      setIsLoading(false);
    }, exitDurationMs);
  }, [exitDurationMs, sessionKey]);

  const handleStartLaunch = useCallback(() => {
    if (isLaunching || isLaunched) return;
    setIsLaunching(true);
    fireInput(inputStartLaunching);

    // Otomatis panggil triggerExit() setelah animasi rocket Rive selesai
    autoExitTimerRef.current = setTimeout(() => {
      setIsLaunched(true);
      setIsLaunching(false);
      triggerExit();
    }, ROCKET_ANIMATION_DURATION_MS);
  }, [inputStartLaunching, isLaunching, isLaunched, triggerExit]);

  const resetIntro = useCallback(() => {
    if (autoExitTimerRef.current) {
      clearTimeout(autoExitTimerRef.current);
    }
    try {
      sessionStorage.removeItem(sessionKey);
    } catch {}
    setShouldShow(true);
    setIsLoading(true);
    setIsExiting(false);
    setIsLaunching(false);
    setIsLaunched(false);
  }, [sessionKey]);

  return {
    mounted,
    shouldShow,
    isLoading,
    isExiting,
    isLaunching,
    isLaunched,
    riveError,
    riveReady: !!rive,
    RiveComponent,
    handleButtonHover,
    handleButtonExit,
    handleStartLaunch,
    triggerExit,
    resetIntro,
  };
}

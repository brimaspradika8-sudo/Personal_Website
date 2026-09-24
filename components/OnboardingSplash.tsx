"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const OnboardingIntro = dynamic(() => import("@/components/OnboardingIntro"), {
  ssr: false,
});

const SESSION_KEY = "hasSeenOnboarding";

function shouldSkip(): boolean {
  if (typeof window === "undefined") return true;
  // prefers-reduced-motion → skip
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  // already seen this session → skip
  try {
    if (sessionStorage.getItem(SESSION_KEY) === "1") return true;
  } catch {
    /* noop */
  }
  return false;
}

export default function OnboardingSplash() {
  const router = useRouter();
  /**
   * null  = still detecting (avoid flash)
   * true  = show intro
   * false = skip straight to dashboard
   */
  const [showIntro, setShowIntro] = useState<boolean | null>(null);

  useEffect(() => {
    router.prefetch("/dashboard");
    setShowIntro(!shouldSkip());
  }, [router]);

  const handleIntroDone = () => {
    router.replace("/dashboard");
  };

  /* While detecting — render nothing (prevents blank flash) */
  if (showIntro === null) return null;

  /* Skip intro: navigate immediately */
  if (!showIntro) {
    router.replace("/dashboard");
    return null;
  }

  return <OnboardingIntro onDone={handleIntroDone} />;
}

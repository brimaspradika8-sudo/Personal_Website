"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const OnboardingIntro = dynamic(() => import("@/components/OnboardingIntro"), {
  ssr: false,
});

const SESSION_KEY = "hasSeenOnboarding";
const LEGACY_SESSION_KEY = "brimas_onboarding_seen";

function shouldSkip(): boolean {
  if (typeof window === "undefined") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;

  try {
    const seenBySession = window.sessionStorage.getItem(SESSION_KEY) === "1";
    const seenByLocal = window.localStorage.getItem(SESSION_KEY) === "1";
    const seenByLegacy = window.localStorage.getItem(LEGACY_SESSION_KEY) === "true";
    return seenBySession || seenByLocal || seenByLegacy;
  } catch {
    return false;
  }
}

export default function OnboardingSplash() {
  const router = useRouter();
  /**
   * null  = still detecting (avoid flash)
   * true  = show intro
   * false = skip straight to dashboard
   */
  const [showIntro] = useState<boolean | null>(() =>
    typeof window === "undefined" ? null : !shouldSkip()
  );

  useEffect(() => {
    router.prefetch("/dashboard");
  }, [router]);

  useEffect(() => {
    if (showIntro === false) {
      router.replace("/dashboard");
    }
  }, [showIntro, router]);

  const handleIntroDone = () => {
    router.replace("/dashboard");
  };

  if (showIntro === null) return null;
  if (!showIntro) return null;

  return <OnboardingIntro onDone={handleIntroDone} />;
}

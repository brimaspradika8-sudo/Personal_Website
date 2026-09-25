"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

// ─── Config ────────────────────────────────────────────────────────────────
const SESSION_KEY = "hasSeenOnboarding";
const LEGACY_SESSION_KEY = "brimas_onboarding_seen";

/** Desktop: original is 10 s — we cut at 9.3 s (drop HP mockup) */
const DESKTOP_END = 9.3;
/** Mobile:  original is 10 s — we cut at 8.0 s (logo B clear, drop title card) */
const MOBILE_END = 8.0;

/**
 * How many seconds before the cut-point we start the exit transition.
 * The "B" zoom-in happens in the last ~1 s of each clip, so we begin at -1.0 s.
 */
const LEAD_OUT = 1.0;

// ─── Types ──────────────────────────────────────────────────────────────────
type Phase = "playing" | "transitioning" | "done";

// ─── Helpers ────────────────────────────────────────────────────────────────
function markSeen(): void {
  try {
    window.sessionStorage.setItem(SESSION_KEY, "1");
    window.localStorage.setItem(SESSION_KEY, "1");
    window.localStorage.setItem(LEGACY_SESSION_KEY, "true");
  } catch {
    /* noop */
  }
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function OnboardingIntro({
  onDone,
}: {
  /** Called once the overlay is fully gone so the parent can unmount it. */
  onDone: () => void;
}) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [phase, setPhase] = useState<Phase>("playing");
  const [showSkip, setShowSkip] = useState(false);
  const [isMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  const triggeredRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "transitioning") return;

    router.prefetch("/dashboard");
    const transitionTimer = window.setTimeout(() => {
      router.replace("/dashboard");
    }, 150);

    return () => window.clearTimeout(transitionTimer);
  }, [phase, router]);

  const triggerExit = useCallback(() => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;
    markSeen();
    setPhase("transitioning");
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const vid = videoRef.current;
    if (!vid || triggeredRef.current) return;
    const cutPoint = isMobile ? MOBILE_END : DESKTOP_END;
    if (vid.currentTime >= cutPoint - LEAD_OUT) {
      triggerExit();
    }
  }, [isMobile, triggerExit]);

  const handleEnded = useCallback(() => {
    triggerExit();
  }, [triggerExit]);

  const handleError = useCallback(() => {
    triggerExit();
  }, [triggerExit]);

  const handleTransitionEnd = useCallback(() => {
    setPhase("done");
    onDone();
  }, [onDone]);

  const videoSrc = isMobile ? "/onboarding-mobile.mp4" : "/onboarding-desktop.mp4";
  const posterSrc = "/icon.webp";
  const TRANS_DURATION = 0.6;

  return (
    <AnimatePresence onExitComplete={handleTransitionEnd}>
      {phase !== "done" && (
        <motion.div
          key="onboarding-overlay"
          className="fixed inset-0 z-[9999] overflow-hidden bg-transparent"
          initial={{ opacity: 1, scale: 1 }}
          animate={
            phase === "transitioning"
              ? { opacity: 0, scale: 1.12 }
              : { opacity: 1, scale: 1 }
          }
          transition={{
            duration: TRANS_DURATION,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <video
            ref={videoRef}
            key={videoSrc}
            className="h-full w-full object-cover"
            autoPlay
            muted
            playsInline
            preload="auto"
            poster={posterSrc}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onError={handleError}
            aria-label="Intro animation"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>

          <AnimatePresence>
            {showSkip && phase === "playing" && (
              <motion.button
                key="skip-btn"
                type="button"
                onClick={triggerExit}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-white/30 bg-black/25 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm transition hover:bg-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                aria-label="Lewati intro"
              >
                <X className="h-3 w-3 opacity-80" />
                Lewati
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const ONBOARDING_KEY = "brimas_onboarding_seen";
const TRIGGER_AT_SECONDS = 8.0;
const TRANSITION_DELAY_MS = 180;

export default function OnboardingSplash() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const transitionLockedRef = useRef(false);

  const [videoSource, setVideoSource] = useState<string | null>(null);
  const [showStaticFallback, setShowStaticFallback] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const finishOnboarding = useCallback(() => {
    if (transitionLockedRef.current) return;
    transitionLockedRef.current = true;

    if (typeof window !== "undefined") {
      localStorage.setItem(ONBOARDING_KEY, "true");
    }

    setIsTransitioning(true);

    window.setTimeout(() => {
      router.push("/dashboard");
    }, TRANSITION_DELAY_MS);
  }, [router]);

  useEffect(() => {
    router.prefetch("/dashboard");

    if (typeof window === "undefined") return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const shouldReduceMotion = reducedMotionQuery.matches;

    const alreadySeen = localStorage.getItem(ONBOARDING_KEY) === "true";
    if (alreadySeen) {
      router.replace("/dashboard");
      return;
    }

    if (shouldReduceMotion) {
      setShowStaticFallback(true);
      const timer = window.setTimeout(() => {
        finishOnboarding();
      }, 1000);

      return () => window.clearTimeout(timer);
    }

    const isMobileViewport = window.innerWidth < 768;
    setVideoSource(isMobileViewport ? "/videos/onboarding-mobile.mp4" : "/videos/onboarding-desktop.mp4");
  }, [finishOnboarding, router]);

  useEffect(() => {
    if (!videoRef.current || !videoSource) return;

    const video = videoRef.current;

    const handleTimeUpdate = () => {
      // Timing target: roughly when the stylized "B" reaches full-screen zoom.
      // Adjust this number after preview in-browser if the impact feels slightly early/late.
      if (video.currentTime >= TRIGGER_AT_SECONDS) {
        finishOnboarding();
      }
    };

    const handleEnded = () => {
      finishOnboarding();
    };

    const handleVideoError = () => {
      window.setTimeout(() => {
        finishOnboarding();
      }, 500);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleVideoError);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleVideoError);
    };
  }, [finishOnboarding, videoSource]);

  const handleSkip = () => {
    finishOnboarding();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black">
      <button
        type="button"
        onClick={handleSkip}
        className="absolute right-4 top-4 z-20 rounded-full border border-white/30 bg-black/20 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.24em] text-white/85 backdrop-blur-sm transition hover:bg-black/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
        aria-label="Skip onboarding"
      >
        Skip
      </button>

      {videoSource && !showStaticFallback ? (
        <video
          ref={videoRef}
          key={videoSource}
          src={videoSource}
          autoPlay
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
          onError={() => {
            window.setTimeout(() => {
              finishOnboarding();
            }, 500);
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-black text-white">
          <div className="select-none text-[18rem] font-black leading-none tracking-[-0.14em] sm:text-[24rem]">
            B
          </div>
        </div>
      )}

      <div
        className={[
          "pointer-events-none absolute inset-0 bg-white transition-all duration-200 ease-out",
          isTransitioning ? "opacity-100 scale-105" : "opacity-0 scale-100",
        ].join(" ")}
      />
    </div>
  );
}

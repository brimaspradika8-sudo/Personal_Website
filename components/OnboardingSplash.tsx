"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const ONBOARDING_KEY = "brimas_onboarding_seen";
const TRANSITION_DELAY_MS = 1100;
const VIDEO_ERROR_REDIRECT_DELAY_MS = 2500;
const ONBOARDING_DURATION_MS = 9800;

export default function OnboardingSplash() {
  const router = useRouter();
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

    const resolvedSource = window.innerWidth < 768
      ? "/Mobile_app_onboarding_animation_20260924081709 (1).gif"
      : "/Minimalist_app_onboarding_animation_20260924081242 (1).gif";
    setVideoSource(resolvedSource);
  }, [finishOnboarding, router]);

  useEffect(() => {
    if (!videoSource) return;

    const timer = window.setTimeout(() => {
      finishOnboarding();
    }, ONBOARDING_DURATION_MS);

    return () => window.clearTimeout(timer);
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
        videoSource.toLowerCase().endsWith(".gif") ? (
          <Image
            key={videoSource}
            src={videoSource}
            alt="Onboarding animation"
            width={1440}
            height={900}
            priority
            unoptimized
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            key={videoSource}
            autoPlay
            muted
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
            onError={(event) => {
              const element = event.currentTarget;
              console.error("[onboarding] video error:", element.error?.code, element.error?.message, element.currentSrc);
              window.setTimeout(() => {
                finishOnboarding();
              }, VIDEO_ERROR_REDIRECT_DELAY_MS);
            }}
          >
            <source src={videoSource} type="video/mp4" />
          </video>
        )
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-black text-white">
          <div className="select-none text-[18rem] font-black leading-none tracking-[-0.14em] sm:text-[24rem]">
            B
          </div>
        </div>
      )}

      <div
        className={[
          "pointer-events-none absolute inset-0 bg-white transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          isTransitioning ? "opacity-100 scale-[1.24]" : "opacity-0 scale-100",
        ].join(" ")}
      />
    </div>
  );
}

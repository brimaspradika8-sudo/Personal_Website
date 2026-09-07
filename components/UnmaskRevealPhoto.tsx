"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { soundFx } from "@/lib/audio/sound";
import { Sparkles, RefreshCw } from "lucide-react";

interface UnmaskRevealPhotoProps {
  maskedSrc?: string;
  realSrc?: string;
  alt?: string;
  className?: string;
  durationMs?: number;
}

export default function UnmaskRevealPhoto({
  maskedSrc = "/images/image-masked.png",
  realSrc = "/images/avatar.png",
  alt = "Brimas Pradika Utama",
  className = "",
  durationMs = 1200,
}: UnmaskRevealPhotoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealPct, setRevealPct] = useState(0); // 0 (Fully Masked) -> 115 (Fully Unmasked)
  const animRef = useRef<number | null>(null);
  const currentPctRef = useRef(0);
  const hasAutoPlayedRef = useRef(false);

  const animateTo = (targetPct: number, targetRevealedState: boolean) => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
    }
    soundFx.playClick();
    setIsRevealed(targetRevealedState);

    const startPct = currentPctRef.current;
    const startTime = performance.now();
    const duration = durationMs;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out curve
      const ease = 1 - Math.pow(1 - progress, 3);
      const nextPct = startPct + (targetPct - startPct) * ease;

      currentPctRef.current = nextPct;
      setRevealPct(nextPct);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        currentPctRef.current = targetPct;
        setRevealPct(targetPct);
      }
    };

    animRef.current = requestAnimationFrame(step);
  };

  const toggleUnmask = () => {
    const nextRevealed = !isRevealed;
    const targetPct = nextRevealed ? 115 : 0;
    animateTo(targetPct, nextRevealed);
  };

  // Intersection Observer to trigger entrance unmask animation once
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAutoPlayedRef.current) {
            hasAutoPlayedRef.current = true;
            setTimeout(() => {
              animateTo(115, true);
            }, 300);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Compute clean polygon clip path for the Spider-Man mask layer
  const getClipPath = (pct: number) => {
    if (pct <= 0) return "none";
    return `polygon(
      0% ${pct}%,
      8% ${pct + 2.5}%,
      18% ${pct - 2}%,
      30% ${pct + 3}%,
      42% ${pct - 2.5}%,
      55% ${pct + 3.5}%,
      68% ${pct - 2}%,
      80% ${pct + 2.5}%,
      92% ${pct - 1.5}%,
      100% ${pct}%,
      100% 100%,
      0% 100%
    )`;
  };

  return (
    <div
      ref={containerRef}
      onClick={toggleUnmask}
      className={`relative w-full h-full overflow-hidden rounded-2xl cursor-pointer select-none group border border-white/10 shadow-2xl bg-black/20 ${className}`}
      title="Klik untuk mentrigger animasi Spider-Man Unmasking!"
    >
      {/* BASE LAYER (BOTTOM): Real Photo */}
      <div className="relative w-full h-full z-0 overflow-hidden pointer-events-none">
        <Image
          src={realSrc}
          alt={`${alt} - Real Photo`}
          fill
          priority
          unoptimized
          sizes="(max-width: 768px) 380px, 460px"
          className="object-cover object-center w-full h-full pointer-events-none transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* OVERLAY LAYER (TOP): Spider-Man Costume Mask */}
      <div
        className="absolute inset-0 z-10 w-full h-full overflow-hidden pointer-events-none will-change-[clip-path]"
        style={{
          clipPath: getClipPath(revealPct),
        }}
      >
        <Image
          src={maskedSrc}
          alt={`${alt} - Spider-Man Suit`}
          fill
          priority
          unoptimized
          sizes="(max-width: 768px) 380px, 460px"
          className="object-cover object-center w-full h-full pointer-events-none drop-shadow-2xl brightness-105 contrast-110"
        />
      </div>

      {/* DRAMATIC RED NANOTECH ENERGY LINE (GLOW BOUNDARY) */}
      {revealPct > 1 && revealPct < 108 && (
        <div
          className="absolute left-0 right-0 z-20 pointer-events-none transform -translate-y-1/2"
          style={{ top: `${Math.min(revealPct, 100)}%` }}
        >
          <div className="w-full h-2 bg-gradient-to-r from-transparent via-[#DC2626] to-transparent shadow-[0_0_15px_#DC2626,0_0_25px_#F5B301] animate-pulse" />
          <div className="w-full h-0.5 bg-white shadow-[0_0_10px_#FFFFFF]" />
        </div>
      )}

      {/* INTERACTIVE UNMASK BADGE BUTTON */}
      <div className="absolute top-3 right-3 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleUnmask();
          }}
          className="px-3.5 py-1.5 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 border border-white/30"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F5B301] animate-spin" />
          <span>{isRevealed ? "RE-MASK" : "UNMASK"}</span>
          <RefreshCw className="w-3 h-3 text-white/80" />
        </button>
      </div>
    </div>
  );
}

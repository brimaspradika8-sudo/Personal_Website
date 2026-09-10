"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRiveIntro } from "@/hooks/useRiveIntro";
import { ArrowRight, Rocket, Loader2 } from "lucide-react";

interface IntroLoaderProps {
  /** Path file Rive animation (.riv) */
  animationSrc?: string;
  /** Durasi animasi transisi keluar Framer Motion (ms) */
  exitDurationMs?: number;
  /** Callback saat intro selesai sepenuhnya (misal untuk router.push("/dashboard")) */
  onComplete?: () => void;
}

export default function IntroLoader({
  animationSrc = "/animations/maploadingscreen.riv",
  exitDurationMs = 700,
  onComplete,
}: IntroLoaderProps) {
  const {
    mounted,
    shouldShow,
    isLoading,
    isExiting,
    isLaunching,
    isLaunched,
    riveError,
    riveReady,
    RiveComponent,
    handleButtonHover,
    handleButtonExit,
    handleStartLaunch,
    triggerExit,
  } = useRiveIntro({
    src: animationSrc,
    exitDurationMs,
    sessionKey: "hasSeenRiveIntro",
  });

  // Ref untuk melacak apakah user sudah klik peluncuran
  const hasLaunchedRef = useRef(false);

  // Safety fallback button state: muncul jika 5 detik setelah launch diklik / error
  const [showSafetyFallback, setShowSafetyFallback] = useState(false);

  // Handler klik peluncuran (mendukung 100% area klik layar)
  const onLaunchClick = () => {
    if (hasLaunchedRef.current || isLaunching || isLaunched) return;
    hasLaunchedRef.current = true;
    handleStartLaunch();

    setTimeout(() => {
      setShowSafetyFallback(true);
    }, 5000);
  };

  // 1. AUTO-START FALLBACK (4 DETIK) & GLOBAL SAFETY TIMEOUT (8 DETIK)
  useEffect(() => {
    if (!mounted || shouldShow === false) return;

    // Auto-Start Fallback (4 Detik): Jika user belum klik dalam 4 detik, luncurkan otomatis
    const autoStartTimer = setTimeout(() => {
      if (!hasLaunchedRef.current && !isLaunching && !isLaunched) {
        hasLaunchedRef.current = true;
        handleStartLaunch();
      }
    }, 4000);

    // Global Safety Timeout (8 Detik): Paksa triggerExit() dipanggil apa pun yang terjadi
    const globalSafetyTimer = setTimeout(() => {
      triggerExit();
    }, 8000);

    return () => {
      clearTimeout(autoStartTimer);
      clearTimeout(globalSafetyTimer);
    };
  }, [mounted, shouldShow, isLaunching, isLaunched, handleStartLaunch, triggerExit]);

  // Jangan render apapun jika belum ter-mount pada client side (SSR pass) atau loading sudah selesai (DAN tidak sedang proses exit)
  if (!mounted || shouldShow === false || (!isLoading && !isExiting)) {
    return null;
  }

  return (
    <AnimatePresence
      onExitComplete={() => {
        // TUNGGAL & SINKRON: Panggil onComplete HANYA dari sini saat exit animation selesai
        if (onComplete) {
          onComplete();
        }
      }}
    >
      {!isExiting && (
        <motion.div
          key="rive-full-bleed-intro"
          initial={{ opacity: 1, scale: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: "blur(12px)",
          }}
          transition={{
            duration: exitDurationMs / 1000,
            ease: [0.4, 0, 0.2, 1],
          }}
          aria-live="polite"
          role="status"
          className="fixed inset-0 w-screen h-screen z-[9999] bg-black text-white select-none overflow-hidden touch-none"
        >
          {/* 1. RIVE FULL-BLEED CANVAS */}
          {!riveError ? (
            <div className="relative w-full h-full">
              <RiveComponent className="w-full h-full object-cover" />

              {/* Minimal Spinner saat Rive canvas sedang mempersiapkan render */}
              {!riveReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#12160F] z-10 pointer-events-none">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-[#DC2626] animate-spin" />
                    <span className="font-mono text-xs text-[#F1EFE9]/50 tracking-widest uppercase">
                      Memuat Animasi...
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* FALLBACK INTRO HTML/CSS (Jika Rive .riv gagal load) */
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#12160F] to-black space-y-6">
              <div className="w-20 h-20 rounded-full bg-[#DC2626]/20 border border-[#DC2626]/40 flex items-center justify-center text-[#DC2626] animate-pulse">
                <Rocket className="w-10 h-10" />
              </div>
              <div className="space-y-2 max-w-md">
                <h2 className="font-display text-3xl font-black uppercase text-[#F1EFE9] tracking-tight">
                  Personal Website
                </h2>
                <p className="text-xs text-[#F1EFE9]/60 font-mono">
                  Brimas Pradika Utama
                </p>
              </div>
              <button
                onClick={triggerExit}
                className="px-6 py-3 rounded-full bg-[#DC2626] hover:bg-[#b91c1c] text-[#F1EFE9] font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#DC2626]/40 transition-all cursor-pointer flex items-center gap-2 z-[10001] pointer-events-auto"
              >
                <span>Masuk ke Website</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 2. AREA KLIK SELURUH LAYAR (100% x 100%) UTK MEMULAI LAUNCH — BULLETPROOF */}
          {!isLaunched && !riveError && (
            <div
              onClick={onLaunchClick}
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonExit}
              role="button"
              tabIndex={0}
              aria-label="Klik di mana saja untuk Start Launching Animasi Rive"
              className={`absolute inset-0 z-20 w-full h-full bg-transparent cursor-pointer ${
                isLaunching ? "pointer-events-none opacity-50" : ""
              }`}
              title="Klik di mana saja untuk meluncurkan animasi"
            />
          )}


          {/* 4. SAFETY FALLBACK BUTTON (MUNCUL JIKA STUCK > 5 DETIK / ERROR) */}
          {(showSafetyFallback || riveError) && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[10001] pointer-events-auto">
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={triggerExit}
                className="px-6 py-3 rounded-full bg-[#DC2626] hover:bg-[#b91c1c] text-[#F1EFE9] font-mono font-bold text-xs uppercase tracking-wider shadow-2xl shadow-[#DC2626]/50 transition-all cursor-pointer inline-flex items-center gap-2 border border-[#2A2F26]"
              >
                <span>Masuk ke Website</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

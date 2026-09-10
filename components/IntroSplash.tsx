"use client";

import { useEffect, useState } from "react";
import { Terminal, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { soundFx } from "@/lib/audio/sound";

interface IntroSplashProps {
  onComplete: () => void;
  ownerName?: string;
}

export default function IntroSplash({ onComplete, ownerName = "BRIMAS PRADIKA UTAMA" }: IntroSplashProps) {
  const [progress, setProgress] = useState(0);
  const [bootStep, setBootStep] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const bootLogs = [
    "INITIALIZING SYSTEM ARCHITECTURE...",
    "CONNECTING SUPABASE & PRISMA ORM DATABASE...",
    "LOADING AI AGENT WORKFLOW ENGINE...",
    "MOUNTING INTERACTIVE 3D LANYARD & CANVAS...",
    "SYSTEM READY • WELCOME TO PORTFOLIO HUB",
  ];

  useEffect(() => {
    try {
      soundFx.playClick();
    } catch {}

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const inc = Math.floor(Math.random() * 8) + 4;
        const next = Math.min(100, prev + inc);
        
        if (next >= 85) setBootStep(4);
        else if (next >= 65) setBootStep(3);
        else if (next >= 40) setBootStep(2);
        else if (next >= 20) setBootStep(1);
        
        return next;
      });
    }, 90);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        handleFinish();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  const handleFinish = () => {
    try {
      soundFx.playClick();
    } catch {}
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 700);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#FAFAFA] text-[#1A1A1A] flex flex-col justify-between p-6 sm:p-12 overflow-hidden transition-all duration-700 selection:bg-[#DC2626] selection:text-white ${
        isFadingOut ? "opacity-0 scale-105 pointer-events-none filter blur-sm" : "opacity-100 scale-100"
      }`}
    >
      {/* Background Animated Subtle Glow Grids */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Top Header Controls */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-black/70">
          <Terminal className="w-4 h-4 text-[#DC2626] animate-pulse" />
          <span className="font-bold tracking-wider text-black">SYSTEM BOOT SEQUENCE</span>
          <span className="text-black/40">v2.4</span>
        </div>

        <button
          onClick={handleFinish}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-black/5 hover:bg-[#DC2626] text-black hover:text-white text-xs font-mono transition-all cursor-pointer border border-black/15 hover:border-[#DC2626] shadow-sm group"
        >
          <span>LEWATI INTRO</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Centerpiece Hero Emblem & Title */}
      <div className="relative z-10 max-w-2xl mx-auto w-full text-center space-y-8 my-auto">
        
        {/* Animated Spiderman-Tech Glowing Badge Logo */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto flex items-center justify-center">
          {/* Pulsing Outer Rings */}
          <div className="absolute -inset-4 rounded-full border border-[#DC2626]/30 animate-ping opacity-40" />
          <div className="absolute -inset-2 rounded-full border-2 border-dashed border-[#DC2626]/50 animate-spin" style={{ animationDuration: "12s" }} />
          
          <div className="w-full h-full rounded-full bg-[#DC2626] flex items-center justify-center text-white font-black text-3xl sm:text-4xl shadow-xl shadow-[#DC2626]/40 border-2 border-white">
            B
          </div>
        </div>

        {/* Dynamic Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#DC2626]/10 border border-[#DC2626]/30 text-[#DC2626] text-xs font-mono font-bold uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5" />
            <span>AI SYSTEMS DEVELOPER</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#1A1A1A] leading-none">
            {ownerName}
          </h1>

          <p className="text-xs sm:text-sm font-mono text-black/60">
            SMK Bhakti Mulia Pare &bull; Interactive Web &amp; Intelligent Systems
          </p>
        </div>

        {/* Boot Logs Terminal Line */}
        <div className="h-10 px-4 py-2 rounded-xl bg-white border border-black/10 text-xs font-mono text-emerald-600 flex items-center justify-center gap-2 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <span className="truncate font-semibold">{bootLogs[bootStep]}</span>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-2 max-w-md mx-auto">
          <div className="flex items-center justify-between text-xs font-mono text-black/70">
            <span>LOADING MODULES</span>
            <span className="font-bold text-[#DC2626]">{progress}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden p-0.5 border border-black/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#DC2626] via-red-500 to-emerald-500 transition-all duration-150 shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

      </div>

      {/* Footer System Status */}
      <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-black/40 border-t border-black/10 pt-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>SECURITY STATUS: ENCRYPTED</span>
        </div>

        <span>© {new Date().getFullYear()} BRIMAS PRADIKA UTAMA</span>
      </div>
    </div>
  );
}

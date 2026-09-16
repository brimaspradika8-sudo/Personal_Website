"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { soundFx } from "@/lib/audio/sound";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function BackToTop() {
  const { lang } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    try {
      soundFx.playClick();
    } catch {}
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Kembali ke atas"
      className="fixed bottom-24 sm:bottom-8 right-6 z-40 px-3.5 py-2.5 rounded-none bg-[#FFFF00] text-black border-3 border-black dark:border-white font-mono font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
    >
      <ArrowUp className="w-4 h-4 text-black animate-bounce" />
      <span>{lang === "id" ? "KEMBALI KE ATAS" : "BACK TO TOP"}</span>
    </button>
  );
}

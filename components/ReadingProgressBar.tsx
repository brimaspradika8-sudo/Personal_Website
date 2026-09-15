"use client";

import { useEffect, useState } from "react";

export default function ReadingProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 z-[100] h-2 bg-slate-900/10 dark:bg-white/10 pointer-events-none">
      <div
        className="h-full bg-[#DC2626] border-r-2 border-slate-900 dark:border-white transition-all duration-75 ease-out shadow-[0_2px_4px_rgba(220,38,38,0.5)]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}

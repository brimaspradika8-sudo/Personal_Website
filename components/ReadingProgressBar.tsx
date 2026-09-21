"use client";

import { useEffect, useRef } from "react";

export default function ReadingProgressBar() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId = 0;
    const updateScrollCompletion = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        const scrollHeight = document.body.scrollHeight - window.innerHeight;
        const completion = scrollHeight > 0 ? Math.min(1, window.scrollY / scrollHeight) : 0;
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${completion})`;
        }
        frameId = 0;
      });
    };

    window.addEventListener("scroll", updateScrollCompletion);
    window.addEventListener("resize", updateScrollCompletion);
    updateScrollCompletion();
    return () => {
      window.removeEventListener("scroll", updateScrollCompletion);
      window.removeEventListener("resize", updateScrollCompletion);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1.5 bg-neutral-200 dark:bg-neutral-900 border-b border-black dark:border-white pointer-events-none">
      <div
        ref={progressRef}
        className="h-full bg-[#FFFF00] transition-all duration-75 shadow-[0_0_8px_rgba(255,255,0,0.8)]"
        style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
      />
    </div>
  );
}

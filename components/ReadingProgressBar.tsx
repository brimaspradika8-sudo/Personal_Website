"use client";

import { useEffect, useState } from "react";

export default function ReadingProgressBar() {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const updateScrollCompletion = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setCompletion(Number((currentProgress / scrollHeight).toFixed(3)) * 100);
      }
    };

    window.addEventListener("scroll", updateScrollCompletion);
    return () => window.removeEventListener("scroll", updateScrollCompletion);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1.5 bg-neutral-200 dark:bg-neutral-900 border-b border-black dark:border-white pointer-events-none">
      <div
        className="h-full bg-[#FFFF00] transition-all duration-75 shadow-[0_0_8px_rgba(255,255,0,0.8)]"
        style={{ width: `${completion}%` }}
      />
    </div>
  );
}

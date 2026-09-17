"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { soundFx } from "@/lib/audio/sound";

export function parseProjectImages(thumbnail?: string | null): string[] {
  if (!thumbnail) return [];
  try {
    if (thumbnail.trim().startsWith("[")) {
      const parsed = JSON.parse(thumbnail);
      if (Array.isArray(parsed)) {
        const filtered = parsed.filter((img) => typeof img === "string" && img.trim() !== "");
        if (filtered.length > 0) return filtered;
      }
    }
    if (thumbnail.includes(",")) {
      const split = thumbnail.split(",").map((s) => s.trim()).filter(Boolean);
      if (split.length > 0) return split;
    }
  } catch {}
  return [thumbnail.trim()];
}

interface ProjectImageCarouselProps {
  thumbnail?: string | null;
  title: string;
  className?: string;
  aspectRatioClass?: string;
}

export default function ProjectImageCarousel({
  thumbnail,
  title,
  className = "",
  aspectRatioClass = "h-48 sm:h-52",
}: ProjectImageCarouselProps) {
  const images = parseProjectImages(thumbnail);
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayImages = images.length > 0 ? images : ["/images/project1.png"];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playClick();
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playClick();
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    soundFx.playClick();
    setCurrentIndex(index);
  };

  return (
    <div className={`relative w-full overflow-hidden bg-black ${aspectRatioClass} ${className}`}>
      {/* Current Active Image */}
      <Image
        src={displayImages[currentIndex]}
        alt={`${title} - image ${currentIndex + 1}`}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        unoptimized
        className="object-cover transition-opacity duration-300"
      />

      {/* Counter Badge if multiple images */}
      {displayImages.length > 1 && (
        <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-black/80 text-[#FFFF00] border border-black text-[10px] font-mono font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          {currentIndex + 1} / {displayImages.length}
        </div>
      )}

      {/* Navigation Arrows if multiple images */}
      {displayImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-black/80 text-white hover:bg-[#FFFF00] hover:text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
            title="Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4 stroke-[3]" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-black/80 text-white hover:bg-[#FFFF00] hover:text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
            title="Berikutnya"
          >
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>

          {/* Carousel Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-xs rounded-none border border-black">
            {displayImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => handleDotClick(e, idx)}
                className={`w-2 h-2 rounded-none transition-all cursor-pointer border border-black ${
                  currentIndex === idx ? "bg-[#FFFF00] scale-125" : "bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

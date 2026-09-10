"use client";

import React from "react";
import Image from "next/image";

interface UnmaskRevealPhotoProps {
  maskedSrc?: string;
  realSrc?: string;
  alt?: string;
  className?: string;
  durationMs?: number;
}

export default function UnmaskRevealPhoto({
  realSrc = "/images/avatar.webp",
  alt = "Brimas Pradika Utama",
  className = "",
}: UnmaskRevealPhotoProps) {
  return (
    <div
      className={`relative w-full h-full select-none group rounded-3xl overflow-hidden shadow-2xl border border-white/10 ${className}`}
    >
      {/* PHOTO CONTAINER WITH SLEEK DARK BACKDROP & SMOOTH SHADOW */}
      <div className="relative w-full h-full z-0 overflow-hidden pointer-events-none bg-[#12160F] flex items-center justify-center p-3">
        <Image
          src={realSrc}
          alt={alt}
          fill
          priority
          unoptimized
          sizes="(max-width: 768px) 380px, 460px"
          className="object-cover object-center w-full h-full pointer-events-none transition-transform duration-700 group-hover:scale-105 rounded-2xl"
        />
      </div>
    </div>
  );
}

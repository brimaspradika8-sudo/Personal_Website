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
      className={`relative w-full h-full select-none group ${className}`}
    >
      {/* REAL PHOTO ONLY (NO CARD FRAME OR BORDER) */}
      <div className="relative w-full h-full z-0 overflow-hidden pointer-events-none">
        <Image
          src={realSrc}
          alt={alt}
          fill
          priority
          unoptimized
          sizes="(max-width: 768px) 380px, 460px"
          className="object-cover object-center w-full h-full pointer-events-none transition-transform duration-700 group-hover:scale-105"
        />
      </div>
    </div>
  );
}

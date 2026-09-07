"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { soundFx } from "@/lib/audio/sound";
import { Sparkles } from "lucide-react";

interface InteractiveCharacterProps {
  avatarSrc: string;
  name: string;
}

export default function InteractiveCharacter({ avatarSrc, name }: InteractiveCharacterProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [hairAnimating, setHairAnimating] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || hairAnimating) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Subtle 3D Tilt calculation (max 12 deg)
    const rotateX = -(y / (rect.height / 2)) * 12;
    const rotateY = (x / (rect.width / 2)) * 12;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const triggerHairBounce = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (hairAnimating) return;

    soundFx.playClick();
    setHairAnimating(true);

    // Create playful sparkles around the hair top
    const newSparkle = {
      id: Date.now(),
      x: Math.random() * 80 + 10,
      y: Math.random() * 30 + 5,
    };
    setSparkles((prev) => [...prev.slice(-4), newSparkle]);

    setTimeout(() => {
      setHairAnimating(false);
    }, 800);
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      
      {/* Interactive Tooltip Hint */}
      <div className="absolute -top-9 z-30 transition-all duration-300 opacity-90 hover:opacity-100">
        <button
          type="button"
          onClick={triggerHairBounce}
          className="px-3 py-1 rounded-full bg-[#1A211A]/90 border border-[#3B5D42]/60 text-[#F1EFE9] text-[11px] font-mono shadow-xl flex items-center gap-1.5 cursor-pointer hover:border-[#A6532D] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#A6532D] animate-spin" />
          <span>Klik rambut untuk interaksi! ✨</span>
        </button>
      </div>

      {/* Main 3D Card Container */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={triggerHairBounce}
        className="relative w-64 h-80 sm:w-72 sm:h-[400px] md:w-80 md:h-[440px] rounded-3xl overflow-hidden border-2 border-[#3B5D42]/60 bg-[#1A211A]/80 backdrop-blur-md shadow-2xl cursor-pointer group select-none transition-transform duration-200 ease-out"
        style={{
          transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(${
            isHovered ? 1.03 : 1
          }, ${isHovered ? 1.03 : 1}, 1)`,
        }}
      >
        {/* Floating Sparkles Effect */}
        {sparkles.map((sp) => (
          <div
            key={sp.id}
            className="absolute z-30 pointer-events-none animate-ping text-[#A6532D]"
            style={{ left: `${sp.x}%`, top: `${sp.y}%` }}
          >
            ✦
          </div>
        ))}

        {/* Top Hair Hotspot Trigger */}
        <div
          onClick={triggerHairBounce}
          onTouchStart={triggerHairBounce}
          className="absolute top-0 inset-x-0 h-1/3 z-20 cursor-pointer group-hover:bg-[#A6532D]/10 transition-colors flex justify-center pt-2"
          title="Klik/Tap Rambut untuk Bounce!"
        >
          <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-[#F1EFE9] bg-[#12160F]/80 px-2 py-0.5 rounded border border-[#3B5D42] h-fit">
            hair zone
          </div>
        </div>

        {/* Animated Avatar Image Layer with Hair Bounce Transform */}
        <div
          className={`relative w-full h-full transition-all duration-500 ease-spring ${
            hairAnimating ? "animate-hair-bounce" : ""
          }`}
        >
          <Image
            src={avatarSrc}
            alt={name}
            fill
            priority
            sizes="(max-width: 768px) 280px, 320px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Inset Vignette & Edge Glow Overlay */}
        <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_50px_15px_rgba(18,22,15,0.65)] pointer-events-none z-10 border border-[#2A2F26]/40" />

        {/* Subtle Ember Glow on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12160F] via-transparent to-transparent opacity-60 pointer-events-none z-10" />

      </div>

    </div>
  );
}

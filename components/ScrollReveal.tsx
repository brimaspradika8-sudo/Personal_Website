"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "zoom" | "fade";
  delayMs?: number;
  durationMs?: number;
  className?: string;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  direction = "up",
  delayMs = 0,
  durationMs = 700,
  className = "",
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  // Initial hidden transform styles
  const getInitialTransform = () => {
    switch (direction) {
      case "up":
        return "translate3d(0, 40px, 0)";
      case "down":
        return "translate3d(0, -40px, 0)";
      case "left":
        return "translate3d(40px, 0, 0)";
      case "right":
        return "translate3d(-40px, 0, 0)";
      case "zoom":
        return "scale(0.92) translate3d(0, 20px, 0)";
      case "fade":
        return "translate3d(0, 0, 0)";
      default:
        return "translate3d(0, 40px, 0)";
    }
  };

  return (
    <div
      ref={ref}
      className={`will-change-transform ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate3d(0, 0, 0) scale(1)" : getInitialTransform(),
        transitionProperty: "opacity, transform",
        transitionDuration: `${durationMs}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${delayMs}ms`,
      }}
    >
      {children}
    </div>
  );
}

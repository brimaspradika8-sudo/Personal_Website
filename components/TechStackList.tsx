"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface TechItem {
  id: string;
  name: string;
  logo: React.ReactNode;
}

function SvgWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border-2 border-slate-900 bg-white dark:border-white dark:bg-slate-950">
      {children}
    </div>
  );
}

function PhpLogo() {
  return (
    <SvgWrap>
      <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
        <rect x="0" y="0" width="64" height="64" rx="8" fill="#8892BF"/>
        <path d="M25 18h8.5c6.9 0 11.5 3.9 11.5 10.2 0 7.3-5.5 11.8-13.8 11.8H25.5v-8.7h7.1c2.7 0 4.4-1.3 4.4-3.6s-1.7-3.5-4.4-3.5h-6.2V18zm-7.1 0h7.2v27.9h-7.2V18zm19.6 0h8.5v27.9h-8.5V18z" fill="#fff"/>
      </svg>
    </SvgWrap>
  );
}

function HtmlLogo() {
  return (
    <SvgWrap>
      <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
        <path d="M10 12 16 50l16 6 16-6 6-38H10zm16 10h14l-.7 8H25.3l-.8 9.5 6.5 1.8 6.3-1.7.8-8.6h-7.8v-7.8h15.2l-.6 7.3-1.5 17-13.1 3.9-13-3.8-1.8-18.6h7.5v7h6.4l.9-5.5h-7.3v-7.8z" fill="#E44D26"/>
      </svg>
    </SvgWrap>
  );
}

function CssLogo() {
  return (
    <SvgWrap>
      <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
        <path d="M10 12 16 50l16 6 16-6 6-38H10zm31.5 13.5-7.2 3.4 7.2 3.5-1.2 7.2-8.4 3.4-8.3-3.4-1.3-7.1 7.3-3.5-7.3-3.4 1.4-8.2 7.2 3.1 7.2-3.1 1.3 8.2z" fill="#1F6FEB"/>
      </svg>
    </SvgWrap>
  );
}

function JsLogo() {
  return (
    <SvgWrap>
      <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
        <rect x="0" y="0" width="64" height="64" rx="8" fill="#F7DF1E"/>
        <path d="M18 17h28v30H18V17zm5.5 5.5v19h17v-4.4H34v-14.6h-10.5zm13.4 14.8c-1.1 0-2 .9-2 2 0 1.2.9 2 2 2s2-.8 2-2-.9-2-2-2zm-4.9 0c-1.1 0-2 .9-2 2 0 1.2.9 2 2 2s2-.8 2-2-.9-2-2-2z" fill="#000"/>
      </svg>
    </SvgWrap>
  );
}

function ReactLogo() {
  return (
    <SvgWrap>
      <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
        <circle cx="32" cy="32" r="7" fill="#61DAFB"/>
        <g stroke="#61DAFB" strokeWidth="2.6" fill="none">
          <ellipse cx="32" cy="32" rx="22" ry="8.5" transform="rotate(0 32 32)"/>
          <ellipse cx="32" cy="32" rx="22" ry="8.5" transform="rotate(60 32 32)"/>
          <ellipse cx="32" cy="32" rx="22" ry="8.5" transform="rotate(120 32 32)"/>
        </g>
      </svg>
    </SvgWrap>
  );
}

function NextLogo() {
  return (
    <SvgWrap>
      <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
        <rect x="0" y="0" width="64" height="64" rx="8" fill="#111827"/>
        <path d="M38 18 24 44h-6L32 20h6zm-10.5 26h6.8L48 18h-6.5l-8.9 26z" fill="#fff"/>
      </svg>
    </SvgWrap>
  );
}

function LaravelLogo() {
  return (
    <SvgWrap>
      <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
        <rect x="0" y="0" width="64" height="64" rx="8" fill="#F0523F"/>
        <path d="M18 20.5 32 12l14 8.5v23L32 52l-14-8.5v-23zm14 4.1L24.5 27v12.5L32 43l7.5-3.5V27L32 24.6zm0 0 7.5 3.5v12.5L32 44V24.6z" fill="#fff"/>
      </svg>
    </SvgWrap>
  );
}

function DockerLogo() {
  return (
    <SvgWrap>
      <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
        <rect x="0" y="0" width="64" height="64" rx="8" fill="#1E88E5"/>
        <path d="M14 34h7v7h-7v-7zm9 0h7v7h-7v-7zm9 0h7v7h-7v-7zm9 0h7v7h-7v-7zm-27-9h7v7h-7v-7zm9 0h7v7h-7v-7zm9 0h7v7h-7v-7zm9 0h7v7h-7v-7zm-27-9h7v7h-7v-7zm9 0h7v7h-7v-7zm9 0h7v7h-7v-7zm-32 29h42v5H11v-5z" fill="#fff"/>
      </svg>
    </SvgWrap>
  );
}

function SupabaseLogo() {
  return (
    <SvgWrap>
      <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
        <rect x="0" y="0" width="64" height="64" rx="8" fill="#0B8F5A"/>
        <path d="M24 46.5c-1.8 0-3.2-1.8-2.3-3.4L31 17.7c.7-1.3 2.7-1.1 3.2.3l6.5 20.9c.7 2.5-1.1 4.6-3.5 4.6H24zm9.1-25.8c.8-1.3 2.7-1.1 3.2.3l3.8 12.1h-7.5l.5-12.4z" fill="#fff"/>
      </svg>
    </SvgWrap>
  );
}

const TECH_ITEMS: TechItem[] = [
  { id: "php", name: "PHP", logo: <PhpLogo /> },
  { id: "html", name: "HTML", logo: <HtmlLogo /> },
  { id: "css", name: "CSS", logo: <CssLogo /> },
  { id: "javascript", name: "JavaScript", logo: <JsLogo /> },
  { id: "react", name: "React", logo: <ReactLogo /> },
  { id: "nextjs", name: "Next.js", logo: <NextLogo /> },
  { id: "laravel", name: "Laravel", logo: <LaravelLogo /> },
  { id: "docker", name: "Docker", logo: <DockerLogo /> },
  { id: "supabase", name: "Supabase", logo: <SupabaseLogo /> },
];

interface TechStackBentoProps {
  isNight: boolean;
  lang: "id" | "en";
}

export default function TechStackList({ lang }: TechStackBentoProps) {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section
      id="skills"
      className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20 border-b-2 border-slate-900 dark:border-white text-left"
    >
      <div className="space-y-6 sm:space-y-10">
        
        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 sm:space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xl bg-[#00E676] text-slate-950 border-2 border-slate-900 dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] text-[11px] font-mono font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>TEKNOLOGI &amp; KAPABILITAS</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-5xl font-black uppercase tracking-tight text-slate-950 dark:text-white leading-none">
              STACK &amp; <span className="text-[#00C853]">KEAHLIAN UTAMA</span>
            </h2>
            <p className="text-xs sm:text-base text-slate-800 dark:text-slate-200 font-sans font-medium leading-relaxed">
              {lang === "id"
                ? "Ekosistem alat pengembangan modern dan teknologi teruji yang saya gunakan untuk membangun sistem perangkat lunak scalable."
                : "Modern development tools and battle-tested technologies used to build scalable software."}
            </p>
          </div>

        </div>

        {/* Continuous technology strip: compact, legible, and easy to scan. */}
        <div className="overflow-hidden border-y-2 border-slate-900 dark:border-white bg-white dark:bg-[#0E121D] py-3">
          <motion.div
            className="flex w-max items-center gap-3 px-3"
            animate={{ x: [0, -420] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear", ...(isPaused ? { repeat: 0 } : {}) }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
          >
          {[...TECH_ITEMS, ...TECH_ITEMS].map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center gap-2.5 min-w-47.5 px-3 py-2 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              {item.logo}
              <span className="whitespace-nowrap text-xs font-mono font-black text-slate-950 dark:text-white">{item.name}</span>
            </div>
          ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

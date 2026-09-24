"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { TECH_STACK_ITEMS } from "@/lib/tech-stack";

interface TechItem {
  id: string;
  name: string;
  logo: React.ReactNode;
}

function SvgWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-slate-900 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200 group-hover:scale-105 dark:border-white dark:bg-slate-950 dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
      {children}
    </div>
  );
}

function HtmlLogo() {
  return (
    <SvgWrap>
      <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
        <path d="M10 12 16 50l16 6 16-6 6-38H10Zm15.9 10.7h13.6l-.7 8.2H25.2l-.7 9.2 6.1 1.8 6.3-1.8.7-7.6H25.6l-.5-5.8h14.2l-.4 5.3-1.6 18.1-12.7 3.8-12.6-3.8-1.7-17.4h7.3l.7 8.6 6.3 1.7 6.2-1.7.4-4.7H25.9l-.8-8.8Z" fill="#E44D26"/>
      </svg>
    </SvgWrap>
  );
}

function CssLogo() {
  return (
    <SvgWrap>
      <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
        <path d="M10 12 16 50l16 6 16-6 6-38H10Zm22.1 22.1 8.2-3.9-1.3 7.8-7 2.8-6.9-3.2-.8-6.3h7.1l.4 2.9h3.7l-.4-2.4-4-.6-3.8.9-.3 2.6h-7l1.8-10.4 8.9-3.6 8.6 3.7.7 4.7h-7.1l-.4-2-4.4-.5-4.3.6-.4 2.7h7.3v.1Z" fill="#1F6FEB"/>
      </svg>
    </SvgWrap>
  );
}

function JavaScriptLogo() {
  return (
    <SvgWrap>
      <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
        <rect x="0" y="0" width="64" height="64" rx="8" fill="#F7DF1E"/>
        <path d="M20 18h24v28H20V18Zm4 4v20h16V22H24Zm13.7 3.5v13.8h-3.5v-8.5h-2.2v8.5h-3.5V25.5h9.2Zm-11.5 6.8h4.6v2.6h-4.6v-2.6Zm0 4.3h4.6v2.6h-4.6v-2.6Z" fill="#111827"/>
      </svg>
    </SvgWrap>
  );
}

function TypeScriptLogo() {
  return (
    <SvgWrap>
      <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
        <rect x="0" y="0" width="64" height="64" rx="8" fill="#3178C6"/>
        <path d="M17 19h30v26H17V19Zm7 7h16v5h-5v12h-6V31h-5v-5Zm18.5 0h6v17h-6V26Z" fill="#fff"/>
      </svg>
    </SvgWrap>
  );
}

function ReactLogo() {
  return (
    <SvgWrap>
      <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
        <circle cx="32" cy="32" r="7" fill="#61DAFB"/>
        <g stroke="#61DAFB" strokeWidth="2.5" fill="none">
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
        <path d="M31 19c-7.4 0-13 5.6-13 13 0 7.6 5.6 13 13 13 3.4 0 6.5-1.3 8.9-3.6l-5.4-4.5c-.8.8-1.9 1.3-3.2 1.3-2.6 0-4.6-2.1-4.6-4.7 0-2.7 2-4.8 4.6-4.8 1.5 0 2.8.7 3.8 1.8l5.2-4.7A12.7 12.7 0 0 0 31 19Zm16.5 7.4h-5.2L32.8 39.5h5.2l9.5-13.1Z" fill="#fff"/>
      </svg>
    </SvgWrap>
  );
}

function LaravelLogo() {
  return (
    <SvgWrap>
      <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
        <rect x="0" y="0" width="64" height="64" rx="8" fill="#F0523F"/>
        <path d="M18 22.5 32 15l14 7.5v19L32 49l-14-7.5v-19Zm14 4.5L25.5 29v11.5L32 44l6.5-3.5V29L32 27Zm0 0 6.5 2.5v11.5L32 44V27Z" fill="#fff"/>
      </svg>
    </SvgWrap>
  );
}

function PhpLogo() {
  return (
    <SvgWrap>
      <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
        <rect x="0" y="0" width="64" height="64" rx="8" fill="#8892BF"/>
        <path d="M25 18h9.5c7.2 0 11.5 4.2 11.5 10.6 0 7.1-5.4 11.6-13.3 11.6H25v-8.4h7.3c2.8 0 4.3-1.2 4.3-3.4 0-2.2-1.5-3.3-4.3-3.3H25v-7.5Zm-7.2 0h7.1v27.9h-7.1V18Zm19.5 0h8.5v27.9h-8.5V18Z" fill="#fff"/>
      </svg>
    </SvgWrap>
  );
}

function DockerLogo() {
  return (
    <SvgWrap>
      <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
        <rect x="0" y="0" width="64" height="64" rx="8" fill="#1E88E5"/>
        <path d="M14 35h7v7h-7v-7Zm9 0h7v7h-7v-7Zm9 0h7v7h-7v-7Zm9 0h7v7h-7v-7Zm-27-9h7v7h-7v-7Zm9 0h7v7h-7v-7Zm9 0h7v7h-7v-7Zm9 0h7v7h-7v-7Zm-27-9h7v7h-7v-7Zm9 0h7v7h-7v-7Zm9 0h7v7h-7v-7Zm-10 27h32v5H16v-5Z" fill="#fff"/>
      </svg>
    </SvgWrap>
  );
}

function SupabaseLogo() {
  return (
    <SvgWrap>
      <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
        <rect x="0" y="0" width="64" height="64" rx="8" fill="#0B8F5A"/>
        <path d="M24 47c-1.8 0-3.2-1.7-2.4-3.3L31.7 17.4c.7-1.2 2.4-1.3 3.2-.2l9.8 17.1c1.1 2-.3 4.7-2.7 4.7H24Zm9.8-22.6 3.4 11.3h-7.7l.5-11.3h3.8Z" fill="#fff"/>
      </svg>
    </SvgWrap>
  );
}

function PostgresLogo() {
  return (
    <SvgWrap>
      <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
        <rect x="0" y="0" width="64" height="64" rx="8" fill="#336791"/>
        <path d="M22 18h20v28H22V18Zm4 4v20h12V22H26Zm14 0h4v20h-4V22Zm-16 3h8v2h-8v-2Zm0 6h8v2h-8v-2Zm0 6h8v2h-8v-2Z" fill="#fff"/>
      </svg>
    </SvgWrap>
  );
}

function MySqlLogo() {
  return (
    <SvgWrap>
      <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
        <rect x="0" y="0" width="64" height="64" rx="8" fill="#0F5A7F"/>
        <path d="M20 20h24v24H20V20Zm4 4v16h16V24H24Zm2 2h12v12H26V26Zm2 2v8h8v-8h-8Zm3 1h2v6h-2v-6Z" fill="#F29E1F"/>
      </svg>
    </SvgWrap>
  );
}

function GenericTechLogo() {
  return (
    <SvgWrap>
      <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
        <rect x="0" y="0" width="64" height="64" rx="8" fill="url(#g1)"/>
        <defs>
          <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#8B5CF6"/>
            <stop offset="100%" stopColor="#14B8A6"/>
          </linearGradient>
        </defs>
        <path d="M18 34c0-9.4 7.6-17 17-17 5 0 9.6 2.2 12.7 5.8l-5.1 4.1A10.7 10.7 0 0 0 35 24c-6 0-10.9 4.9-10.9 11S29 46 35 46a10.8 10.8 0 0 0 7.6-3.1l5.1 4.1A17 17 0 0 1 35 51c-9.4 0-17-7.6-17-17Z" fill="#fff"/>
      </svg>
    </SvgWrap>
  );
}

const TECH_LOGOS: Record<string, React.ReactNode> = {
  HTML: <HtmlLogo />,
  CSS: <CssLogo />,
  JavaScript: <JavaScriptLogo />,
  TypeScript: <TypeScriptLogo />,
  "Next.js": <NextLogo />,
  React: <ReactLogo />,
  Laravel: <LaravelLogo />,
  PHP: <PhpLogo />,
  Supabase: <SupabaseLogo />,
  PostgreSQL: <PostgresLogo />,
  MySQL: <MySqlLogo />,
  Docker: <DockerLogo />,
};

const TECH_ITEMS: TechItem[] = TECH_STACK_ITEMS.map((item) => ({
  id: item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name: item.name,
  logo: TECH_LOGOS[item.name] || <GenericTechLogo />,
}));

interface TechStackBentoProps {
  isNight: boolean;
  lang: "id" | "en";
}

export default function TechStackList({ lang }: TechStackBentoProps) {
  return (
    <section
      id="skills"
      className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20 border-b-2 border-slate-900 dark:border-white text-left"
    >
      <div className="space-y-6 sm:space-y-10">
        
        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 sm:space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xl bg-[#00E676] text-slate-950 border-2 border-slate-900 dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] text-[11px] font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>TEKNOLOGI &amp; KAPABILITAS</span>
            </div>
            <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tight text-slate-950 dark:text-white leading-none">
              STACK &amp; <span className="text-[#00C853]">KEAHLIAN UTAMA</span>
            </h2>
            <p className="text-xs sm:text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
              {lang === "id"
                ? "Ekosistem alat pengembangan modern dan teknologi teruji yang saya gunakan untuk membangun sistem perangkat lunak scalable."
                : "Modern development tools and battle-tested technologies used to build scalable software."}
            </p>
          </div>

        </div>

        {/* Continuous technology strip: compact, legible, and easy to scan. */}
        <div className="overflow-hidden border-y-2 border-slate-900 bg-white/90 dark:border-white dark:bg-[#0E121D]/90">
          <div className="animate-marquee flex w-max items-center gap-3 px-3 py-3">
            {[...TECH_ITEMS, ...TECH_ITEMS].map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="group flex min-w-45 items-center gap-2.5 rounded-2xl border-2 border-slate-900 bg-slate-50 px-3 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ECFDF5] dark:border-white dark:bg-slate-900 dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] dark:hover:bg-slate-800"
              >
                {item.logo}
                <span className="whitespace-nowrap text-[11px] font-black uppercase tracking-[0.15em] text-slate-950 dark:text-white">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

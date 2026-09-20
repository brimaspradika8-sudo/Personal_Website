"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  FileCode2,
  Braces,
  Database,
  Sparkles,
  Container,
  Atom,
} from "lucide-react";

interface TechItem {
  id: string;
  name: string;
  icon: React.ElementType;
  logo: string;
}

const TECH_ITEMS: TechItem[] = [
  { id: "php", name: "PHP", logo: "PHP", icon: Code2 },
  { id: "html", name: "HTML", logo: "</>", icon: FileCode2 },
  { id: "css", name: "CSS", logo: "#", icon: Braces },
  { id: "javascript", name: "JavaScript", logo: "JS", icon: Braces },
  { id: "react", name: "React", logo: "R", icon: Atom },
  {
    id: "nextjs",
    name: "Next.js",
    logo: "N",
    icon: Code2,
  },
  {
    id: "laravel",
    name: "Laravel",
    logo: "L",
    icon: Database,
  },
  { id: "docker", name: "Docker", logo: "D", icon: Container },
  { id: "supabase", name: "Supabase", logo: "S", icon: Database },
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
          {[...TECH_ITEMS, ...TECH_ITEMS].map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={`${item.id}-${index}`} className="flex items-center gap-2.5 min-w-[190px] px-3 py-2 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-slate-900 dark:border-white bg-[#EAB308] text-[10px] font-mono font-black text-slate-950">
                  <span aria-hidden="true">{item.logo}</span>
                </div>
                <Icon className="h-4 w-4 shrink-0 text-[#166534] dark:text-[#00E676]" />
                <span className="whitespace-nowrap text-xs font-mono font-black text-slate-950 dark:text-white">{item.name}</span>
              </div>
            );
          })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

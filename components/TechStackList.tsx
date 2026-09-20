"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Cpu,
  Database,
  Layers,
  Sparkles,
  Terminal,
  Container,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { soundFx } from "@/lib/audio/sound";

interface TechItem {
  id: string;
  name: string;
  category: "Frontend" | "Backend" | "Database & Cloud" | "AI & Systems";
  level: "Expert" | "Production Ready" | "Advanced" | "Specialized";
  description: string;
  useCase: string;
  icon: React.ElementType;
  lightBg: string;
  darkBg: string;
  badgeBg: string;
  span: string;
  logo: string;
}

const TECH_ITEMS: TechItem[] = [
  {
    id: "nextjs",
    name: "Next.js & React",
    logo: "N/R",
    category: "Frontend",
    level: "Production Ready",
    description: "App Router, Server Actions, Dynamic SSR, dan React Server Components.",
    useCase: "Membangun web app skala besar dengan performa tinggi & SEO optimal.",
    icon: Code2,
    lightBg: "bg-slate-950 text-white",
    darkBg: "dark:bg-[#0E121D] dark:text-white",
    badgeBg: "bg-[#FFE600] text-slate-950",
    span: "col-span-1 md:col-span-2 lg:col-span-2",
  },
  {
    id: "laravel",
    name: "Laravel & PHP",
    logo: "L/P",
    category: "Backend",
    level: "Advanced",
    description: "RESTful API Architecture, Eloquent ORM, Queue Workers & Middleware.",
    useCase: "Sistem manajemen data, otentikasi enterprise, dan backend service.",
    icon: Flame,
    lightBg: "bg-emerald-600 text-white",
    darkBg: "dark:bg-emerald-700 dark:text-white",
    badgeBg: "bg-[#FFE600] text-slate-950",
    span: "col-span-1 md:col-span-1 lg:col-span-1",
  },
  {
    id: "ai-systems",
    name: "AI & LLM",
    logo: "AI",
    category: "AI & Systems",
    level: "Specialized",
    description: "Agentic Workflows, OpenAI/Anthropic APIs, Prompt Engineering & Embeddings.",
    useCase: "Otomatisasi alur kerja cerdas, chatbot kustom, dan analisis dokumen.",
    icon: Cpu,
    lightBg: "bg-[#FFE600] text-slate-950",
    darkBg: "dark:bg-[#FFE600] dark:text-slate-950",
    badgeBg: "bg-slate-950 text-white",
    span: "col-span-1 md:col-span-1 lg:col-span-1",
  },
  {
    id: "supabase",
    name: "Supabase & PostgreSQL",
    logo: "S/P",
    category: "Database & Cloud",
    level: "Production Ready",
    description: "Row Level Security (RLS), Realtime Subscriptions, Storage & Auth.",
    useCase: "Penyimpanan basis data relasional real-time & manajemen aset media.",
    icon: Database,
    lightBg: "bg-emerald-400 text-slate-950",
    darkBg: "dark:bg-emerald-500 dark:text-slate-950",
    badgeBg: "bg-slate-950 text-white",
    span: "col-span-1 md:col-span-2 lg:col-span-2",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS & Motion",
    logo: "T/M",
    category: "Frontend",
    level: "Expert",
    description: "Neo-Brutalism design system, mikro-animasi UI, dan responsif layout.",
    useCase: "Menciptakan antarmuka yang bold, cepat, berani, dan modern.",
    icon: Layers,
    lightBg: "bg-[#00E676] text-slate-950",
    darkBg: "dark:bg-[#00E676] dark:text-slate-950",
    badgeBg: "bg-slate-950 text-white",
    span: "col-span-1 md:col-span-1 lg:col-span-1",
  },
  {
    id: "docker-prisma",
    name: "Docker & Prisma",
    logo: "D/P",
    category: "Database & Cloud",
    level: "Advanced",
    description: "Containerization, Database Migrations, Schema Design & Indexing.",
    useCase: "Isolasi lingkungan aplikasi & pengelolaan skema database bertipe aman.",
    icon: Container,
    lightBg: "bg-emerald-700 text-white",
    darkBg: "dark:bg-emerald-800 dark:text-white",
    badgeBg: "bg-[#FFE600] text-slate-950",
    span: "col-span-1 md:col-span-2 lg:col-span-2",
  },
];

interface TechStackBentoProps {
  isNight: boolean;
  lang: "id" | "en";
}

export default function TechStackList({ isNight, lang }: TechStackBentoProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("Semua");
  const [isPaused, setIsPaused] = useState(false);

  const categories = ["Semua", "Frontend", "Backend", "Database & Cloud", "AI & Systems"];

  const filteredItems = TECH_ITEMS.filter((item) => {
    if (selectedFilter === "Semua") return true;
    return item.category === selectedFilter;
  });

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

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedFilter(cat);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all border-2 border-slate-900 dark:border-white cursor-pointer ${
                  selectedFilter === cat
                    ? "bg-[#00E676] text-slate-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
                    : "bg-white dark:bg-[#0E121D] text-slate-950 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
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
          {[...filteredItems, ...filteredItems].map((item, index) => {
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

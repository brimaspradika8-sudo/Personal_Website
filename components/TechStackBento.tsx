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
}

const TECH_ITEMS: TechItem[] = [
  {
    id: "nextjs",
    name: "Next.js 16 & React 19",
    category: "Frontend",
    level: "Production Ready",
    description: "App Router, Server Actions, Dynamic SSR, dan React Server Components.",
    useCase: "Membangun web app skala besar dengan performa tinggi & SEO optimal.",
    icon: Code2,
    lightBg: "bg-slate-950 text-white",
    darkBg: "dark:bg-[#0E121D] dark:text-white",
    badgeBg: "bg-sky-500 text-white",
    span: "col-span-1 md:col-span-2 lg:col-span-2",
  },
  {
    id: "laravel",
    name: "Laravel 11 & PHP 8.3",
    category: "Backend",
    level: "Advanced",
    description: "RESTful API Architecture, Eloquent ORM, Queue Workers & Middleware.",
    useCase: "Sistem manajemen data, otentikasi enterprise, dan backend service.",
    icon: Flame,
    lightBg: "bg-sky-600 text-white",
    darkBg: "dark:bg-sky-700 dark:text-white",
    badgeBg: "bg-sky-300 text-slate-950",
    span: "col-span-1 md:col-span-1 lg:col-span-1",
  },
  {
    id: "ai-systems",
    name: "AI & LLM Integration",
    category: "AI & Systems",
    level: "Specialized",
    description: "Agentic Workflows, OpenAI/Anthropic APIs, Prompt Engineering & Embeddings.",
    useCase: "Otomatisasi alur kerja cerdas, chatbot kustom, dan analisis dokumen.",
    icon: Cpu,
    lightBg: "bg-sky-400 text-slate-950",
    darkBg: "dark:bg-sky-400 dark:text-slate-950",
    badgeBg: "bg-slate-950 text-white",
    span: "col-span-1 md:col-span-1 lg:col-span-1",
  },
  {
    id: "supabase",
    name: "Supabase & PostgreSQL",
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
    name: "Tailwind CSS & Framer Motion",
    category: "Frontend",
    level: "Expert",
    description: "Neo-Brutalism design system, mikro-animasi UI, dan responsif layout.",
    useCase: "Menciptakan antarmuka yang bold, cepat, berani, dan modern.",
    icon: Layers,
    lightBg: "bg-cyan-400 text-slate-950",
    darkBg: "dark:bg-cyan-500 dark:text-slate-950",
    badgeBg: "bg-slate-950 text-white",
    span: "col-span-1 md:col-span-1 lg:col-span-1",
  },
  {
    id: "docker-prisma",
    name: "Docker & Prisma ORM",
    category: "Database & Cloud",
    level: "Advanced",
    description: "Containerization, Database Migrations, Schema Design & Indexing.",
    useCase: "Isolasi lingkungan aplikasi & pengelolaan skema database bertipe aman.",
    icon: Container,
    lightBg: "bg-indigo-500 text-white",
    darkBg: "dark:bg-indigo-600 dark:text-white",
    badgeBg: "bg-sky-300 text-slate-950",
    span: "col-span-1 md:col-span-2 lg:col-span-2",
  },
];

interface TechStackBentoProps {
  isNight: boolean;
  lang: "id" | "en";
}

export default function TechStackBento({ isNight, lang }: TechStackBentoProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("Semua");

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
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xl bg-sky-500 text-white border-2 border-slate-900 dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] text-[11px] font-mono font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>TEKNOLOGI &amp; KAPABILITAS</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-5xl font-black uppercase tracking-tight text-slate-950 dark:text-white leading-none">
              STACK &amp; <span className="text-sky-500">KEAHLIAN UTAMA</span>
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
                    ? "bg-sky-500 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
                    : "bg-white dark:bg-[#0E121D] text-slate-950 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`${item.span} p-5 sm:p-7 rounded-2xl border-2 sm:border-3 border-slate-900 dark:border-white flex flex-col justify-between space-y-4 sm:space-y-6 transition-all duration-200 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 ${
                  isNight ? item.darkBg : item.lightBg
                }`}
              >
                {/* Header Meta */}
                <div className="flex items-start justify-between gap-3">
                  <div className="p-3 rounded-xl border-2 border-slate-900 bg-white text-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Icon className="w-6 h-6 text-slate-950" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2.5 py-0.5 rounded-lg border-2 border-slate-900 text-[10px] font-mono font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${item.badgeBg}`}>
                      {item.level}
                    </span>
                    <span className="text-[10px] font-mono font-bold opacity-80 uppercase">
                      [{item.category}]
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h3 className="font-serif font-black text-xl sm:text-2xl leading-tight uppercase">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-sans font-medium opacity-90 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Use Case Footer */}
                <div className="pt-3 border-t-2 border-slate-900/30 dark:border-white/30 flex items-center gap-2 text-xs font-sans font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-sky-500" />
                  <span className="line-clamp-1">{item.useCase}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

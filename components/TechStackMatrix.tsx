"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
} from "lucide-react";
import { soundFx } from "@/lib/audio/sound";

interface TechItem {
  id: string;
  name: string;
  category: "backend" | "frontend" | "database";
  level: string;
  iconName: string;
  description: string;
  snippet: string;
}

const techSkills: TechItem[] = [
  {
    id: "laravel",
    name: "PHP & Laravel",
    category: "backend",
    level: "Advanced",
    iconName: "Code2",
    description: "Framework utama untuk membangun RESTful API terstruktur, Eloquent ORM, autentikasi RBAC, dan arsitektur backend scalable.",
    snippet: `// Laravel 11 API Controller
namespace App\\Http\\Controllers\\Api;

use App\\Models\\Project;
use Illuminate\\Http\\Request;

class ProjectController extends Controller
{
    public function index()
    {
        return response()->json(Project::with('tags')->latest()->get());
    }
}`,
  },
  {
    id: "nextjs",
    name: "React & Next.js",
    category: "frontend",
    level: "Advanced",
    iconName: "Layers",
    description: "Next.js App Router, React Server Components, client-side state management, dan antarmuka web performa tinggi.",
    snippet: `// Next.js App Router Server Component
import { prisma } from "@/lib/prisma";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" }
  });
  return <ProjectGrid items={projects} />;
}`,
  },
  {
    id: "database",
    name: "MySQL & PostgreSQL",
    category: "database",
    level: "Intermediate",
    iconName: "Database",
    description: "Perancangan skema relasional, pengindeksan kolom, relasi tabel, dan komposisi query SQL teroptimasi.",
    snippet: `-- Relational Database Schema Query
SELECT 
  p.id, p.title, p.slug, COUNT(t.id) AS total_tags
FROM projects p
LEFT JOIN project_tags pt ON p.id = pt.project_id
LEFT JOIN tags t ON pt.tag_id = t.id
GROUP BY p.id;`,
  },
  {
    id: "prisma",
    name: "Prisma ORM",
    category: "database",
    level: "Intermediate",
    iconName: "Cpu",
    description: "Type-safe ORM untuk TypeScript, penanganan migrasi skema otomatis, dan manipulasi data berkecepatan tinggi.",
    snippet: `// Prisma Data Mutation & Migration
const newProject = await prisma.project.create({
  data: {
    title: "Portfolio 3D Physics",
    slug: "portfolio-3d-physics",
    techStack: ["Next.js", "Three.js", "Prisma"],
  },
});`,
  },
  {
    id: "supabase",
    name: "Supabase",
    category: "database",
    level: "Intermediate",
    iconName: "Database",
    description: "Backend-as-a-Service dengan PostgreSQL Realtime, Supabase Auth, Storage buckets, dan Row Level Security (RLS).",
    snippet: `// Supabase Realtime Client Data Fetching
const { data: projects, error } = await supabase
  .from('projects')
  .select('*, profiles(name, avatar)')
  .order('created_at', { ascending: false });`,
  },
  {
    id: "docker",
    name: "Docker Containerization",
    category: "backend",
    level: "Intermediate",
    iconName: "Terminal",
    description: "Containerization environment untuk memastikan replikasi environment aplikasi yang konsisten antara dev dan prod.",
    snippet: `# Docker Compose Multi-Container Setup
version: '3.8'
services:
  app:
    build: .
    ports: ["8000:8000"]
    environment:
      - DB_HOST=postgres
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: portfolio_db`,
  },
];

interface TechStackMatrixProps {
  isNight: boolean;
  lang: "id" | "en";
}

export default function TechStackMatrix({ isNight, lang }: TechStackMatrixProps) {
  const [activeTab, setActiveTab] = useState<"all" | "backend" | "frontend" | "database">("all");
  const [selectedTech, setSelectedTech] = useState<TechItem>(techSkills[0]);
  const [copied, setCopied] = useState(false);

  const filteredSkills = techSkills.filter((item) => {
    if (activeTab === "all") return true;
    return item.category === activeTab;
  });

  const handleCopyCode = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(selectedTech.snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="skills" className="scroll-mt-20 max-w-6xl mx-auto px-4 sm:px-6 py-20 border-b border-slate-200 dark:border-slate-800/80">
      <div className="space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {lang === "id" ? "Teknologi & Lingkungan Pengganti" : "Technical Stack & Environment"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              {lang === "id"
                ? "Daftar teknologi dan framework yang digunakan dalam pengembangan sistem AI dan web fullstack."
                : "Technologies and tools used for AI systems engineering and fullstack web architecture."}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start md:self-auto overflow-x-auto max-w-full">
            {[
              { id: "all", label: lang === "id" ? "Semua" : "All" },
              { id: "backend", label: "Backend" },
              { id: "frontend", label: "Frontend" },
              { id: "database", label: "DB & DevOps" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(tab.id as "all" | "backend" | "frontend" | "database");
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#D32F2F] text-white shadow-sm font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Main Grid & Terminal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Grid: Tech Cards (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredSkills.map((tech) => {
              const isSelected = selectedTech.id === tech.id;
              return (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedTech(tech);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 relative group cursor-pointer w-full ${
                    isSelected
                      ? "border-[#D32F2F] bg-[#D32F2F]/5 dark:bg-[#D32F2F]/10 shadow-xs"
                      : isNight
                      ? "bg-[#0E1015] border-slate-800/80 hover:border-slate-700"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-slate-700">
                        {tech.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 leading-snug">{tech.name}</h3>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                          {tech.category} · {tech.level}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans line-clamp-2">
                    {tech.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Column: Interactive Code Terminal Box (5 Cols) */}
          <div className="lg:col-span-5 w-full">
            <div className={`rounded-xl border overflow-hidden shadow-md transition-all ${
              isNight ? "bg-[#0B0F17] border-slate-800" : "bg-slate-900 border-slate-800 text-slate-100"
            }`}>
              
              {/* Terminal Top Window Controls */}
              <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <span className="text-xs font-mono text-slate-400 ml-2 truncate">
                    {selectedTech.id}.snippet.ts
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>

              {/* Terminal Code Display Body */}
              <div className="p-4 overflow-x-auto font-mono text-xs text-slate-200 leading-relaxed max-h-[340px]">
                <pre className="text-left select-all">
                  <code>{selectedTech.snippet}</code>
                </pre>
              </div>

              {/* Terminal Footer Status Bar */}
              <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>UTF-8 · {selectedTech.name}</span>
                <span className="text-amber-500 font-medium">READY</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import {
  Terminal,
  Code2,
  Database,
  Layers,
  Cpu,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import { soundFx } from "@/lib/audio/sound";
import ScrollReveal from "@/components/ScrollReveal";

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
    description: "MVC framework andal untuk membangun arsitektur backend, RESTful API, ORM Eloquent, dan autentikasi terstruktur.",
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
    description: "React framework modern dengan App Router, Server Components, SSR/SSG, dan optimasi UI performa tinggi.",
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
    description: "Perancangan skema database relasional terstruktur, relasi tabel, indexing, dan query SQL teroptimasi.",
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
    description: "Type-safe ORM untuk TypeScript & Node.js, mempermudah migrasi skema dan manipulasi data berkecepatan tinggi.",
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
    description: "Backend-as-a-Service open-source dengan PostgreSQL Realtime, Auth, Storage bucket, dan Row Level Security (RLS).",
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
    description: "Containerization environment untuk memastikan aplikasi berjalan konsisten di server lokal maupun production.",
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
    <section id="skills" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-b border-current/10">
      <div className="space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DC2626]/15 text-[#DC2626] text-xs font-mono font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TECH MATRIX</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight">
              TECHNICAL <span className="text-[#DC2626]">STACK &amp; CLI</span>
            </h2>
            <p className="text-xs sm:text-sm opacity-80 max-w-xl font-sans">
              {lang === "id"
                ? "Eksplorasi stack teknologi fullstack web development yang saya gunakan sehari-hari. Klik setiap kartu untuk melihat snippet kode."
                : "Explore the fullstack web development technologies I build with daily. Click any card to inspect code snippets."}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-current/5 border border-current/10 self-start sm:self-auto overflow-x-auto max-w-full">
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
                  setActiveTab(tab.id as any);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#DC2626] text-white shadow-md shadow-[#DC2626]/30"
                    : "opacity-70 hover:opacity-100 hover:bg-current/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Main Grid & Terminal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Grid: Tech Cards (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredSkills.map((tech, idx) => {
              const isSelected = selectedTech.id === tech.id;
              return (
                <ScrollReveal key={tech.id} direction="up" delayMs={idx * 80}>
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedTech(tech);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all duration-300 relative group overflow-hidden cursor-pointer w-full ${
                      isSelected
                        ? "border-[#DC2626] shadow-lg shadow-[#DC2626]/20 bg-[#DC2626]/10"
                        : isNight
                        ? "bg-[#1A211A] border-[#2A2F26] hover:border-[#DC2626]/50"
                        : "bg-[#F8F8F6] border-[#E5E5E2] hover:border-[#DC2626]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#DC2626] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          {tech.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm leading-snug">{tech.name}</h3>
                          <span className="text-[10px] font-mono opacity-70 uppercase tracking-wider">
                            {tech.category} &bull; {tech.level}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs opacity-80 leading-relaxed font-sans line-clamp-2">
                      {tech.description}
                    </p>
                  </button>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Right Column: Interactive Code Terminal Box (5 Cols) */}
          <div className="lg:col-span-5 w-full">
            <div className={`rounded-xl border overflow-hidden shadow-2xl transition-all ${
              isNight ? "bg-[#0D110C] border-[#2A2F26]" : "bg-[#1E1E1E] border-black/80 text-white"
            }`}>
              
              {/* Terminal Top Window Controls */}
              <div className="px-4 py-3 bg-black/40 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-[11px] font-mono text-white/60 ml-2 truncate">
                    {selectedTech.id}.snippet.ts
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono flex items-center gap-1.5 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-white/80" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>

              {/* Terminal Code Display Body */}
              <div className="p-4 overflow-x-auto font-mono text-xs text-[#F1EFE9] leading-relaxed max-h-[340px]">
                <pre className="text-left select-all">
                  <code>{selectedTech.snippet}</code>
                </pre>
              </div>

              {/* Terminal Footer Status Bar */}
              <div className="px-4 py-2 bg-black/60 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/50">
                <span>UTF-8 &bull; {selectedTech.name}</span>
                <span className="text-[#DC2626] uppercase font-bold">READY</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

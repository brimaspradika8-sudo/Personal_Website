"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FolderGit2, ExternalLink, Code2, Eye, RefreshCw, Database, CheckCircle2 } from "lucide-react";
import { soundFx } from "@/lib/audio/sound";
import { ProjectData } from "@/components/ProjectModal";
import ScrollReveal from "@/components/ScrollReveal";
import { createClient } from "@/lib/supabase/client";
import TiltCard from "@/components/TiltCard";

const showcaseProjects: ProjectData[] = [
  {
    id: "proj-1",
    title: "Fullstack E-Commerce & Inventory Hub",
    description: "Sistem inventaris & e-commerce enterprise dengan arsitektur Laravel 11 API, RBAC (Role Based Access Control), manajemen stok real-time, laporan transaksi otomatis, dan containerization Docker.",
    thumbnail: "/images/project1.png",
    demo_url: "https://github.com",
    repository_url: "https://github.com",
    techStack: ["PHP 8.3", "Laravel 11", "MySQL", "Tailwind CSS", "Docker"],
  },
  {
    id: "proj-2",
    title: "Developer Identity & 3D Interactive Portfolio",
    description: "Portfolio web interaktif generasi terbaru memanfaatkan Next.js 14 App Router, simulasi 3D Physics Lanyard menggunakan Three.js/R3F, sound effects, mode siang/malam, dan Command Palette.",
    thumbnail: "/images/project2.png",
    demo_url: "https://github.com",
    repository_url: "https://github.com",
    techStack: ["Next.js 14", "TypeScript", "Three.js / R3F", "Prisma", "Tailwind CSS"],
  },
  {
    id: "proj-3",
    title: "High-Performance REST API & Auth Gateway",
    description: "Gateway REST API mikroservice dengan autentikasi Supabase Auth & JWT, PostgreSQL database pooling, rate limiting middleware, dan dokumentasi Swagger API terintegrasi.",
    thumbnail: "/images/project3.png",
    demo_url: "https://github.com",
    repository_url: "https://github.com",
    techStack: ["Node.js", "Express", "PostgreSQL", "Supabase Auth", "Docker"],
  },
];

interface ProjectShowcaseProps {
  isNight: boolean;
  lang: "id" | "en";
  onSelectProject: (project: ProjectData) => void;
  fetchedProjects?: any[];
}

export default function ProjectShowcase({ isNight, lang, onSelectProject, fetchedProjects }: ProjectShowcaseProps) {
  const [liveData, setLiveData] = useState<any[] | null>(fetchedProjects || null);
  const [isFetching, setIsFetching] = useState(false);
  const [lastFetched, setLastFetched] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const categories = lang === "id" 
    ? ["Semua", "Web", "AI", "Mobile", "Cloud"] 
    : ["All", "Web", "AI", "Mobile", "Cloud"];

  const handleSyncSupabase = async () => {
    soundFx.playClick();
    setIsFetching(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("Project").select("*").order("created_at", { ascending: false });
      if (!error && data) {
        setLiveData(data);
        setLastFetched(new Date().toLocaleTimeString(lang === "id" ? "id-ID" : "en-US"));
      }
    } catch (e) {
      console.warn("Client fetch error:", e);
    } finally {
      setIsFetching(false);
    }
  };

  const projectsToUse = liveData && liveData.length > 0 ? liveData : (fetchedProjects && fetchedProjects.length > 0 ? fetchedProjects : null);

  const rawProjects: ProjectData[] = projectsToUse
    ? projectsToUse.map((fp, i) => ({
        id: fp.id || `supa-${i}`,
        title: fp.title || "Untitled Project",
        description: fp.description || "No description provided.",
        thumbnail: fp.thumbnail || `/images/project${(i % 3) + 1}.png`,
        demo_url: fp.demo_url || "#",
        repository_url: fp.repository_url || "#",
        techStack: Array.isArray(fp.techStack) ? fp.techStack : ["Supabase", "Next.js", "TypeScript"],
      }))
    : showcaseProjects;

  const displayProjects = rawProjects.filter((p) => {
    if (selectedCategory === "Semua" || selectedCategory === "All") return true;
    const cat = selectedCategory.toLowerCase();
    const stackStr = (p.techStack || []).join(" ").toLowerCase();
    const titleDesc = (p.title + " " + p.description).toLowerCase();
    return stackStr.includes(cat) || titleDesc.includes(cat);
  });

  return (
    <section id="projects" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 py-16 border-b border-current/10">
      <div className="space-y-8 text-left">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DC2626]/15 text-[#DC2626] text-xs font-mono font-bold tracking-widest uppercase">
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>{lang === "id" ? "ETALASE PROYEK" : "PROJECT SHOWCASE"}</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-bold">
                <Database className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>SUPABASE FETCH ACTIVE</span>
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight">
              {lang === "id" ? (
                <>PROYEK <span className="text-[#DC2626]">UNGGULAN</span></>
              ) : (
                <>FEATURED <span className="text-[#DC2626]">PROJECTS</span></>
              )}
            </h2>
            <p className="text-xs sm:text-sm opacity-80 max-w-xl font-sans">
              {lang === "id"
                ? "Daftar proyek nyata dan eksperimen arsitektur web yang diambil secara langsung dari Supabase Database."
                : "Real-world web application projects fetched directly from Supabase Database."}
            </p>
          </div>

          {/* Interactive Supabase Client Sync Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSyncSupabase}
              disabled={isFetching}
              className="px-4 py-2 rounded-xl bg-current/5 hover:bg-[#DC2626] hover:text-white border border-current/10 text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-[#DC2626]" : ""}`} />
              <span>{isFetching ? (lang === "id" ? "Sinkronisasi..." : "Syncing...") : (lang === "id" ? "Sinkron Data Live" : "Sync Live Data")}</span>
            </button>
            {lastFetched && (
              <span className="text-[10px] font-mono opacity-70 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{lastFetched}</span>
              </span>
            )}
          </div>
        </div>

        {/* Category Filter Chips / Tabs (Feature 3.2: Edge Scroll Gradient for Mobile Swiping) */}
        <div className="relative group">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 pb-1 pr-6">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedCategory(cat);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap border ${
                    isActive
                      ? "bg-[#DC2626] text-white border-[#DC2626] shadow-md shadow-[#DC2626]/30"
                      : isNight
                      ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                      : "bg-black/5 border-black/10 text-black/70 hover:bg-black/10 hover:text-black"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
          {/* Right edge fade gradient hint */}
          <div className={`pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l ${isNight ? "from-[#0A0A0B]" : "from-white"} to-transparent z-10 sm:hidden`} />
        </div>

        {/* Feature 2.1: Skeleton Shimmer Loading Cards vs 3D Glassmorphism Cards Grid */}
        {isFetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`rounded-2xl border p-5 space-y-4 animate-pulse ${
                  isNight ? "bg-[#121214]/60 border-[#26262A]" : "bg-slate-100 border-slate-200"
                }`}
              >
                <div className="w-full h-48 rounded-xl bg-current/10" />
                <div className="h-5 w-3/4 bg-current/10 rounded-md" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-current/10 rounded-md" />
                  <div className="h-3 w-5/6 bg-current/10 rounded-md" />
                </div>
                <div className="flex gap-2 pt-2">
                  <div className="h-6 w-16 bg-current/10 rounded-md" />
                  <div className="h-6 w-16 bg-current/10 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : displayProjects.length === 0 ? (
          <div className={`p-10 rounded-2xl border text-center space-y-3 ${isNight ? "bg-[#121214]/50 border-[#26262A]" : "bg-slate-50 border-slate-200"}`}>
            <FolderGit2 className="w-10 h-10 text-[#DC2626] mx-auto opacity-70" />
            <p className="font-mono text-sm font-bold opacity-80">
              {lang === "id" ? "Belum ada proyek untuk kategori ini." : "No projects found in this category."}
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory(lang === "id" ? "Semua" : "All")}
              className="text-xs font-mono font-bold text-[#DC2626] hover:underline cursor-pointer"
            >
              {lang === "id" ? "Tampilkan Semua Proyek" : "Show All Projects"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProjects.map((project, idx) => (
              <ScrollReveal key={project.id} direction="up" delayMs={idx * 120}>
                <TiltCard
                  onClick={() => {
                    soundFx.playClick();
                    onSelectProject(project);
                  }}
                >
                  <div
                    className={`rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col justify-between group cursor-pointer ${
                      isNight
                        ? "bg-[#141416]/90 border-white/10 backdrop-blur-md hover:border-[#DC2626] hover:shadow-2xl hover:shadow-[#DC2626]/20"
                        : "bg-white border-slate-200/90 hover:border-[#DC2626] hover:shadow-2xl"
                    }`}
                  >
                    {/* Thumbnail Container */}
                    <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-black/40">
                      <Image
                        src={project.thumbnail || "/images/project1.png"}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Overlay Action Badge */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundFx.playClick();
                          onSelectProject(project);
                        }}
                        className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-[#DC2626] text-white font-bold text-xs flex items-center gap-1.5 shadow-lg hover:scale-105 transition-transform"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{lang === "id" ? "Lihat Case Study" : "View Case Study"}</span>
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="font-display text-lg font-bold leading-snug group-hover:text-[#DC2626] transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-xs opacity-80 leading-relaxed font-sans line-clamp-3">
                          {project.description}
                        </p>
                      </div>

                      {/* Tech Stack Badges */}
                      <div className="space-y-3 pt-2">
                        <div className="flex flex-wrap gap-1.5">
                          {project.techStack?.map((tech) => (
                            <span
                              key={tech}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all ${
                                isNight
                                  ? "bg-[#DC2626]/10 text-slate-200 border-[#DC2626]/30 hover:border-[#DC2626] hover:text-white"
                                  : "bg-slate-100 text-slate-700 border-slate-200 hover:border-[#DC2626]"
                              }`}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Card Bottom Links */}
                        <div className="pt-3 border-t border-current/10 flex items-center justify-between gap-2 text-xs font-medium">
                          {project.repository_url && (
                            <a
                              href={project.repository_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                e.stopPropagation();
                                soundFx.playClick();
                              }}
                              className="hover:text-[#DC2626] transition-colors flex items-center gap-1 opacity-80 hover:opacity-100"
                            >
                              <Code2 className="w-3.5 h-3.5" />
                              <span>Source Code</span>
                            </a>
                          )}

                          {project.demo_url && (
                            <a
                              href={project.demo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                e.stopPropagation();
                                soundFx.playClick();
                              }}
                              className="text-[#DC2626] font-bold hover:underline flex items-center gap-1"
                            >
                              <span>Live Demo</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>

                    </div>

                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
        </div>
        )}

      </div>
    </section>
  );
}

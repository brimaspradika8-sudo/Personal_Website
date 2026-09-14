"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FolderGit2, ExternalLink, Code2, Eye, RefreshCw, Database, CheckCircle2 } from "lucide-react";
import { soundFx } from "@/lib/audio/sound";
import { ProjectData } from "@/components/ProjectModal";
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
  fetchedProjects?: Record<string, unknown>[];
}

export default function ProjectShowcase({ isNight, lang, onSelectProject, fetchedProjects }: ProjectShowcaseProps) {
  const [liveData, setLiveData] = useState<Record<string, unknown>[] | null>(fetchedProjects || null);
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
        id: String(fp.id || `supa-${i}`),
        title: String(fp.title || "Untitled Project"),
        description: String(fp.description || "No description provided."),
        thumbnail: String(fp.thumbnail || `/images/project${(i % 3) + 1}.png`),
        demo_url: String(fp.demo_url || "#"),
        repository_url: String(fp.repository_url || "#"),
        techStack: Array.isArray(fp.techStack) ? (fp.techStack as string[]) : ["Supabase", "Next.js", "TypeScript"],
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
    <section id="projects" className="scroll-mt-20 max-w-6xl mx-auto px-4 sm:px-6 py-20 border-b border-slate-200 dark:border-slate-800/80">
      <div className="space-y-8 text-left">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                <Database className="w-3 h-3 text-emerald-500" />
                <span>Supabase Live Sync</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {lang === "id" ? "Proyek & Eksperimen Sistem" : "Featured Projects & Architecture"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              {lang === "id"
                ? "Eksplorasi aplikasi web dan implementasi sistem AI yang dibangun secara nyata."
                : "Real-world web application projects and AI system implementations."}
            </p>
          </div>

          {/* Interactive Supabase Client Sync Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSyncSupabase}
              disabled={isFetching}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-medium hover:border-[#D32F2F] hover:text-[#D32F2F] transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-[#D32F2F]" : ""}`} />
              <span>{isFetching ? (lang === "id" ? "Menghubungkan..." : "Syncing...") : (lang === "id" ? "Sinkronkan Data" : "Sync Live Data")}</span>
            </button>
            {lastFetched && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{lastFetched}</span>
              </span>
            )}
          </div>
        </div>

        {/* Category Filter Chips / Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap border ${
                  isActive
                    ? "bg-[#D32F2F] text-white border-[#D32F2F] shadow-xs"
                    : isNight
                    ? "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
                    : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Project Cards Grid */}
        {isFetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`rounded-2xl border p-5 space-y-4 animate-pulse ${
                  isNight ? "bg-slate-900/50 border-slate-800" : "bg-slate-100 border-slate-200"
                }`}
              >
                <div className="w-full h-48 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
                  <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : displayProjects.length === 0 ? (
          <div className={`p-10 rounded-2xl border text-center space-y-3 ${isNight ? "bg-[#0E1015] border-slate-800" : "bg-slate-50 border-slate-200"}`}>
            <FolderGit2 className="w-8 h-8 text-slate-400 mx-auto opacity-70" />
            <p className="text-xs text-slate-500 font-medium">
              {lang === "id" ? "Belum ada proyek untuk kategori ini." : "No projects found in this category."}
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory(lang === "id" ? "Semua" : "All")}
              className="text-xs font-medium text-[#D32F2F] hover:underline cursor-pointer"
            >
              {lang === "id" ? "Tampilkan Semua Proyek" : "Show All Projects"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProjects.map((project) => (
              <TiltCard
                key={project.id}
                onClick={() => {
                  soundFx.playClick();
                  onSelectProject(project);
                }}
              >
                <div
                  className={`rounded-2xl border overflow-hidden transition-all duration-200 flex flex-col justify-between group cursor-pointer ${
                    isNight
                      ? "bg-[#0E1015] border-slate-800/80 hover:border-slate-700"
                      : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  {/* Thumbnail Container */}
                  <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-900">
                    <Image
                      src={project.thumbnail || "/images/project1.png"}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />

                    {/* Overlay Action Badge */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFx.playClick();
                        onSelectProject(project);
                      }}
                      className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-slate-900/80 text-white text-xs font-medium flex items-center gap-1.5 backdrop-blur-md border border-white/10 hover:bg-[#D32F2F] transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{lang === "id" ? "Detail Proyek" : "View Case Study"}</span>
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug group-hover:text-[#D32F2F] transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech Stack Badges */}
                    <div className="space-y-3 pt-2">
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack?.map((tech) => (
                          <span
                            key={tech}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-sans border transition-all ${
                              isNight
                                ? "bg-slate-900 text-slate-300 border-slate-800"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Card Bottom Links */}
                      <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs font-medium">
                        {project.repository_url && (
                          <a
                            href={project.repository_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation();
                              soundFx.playClick();
                            }}
                            className="text-slate-500 hover:text-[#D32F2F] transition-colors flex items-center gap-1"
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
                            className="text-[#D32F2F] font-medium hover:underline flex items-center gap-1"
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
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

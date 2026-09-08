"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FolderGit2, ExternalLink, Code2, Eye, RefreshCw, Database, CheckCircle2 } from "lucide-react";
import { soundFx } from "@/lib/audio/sound";
import { ProjectData } from "@/components/ProjectModal";
import ScrollReveal from "@/components/ScrollReveal";
import { createClient } from "@/lib/supabase/client";

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

  const handleSyncSupabase = async () => {
    soundFx.playClick();
    setIsFetching(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("Project").select("*").order("created_at", { ascending: false });
      if (!error && data) {
        setLiveData(data);
        setLastFetched(new Date().toLocaleTimeString("id-ID"));
      }
    } catch (e) {
      console.warn("Client fetch error:", e);
    } finally {
      setIsFetching(false);
    }
  };

  const projectsToUse = liveData && liveData.length > 0 ? liveData : (fetchedProjects && fetchedProjects.length > 0 ? fetchedProjects : null);

  const displayProjects: ProjectData[] = projectsToUse
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

  return (
    <section id="projects" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-b border-current/10">
      <div className="space-y-8 text-left">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DC2626]/15 text-[#DC2626] text-xs font-mono font-bold tracking-widest uppercase">
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>PORTFOLIO SHOWCASE</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-bold">
                <Database className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>SUPABASE FETCH ACTIVE</span>
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight">
              FEATURED <span className="text-[#DC2626]">PROJECTS</span>
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
              <span>{isFetching ? "Fetching Supabase..." : "Sync Live Supabase Data"}</span>
            </button>
            {lastFetched && (
              <span className="text-[10px] font-mono opacity-70 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{lastFetched}</span>
              </span>
            )}
          </div>
        </div>

        {/* 3D Glassmorphism Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProjects.map((project, idx) => (
            <ScrollReveal key={project.id} direction="up" delayMs={idx * 120}>
              <div
                className={`rounded-2xl border overflow-hidden transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between group cursor-pointer ${
                  isNight
                    ? "bg-[#1A211A]/90 border-[#2A2F26] hover:border-[#DC2626] hover:shadow-xl hover:shadow-[#DC2626]/20"
                    : "bg-[#ffffff] border-[#E5E5E2] hover:border-[#DC2626] hover:shadow-xl"
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
                    onClick={() => {
                      soundFx.playClick();
                      onSelectProject(project);
                    }}
                    className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-[#DC2626] text-white font-bold text-xs flex items-center gap-1.5 shadow-lg hover:scale-105 transition-transform"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{lang === "id" ? "Detail Case Study" : "Case Study"}</span>
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
                          className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-current/5 border border-current/10 opacity-90"
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
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FolderGit2, ExternalLink, Code2, Eye, RefreshCw, Database, CheckCircle2 } from "lucide-react";
import { soundFx } from "@/lib/audio/sound";
import { ProjectData } from "@/components/ProjectModal";
import { createClient } from "@/lib/supabase/client";
import TiltCard from "@/components/TiltCard";
import ProjectImageCarousel from "@/components/ProjectImageCarousel";

const showcaseProjects: ProjectData[] = [];

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
    <section id="projects" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20 border-b-4 border-black dark:border-white">
      <div className="space-y-5 sm:space-y-8 text-left">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <h2 className="font-mono text-2xl sm:text-5xl font-black uppercase tracking-tight text-black dark:text-white leading-none">
              PROYEK &amp; <span className="bg-[#FFFF00] text-black px-2 py-0.5 border-3 border-black">PORTFOLIO</span>
            </h2>
            <p className="text-xs sm:text-base text-black dark:text-white leading-relaxed font-mono font-bold">
              {lang === "id"
                ? "Eksplorasi aplikasi web dan implementasi sistem AI yang dibangun secara nyata."
                : "Real-world web application projects and AI system implementations."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSyncSupabase}
              disabled={isFetching}
              className="px-4 py-2 rounded-none border-3 border-black dark:border-white bg-[#FFFF00] text-black text-xs font-mono font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-black" : ""}`} />
              <span>{isFetching ? (lang === "id" ? "MENGHUBUNGKAN..." : "SYNCING...") : (lang === "id" ? "SINKRONKAN DATA" : "SYNC LIVE DATA")}</span>
            </button>
            {lastFetched && (
              <span className="text-xs font-mono font-black text-black dark:text-white flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-[#00FF66]" />
                <span>{lastFetched}</span>
              </span>
            )}
          </div>
        </div>

        {/* Category Filter Chips / Tabs (Pure Brutalism Sharp Tabs) */}
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
                className={`px-4 py-1.5 rounded-none text-xs font-mono font-black transition-all cursor-pointer whitespace-nowrap border-3 border-black dark:border-white uppercase ${
                  isActive
                    ? "bg-[#166534] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                    : isNight
                    ? "bg-black text-white hover:bg-neutral-800"
                    : "bg-white text-black hover:bg-neutral-200"
                }`}
              >
                [{cat}]
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
                className="rounded-none border-4 border-black dark:border-white p-5 space-y-4 animate-pulse bg-white dark:bg-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="w-full h-48 rounded-none bg-neutral-300 dark:bg-neutral-800" />
                <div className="h-5 w-3/4 bg-neutral-300 dark:bg-neutral-800 rounded-none" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-neutral-300 dark:bg-neutral-800 rounded-none" />
                  <div className="h-3 w-5/6 bg-neutral-300 dark:bg-neutral-800 rounded-none" />
                </div>
              </div>
            ))}
          </div>
        ) : displayProjects.length === 0 ? (
          <div className="p-10 rounded-none border-4 border-black dark:border-white text-center space-y-3 bg-white dark:bg-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
            <FolderGit2 className="w-8 h-8 text-[#166534] mx-auto opacity-80" />
            <p className="text-xs font-mono font-black uppercase text-black dark:text-white">
              {lang === "id" ? "BELUM ADA PROYEK UNTUK KATEGORI INI." : "NO PROJECTS FOUND IN THIS CATEGORY."}
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory(lang === "id" ? "Semua" : "All")}
              className="text-xs font-mono font-black text-[#166534] underline cursor-pointer uppercase"
            >
              {lang === "id" ? "TAMPILKAN SEMUA PROYEK" : "SHOW ALL PROJECTS"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayProjects.map((project) => (
              <TiltCard
                key={project.id}
                onClick={() => {
                  soundFx.playClick();
                  onSelectProject(project);
                }}
              >
                <div
                  className={`rounded-none border-4 border-black dark:border-white overflow-hidden transition-all duration-150 flex flex-col justify-between group cursor-pointer shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(22,101,52,1)] ${
                    isNight
                      ? "bg-black"
                      : "bg-white"
                  }`}
                >
                  {/* Thumbnail Carousel Container */}
                  <div className="relative w-full overflow-hidden bg-black border-b-4 border-black dark:border-white">
                    <ProjectImageCarousel
                      thumbnail={project.thumbnail}
                      title={project.title}
                      aspectRatioClass="h-48 sm:h-52"
                    />

                    {/* Overlay Action Badge */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFx.playClick();
                        onSelectProject(project);
                      }}
                      className="absolute bottom-3 right-3 z-20 px-3 py-1.5 rounded-none bg-[#166534] text-white text-xs font-mono font-black flex items-center gap-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{lang === "id" ? "DETAIL PROYEK" : "VIEW CASE STUDY"}</span>
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-mono font-black uppercase text-black dark:text-white leading-snug group-hover:text-[#166534] transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs text-black dark:text-white leading-relaxed font-mono font-bold line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech Stack Badges */}
                    <div className="space-y-3 pt-2">
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack?.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded-none text-[10px] font-mono font-black border-2 border-black dark:border-white bg-[#FFFF00] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Card Bottom Links */}
                      <div className="pt-3 border-t-3 border-black dark:border-white flex items-center justify-between gap-2 text-xs font-mono font-black">
                        {project.repository_url && (
                          <a
                            href={project.repository_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation();
                              soundFx.playClick();
                            }}
                            className="text-black dark:text-white hover:text-[#166534] transition-colors flex items-center gap-1"
                          >
                            <Code2 className="w-3.5 h-3.5" />
                            <span>CODE</span>
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
                            className="text-[#166534] font-black underline flex items-center gap-1"
                          >
                            <span>DEMO</span>
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

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FolderGit2, ExternalLink, Code2, Eye, Search, Sparkles, Filter, Mail } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { soundFx } from "@/lib/audio/sound";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import QuickContactFAB from "@/components/QuickContactFAB";
import { ProjectItem } from "@/lib/actions/project";
import ProjectModal, { ProjectData } from "@/components/ProjectModal";
import TiltCard from "@/components/TiltCard";
import ProjectImageCarousel from "@/components/ProjectImageCarousel";

const DEFAULT_PROJECTS: ProjectData[] = [
  {
    id: "proj-1",
    title: "Personal Portfolio & Article Studio Platform",
    description: "Platform portofolio personal & studio manajemen artikel berskala produksi dengan arsitektur Next.js 15, Supabase Auth, Prisma ORM, Xendit Payment Gateway, dan ElevenLabs AI Voice TTS.",
    thumbnail: "/images/project1.png",
    demo_url: "https://brimaspradika.vercels.app",
    repository_url: "https://github.com/brimaspradika8-sudo/Personal_Website",
  },
  {
    id: "proj-2",
    title: "Article Studio & AI Text-to-Speech Engine",
    description: "Sistem studio editor artikel ala Microsoft Word dengan fitur AI Assistant, Edge Neural TTS voice generator, kontrol akses bertingkat (VIP Member), dan reaksi/komentar 0ms Optimistic UI.",
    thumbnail: "/images/project2.png",
    demo_url: "https://brimaspradika.vercels.app/artikel",
    repository_url: "https://github.com/brimaspradika8-sudo/Personal_Website",
  },
  {
    id: "proj-3",
    title: "Askyle Web Application System",
    description: "Sistem informasi berbasis PHP & MySQL dengan integrasi database terstruktur, antarmuka responsif, dan pengolahan data kueri performa tinggi.",
    thumbnail: "/images/project3.png",
    demo_url: "",
    repository_url: "https://github.com/brimaspradika8-sudo/Askyle",
  },
];

interface ProyekClientProps {
  initialProjects?: ProjectItem[];
}

export default function ProyekClient({ initialProjects = [] }: ProyekClientProps) {
  const { lang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedProjectModal, setSelectedProjectModal] = useState<ProjectData | null>(null);

  const categories = lang === "id"
    ? ["Semua", "Web", "AI", "Fullstack", "Laravel", "Next.js"]
    : ["All", "Web", "AI", "Fullstack", "Laravel", "Next.js"];

  // Mapping backend ProjectItem to ProjectData
  const projectsData: ProjectData[] = initialProjects.length > 0
    ? initialProjects.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        thumbnail: p.thumbnail || "/images/project1.png",
        demo_url: p.demo_url || "",
        repository_url: p.repository_url || "",
      }))
    : DEFAULT_PROJECTS;

  // Filter projects by search query & category tag
  const filteredProjects = projectsData.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === "Semua" || selectedCategory === "All") return true;

    const cat = selectedCategory.toLowerCase();
    const titleDesc = (p.title + " " + p.description).toLowerCase();

    return titleDesc.includes(cat);
  });

  const isLiveDemoValid = (url?: string | null) => {
    if (!url) return false;
    const trimmed = url.trim();
    if (!trimmed || trimmed === "#") return false;
    return trimmed.startsWith("http://") || trimmed.startsWith("https://");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-[#EAB308] selection:text-black pb-28 sm:pb-20">
      
      {/* Container Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-8 sm:space-y-12">

        {/* 1. TOP NAV BREADCRUMB */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-white dark:bg-black border-3 border-black dark:border-white text-xs font-mono font-black text-black dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer group uppercase"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#166534] dark:text-[#EAB308]" />
            <span>{lang === "id" ? "KEMBALI KE BERANDA" : "BACK TO HOME"}</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-[#EAB308] text-black border-2 border-black font-mono font-black text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <FolderGit2 className="w-4 h-4 text-black" />
            <span>{projectsData.length} {lang === "id" ? "PROYEK TERPOPULER" : "TOTAL PROJECTS"}</span>
          </div>
        </div>

        {/* 2. HERO HEADER BANNER (Brazil Neo-Brutalism Style) */}
        <section className="relative p-6 sm:p-10 rounded-none border-4 border-black dark:border-white bg-white dark:bg-[#0A0D14] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#166534] border-4 border-black dark:border-white rotate-12 pointer-events-none opacity-20 dark:opacity-30" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-[#166534] text-white border-3 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs font-mono font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#FFFF00]" />
              <span>{lang === "id" ? "PORTOFOLIO REKAYASA PERANGKAT LUNAK" : "SOFTWARE ENGINEERING PORTFOLIO"}</span>
            </div>

            <h1 className="font-serif font-black text-3xl sm:text-6xl uppercase tracking-tight text-black dark:text-white leading-tight">
              PROYEK &amp; <span className="text-[#166534] dark:text-[#00E676] bg-[#FFFF00] text-black px-2 py-0.5 border-3 border-black">PORTOFOLIO</span>
            </h1>

            <p className="text-xs sm:text-base font-mono font-bold text-black dark:text-white max-w-3xl leading-relaxed">
              {lang === "id"
                ? "Daftar aplikasi web nyata, integrasi sistem kecerdasan buatan (AI), arsitektur fullstack, dan repositori open-source yang telah dirancang & diimplementasikan."
                : "A showcase of real-world web applications, AI system integrations, fullstack architectures, and open-source repositories."}
            </p>
          </div>
        </section>

        {/* 3. SEARCH & FILTER CONTROLS BAR */}
        <div className="p-4 rounded-none border-4 border-black dark:border-white bg-white dark:bg-[#0A0D14] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === "id" ? "Cari nama proyek atau kata kunci..." : "Search project title or keywords..."}
                className="w-full pl-10 pr-4 py-2.5 rounded-none border-3 border-black dark:border-white bg-slate-50 dark:bg-[#121824] text-xs font-mono font-bold text-black dark:text-white focus:outline-none focus:bg-white dark:focus:bg-black placeholder:text-neutral-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-black text-neutral-400 hover:text-black dark:hover:text-white"
                >
                  [CLEAR]
                </button>
              )}
            </div>

            <div className="px-4 py-2.5 rounded-none border-3 border-black dark:border-white bg-[#166534] text-white text-xs font-mono font-black shrink-0 uppercase">
              {filteredProjects.length} {lang === "id" ? "Proyek Ditemukan" : "Projects Found"}
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
            <span className="text-xs font-mono font-black uppercase text-neutral-500 shrink-0 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              Kategori:
            </span>
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
                  className={`px-3.5 py-1.5 rounded-none text-xs font-mono font-black transition-all cursor-pointer whitespace-nowrap border-2 border-black dark:border-white uppercase ${
                    isActive
                      ? "bg-[#166534] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
                      : "bg-white dark:bg-black text-black dark:text-white hover:bg-[#FEF9C3] dark:hover:bg-neutral-800"
                  }`}
                >
                  [{cat}]
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. PROJECTS GRID */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 rounded-none border-4 border-black dark:border-white text-center space-y-4 bg-white dark:bg-[#0A0D14] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
            <FolderGit2 className="w-10 h-10 text-[#166534] mx-auto opacity-80" />
            <div className="space-y-1">
              <h3 className="text-base font-mono font-black uppercase text-black dark:text-white">
                {lang === "id" ? "TIDAK ADA PROYEK DITEMUKAN" : "NO PROJECTS FOUND"}
              </h3>
              <p className="text-xs font-mono text-neutral-500 font-bold">
                {lang === "id" ? `Tidak ada proyek yang sesuai dengan filter "${searchQuery || selectedCategory}".` : `No projects match "${searchQuery || selectedCategory}".`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setSearchQuery("");
                setSelectedCategory(lang === "id" ? "Semua" : "All");
              }}
              className="px-5 py-2 bg-[#EAB308] text-black border-3 border-black text-xs font-mono font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              {lang === "id" ? "RESET SEMUA FILTER" : "RESET FILTERS"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <TiltCard
                key={project.id}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedProjectModal(project);
                }}
              >
                <div className="h-full rounded-none border-4 border-black dark:border-white bg-white dark:bg-[#0A0D14] overflow-hidden flex flex-col justify-between group cursor-pointer shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(22,101,52,1)] transition-all">
                  
                  {/* Thumbnail Carousel Container */}
                  <div className="relative w-full overflow-hidden bg-black border-b-4 border-black dark:border-white">
                    <ProjectImageCarousel
                      thumbnail={project.thumbnail}
                      title={project.title}
                      aspectRatioClass="h-52"
                    />

                    {/* View Detail Overlay Badge */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFx.playClick();
                        setSelectedProjectModal(project);
                      }}
                      className="absolute bottom-3 right-3 z-20 px-3 py-1.5 bg-[#166534] text-white text-xs font-mono font-black flex items-center gap-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{lang === "id" ? "DETAIL PROYEK" : "VIEW DETAILS"}</span>
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-mono font-black uppercase text-black dark:text-white leading-snug group-hover:text-[#166534] transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300 leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    {/* Card Footer Links */}
                    <div className="pt-3 border-t-3 border-black dark:border-white flex items-center justify-between text-xs font-mono font-black">
                      {project.repository_url && project.repository_url !== "#" ? (
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
                      ) : (
                        <span className="text-neutral-400 font-mono text-[10px] uppercase">PRIVATE REPO</span>
                      )}

                      {isLiveDemoValid(project.demo_url) && (
                        <a
                          href={project.demo_url!}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                            soundFx.playClick();
                          }}
                          className="text-[#166534] dark:text-[#00E676] font-black underline flex items-center gap-1"
                        >
                          <span>LIVE DEMO</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                  </div>

                </div>
              </TiltCard>
            ))}
          </div>
        )}

        {/* 5. COLLABORATION CTA BANNER */}
        <section className="p-8 sm:p-12 rounded-none border-4 border-black dark:border-white bg-[#166534] text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] space-y-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#EAB308] text-black border-2 border-black text-xs font-mono font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>KOLABORASI &amp; IDE BARU</span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-4xl uppercase leading-tight text-white">
              INGIN MEMBANGUN PROYEK SERUPA?
            </h2>
            <p className="text-xs sm:text-sm font-mono font-bold leading-relaxed text-slate-100">
              Terbuka untuk konsultasi pembuatan sistem web custom, integrasi AI Agent, arsitektur database, atau diskusi proyek open-source.
            </p>
          </div>

          <a
            href="mailto:brimaspradika8@gmail.com"
            onClick={() => soundFx.playClick()}
            className="w-full sm:w-auto px-6 py-3 rounded-none bg-[#EAB308] hover:bg-[#d9a207] text-black border-3 border-black font-mono font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer inline-flex items-center justify-center gap-2 shrink-0"
          >
            <Mail className="w-4 h-4" />
            <span>KIRIM EMAIL DISKUSI</span>
          </a>
        </section>

      </div>

      {/* Detail Project Modal */}
      <ProjectModal
        project={selectedProjectModal}
        onClose={() => setSelectedProjectModal(null)}
      />

      {/* Floating Bottom Nav */}
      <MobileBottomNav />

      {/* Quick Contact FAB */}
      <QuickContactFAB />

      {/* Footer */}
      <div className="pt-16">
        <Footer />
      </div>
    </div>
  );
}

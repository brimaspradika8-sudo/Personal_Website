"use client";

import React from "react";
import { FolderGit2, ExternalLink, Code2, Eye } from "lucide-react";
import { soundFx } from "@/lib/audio/sound";
import { ProjectData } from "@/components/ProjectModal";
import { ProjectItem } from "@/lib/actions/project";
import TiltCard from "@/components/TiltCard";
import ProjectImageCarousel from "@/components/ProjectImageCarousel";

const showcaseProjects: ProjectData[] = [
  {
    id: "proj-1",
    title: "Personal Portfolio & Article Studio Platform",
    description: "Platform portofolio personal & studio manajemen artikel berskala produksi dengan arsitektur Next.js 15, Supabase Auth, Prisma ORM, Xendit Payment Gateway, dan ElevenLabs AI Voice TTS.",
    thumbnail: "/images/project1.png",
    demo_url: "https://brimaspradika.vercels.app",
    repository_url: "https://github.com/brimaspradika8-sudo/Personal_Website",
    techStack: ["Next.js 15", "TypeScript", "Prisma", "Supabase", "TailwindCSS"],
  },
  {
    id: "proj-2",
    title: "Article Studio & AI Text-to-Speech Engine",
    description: "Sistem studio editor artikel ala Microsoft Word dengan fitur AI Assistant, Edge Neural TTS voice generator, kontrol akses bertingkat (VIP Member), dan reaksi/komentar 0ms Optimistic UI.",
    thumbnail: "/images/project2.png",
    demo_url: "https://brimaspradika.vercels.app/artikel",
    repository_url: "https://github.com/brimaspradika8-sudo/Personal_Website",
    techStack: ["Next.js", "Edge Neural AI", "TypeScript", "TailwindCSS"],
  },
  {
    id: "proj-3",
    title: "Askyle Web Application System",
    description: "Sistem informasi berbasis PHP & MySQL dengan integrasi database terstruktur, antarmuka responsif, dan pengolahan data kueri performa tinggi.",
    thumbnail: "/images/project3.png",
    demo_url: "",
    repository_url: "https://github.com/brimaspradika8-sudo/Askyle",
    techStack: ["PHP", "MySQL", "JavaScript", "Bootstrap"],
  },
];

interface ProjectShowcaseProps {
  isNight: boolean;
  lang: "id" | "en";
  onSelectProject: (project: ProjectData) => void;
  fetchedProjects?: (ProjectItem | Record<string, unknown>)[];
}

export default function ProjectShowcase({ isNight, lang, onSelectProject, fetchedProjects }: ProjectShowcaseProps) {
  const projectsToUse = fetchedProjects && fetchedProjects.length > 0 ? fetchedProjects : null;

  const displayProjects: ProjectData[] = projectsToUse
    ? projectsToUse.map((fp: any, i) => ({
        id: String(fp.id || `supa-${i}`),
        title: String(fp.title || "Untitled Project"),
        description: String(fp.description || "No description provided."),
        thumbnail: String(fp.thumbnail || `/images/project${(i % 3) + 1}.png`),
        demo_url: String(fp.demo_url || "#"),
        repository_url: String(fp.repository_url || "#"),
        techStack: Array.isArray(fp.techStack) ? (fp.techStack as string[]) : ["Next.js", "TypeScript", "Prisma"],
      }))
    : showcaseProjects;

  return (
    <section id="projects" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20 border-b-4 border-black dark:border-white">
      <div className="space-y-5 sm:space-y-8 text-left">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tight text-black dark:text-white leading-none">
              PROYEK &amp; <span className="bg-[#FFFF00] text-black px-2 py-0.5 border-3 border-black">PORTFOLIO</span>
            </h2>
            <p className="text-xs sm:text-base text-black dark:text-white leading-relaxed font-bold">
              {lang === "id"
                ? "Eksplorasi aplikasi web dan implementasi sistem AI yang dibangun secara nyata."
                : "Real-world web application projects and AI system implementations."}
            </p>
          </div>
        </div>

        {/* Project Cards Grid */}
        {displayProjects.length === 0 ? (
          <div className="p-10 rounded-none border-4 border-black dark:border-white text-center space-y-3 bg-white dark:bg-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
            <FolderGit2 className="w-8 h-8 text-[#166534] mx-auto opacity-80" />
            <p className="text-xs font-black uppercase text-black dark:text-white">
              {lang === "id" ? "BELUM ADA PROYEK TERSEDIA." : "NO PROJECTS AVAILABLE."}
            </p>
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
                      className="absolute bottom-3 right-3 z-20 px-3 py-1.5 rounded-none bg-[#166534] text-white text-xs font-black flex items-center gap-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{lang === "id" ? "DETAIL PROYEK" : "VIEW CASE STUDY"}</span>
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-black uppercase text-black dark:text-white leading-snug group-hover:text-[#166534] transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs text-black dark:text-white leading-relaxed font-bold line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech Stack Badges */}
                    <div className="space-y-3 pt-2">
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack?.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded-none text-[10px] font-black border-2 border-black dark:border-white bg-[#FFFF00] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Card Bottom Links */}
                      <div className="pt-3 border-t-3 border-black dark:border-white flex items-center justify-between gap-2 text-xs font-black">
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

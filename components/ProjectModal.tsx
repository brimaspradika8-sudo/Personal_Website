"use client";

import React, { useEffect, useState } from "react";
import { X, ExternalLink, Code2 } from "lucide-react";
import { soundFx } from "@/lib/audio/sound";
import { useLanguage } from "@/lib/i18n/LanguageContext";

import ProjectImageCarousel from "@/components/ProjectImageCarousel";

export interface ProjectData {
  id: string;
  title: string;
  slug?: string;
  description: string;
  thumbnail: string | null;
  demo_url: string | null;
  repository_url: string | null;
  techStack?: string[];
}

interface ProjectModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { lang } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (project) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      setIsVisible(false);
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  const isLiveDemoValid = (url?: string | null) => {
    if (!url) return false;
    const trimmed = url.trim();
    if (!trimmed || trimmed === "#") return false;
    return trimmed.startsWith("http://") || trimmed.startsWith("https://");
  };

  if (!project) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto pointer-events-auto transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop Blur Container */}
      <button
        type="button"
        onClick={() => {
          soundFx.playClick();
          onClose();
        }}
        aria-label="Tutup modal proyek"
        className="fixed inset-0 bg-black/80 backdrop-blur-md -z-10"
      />

      {/* Modal Container */}
      <div
        className={`w-full max-w-2xl bg-[#0D0D0E] border border-white/15 dark:border-[#26262A] rounded-2xl overflow-hidden text-[#F1EFE9] shadow-2xl relative flex flex-col max-h-[88vh] my-auto transition-all duration-200 ease-out ${
          isVisible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"
        }`}
      >
            {/* Header Image / Thumbnail Banner */}
            <div className="relative w-full overflow-hidden bg-black shrink-0">
              <ProjectImageCarousel
                thumbnail={project.thumbnail}
                title={project.title}
                aspectRatioClass="h-56 sm:h-64"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0E] via-transparent to-transparent pointer-events-none" />

              {/* Top Close Button */}
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  onClose();
                }}
                className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/60 hover:bg-[#166534] text-white hover:text-white border border-white/20 transition-all cursor-pointer shadow-lg hover:scale-105"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            {/* Content Body Section */}
            <div className="p-6 sm:p-7 overflow-y-auto space-y-6 flex-1">
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-snug">
                  {project.title}
                </h2>
                <p className="text-xs text-[#166534] uppercase font-bold tracking-wider">
                  {lang === "id" ? "Proyek Software System" : "Software System Project"}
                </p>
              </div>

              {/* Overview / Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">
                  {lang === "id" ? "DESKRIPSI PROYEK" : "PROJECT OVERVIEW"}
                </h3>
                <p className="text-sm text-white/90 leading-relaxed font-normal break-words">
                  {project.description}
                </p>
              </div>

              {/* Action Links */}
              <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                {project.repository_url && project.repository_url !== "#" ? (
                  <a
                    href={project.repository_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundFx.playClick()}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <Code2 className="w-4 h-4 text-white/70" />
                    <span>{lang === "id" ? "Lihat Source Code" : "View Source Code"}</span>
                  </a>
                ) : (
                  <div />
                )}

                {isLiveDemoValid(project.demo_url) && (
                  <a
                    href={project.demo_url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundFx.playClick()}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#EAB308] hover:bg-[#166534] text-slate-950 hover:text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <span>{lang === "id" ? "Buka Live Demo" : "Open Live Demo"}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
      </div>
    </div>
  );
}

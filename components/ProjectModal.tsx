"use client";

import React from "react";
import Image from "next/image";
import { X, ExternalLink, FolderGit2, Code2, Sparkles, CheckCircle2 } from "lucide-react";
import { soundFx } from "@/lib/audio/sound";

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
  if (!project) return null;

  const defaultTechStack = ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "Supabase"];
  const techList = project.techStack || defaultTechStack;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="w-full max-w-2xl bg-stone-900/95 border border-amber-400/40 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-2xl text-white relative flex flex-col max-h-[90vh]">
        
        {/* Header Image / Thumbnail Banner */}
        <div className="relative w-full h-48 sm:h-64 bg-stone-950 shrink-0">
          <Image
            src={project.thumbnail || "/images/project1.png"}
            alt={project.title}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
          
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-stone-950/70 hover:bg-stone-900 text-white border border-white/20 backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 backdrop-blur-md uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Project Showcase</span>
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
              {project.title}
            </h2>
            <p className="text-xs font-medium text-amber-300/90 mt-1">
              Project Exploration & Software Architecture
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Deskripsi Project</h3>
            <p className="text-sm text-slate-200 leading-relaxed break-words">
              {project.description}
            </p>
          </div>

          {/* Tech Stack List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Teknologi Digunakan</h3>
            <div className="flex flex-wrap gap-2">
              {techList.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-white/10 text-amber-200 border border-white/15 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{tech}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            {project.repository_url ? (
              <a
                href={project.repository_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFx.playClick()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 flex items-center justify-center gap-2 transition-all"
              >
                <Code2 className="w-4 h-4 text-amber-400" />
                <span>Lihat Repository Code</span>
              </a>
            ) : (
              <div />
            )}

            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFx.playClick()}
                className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 transition-all"
              >
                <span>Buka Live Demo</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

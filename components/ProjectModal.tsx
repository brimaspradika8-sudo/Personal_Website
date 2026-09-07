"use client";

import React from "react";
import Image from "next/image";
import { X, ExternalLink, Code2, CheckCircle2 } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#12160F]/80 backdrop-blur-sm animate-fadeIn">
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="w-full max-w-2xl bg-[#1A211A] border border-[#2A2F26] rounded-xl overflow-hidden text-[#F1EFE9] relative flex flex-col max-h-[90vh]">
        
        {/* Header Image / Thumbnail Banner */}
        <div className="relative w-full h-48 sm:h-64 bg-[#12160F] shrink-0">
          <Image
            src={project.thumbnail || "/images/project1.png"}
            alt={project.title}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A211A] via-[#1A211A]/40 to-transparent" />
          
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="absolute top-3 right-3 p-2 rounded-lg bg-[#12160F]/80 hover:bg-[#12160F] text-[#F1EFE9] border border-[#2A2F26] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div>
            <h2 className="font-display text-2xl font-bold text-[#F1EFE9]">
              {project.title}
            </h2>
            <p className="text-xs text-[#A8A79C] mt-1">
              Eksplorasi Project & Arsitektur Perangkat Lunak
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-medium text-[#A8A79C]">Deskripsi Project</h3>
            <p className="text-sm text-[#F1EFE9] leading-relaxed break-words">
              {project.description}
            </p>
          </div>

          {/* Tech Stack List */}
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-[#A8A79C]">Teknologi Digunakan</h3>
            <div className="flex flex-wrap gap-2">
              {techList.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-lg text-xs font-mono bg-[#12160F] text-[#F1EFE9] border border-[#2A2F26] flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3B5D42]" />
                  <span>{tech}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-4 border-t border-[#2A2F26] flex flex-col sm:flex-row items-center justify-between gap-3">
            {project.repository_url ? (
              <a
                href={project.repository_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFx.playClick()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#12160F] hover:bg-[#212A20] text-[#F1EFE9] font-medium text-xs sm:text-sm border border-[#2A2F26] flex items-center justify-center gap-2 transition-colors"
              >
                <Code2 className="w-4 h-4 text-[#A8A79C]" />
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
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#A6532D] hover:bg-[#8A4425] text-[#F1EFE9] font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
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

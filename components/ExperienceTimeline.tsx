"use client";

import React from "react";
import { GraduationCap, Code2, Award, Calendar } from "lucide-react";

interface TimelineItem {
  id: string;
  year: string;
  title: string;
  organization: string;
  description: string;
  icon: typeof GraduationCap;
  highlights: string[];
}

const timelineData: TimelineItem[] = [
  {
    id: "time-1",
    year: "2024 - PRESENT",
    title: "Student & AI Systems Developer",
    organization: "SMK Bhakti Mulia Pare",
    description: "Membangun aplikasi berbasis kecerdasan buatan, integrasi LLM API, RESTful API backend, serta arsitektur antarmuka modern yang scalable.",
    icon: GraduationCap,
    highlights: ["AI Systems & LLM Integration", "PHP & Laravel 11", "React & Next.js App Router", "Python & Supabase"],
  },
  {
    id: "time-2",
    year: "2024",
    title: "Backend Architecture & Database Engineering",
    organization: "Project Engineering",
    description: "Perancangan database relasional terstruktur, ORM Prisma, integrasi Supabase Realtime, serta keamanan REST API.",
    icon: Code2,
    highlights: ["Prisma ORM", "Supabase BaaS", "RESTful API Security", "Database Indexing"],
  },
  {
    id: "time-3",
    year: "2023",
    title: "Frontend Development & Web Fundamentals",
    organization: "Web Development",
    description: "Penguasaan dasar-dasar web development, JavaScript ES6+, Vanilla CSS & Tailwind CSS, serta arsitektur komponen React.",
    icon: Award,
    highlights: ["JavaScript ES6+", "Tailwind CSS", "React Components", "UI Micro-interactions"],
  },
];

interface ExperienceTimelineProps {
  isNight: boolean;
  lang: "id" | "en";
}

export default function ExperienceTimeline({ isNight, lang }: ExperienceTimelineProps) {
  return (
    <section id="experience" className="scroll-mt-20 max-w-6xl mx-auto px-4 sm:px-6 py-20 border-b border-slate-200 dark:border-slate-800/80">
      <div className="space-y-10 text-left">
        
        {/* Header */}
        <div className="space-y-2 max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {lang === "id" ? "Pengalaman & Tahap Belajar" : "Experience & Learning Journey"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
            {lang === "id"
              ? "Perjalanan pengembangan kemampuan teknis sebagai siswa SMK Bhakti Mulia Pare dalam bidang AI Systems & Software Engineering."
              : "Timeline of technical learning and development as an AI Systems Developer student."}
          </p>
        </div>

        {/* Vertical Clean Timeline */}
        <div className="relative pl-6 sm:pl-8 border-l border-slate-200 dark:border-slate-800 space-y-10">
          {timelineData.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.id} className="relative group">
                
                {/* Node Marker */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold shadow-xs">
                  <IconComponent className="w-3 h-3 text-[#D32F2F]" />
                </div>

                {/* Content Area */}
                <div className={`p-6 rounded-2xl border transition-all duration-200 ${
                  isNight
                    ? "bg-[#0E1015] border-slate-800/80"
                    : "bg-white border-slate-200 shadow-xs"
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-mono text-[#D32F2F] flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{item.year}</span>
                      </span>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{item.title}</h3>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 self-start sm:self-auto font-sans">
                      {item.organization}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans mt-2">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-4">
                    {item.highlights.map((badge) => (
                      <span
                        key={badge}
                        className="px-2.5 py-1 rounded-md text-[11px] font-sans bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

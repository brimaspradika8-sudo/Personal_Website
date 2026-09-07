"use client";

import React from "react";
import { Briefcase, GraduationCap, Code2, Award, Calendar } from "lucide-react";

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
    title: "Student & Fullstack Web Developer",
    organization: "SMK Bhakti Mulia Pare",
    description: "Aktif mengeksplorasi dan membangun aplikasi web komprehensif dari backend logic, RESTful API, hingga antarmuka pengguna (UI) yang responsif dan interaktif.",
    icon: GraduationCap,
    highlights: ["PHP & Laravel 11", "React & Next.js App Router", "MySQL & PostgreSQL", "Docker Containerization"],
  },
  {
    id: "time-2",
    year: "2024",
    title: "Backend Architecture & Database Engineering",
    organization: "Self-Directed & Project Builds",
    description: "Fokus pada pembuatan arsitektur database relasional terstruktur, skema Prisma ORM, integrasi Supabase Realtime, dan keamanan REST API.",
    icon: Code2,
    highlights: ["Prisma ORM", "Supabase BaaS", "RESTful API Security", "Database Indexing"],
  },
  {
    id: "time-3",
    year: "2023",
    title: "Frontend Development & Interactive UI Exploration",
    organization: "Software Exploration",
    description: "Mempelajari fundamental modern web development, JavaScript ES6+, Vanilla & Tailwind CSS, serta komponen React reusable.",
    icon: Award,
    highlights: ["JavaScript ES6+", "Tailwind CSS", "React Components", "UI/UX Micro-animations"],
  },
];

interface ExperienceTimelineProps {
  isNight: boolean;
  lang: "id" | "en";
}

export default function ExperienceTimeline({ isNight, lang }: ExperienceTimelineProps) {
  return (
    <section id="experience" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-b border-current/10">
      <div className="space-y-10 text-left">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DC2626]/15 text-[#DC2626] text-xs font-mono font-bold tracking-widest uppercase">
            <Briefcase className="w-3.5 h-3.5" />
            <span>JOURNEY &amp; MILESTONES</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight">
            EXPERIENCE &amp; <span className="text-[#DC2626]">LEARNING TIMELINE</span>
          </h2>
          <p className="text-xs sm:text-sm opacity-80 max-w-xl font-sans">
            {lang === "id"
              ? "Langkah perjalanan dan milestone pengembangan diri saya sebagai siswa Fullstack Developer di SMK Bhakti Mulia Pare."
              : "My learning journey and development milestones as a Fullstack Developer student at SMK Bhakti Mulia Pare."}
          </p>
        </div>

        {/* Vertical Glowing Timeline */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#DC2626]/40 space-y-10">
          {timelineData.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.id} className="relative group">
                
                {/* Glowing Node Marker */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-[#DC2626] text-white flex items-center justify-center font-bold shadow-md shadow-[#DC2626]/40 group-hover:scale-125 transition-transform duration-300">
                  <IconComponent className="w-3.5 h-3.5 text-white" />
                </div>

                {/* Content Card */}
                <div className={`p-6 rounded-2xl border transition-all duration-300 ${
                  isNight
                    ? "bg-[#1A211A] border-[#2A2F26] group-hover:border-[#DC2626]"
                    : "bg-[#F8F8F6] border-[#E5E5E2] group-hover:border-[#DC2626]"
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-[#DC2626] uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{item.year}</span>
                      </span>
                      <h3 className="font-display text-lg font-bold mt-0.5">{item.title}</h3>
                    </div>
                    <span className="text-xs font-mono opacity-70 bg-current/5 px-2.5 py-1 rounded-md border border-current/10 self-start sm:self-auto">
                      {item.organization}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm opacity-85 leading-relaxed font-sans mt-2">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-4">
                    {item.highlights.map((badge) => (
                      <span
                        key={badge}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/30 font-semibold"
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

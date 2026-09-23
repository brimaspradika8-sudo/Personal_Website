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
    year: "2024 - 2026",
    title: "Student Rekayasa Perangkat Lunak",
    organization: "SMK Bhakti Mulia Pare",
    description: "Membangun aplikasi berbasis web dan menggunakan teknologi AI untuk pengembangan sistem cerdas, termasuk pemrograman web, manajemen database,",
    icon: GraduationCap,
    highlights: ["html" , "css", "javascript", "PHP", "MySQL"],
  },
  {
    id: "time-2",
    year: "2026",
    title: "Internship",
    organization: "Language Center & IT",
    description: "Pengalaman kerja praktik di bidang teknologi informasi, termasuk pengembangan aplikasi web, manajemen database, dan pemeliharaan sistem.",
    icon: Code2,
    highlights: ["Laravel", "Next.js", "React Native EXPO", "PostgreSQL", "Prisma ORM", "Docker", "Supabase", "node.js", "Github", "Vercel", "Figma",],
  },
];

interface ExperienceTimelineProps {
  isNight: boolean;
  lang: "id" | "en";
}

export default function ExperienceTimeline({ isNight, lang }: ExperienceTimelineProps) {
  return (
    <section id="experience" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20 border-b-4 border-black dark:border-white">
      <div className="space-y-6 sm:space-y-10 text-left">
        
        {/* Header */}
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-lg bg-[#166534] text-white border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] text-[11px] font-black tracking-widest uppercase">
            <GraduationCap className="w-3.5 h-3.5 text-white" />
          </div>
          <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tight text-black dark:text-white leading-none">
            PENGALAMAN
          </h2>
          <p className="text-xs sm:text-base text-black dark:text-white leading-relaxed font-bold">
            {lang === "id"
              ? "Perjalanan pengembangan kemampuan teknis sebagai siswa SMK Bhakti Mulia Pare dalam bidang AI Systems & Software Engineering."
              : "Timeline of technical learning and development as an AI Systems Developer student."}
          </p>
        </div>


        <div className="relative pl-6 sm:pl-10 border-l-4 border-black dark:border-white space-y-6 sm:space-y-10">
          {timelineData.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.id} className="relative group">
                
                {/* Node Marker */}
                <div className="absolute -left-[38px] sm:-left-[54px] top-2 w-8 h-8 rounded-lg bg-[#166534] text-white border-3 border-black dark:border-white flex items-center justify-center font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <IconComponent className="w-4 h-4 text-white" />
                </div>

                {/* Content Area */}
                <div className={`p-4 sm:p-6 rounded-3xl border-4 border-black dark:border-white transition-all duration-150 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] ${
                  isNight
                    ? "bg-black"
                    : "bg-white"
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-black text-[#166534] dark:text-[#EAB308] flex items-center gap-1 uppercase">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>[{item.year}]</span>
                      </span>
                      <h3 className="text-lg font-black uppercase text-black dark:text-white mt-0.5">{item.title}</h3>
                    </div>
                    <span className="text-xs font-black text-black bg-[#FFFF00] px-3 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] self-start sm:self-auto uppercase">
                      {item.organization}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-black dark:text-white font-bold leading-relaxed mt-2">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-4">
                    {item.highlights.map((badge) => (
                      <span
                        key={badge}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] uppercase"
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

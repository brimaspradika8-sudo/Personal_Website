"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  User,
  GraduationCap,
  MapPin,
  Mail,
  Code2,
  Cpu,
  Sparkles,
  Layers,
  Award,
  ExternalLink,
  ShieldCheck,
  Terminal,
  FileText,
  CheckCircle2,
  Maximize2,
  X,
  Briefcase,
  Heart,
  Flame,
  Globe,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { soundFx } from "@/lib/audio/sound";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import QuickContactFAB from "@/components/QuickContactFAB";
import { TECH_STACK_ITEMS } from "@/lib/tech-stack";

// Timeline milestones
const TIMELINE_EVENTS = [
  {
    year: "2026",
    title_id: "Sertifikasi BCT Trial Class 2026",
    title_en: "BCT Trial Class 2026 Certification",
    school_id: "BCT X Trial Class",
    school_en: "BCT X Trial Class",
    desc_id: "Menyelesaikan kelas pelatihan intensif pemrograman dan integrasi sistem modern dengan nilai memuaskan.",
    desc_en: "Completed an intensive training class on modern programming and systems integration with outstanding performance.",
    badge: "Certification",
    color: "#EAB308",
  },
  {
    year: "2025 - Present",
    title_id: "Siswa Rekayasa Perangkat Lunak (RPL)",
    title_en: "Software Engineering Student (RPL)",
    school_id: "SMK Bhakti Mulia Pare",
    school_en: "SMK Bhakti Mulia Pare High School",
    desc_id: "Mendalami arsitektur perangkat lunak, pemrograman web fullstack, basis data terstruktur, dan integrasi AI.",
    desc_en: "Deepening knowledge in software architecture, fullstack web development, relational databases, and AI integration.",
    badge: "Education",
    color: "#166534",
  },
  {
    year: "2024 - 2025",
    title_id: "Pengembangan Portofolio & Sistem Web AI",
    title_en: "Portfolio & AI Web System Development",
    school_id: "Proyek Mandiri / Independent Projects",
    school_en: "Independent Exploration & Projects",
    desc_id: "Membangun platform personal website berarsitektur Next.js 15, fitur autentikasi Supabase, dan desain Neo-Brutalisme.",
    desc_en: "Built high-performance Next.js 15 web applications featuring Supabase auth and high-contrast Neo-Brutalist UI.",
    badge: "Milestone",
    color: "#00E676",
  },
];

export default function AboutClient() {
  const { lang } = useLanguage();
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-[#EAB308] selection:text-black pb-28 sm:pb-20">
      
      {/* Container wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-10 sm:space-y-14">

        {/* 1. TOP NAV & BREADCRUMB */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-white dark:bg-black border-3 border-black dark:border-white text-xs font-black text-black dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer group uppercase"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#166534] dark:text-[#EAB308]" />
            <span>{lang === "id" ? "KEMBALI KE BERANDA" : "BACK TO HOME"}</span>
          </Link>
        </div>

        {/* 2. HERO HEADER BANNER (Brazil Neo-Brutalism Style) */}
        <section className="relative p-6 sm:p-10 rounded-none border-4 border-black dark:border-white bg-white dark:bg-[#0A0D14] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] overflow-hidden">
          {/* Background Decorative Accent Stripe */}
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-[#EAB308] border-4 border-black dark:border-white rotate-12 pointer-events-none opacity-20 dark:opacity-30" />
          
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-[#EAB308] text-black border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs font-black uppercase tracking-wider">
              <User className="w-4 h-4 text-black" />
              <span>{lang === "id" ? "PROFIL DIRI & REKAM JEJAK" : "PERSONAL PROFILE & BIOGRAPHY"}</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-black text-3xl sm:text-6xl uppercase tracking-tight text-black dark:text-white leading-tight">
                BRIMAS <span className="text-[#166534] dark:text-[#00E676] underline decoration-4 underline-offset-4">PRADIKA UTAMA</span>
              </h1>
              <p className="text-xs sm:text-lg font-bold text-black dark:text-white max-w-3xl leading-relaxed">
                {lang === "id"
                  ? "Junior Programmer & AI Systems Developer berpendidikan di SMK Bhakti Mulia Pare. Berfokus pada arsitektur web modern, integrasi kecerdasan buatan (AI), serta desain sistem performa tinggi."
                  : "Junior Programmer & AI Systems Developer studying at SMK Bhakti Mulia Pare. Dedicated to modern web architecture, artificial intelligence integration, and high-performance system design."}
              </p>
            </div>

            {/* Quick Stats Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-none border-3 border-black dark:border-white bg-[#FEF9C3] dark:bg-[#121824] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] space-y-1">
                <div className="flex items-center gap-1.5 text-[#166534] dark:text-[#EAB308]">
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase">{lang === "id" ? "SEKOLAH" : "SCHOOL"}</span>
                </div>
                <p className="text-xs font-black truncate text-black dark:text-white">SMK Bhakti Mulia Pare</p>
              </div>

              <div className="p-3.5 rounded-none border-3 border-black dark:border-white bg-[#DCFCE7] dark:bg-[#121824] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] space-y-1">
                <div className="flex items-center gap-1.5 text-[#166534] dark:text-[#00E676]">
                  <Code2 className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase">{lang === "id" ? "JURUSAN" : "MAJOR"}</span>
                </div>
                <p className="text-xs font-black truncate text-black dark:text-white">Rekayasa Perangkat Lunak (RPL)</p>
              </div>

              <div className="p-3.5 rounded-none border-3 border-black dark:border-white bg-[#FEF9C3] dark:bg-[#121824] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] space-y-1">
                <div className="flex items-center gap-1.5 text-[#166534] dark:text-[#EAB308]">
                  <MapPin className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase">{lang === "id" ? "LOKASI" : "LOCATION"}</span>
                </div>
                <p className="text-xs font-black truncate text-black dark:text-white">Kediri, Jawa Timur, ID</p>
              </div>

              <div className="p-3.5 rounded-none border-3 border-black dark:border-white bg-[#DCFCE7] dark:bg-[#121824] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] space-y-1">
                <div className="flex items-center gap-1.5 text-[#166534] dark:text-[#00E676]">
                  <Cpu className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase">FOKUS</span>
                </div>
                <p className="text-xs font-black truncate text-black dark:text-white">Next.js &amp; AI Agents</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href="mailto:brimaspradika8@gmail.com"
                onClick={() => soundFx.playClick()}
                className="px-5 py-2.5 rounded-none bg-[#166534] hover:bg-[#14532D] text-white border-3 border-black dark:border-white font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>{lang === "id" ? "HUBUNGI EMAIL" : "CONTACT EMAIL"}</span>
              </a>

              <a
                href="https://github.com/brimaspradika8-sudo"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFx.playClick()}
                className="px-5 py-2.5 rounded-none bg-[#EAB308] hover:bg-[#d9a207] text-black border-3 border-black dark:border-white font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                <span>GITHUB REPOSITORY</span>
              </a>
            </div>
          </div>
        </section>

        {/* 3. ABOUT ME STORY & BIOGRAPHY SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Avatar Cutout & Quote Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-none border-4 border-black dark:border-white bg-[#EAB308] p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] overflow-hidden group">
              <div className="relative w-full h-[320px] sm:h-[380px] bg-[#166534] border-3 border-black overflow-hidden flex items-center justify-center">
                <Image
                  src="/images/avatar.webp"
                  alt="Brimas Pradika Utama"
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badge Overlay */}
                <div className="absolute top-3 left-3 bg-black text-white px-3 py-1 border-2 border-white text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                  SMK BM PARE &bull; RPL
                </div>
              </div>

              {/* Card Footer Caption */}
              <div className="pt-3 text-center">
                <h3 className="font-black text-xl uppercase text-black">BRIMAS PRADIKA UTAMA</h3>
                <p className="text-xs font-black text-slate-900 uppercase">SOFTWARE &amp; AI SYSTEMS DEVELOPER</p>
              </div>
            </div>

            {/* Philosophy Quote Card */}
            <div className="p-5 rounded-none border-4 border-black dark:border-white bg-white dark:bg-[#0A0D14] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,1)] space-y-2">
              <div className="flex items-center gap-2 text-[#166534] dark:text-[#EAB308]">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-black uppercase">{lang === "id" ? "FILOSOFI REKAYASA" : "ENGINEERING PHILOSOPHY"}</span>
              </div>
              <p className="text-xs font-bold leading-relaxed text-black dark:text-white italic">
                &ldquo;{lang === "id"
                  ? "Membangun perangkat lunak bukan sekadar menulis baris kode, melainkan menciptakan solusi yang efisien, terstruktur, dan memberikan dampak nyata bagi pengguna."
                  : "Building software is not just about writing lines of code, but about creating efficient, structured solutions that deliver real user impact."}&rdquo;
              </p>
            </div>
          </div>

          {/* Bio Text & Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#166534] text-white border-3 border-black dark:border-white text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <FileText className="w-3.5 h-3.5 text-white" />
                <span>{lang === "id" ? "BIOGRAFI LENGKAP" : "FULL BIOGRAPHY"}</span>
              </div>
              <h2 className="font-black text-2xl sm:text-4xl uppercase tracking-tight text-black dark:text-white">
                {lang === "id" ? "EKSPLORASI TEKNOLOGI & PERJALANAN CODING" : "TECHNOLOGY EXPLORATION & CODING JOURNEY"}
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-black dark:text-white">
              <p className="p-4 rounded-none border-3 border-black dark:border-white bg-[#FEF9C3] dark:bg-[#121824] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] font-bold">
                  {lang === "id"
                    ? "Saya Brimas Pradika Utama, pengembang perangkat lunak dari Pare, Kediri. Saat ini saya menempuh pendidikan Rekayasa Perangkat Lunak (RPL) di SMK Bhakti Mulia Pare."
                    : "I am Brimas Pradika Utama, a software developer from Pare, Kediri. I am currently studying Software Engineering at SMK Bhakti Mulia Pare."}
              </p>

              <p>
                {lang === "id"
                    ? "Saya berfokus pada arsitektur web modern, integrasi AI Agent, serta pengembangan antarmuka yang terstruktur dan mudah digunakan. Teknologi utama yang saya gunakan meliputi Next.js 15, TypeScript, Prisma, dan Supabase."
                    : "I focus on modern web architecture, AI Agent integration, and structured, usable interfaces. My primary technologies are Next.js 15, TypeScript, Prisma, and Supabase."}
              </p>

              <p>
                {lang === "id"
                    ? "Di luar kegiatan sekolah, saya mengikuti pelatihan dan kegiatan teknologi seperti BCT Trial Class 2026, serta mengembangkan proyek fullstack dan AI sebagai bagian dari penguatan kompetensi."
                    : "Outside school, I participate in technology training such as BCT Trial Class 2026 and develop fullstack and AI projects to strengthen my skills."}
              </p>
            </div>

            {/* Core Values / 4 Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-none border-3 border-black dark:border-white bg-white dark:bg-[#0A0D14] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-2">
                <div className="flex items-center gap-2 text-[#166534] dark:text-[#00E676]">
                  <Zap className="w-4 h-4" />
                  <h4 className="font-black text-xs uppercase">{lang === "id" ? "KODE BERSIH & PERFORMA" : "CLEAN CODE & SPEED"}</h4>
                </div>
                <p className="text-[11px] leading-relaxed text-black dark:text-white">
                  {lang === "id"
                    ? "Menulis kode yang terstruktur, bermemori efisien, dan mudah dipelihara dalam jangka panjang."
                    : "Writing structured, memory-efficient code that is maintainable for the long term."}
                </p>
              </div>

              <div className="p-4 rounded-none border-3 border-black dark:border-white bg-white dark:bg-[#0A0D14] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-2">
                <div className="flex items-center gap-2 text-[#EAB308]">
                  <Cpu className="w-4 h-4" />
                  <h4 className="font-black text-xs uppercase">{lang === "id" ? "INTEGRASI AI AGENT" : "AI AGENT INTEGRATION"}</h4>
                </div>
                <p className="text-[11px] leading-relaxed text-black dark:text-white">
                  {lang === "id"
                    ? "Memanfaatkan LLM dan otomatisasi cerdas untuk meningkatkan produktivitas dan alur kerja aplikasi."
                    : "Leveraging LLMs and smart automation to boost application productivity and workflows."}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 4. TECH STACK & SKILL MATRIX SECTION */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-4 border-black dark:border-white pb-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#EAB308] text-black border-3 border-black text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <Layers className="w-3.5 h-3.5 text-black" />
                <span>{lang === "id" ? "MATRIKS KEAHLIAN TEKNIS" : "TECHNICAL SKILL MATRIX"}</span>
              </div>
              <h2 className="font-black text-2xl sm:text-4xl uppercase tracking-tight text-black dark:text-white">
                {lang === "id" ? "TEKNOLOGI & STACK PILIHAN" : "TECHNOLOGY & FEATURED STACK"}
              </h2>
            </div>
          </div>

          {/* Scrolling Marquee Ticker */}
          <div className="overflow-hidden border-y-3 border-black dark:border-white bg-[#166534] py-2.5 relative">
            <motion.div
              className="flex gap-6 whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            >
              {[...TECH_STACK_ITEMS, ...TECH_STACK_ITEMS].map((item, i) => (
                <span key={i} className="inline-flex items-center gap-2 text-[11px] font-black uppercase text-white shrink-0">
                  <span className="text-[#EAB308]">▸</span>
                  {item.name}
                  <span className="text-white/40">·</span>
                </span>
              ))}
            </motion.div>
          </div>

          {/* Category Rows with Skill Bars */}
          <div className="space-y-0 border-3 border-black dark:border-white overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
            {[
              { id: "frontend", label: "FRONTEND",          accent: "#EAB308", items: TECH_STACK_ITEMS.filter((t) => t.category === "frontend") },
              { id: "backend",  label: "BACKEND",           accent: "#166534", items: TECH_STACK_ITEMS.filter((t) => t.category === "backend")  },
              { id: "tools",    label: "TOOLS & DEVOPS",    accent: "#0EA5E9", items: TECH_STACK_ITEMS.filter((t) => t.category === "tools")    },
            ].map((cat, catIdx) => {
              const levelMap: Record<string, number> = { Expert: 95, Advanced: 80, Intermediate: 60, Beginner: 35 };
              return (
                <div key={cat.id} className={catIdx !== 0 ? "border-t-3 border-black dark:border-white" : ""}>
                  {/* Category Header */}
                  <div className="flex items-center gap-3 px-5 py-3" style={{ backgroundColor: cat.accent }}>
                    <span className="text-[11px] font-black uppercase text-white tracking-widest">{cat.label}</span>
                    <span className="ml-auto text-[10px] font-black text-white/70 uppercase">{cat.items.length} TEKNOLOGI</span>
                  </div>
                  {/* Skills rows */}
                  <div className="divide-y divide-black/10 dark:divide-white/10 bg-white dark:bg-[#0A0D14]">
                    {cat.items.map((item, i) => {
                      const pct = levelMap[item.level] ?? 60;
                      return (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                          className="flex items-center gap-4 px-5 py-3 hover:bg-[#FEF9C3] dark:hover:bg-[#0D1526] transition-colors"
                        >
                          <span className="text-[10px] font-black text-neutral-400 dark:text-neutral-600 w-5 shrink-0 tabular-nums">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="font-black text-xs uppercase text-black dark:text-white w-36 shrink-0">
                            {item.name}
                          </span>
                          <div className="flex-1 h-1.5 bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                            <motion.div
                              className="h-full"
                              style={{ backgroundColor: cat.accent }}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${pct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.7, delay: i * 0.06, ease: "easeOut" }}
                            />
                          </div>
                          <span
                            className="text-[9px] font-black uppercase px-2 py-0.5 border shrink-0"
                            style={{ color: cat.accent, borderColor: cat.accent }}
                          >
                            {item.level}
                          </span>
                          <span className="hidden lg:block text-[10px] text-neutral-500 dark:text-neutral-400 font-bold leading-snug max-w-[220px] truncate">
                            {item.desc}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        {/* 6. CERTIFICATIONS & ACHIEVEMENTS GALLERY */}
        <section className="space-y-6 pt-4">
          <div className="space-y-2 border-b-4 border-black dark:border-white pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#EAB308] text-black border-3 border-black text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Award className="w-3.5 h-3.5 text-black" />
              <span>{lang === "id" ? "SERTIFIKASI & PENGHARGAAN" : "CERTIFICATIONS & AWARDS"}</span>
            </div>
            <h2 className="font-black text-2xl sm:text-4xl uppercase tracking-tight text-black dark:text-white">
              {lang === "id" ? "GALERI SERTIFIKAT RESMI" : "OFFICIAL CERTIFICATE GALLERY"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Certificate Card: BCT Trial Class 2026 */}
            <div className="p-5 rounded-none border-4 border-black dark:border-white bg-white dark:bg-[#0A0D14] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4 group">
              <div className="relative w-full h-56 bg-black border-3 border-black overflow-hidden relative cursor-pointer" onClick={() => setSelectedCert("/images/sertifikat-bct-2026.webp")}>
                <Image
                  src="/images/sertifikat-bct-2026.webp"
                  alt="Sertifikat BCT X Trial Class 2026"
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="px-4 py-2 bg-[#EAB308] text-black border-2 border-black font-black text-xs uppercase flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <Maximize2 className="w-4 h-4" />
                    <span>{lang === "id" ? "PERBESAR GAMBAR" : "ZOOM IMAGE"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-[#166534] text-white border border-black text-[10px] font-black uppercase">
                    {lang === "id" ? "TAHUN 2025" : "YEAR 2025"}
                  </span>
                  <span className="text-xs font-black text-[#166534] dark:text-[#00E676] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    VERIFIED CERTIFICATE
                  </span>
                </div>

                <h3 className="font-black text-xl uppercase text-black dark:text-white">
                  SERTIFIKAT BCT X TRIAL CLASS 2025
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-bold leading-relaxed">
                  {lang === "id"
                    ? "Sertifikat resmi mengikuti program Basic Coding Training X Trial Class 2025"
                    : "Official certificate for participating in Basic Coding Training X Trial Class 2025"}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 7. CONTACT & COLLABORATION BANNER */}
        <section className="p-8 sm:p-12 rounded-none border-4 border-black dark:border-white bg-[#166534] text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] space-y-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#EAB308] text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>{lang === "id" ? "MARI BERKOLABORASI" : "LET'S COLLABORATE"}</span>
            </div>
            <h2 className="font-black text-2xl sm:text-4xl uppercase leading-tight text-white">
              {lang === "id" ? "PUNYA PROYEK ATAU IDE DISKUSI TEKNOLOGI?" : "HAVE A PROJECT OR TECHNICAL DISCUSSION IDEA?"}
            </h2>
            <p className="text-xs sm:text-sm font-bold leading-relaxed text-slate-100">
              {lang === "id"
                ? "Terbuka untuk diskusi arsitektur perangkat lunak, proyek pembuatan website, integrasi AI agent, atau kesempatan konsultasi."
                : "Open for software architecture discussions, web development projects, AI agent integrations, or consulting opportunities."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="mailto:brimaspradika8@gmail.com"
              onClick={() => soundFx.playClick()}
              className="w-full sm:w-auto px-6 py-3 rounded-none bg-[#EAB308] hover:bg-[#d9a207] text-black border-3 border-black font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>{lang === "id" ? "KIRIM PESAN EMAIL" : "SEND EMAIL MESSAGE"}</span>
            </a>
          </div>
        </section>

      </div>

      {/* CERTIFICATE MODAL LIGHTBOX */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl w-full bg-white dark:bg-black border-4 border-black dark:border-white p-4 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] space-y-4"
            >
              <div className="flex items-center justify-between border-b-3 border-black dark:border-white pb-3">
                <h3 className="font-black text-lg uppercase text-black dark:text-white">
                  {lang === "id" ? "PRINTPREVIEW: SERTIFIKAT BCT X TRIAL CLASS 2026" : "PRINT PREVIEW: BCT X TRIAL CLASS CERTIFICATE"}
                </h3>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="p-1 rounded-none bg-[#166534] text-white border-2 border-black cursor-pointer hover:scale-105"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative w-full h-[60vh] sm:h-[70vh] bg-black border-2 border-black overflow-hidden">
                <Image
                  src={selectedCert}
                  alt="Sertifikat Lightbox Preview"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

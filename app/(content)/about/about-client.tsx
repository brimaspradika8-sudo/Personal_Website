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

// Tech stack items data
const TECH_STACK_ITEMS = [
  { name: "Next.js 15", category: "frontend", level: "Expert", desc: "App Router, Server Actions, SSR & Streaming" },
  { name: "React 19", category: "frontend", level: "Advanced", desc: "Hooks, Server Components, Custom State" },
  { name: "TypeScript", category: "frontend", level: "Advanced", desc: "Strict Type Safety, Interfaces & Generics" },
  { name: "TailwindCSS", category: "frontend", level: "Expert", desc: "Custom Utilities, Neo-Brutalist Layouts" },
  { name: "Framer Motion", category: "frontend", level: "Advanced", desc: "Layout Animations, Micro-interactions" },
  { name: "Node.js", category: "backend", level: "Advanced", desc: "RESTful APIs, Async Workflows, Runtime" },
  { name: "Supabase", category: "backend", level: "Advanced", desc: "PostgreSQL, Auth, Storage, RLS Policies" },
  { name: "Prisma ORM", category: "backend", level: "Intermediate", desc: "Schema Design, Migrations, Query Engine" },
  { name: "AI Agents & LLM", category: "ai", level: "Advanced", desc: "OpenAI & Gemini API, Prompt Engineering" },
  { name: "Git & GitHub", category: "tools", level: "Advanced", desc: "Version Control, CI/CD, Branching Strategy" },
  { name: "Vercel & Cloud", category: "tools", level: "Advanced", desc: "Automated Deployments, Edge Functions" },
  { name: "Postman", category: "tools", level: "Intermediate", desc: "API Testing, Mocking & Documentation" },
];

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
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  const filteredTech = TECH_STACK_ITEMS.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-[#EAB308] selection:text-black pb-28 sm:pb-20">
      
      {/* Container wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-10 sm:space-y-14">

        {/* 1. TOP NAV & BREADCRUMB */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-white dark:bg-black border-3 border-black dark:border-white text-xs font-mono font-black text-black dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer group uppercase"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#166534] dark:text-[#EAB308]" />
            <span>{lang === "id" ? "KEMBALI KE BERANDA" : "BACK TO HOME"}</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#166534] text-white border-2 border-black dark:border-white text-[11px] font-mono font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
            <span>{lang === "id" ? "STATUS: AKTIF & TERSEDIA" : "STATUS: AVAILABLE"}</span>
          </div>
        </div>

        {/* 2. HERO HEADER BANNER (Brazil Neo-Brutalism Style) */}
        <section className="relative p-6 sm:p-10 rounded-none border-4 border-black dark:border-white bg-white dark:bg-[#0A0D14] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] overflow-hidden">
          {/* Background Decorative Accent Stripe */}
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-[#EAB308] border-4 border-black dark:border-white rotate-12 pointer-events-none opacity-20 dark:opacity-30" />
          
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-[#EAB308] text-black border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs font-mono font-black uppercase tracking-wider">
              <User className="w-4 h-4 text-black" />
              <span>{lang === "id" ? "PROFIL DIRI & REKAM JEJAK" : "PERSONAL PROFILE & BIOGRAPHY"}</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-serif font-black text-3xl sm:text-6xl uppercase tracking-tight text-black dark:text-white leading-tight">
                BRIMAS <span className="text-[#166534] dark:text-[#00E676] underline decoration-4 underline-offset-4">PRADIKA UTAMA</span>
              </h1>
              <p className="text-xs sm:text-lg font-mono font-bold text-black dark:text-white max-w-3xl leading-relaxed">
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
                  <span className="text-[10px] font-mono font-black uppercase">{lang === "id" ? "SEKOLAH" : "SCHOOL"}</span>
                </div>
                <p className="text-xs font-mono font-black truncate text-black dark:text-white">SMK Bhakti Mulia Pare</p>
              </div>

              <div className="p-3.5 rounded-none border-3 border-black dark:border-white bg-[#DCFCE7] dark:bg-[#121824] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] space-y-1">
                <div className="flex items-center gap-1.5 text-[#166534] dark:text-[#00E676]">
                  <Code2 className="w-4 h-4" />
                  <span className="text-[10px] font-mono font-black uppercase">{lang === "id" ? "JURUSAN" : "MAJOR"}</span>
                </div>
                <p className="text-xs font-mono font-black truncate text-black dark:text-white">Rekayasa Perangkat Lunak (RPL)</p>
              </div>

              <div className="p-3.5 rounded-none border-3 border-black dark:border-white bg-[#FEF9C3] dark:bg-[#121824] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] space-y-1">
                <div className="flex items-center gap-1.5 text-[#166534] dark:text-[#EAB308]">
                  <MapPin className="w-4 h-4" />
                  <span className="text-[10px] font-mono font-black uppercase">{lang === "id" ? "LOKASI" : "LOCATION"}</span>
                </div>
                <p className="text-xs font-mono font-black truncate text-black dark:text-white">Kediri, Jawa Timur, ID</p>
              </div>

              <div className="p-3.5 rounded-none border-3 border-black dark:border-white bg-[#DCFCE7] dark:bg-[#121824] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] space-y-1">
                <div className="flex items-center gap-1.5 text-[#166534] dark:text-[#00E676]">
                  <Cpu className="w-4 h-4" />
                  <span className="text-[10px] font-mono font-black uppercase">FOKUS</span>
                </div>
                <p className="text-xs font-mono font-black truncate text-black dark:text-white">Next.js &amp; AI Agents</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href="mailto:brimaspradika8@gmail.com"
                onClick={() => soundFx.playClick()}
                className="px-5 py-2.5 rounded-none bg-[#166534] hover:bg-[#14532D] text-white border-3 border-black dark:border-white font-mono font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>{lang === "id" ? "HUBUNGI EMAIL" : "CONTACT EMAIL"}</span>
              </a>

              <a
                href="https://github.com/brimaspradika8-sudo"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFx.playClick()}
                className="px-5 py-2.5 rounded-none bg-[#EAB308] hover:bg-[#d9a207] text-black border-3 border-black dark:border-white font-mono font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer inline-flex items-center gap-2"
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
                <div className="absolute top-3 left-3 bg-black text-white px-3 py-1 border-2 border-white text-[10px] font-mono font-black uppercase shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                  SMK BM PARE &bull; RPL
                </div>
              </div>

              {/* Card Footer Caption */}
              <div className="pt-3 text-center">
                <h3 className="font-serif font-black text-xl uppercase text-black">BRIMAS PRADIKA UTAMA</h3>
                <p className="text-xs font-mono font-black text-slate-900 uppercase">SOFTWARE &amp; AI SYSTEMS DEVELOPER</p>
              </div>
            </div>

            {/* Philosophy Quote Card */}
            <div className="p-5 rounded-none border-4 border-black dark:border-white bg-white dark:bg-[#0A0D14] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,1)] space-y-2">
              <div className="flex items-center gap-2 text-[#166534] dark:text-[#EAB308]">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-mono font-black uppercase">{lang === "id" ? "FILOSOFI REKAYASA" : "ENGINEERING PHILOSOPHY"}</span>
              </div>
              <p className="text-xs font-mono font-bold leading-relaxed text-black dark:text-white italic">
                &ldquo;{lang === "id"
                  ? "Membangun perangkat lunak bukan sekadar menulis baris kode, melainkan menciptakan solusi yang efisien, terstruktur, dan memberikan dampak nyata bagi pengguna."
                  : "Building software is not just about writing lines of code, but about creating efficient, structured solutions that deliver real user impact."}&rdquo;
              </p>
            </div>
          </div>

          {/* Bio Text & Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#166534] text-white border-3 border-black dark:border-white text-xs font-mono font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <FileText className="w-3.5 h-3.5 text-white" />
                <span>{lang === "id" ? "BIOGRAFI LENGKAP" : "FULL BIOGRAPHY"}</span>
              </div>
              <h2 className="font-serif font-black text-2xl sm:text-4xl uppercase tracking-tight text-black dark:text-white">
                {lang === "id" ? "EKSPLORASI TEKNOLOGI & PERJALANAN CODING" : "TECHNOLOGY EXPLORATION & CODING JOURNEY"}
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm font-mono leading-relaxed text-black dark:text-white">
              <p className="p-4 rounded-none border-3 border-black dark:border-white bg-[#FEF9C3] dark:bg-[#121824] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                {lang === "id"
                  ? "Halo! Saya Brimas Pradika Utama, seorang pengembang perangkat lunak muda berbasis di Pare, Kediri. Saat ini saya sedang menempuh pendidikan di SMK Bhakti Mulia Pare pada keahlian Rekayasa Perangkat Lunak (RPL)."
                  : "Hello! I am Brimas Pradika Utama, a passionate young software developer based in Pare, Kediri. Currently studying Software Engineering (RPL) at SMK Bhakti Mulia Pare."}
              </p>

              <p>
                {lang === "id"
                  ? "Minat utama saya berfokus pada arsitektur sistem web berskala tinggi, pembuatan aplikasi berbasis kecerdasan buatan (AI Agent), serta perancangan antarmuka antarmuka yang bersih dan responsif. Saya percaya bahwa integrasi antara Next.js 15, TypeScript, dan Supabase mampu menghasilkan pengalaman web modern yang cepat dan andal."
                  : "My primary focus lies in high-scale web system architecture, artificial intelligence agent integration, and crafting clean, responsive interfaces. I believe combining Next.js 15, TypeScript, and Supabase delivers fast and reliable modern web experiences."}
              </p>

              <p>
                {lang === "id"
                  ? "Selain aktivitas pembelajaran di sekolah, saya aktif mengikuti pelatihan eksternal seperti BCT Trial Class 2026 dan membangun berbagai proyek eksperimental untuk memperdalam pemahaman teknis di bidang fullstack & AI."
                  : "In addition to my high school studies, I actively participate in external training programs such as the BCT Trial Class 2026 and build experimental projects to deepen my technical expertise in fullstack & AI engineering."}
              </p>
            </div>

            {/* Core Values / 4 Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-none border-3 border-black dark:border-white bg-white dark:bg-[#0A0D14] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-2">
                <div className="flex items-center gap-2 text-[#166534] dark:text-[#00E676]">
                  <Zap className="w-4 h-4" />
                  <h4 className="font-mono font-black text-xs uppercase">{lang === "id" ? "KODE BERSIH & PERFORMA" : "CLEAN CODE & SPEED"}</h4>
                </div>
                <p className="text-[11px] font-mono leading-relaxed text-black dark:text-white">
                  Menulis kode yang terstruktur, bermemori efisien, dan mudah dipelihara dalam jangka panjang.
                </p>
              </div>

              <div className="p-4 rounded-none border-3 border-black dark:border-white bg-white dark:bg-[#0A0D14] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-2">
                <div className="flex items-center gap-2 text-[#EAB308]">
                  <Cpu className="w-4 h-4" />
                  <h4 className="font-mono font-black text-xs uppercase">{lang === "id" ? "INTEGRASI AI AGENT" : "AI AGENT INTEGRATION"}</h4>
                </div>
                <p className="text-[11px] font-mono leading-relaxed text-black dark:text-white">
                  Memanfaatkan LLM dan otomatisasi cerdas untuk meningkatkan produktivitas dan alur kerja aplikasi.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 4. TECH STACK & SKILL MATRIX SECTION */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-4 border-black dark:border-white pb-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#EAB308] text-black border-3 border-black text-xs font-mono font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <Layers className="w-3.5 h-3.5 text-black" />
                <span>{lang === "id" ? "MATRIKS KEAHLIAN TEKNIS" : "TECHNICAL SKILL MATRIX"}</span>
              </div>
              <h2 className="font-serif font-black text-2xl sm:text-4xl uppercase tracking-tight text-black dark:text-white">
                TEKNOLOGI &amp; STACK PILIHAN
              </h2>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "all", label: lang === "id" ? "SEMUA" : "ALL" },
                { id: "frontend", label: "FRONTEND" },
                { id: "backend", label: "BACKEND" },
                { id: "ai", label: "AI & INTEGRATION" },
                { id: "tools", label: "TOOLS" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-none border-2 border-black dark:border-white text-xs font-mono font-black uppercase transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-[#166534] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
                      : "bg-white dark:bg-black text-black dark:text-white hover:bg-[#FEF9C3] dark:hover:bg-neutral-800"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tech Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredTech.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="p-4 rounded-none border-3 border-black dark:border-white bg-white dark:bg-[#0A0D14] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-mono font-black text-sm uppercase text-black dark:text-white">{item.name}</h4>
                  <span className="px-2 py-0.5 bg-[#EAB308] text-black border border-black text-[9px] font-mono font-black uppercase">
                    {item.level}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-neutral-600 dark:text-neutral-400 font-bold leading-snug">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. EDUCATION & TIMELINE SECTION */}
        <section className="space-y-6 pt-4">
          <div className="space-y-2 border-b-4 border-black dark:border-white pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#166534] text-white border-3 border-black dark:border-white text-xs font-mono font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <GraduationCap className="w-3.5 h-3.5 text-white" />
              <span>{lang === "id" ? "REKAM JEJAK & PENDIDIKAN" : "TIMELINE & EDUCATION"}</span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-4xl uppercase tracking-tight text-black dark:text-white">
              RIWAYAT PENDIDIKAN &amp; MILESTONES
            </h2>
          </div>

          <div className="space-y-4">
            {TIMELINE_EVENTS.map((event, idx) => (
              <div
                key={idx}
                className="p-5 rounded-none border-4 border-black dark:border-white bg-white dark:bg-[#0A0D14] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2.5 py-0.5 rounded-none border-2 border-black text-xs font-mono font-black text-black uppercase"
                      style={{ backgroundColor: event.color }}
                    >
                      {event.year}
                    </span>
                    <span className="text-xs font-mono font-black text-[#166534] dark:text-[#EAB308] uppercase">
                      [{event.badge}]
                    </span>
                  </div>

                  <h3 className="font-serif font-black text-lg sm:text-xl uppercase text-black dark:text-white">
                    {lang === "id" ? event.title_id : event.title_en}
                  </h3>
                  <p className="text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400">
                    📍 {lang === "id" ? event.school_id : event.school_en}
                  </p>
                  <p className="text-xs font-mono leading-relaxed text-black dark:text-white pt-1">
                    {lang === "id" ? event.desc_id : event.desc_en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. CERTIFICATIONS & ACHIEVEMENTS GALLERY */}
        <section className="space-y-6 pt-4">
          <div className="space-y-2 border-b-4 border-black dark:border-white pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#EAB308] text-black border-3 border-black text-xs font-mono font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Award className="w-3.5 h-3.5 text-black" />
              <span>{lang === "id" ? "SERTIFIKASI & PENGHARGAAN" : "CERTIFICATIONS & AWARDS"}</span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-4xl uppercase tracking-tight text-black dark:text-white">
              GALERI SERTIFIKAT RESMI
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Certificate Card: BCT Trial Class 2026 */}
            <div className="p-5 rounded-none border-4 border-black dark:border-white bg-white dark:bg-[#0A0D14] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4 group">
              <div className="relative w-full h-56 bg-black border-3 border-black overflow-hidden relative cursor-pointer" onClick={() => setSelectedCert("/images/Sertifikat BCT X TRIAL CLASS 2026 72.png")}>
                <Image
                  src="/images/Sertifikat BCT X TRIAL CLASS 2026 72.png"
                  alt="Sertifikat BCT X Trial Class 2026"
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="px-4 py-2 bg-[#EAB308] text-black border-2 border-black font-mono font-black text-xs uppercase flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <Maximize2 className="w-4 h-4" />
                    <span>PERBESAR GAMBAR</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-[#166534] text-white border border-black text-[10px] font-mono font-black uppercase">
                    TAHUN 2026
                  </span>
                  <span className="text-xs font-mono font-black text-[#166534] dark:text-[#00E676] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    VERIFIED CERTIFICATE
                  </span>
                </div>

                <h3 className="font-serif font-black text-xl uppercase text-black dark:text-white">
                  SERTIFIKAT BCT X TRIAL CLASS 2026
                </h3>
                <p className="text-xs font-mono text-neutral-600 dark:text-neutral-400 font-bold leading-relaxed">
                  Sertifikat resmi kelulusan program Trial Class 2026 tentang arsitektur perangkat lunak, dasar pemrograman modern, dan otomatisasi berbasis teknologi.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 7. CONTACT & COLLABORATION BANNER */}
        <section className="p-8 sm:p-12 rounded-none border-4 border-black dark:border-white bg-[#166534] text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] space-y-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#EAB308] text-black border-2 border-black text-xs font-mono font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>MARI BERKOLABORASI</span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-4xl uppercase leading-tight text-white">
              PUNYA PROYEK ATAU IDE DISKUSI TEKNOLOGI?
            </h2>
            <p className="text-xs sm:text-sm font-mono font-bold leading-relaxed text-slate-100">
              Terbuka untuk diskusi arsitektur perangkat lunak, proyek pembuatan website, integrasi AI agent, atau kesempatan konsultasi.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="mailto:brimaspradika8@gmail.com"
              onClick={() => soundFx.playClick()}
              className="w-full sm:w-auto px-6 py-3 rounded-none bg-[#EAB308] hover:bg-[#d9a207] text-black border-3 border-black font-mono font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>KIRIM PESAN EMAIL</span>
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
                <h3 className="font-serif font-black text-lg uppercase text-black dark:text-white">
                  PRINTPREVIEW: SERTIFIKAT BCT X TRIAL CLASS 2026
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

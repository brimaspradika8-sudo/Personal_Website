"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ShoppingBag,
  Play,
  ArrowRight,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  User,
  MapPin,
  ChevronDown,
  Code,
  Layers,
  Database,
  ShieldCheck,
} from "lucide-react";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import MobileBottomNav from "@/components/MobileBottomNav";
import { soundFx } from "@/lib/audio/sound";
import CommandPalette from "@/components/CommandPalette";
import ProjectModal, { ProjectData } from "@/components/ProjectModal";
import TechStackMatrix from "@/components/TechStackMatrix";
import ProjectShowcase from "@/components/ProjectShowcase";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import Lanyard from "@/components/Lanyard";
import ScrollReveal from "@/components/ScrollReveal";


interface DashboardClientProps {
  user: {
    id: string;
    email?: string;
    last_sign_in_at?: string;
    created_at?: string;
    app_metadata?: {
      provider?: string;
      providers?: string[];
    };
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
      name?: string;
      picture?: string;
    };
  } | null;
  dbUser: {
    id: string;
    email: string;
    name: string | null;
    avatar: string | null;
    role?: string | null;
    created_at: Date | string;
  } | null;
  dbProjects?: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    thumbnail: string | null;
    demo_url: string | null;
    repository_url: string | null;
    created_at: Date | string;
  }>;
  /** Ditentukan di Server Component berdasarkan role dari database — tidak bisa di-bypass dari client */
  isAdmin?: boolean;
}

export default function DashboardClient({ user, dbUser, dbProjects, isAdmin = false }: DashboardClientProps) {
  const { lang, toggleLang } = useLanguage();
  const [mode, setMode] = useState<"day" | "night">("day");
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const showToast = (msg: string) => {
    soundFx.playClick();
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    setSfxEnabled(soundFx.getIsEnabled());
    const handleOpen = () => setCmdPaletteOpen(true);

    window.addEventListener("open-command-palette", handleOpen);

    const savedMode = localStorage.getItem("landscape_mode");
    if (savedMode === "night") {
      setMode("night");
      document.documentElement.classList.add("dark");
    } else {
      setMode("day");
      document.documentElement.classList.remove("dark");
    }

    return () => {
      window.removeEventListener("open-command-palette", handleOpen);
    };
  }, []);

  const handleToggleMode = () => {
    setMode((prev) => {
      const nextMode = prev === "day" ? "night" : "day";
      if (nextMode === "night") {
        document.documentElement.classList.add("dark");
        localStorage.setItem("landscape_mode", "night");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("landscape_mode", "day");
      }
      showToast(nextMode === "night" ? (lang === "id" ? "Mode Malam Hari" : "Night Mode") : (lang === "id" ? "Mode Siang Hari" : "Day Mode"));
      return nextMode;
    });
  };

  // PENTING: displayName & avatarSrc SELALU diambil dari data user yang sedang login.
  // Tidak ada hardcode nama/avatar di sini — semua dinamis berdasarkan sesi aktif.
  const displayName =
    dbUser?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Guest User";

  const avatarSrc = dbUser?.avatar || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "";

  const isLoggedIn = !!user;
  const activeUserName =
    dbUser?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    (user?.email ? user.email.split("@")[0] : "");

  const welcomeMarqueeText = isLoggedIn && activeUserName
    ? `WELCOME ${activeUserName.toUpperCase()}`
    : "WELCOME";

  const initialLetter = displayName ? displayName.charAt(0).toUpperCase() : "G";
  const isNight = mode === "night";

  const [heroMousePos, setHeroMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMoveHero = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setHeroMousePos({ x, y });
  };

  const handleToggleSfx = () => {
    const next = soundFx.toggleMute();
    setSfxEnabled(next);
    showToast(next ? (lang === "id" ? "Suara Aktif" : "Sound Enabled") : (lang === "id" ? "Suara Senyap" : "Sound Muted"));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.15,
      }}
      className={`min-h-screen font-sans antialiased text-left selection:bg-[#DC2626] selection:text-white transition-colors duration-300 pb-20 md:pb-0 ${
        isNight ? "bg-[#12160F] text-[#F1EFE9]" : "bg-[#ffffff] text-[#1A1A1A]"
      }`}
    >
      {/* 1. TOP NAVIGATION HEADER (MATCHING BUCKETLISTLY STYLE) */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${
        isNight ? "bg-[#12160F]/90 border-[#2A2F26]" : "bg-[#8a8a88]/90 border-[#7a7a78] text-white"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          
          {/* Logo (Icon Bulat Merah Spider-Man + Personal Brand Name) */}
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="flex items-center gap-2 shrink-0 group"
          >
            <div className="w-6 h-6 rounded-full bg-[#DC2626] flex items-center justify-center text-white font-bold text-xs shadow-md shadow-[#DC2626]/40 group-hover:scale-105 transition-transform">
              B
            </div>
            <span className="font-bold tracking-tight text-sm font-sans">
              Brimas <span className="font-normal opacity-80">Pradika</span>
            </span>
          </Link>



          {/* Navigation Menu Items */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium tracking-wide text-white/90">
            {[
              { label: lang === "id" ? "Beranda" : "Home", href: "#hero" },
              { label: lang === "id" ? "Tentang" : "About", href: "#about" },
              { label: lang === "id" ? "Proyek"  : "Projects", href: "#projects" },
              { label: lang === "id" ? "Artikel" : "Blog", href: "/posts" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => soundFx.playClick()}
                className="transition-colors hover:text-[#DC2626] flex items-center gap-0.5"
              >
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          {/* Right Action Icons & Profile Avatar */}
          <div className="flex items-center gap-2.5 shrink-0 text-white/80">
            
            {/* Ctrl + K Command Palette Visual Hint Badge Button */}
            <button
              onClick={() => {
                soundFx.playClick();
                setCmdPaletteOpen(true);
              }}
              className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 hover:bg-[#DC2626]/80 text-xs text-white/90 border border-white/20 transition-all cursor-pointer shadow-sm hover:scale-105"
              title="Buka Command Palette (Ctrl + K)"
            >
              <Search className="w-3.5 h-3.5 text-white/80" />
              <span className="hidden md:inline text-[11px] font-medium opacity-90">{lang === "id" ? "Cari..." : "Search..."}</span>
              <kbd className="font-mono text-[10px] bg-black/40 px-1.5 py-0.5 rounded text-white/90 border border-white/20 shadow-inner">
                Ctrl K
              </kbd>
            </button>

            {/* Language & Sound Toggles */}
            <button
              onClick={() => {
                soundFx.playClick();
                toggleLang();
              }}
              className="p-1.5 rounded-full hover:bg-white/10 text-xs font-bold transition-all cursor-pointer border border-white/20 px-2"
              title="Ganti Bahasa / Switch Language"
            >
              <span>{lang.toUpperCase()}</span>
            </button>

    
            {/* Profile Avatar / Login Action Button */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  onClick={() => soundFx.playClick()}
                  className="relative w-8 h-8 rounded-full overflow-hidden border border-[#DC2626] shrink-0 flex items-center justify-center font-bold text-xs transition-transform hover:scale-105 bg-[#DC2626] text-white shadow-md shadow-[#DC2626]/30"
                  title={lang === "id" ? "Buka Profil Saya" : "Open My Profile"}
                >
                  {avatarSrc ? (
                    <Image
                      src={avatarSrc}
                      alt={displayName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span>{(displayName || "U").charAt(0).toUpperCase()}</span>
                  )}
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => {
                  try {
                    soundFx.playClick();
                  } catch {}
                }}
                className="px-3.5 py-1.5 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold transition-all hover:scale-105 shadow-md shadow-[#DC2626]/30 border border-white/20 relative z-10 cursor-pointer inline-flex items-center justify-center"
              >
                {lang === "id" ? "Masuk Akun" : "Sign In"}
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section
        id="hero"
        onMouseMove={handleMouseMoveHero}
        className={`relative min-h-[85vh] lg:min-h-[92vh] flex flex-col justify-between overflow-hidden transition-colors duration-300 pt-12 sm:pt-16 md:pt-20 ${
          isNight ? "bg-[#181D15]" : "bg-gradient-to-b from-[#a3a3a0] via-[#92928f] to-[#7f7f7c]"
        }`}
      >
        
        {/* Giant Moving Backdrop Typography ("WELCOME" & "BRIMAS PRADIKA UTAMA") Behind Head */}
        <div className="absolute top-12 sm:top-16 inset-x-0 flex flex-col pointer-events-none select-none overflow-hidden z-0 pt-1 -space-y-4 sm:-space-y-8">
          {/* Line 1: Dynamic WELCOME Marquee */}
          <div
            className="animate-welcome-marquee flex gap-4 whitespace-nowrap will-change-transform"
            style={{ animation: "welcomeMarquee 25s linear infinite" }}
          >
            <h1 className={`font-display text-[22vw] sm:text-[24vw] font-black uppercase tracking-tighter leading-none transition-colors ${
              isNight ? "text-[#242C20]" : "text-[#bcbcb9]/40"
            }`}>
              {welcomeMarqueeText} <span className="mx-2 opacity-50">&bull;</span> {welcomeMarqueeText} <span className="mx-2 opacity-50">&bull;</span>
            </h1>
            <h1 className={`font-display text-[22vw] sm:text-[24vw] font-black uppercase tracking-tighter leading-none transition-colors ${
              isNight ? "text-[#242C20]" : "text-[#bcbcb9]/40"
            }`}>
              {welcomeMarqueeText} <span className="mx-2 opacity-50">&bull;</span> {welcomeMarqueeText} <span className="mx-2 opacity-50">&bull;</span>
            </h1>
          </div>

          {/* Line 2: BRIMAS PRADIKA UTAMA Marquee (Moving Reverse) */}
          <div
            className="animate-welcome-marquee-reverse flex gap-4 whitespace-nowrap will-change-transform"
            style={{ animation: "welcomeMarqueeReverse 30s linear infinite" }}
          >
            <h1 className={`font-display text-[16vw] sm:text-[18vw] font-black uppercase tracking-tighter leading-none transition-colors ${
              isNight ? "text-[#20271C]" : "text-[#bcbcb9]/30"
            }`}>
              BRIMAS PRADIKA UTAMA <span className="mx-2 opacity-50">&bull;</span> BRIMAS PRADIKA UTAMA <span className="mx-2 opacity-50">&bull;</span>
            </h1>
            <h1 className={`font-display text-[16vw] sm:text-[18vw] font-black uppercase tracking-tighter leading-none transition-colors ${
              isNight ? "text-[#20271C]" : "text-[#bcbcb9]/30"
            }`}>
              BRIMAS PRADIKA UTAMA <span className="mx-2 opacity-50">&bull;</span> BRIMAS PRADIKA UTAMA <span className="mx-2 opacity-50">&bull;</span>
            </h1>
          </div>
        </div>

        {/* Hero Content Overlay Grid (z-20 so buttons & photo float ON TOP of wave) */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 w-full flex-1 flex flex-col justify-between pt-6 sm:pt-10 pb-12 sm:pb-16">
          

          {/* Main Hero Center Container */}
          <div className="relative w-full flex flex-col sm:flex-row items-center justify-center min-h-[50vh] sm:min-h-[55vh] my-auto gap-6 sm:gap-0">
            
            {/* Centerpiece Portrait Photo (z-20) seamlessly blending with background */}
            <div className="hero-photo-wrapper relative z-20 w-[270px] h-[360px] sm:w-[380px] sm:h-[480px] md:w-[420px] md:h-[530px] max-w-full flex items-center justify-center pointer-events-auto">
              
              {/* Feature 1.1: Organic Parallax Backlight Halo Glow */}
              <div
                className="absolute -inset-6 sm:-inset-10 rounded-full pointer-events-none transition-all duration-500 opacity-60 filter blur-3xl -z-10"
                style={{
                  background: `radial-gradient(circle at ${heroMousePos.x}% ${heroMousePos.y}%, rgba(220, 38, 38, 0.45), rgba(37, 99, 235, 0.25), transparent 70%)`
                }}
              />

              {/* Hero Portrait Photo (No Card Frame / Border / Box) */}
              <div className="relative w-full h-full overflow-hidden pointer-events-none">
                <Image
                  src="/images/avatar.png"
                  alt="Brimas Pradika Utama"
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 768px) 380px, 460px"
                  className="object-cover object-center w-full h-full pointer-events-none filter brightness-[1.05] contrast-[1.08]"
                />
              </div>
            </div>

            {/* Desktop Headline & CTAs (Absolute Left) */}
            <div className="hidden sm:block absolute left-0 bottom-6 sm:bottom-12 z-20 space-y-4 max-w-md text-left text-white drop-shadow-md">
              <h1 className="font-display text-5xl md:text-6xl font-black uppercase tracking-tight leading-none">
                {lang === "id" ? "SAYA BRIMAS PRADIKA UTAMA" : "I'M BRIMAS PRADIKA UTAMA"}
              </h1>
              <p className="text-sm text-white/95 leading-relaxed font-sans max-w-sm font-medium">
                {lang === "id"
                  ? "Pengembang Perangkat Lunak & Sistem AI yang berfokus pada arsitektur web modern, eksperimen teknologi interaktif, serta solusi digital performa tinggi."
                  : "Software & AI Systems Developer focused on modern web architecture, interactive tech experiments, and high-performance digital solutions."}
              </p>

              {/* Two CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#projects"
                  onClick={() => soundFx.playClick()}
                  className="px-6 py-2.5 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.03] cursor-pointer inline-flex items-center gap-2 shadow-lg shadow-[#DC2626]/40 border border-white/20"
                >
                  <span>{lang === "id" ? "JELAJAH PROYEK" : "EXPLORE PROJECTS"}</span>
                </a>

                <a
                  href="#about"
                  onClick={() => soundFx.playClick()}
                  className="px-6 py-2.5 rounded-full border-[1.5px] border-white text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:bg-white hover:text-[#1A1A1A] cursor-pointer inline-flex items-center gap-2 shadow-lg hover:scale-[1.03]"
                >
                  <span>{lang === "id" ? "TENTANG SAYA" : "ABOUT ME"}</span>
                </a>
              </div>
            </div>

            {/* Mobile Headline & CTAs (Stacked Cleanly Below Photo) */}
            <div className="sm:hidden w-full z-20 space-y-3.5 text-center text-white px-2 pt-2 pb-4">
              <h1 className="font-display text-4xl font-black uppercase tracking-tight leading-none drop-shadow-md">
                {lang === "id" ? "SAYA BRIMAS PRADIKA UTAMA" : "I'M BRIMAS PRADIKA UTAMA"}
              </h1>
              <p className="text-sm text-white/95 leading-relaxed font-sans max-w-xs mx-auto drop-shadow-sm font-medium">
                {lang === "id"
                  ? "Pengembang Perangkat Lunak & Sistem AI yang berfokus pada arsitektur web modern, eksperimen interaktif, serta solusi digital performa tinggi."
                  : "Software & AI Systems Developer focused on modern web architecture, interactive tech experiments, and high-performance digital solutions."}
              </p>

              {/* Two Mobile CTA Buttons */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <a
                  href="#projects"
                  onClick={() => soundFx.playClick()}
                  className="px-5 py-2.5 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#DC2626]/40 hover:scale-105 transition-transform border border-white/20"
                >
                  {lang === "id" ? "PROYEK" : "PROJECTS"}
                </a>

                <a
                  href="#about"
                  onClick={() => soundFx.playClick()}
                  className="px-5 py-2.5 rounded-full border-[1.5px] border-white text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-white hover:text-[#1A1A1A] transition-all duration-200"
                >
                  {lang === "id" ? "TENTANG SAYA" : "ABOUT ME"}
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Ultra-Smooth Organic SVG Wave Divider */}
        <div className="absolute -bottom-[1px] left-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
          <svg
            className={`w-full h-12 sm:h-20 md:h-24 block fill-current transition-colors duration-300 ${
              isNight ? "text-[#12160F]" : "text-[#ffffff]"
            }`}
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path d="M0,64 C480,112 960,16 1440,64 L1440,120 L0,120 Z" />
          </svg>
        </div>

      </section>



      {/* 4. SECTION "ABOUT ME" WITH STAGGERED SCROLL ANIMATIONS */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-b border-current/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Interactive 3D Physics Lanyard Photo Card */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <ScrollReveal direction="right" delayMs={100} durationMs={800} className="w-full flex justify-center">
              <div className="relative w-full max-w-md h-[520px] sm:h-[580px] flex items-center justify-center overflow-visible">
                <Lanyard />
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: About Me Bio & Details */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <ScrollReveal direction="up" delayMs={200} durationMs={700}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DC2626]/15 text-[#DC2626] text-xs font-mono font-bold tracking-widest uppercase">
                <User className="w-3.5 h-3.5" />
                <span>ABOUT ME</span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delayMs={250} durationMs={700}>
              <div className="space-y-3">
                <h2 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none">
                  BRIMAS PRADIKA UTAMA
                </h2>
                <p className="text-xs sm:text-sm font-mono tracking-wide opacity-80 uppercase text-[#DC2626]">
                  AI Systems Developer • SMK Bhakti Mulia Pare
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delayMs={350} durationMs={700}>
              <p className="text-sm sm:text-base opacity-90 leading-relaxed font-sans max-w-xl">
                {lang === "id"
                  ? "Siswa SMK Bhakti Mulia Pare yang aktif membangun aplikasi berbasis kecerdasan buatan & sistem AI secara profesional. Berfokus pada AI Systems Development, LLM Integration, React, Next.js, Python, Supabase, dan Cloud Systems. Bagi saya, coding bukan sekadar menulis sintaks, tapi bagaimana membangun sistem pintar yang rapi, scalable, dan maintainable."
                  : "Student at SMK Bhakti Mulia Pare actively building AI-powered applications & intelligent systems. Specialized in AI Systems Development, LLM Integration, React, Next.js, Python, Supabase, and Cloud Systems. Focused on writing clean, scalable, and maintainable intelligent systems."}
              </p>
            </ScrollReveal>

            {/* Feature Badges Grid */}
            <ScrollReveal direction="zoom" delayMs={450} durationMs={700}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className={`p-3 rounded-xl border space-y-1 transition-colors ${
                  isNight ? "bg-[#1A211A] border-[#2A2F26]" : "bg-[#F8F8F6] border-[#E5E5E2]"
                }`}>
                  <div className="flex items-center gap-1.5 text-[#DC2626]">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-mono font-bold uppercase">SCHOOL</span>
                  </div>
                  <p className="text-xs font-bold truncate">SMK Bhakti Mulia Pare</p>
                </div>

                <div className={`p-3 rounded-xl border space-y-1 transition-colors ${
                  isNight ? "bg-[#1A211A] border-[#2A2F26]" : "bg-[#F8F8F6] border-[#E5E5E2]"
                }`}>
                  <div className="flex items-center gap-1.5 text-[#DC2626]">
                    <Code className="w-4 h-4" />
                    <span className="text-xs font-mono font-bold uppercase">ROLE</span>
                  </div>
                  <p className="text-xs font-bold truncate">AI Systems Developer</p>
                </div>

                <div className={`p-3 rounded-xl border space-y-1 transition-colors ${
                  isNight ? "bg-[#1A211A] border-[#2A2F26]" : "bg-[#F8F8F6] border-[#E5E5E2]"
                }`}>
                  <div className="flex items-center gap-1.5 text-[#DC2626]">
                    <Layers className="w-4 h-4" />
                    <span className="text-xs font-mono font-bold uppercase">STACK</span>
                  </div>
                  <p className="text-xs font-bold truncate">Laravel &bull; Next.js</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Action Buttons */}
            <ScrollReveal direction="up" delayMs={550} durationMs={700}>
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <a
                  href="#projects"
                  onClick={() => soundFx.playClick()}
                  className="px-6 py-3 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.03] cursor-pointer inline-flex items-center gap-2 shadow-lg shadow-[#DC2626]/30 border border-white/20"
                >
                  <span>{lang === "id" ? "LIHAT PROYEK" : "EXPLORE PROJECTS"}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <Link
                  href="/profile"
                  onClick={() => soundFx.playClick()}
                  className={`px-6 py-3 rounded-full border font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.03] cursor-pointer inline-flex items-center gap-2 ${
                    isNight
                      ? "border-white/40 text-white hover:border-[#DC2626] hover:text-[#DC2626]"
                      : "border-black/40 text-black hover:border-[#DC2626] hover:text-[#DC2626]"
                  }`}
                >
                  <span>{lang === "id" ? "PROFIL LENGKAP" : "FULL PROFILE"}</span>
                </Link>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>



      {/* 5. TECH STACK & CLI MATRIX SECTION */}
      <ScrollReveal direction="up" delayMs={50}>
        <TechStackMatrix isNight={isNight} lang={lang} />
      </ScrollReveal>

      {/* 6. PORTFOLIO PROJECTS SHOWCASE SECTION */}
      <ScrollReveal direction="up" delayMs={50}>
        <ProjectShowcase
          isNight={isNight}
          lang={lang}
          fetchedProjects={dbProjects}
          onSelectProject={(proj) => setSelectedProject(proj)}
        />
      </ScrollReveal>

      {/* 7. EXPERIENCE & JOURNEY TIMELINE SECTION */}
      <ScrollReveal direction="up" delayMs={50}>
        <ExperienceTimeline isNight={isNight} lang={lang} />
      </ScrollReveal>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-20 right-6 z-50 px-4 py-2.5 rounded-lg bg-[#DC2626] text-white font-bold text-xs font-mono shadow-xl">
          {toastMsg}
        </div>
      )}

      {/* Footer */}
      <ScrollReveal direction="fade" delayMs={50}>
        <footer className="py-8 text-xs opacity-75 text-left border-t border-current/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} Brimas Pradika Utama. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#hero" className="hover:text-[#DC2626] transition-colors">Beranda</a>
              <a href="#about" className="hover:text-[#DC2626] transition-colors">About</a>
              <a href="#skills" className="hover:text-[#DC2626] transition-colors">Skills</a>
              <a href="#projects" className="hover:text-[#DC2626] transition-colors">Projects</a>
              <a href="#experience" className="hover:text-[#DC2626] transition-colors">Journey</a>
            </div>
          </div>
        </footer>
      </ScrollReveal>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Command Palette */}
      <CommandPalette
        isOpen={cmdPaletteOpen}
        onClose={() => setCmdPaletteOpen(false)}
        onToggleTheme={handleToggleMode}
        isNight={isNight}
      />

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

    </motion.div>
  );
}

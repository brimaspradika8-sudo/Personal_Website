"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  User,
  MapPin,
  Code,
  Layers,
  ShieldCheck,
  ArrowRight,
  LogOut,
  LogIn,
  BookOpen,
  Calendar,
  Clock,
  ChevronRight,
} from "lucide-react";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import MobileBottomNav from "@/components/MobileBottomNav";
import { soundFx } from "@/lib/audio/sound";
import CommandPalette from "@/components/CommandPalette";
import ProjectModal, { ProjectData } from "@/components/ProjectModal";
import TechStackMatrix from "@/components/TechStackMatrix";
import ProjectShowcase from "@/components/ProjectShowcase";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import GuestbookSection from "@/components/GuestbookSection";
import Footer from "@/components/Footer";
import Lanyard from "@/components/Lanyard";
import { signOut } from "@/lib/actions/auth";
import { ArticleItem } from "@/lib/actions/article";

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
    created_at: Date | string;
  } | null;
  initialArticles?: ArticleItem[];
  isAdmin?: boolean;
}

export default function DashboardClient({
  user,
  dbUser,
  initialArticles = [],
  isAdmin = false,
}: DashboardClientProps) {
  const { lang, toggleLang } = useLanguage();
  const [mode, setMode] = useState<"day" | "night">(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("landscape_mode");
      if (savedMode === "day") return "day";
    }
    return "night";
  });
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [sfxEnabled, setSfxEnabled] = useState(() => soundFx.getIsEnabled());
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const showToast = (msg: string) => {
    soundFx.playClick();
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    const handleOpen = () => setCmdPaletteOpen(true);
    window.addEventListener("open-command-palette", handleOpen);

    if (mode === "night") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    return () => {
      window.removeEventListener("open-command-palette", handleOpen);
    };
  }, [mode]);

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
      showToast(
        nextMode === "night"
          ? lang === "id"
            ? "Mode Malam Hari"
            : "Night Mode"
          : lang === "id"
          ? "Mode Siang Hari"
          : "Day Mode"
      );
      return nextMode;
    });
  };

  const ownerName = "BRIMAS PRADIKA UTAMA";
  const heroAvatarSrc = "/images/avatar.webp";

  const navUserName =
    dbUser?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Guest User";

  const isLoggedIn = !!user;
  const activeUserName =
    dbUser?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    (user?.email ? user.email.split("@")[0] : "");

  const welcomeMarqueeText =
    isLoggedIn && activeUserName
      ? `WELCOME ${activeUserName.toUpperCase()}`
      : "WELCOME";

  const initialLetter =
    navUserName && navUserName !== "Guest User"
      ? navUserName.charAt(0).toUpperCase()
      : "G";
  const isNight = mode === "night";

  return (
    <div
      className={`min-h-screen font-sans antialiased text-left selection:bg-[#D32F2F] selection:text-white transition-colors duration-300 pb-20 md:pb-0 ${
        isNight ? "bg-[#0B0F17] text-slate-100" : "bg-[#F8F9FA] text-slate-900"
      }`}
    >
      {/* 1. TOP NAVIGATION HEADER */}
      <header
        className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${
          isNight
            ? "bg-[#0B0F17]/90 border-slate-800 text-slate-100"
            : "bg-white/90 border-slate-200 text-slate-900 shadow-xs"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="flex items-center gap-2.5 shrink-0 group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#D32F2F] flex items-center justify-center text-white font-black text-xs shadow-xs group-hover:scale-105 transition-transform">
              B
            </div>
            <span className="font-bold tracking-tight text-sm font-sans">
              Brimas <span className="font-normal opacity-70">Pradika</span>
            </span>
          </Link>

          {/* Search Bar Center */}
          <div className="hidden md:flex items-center flex-1 max-w-xs relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari proyek atau topik..."
              className={`w-full py-1.5 pl-8 pr-3 text-xs rounded-full border transition-all outline-none ${
                isNight
                  ? "bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-[#D32F2F]"
                  : "bg-slate-100 border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-[#D32F2F]"
              }`}
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 text-slate-400" />
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium tracking-wide">
            {[
              { label: "Beranda", href: "#hero" },
              { label: "About", href: "#about" },
              { label: "Skill Matrix", href: "#skills" },
              { label: "Project", href: "#projects" },
              { label: "Artikel", href: "/posts" },
              { label: "Buku Tamu", href: "#guestbook" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => soundFx.playClick()}
                className="transition-colors hover:text-[#D32F2F]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Action Icons & Auth Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Language & Sound Toggles */}
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                toggleLang();
              }}
              className="px-2 py-1 rounded-full border border-slate-300 dark:border-slate-800 text-[10px] font-mono hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            >
              {lang.toUpperCase()}
            </button>

            <button
              type="button"
              onClick={() => {
                const next = soundFx.toggleMute();
                setSfxEnabled(next);
                showToast(
                  next
                    ? lang === "id"
                      ? "Suara Aktif"
                      : "Sound Enabled"
                    : lang === "id"
                    ? "Suara Senyap"
                    : "Sound Muted"
                );
              }}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
              title={sfxEnabled ? "Mute Sound" : "Enable Sound"}
            >
              {sfxEnabled ? (
                <Volume2 className="w-4 h-4 text-[#D32F2F]" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            <button
              type="button"
              onClick={handleToggleMode}
              aria-label="Toggle Mode"
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
              title="Ganti Mode Terang/Gelap"
            >
              {isNight ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Admin Dashboard Badge (Accessible ONLY by Admin) */}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => soundFx.playClick()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D32F2F] text-white text-xs font-bold hover:bg-[#B91C1C] transition-all shadow-xs cursor-pointer"
                title="Masuk ke Admin Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Admin Panel</span>
              </Link>
            )}

            {/* Profile Avatar / Auth Login Button */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  onClick={() => soundFx.playClick()}
                  title="Halaman Profil"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-[#D32F2F] text-white font-bold text-xs shadow-xs hover:scale-105 active:scale-95 transition-transform border border-white/20 cursor-pointer overflow-hidden relative"
                >
                  {user?.user_metadata?.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt={navUserName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    initialLetter
                  )}
                </Link>

                <button
                  onClick={async () => {
                    soundFx.playClick();
                    await signOut();
                  }}
                  className="p-1.5 rounded-full text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="Sign Out (Keluar)"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => soundFx.playClick()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section
        id="hero"
        className={`relative min-h-[85vh] lg:min-h-[90vh] flex flex-col justify-between overflow-hidden transition-colors duration-300 ${
          isNight
            ? "bg-[#0E1015]"
            : "bg-gradient-to-b from-slate-100 via-slate-50 to-white"
        }`}
      >
        {/* Giant Moving Marquee Typography */}
        <div className="absolute top-2 inset-x-0 flex flex-col pointer-events-none select-none overflow-hidden z-0 pt-1 -space-y-4 sm:-space-y-8">
          <div className="animate-welcome-marquee flex gap-4 whitespace-nowrap">
            <h1
              className={`font-display text-[22vw] sm:text-[24vw] font-black uppercase tracking-tighter leading-none transition-colors ${
                isNight ? "text-slate-900/60" : "text-slate-200/80"
              }`}
            >
              {welcomeMarqueeText} <span className="mx-2 opacity-40">&bull;</span>{" "}
              {welcomeMarqueeText} <span className="mx-2 opacity-40">&bull;</span>
            </h1>
          </div>

          <div className="animate-welcome-marquee-reverse flex gap-4 whitespace-nowrap">
            <h1
              className={`font-display text-[16vw] sm:text-[18vw] font-black uppercase tracking-tighter leading-none transition-colors ${
                isNight ? "text-slate-900/40" : "text-slate-200/50"
              }`}
            >
              BRIMAS PRADIKA UTAMA <span className="mx-2 opacity-40">&bull;</span>{" "}
              BRIMAS PRADIKA UTAMA <span className="mx-2 opacity-40">&bull;</span>
            </h1>
          </div>
        </div>

        {/* Hero Content Overlay Grid */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 w-full flex-1 flex flex-col justify-between pt-6 sm:pt-10 pb-8 sm:pb-14">
          <div className="relative w-full flex flex-col sm:flex-row items-center justify-center min-h-[50vh] sm:min-h-[55vh] my-auto gap-6 sm:gap-0">
            
            {/* Centerpiece Hero Photo Portrait */}
            <div className="hero-photo-wrapper relative z-20 w-[260px] h-[340px] sm:w-[360px] sm:h-[460px] md:w-[400px] md:h-[500px] max-w-full overflow-hidden rounded-3xl shadow-2xl border-4 border-white dark:border-slate-800 flex items-center justify-center pointer-events-auto group">
              <Image
                src={heroAvatarSrc}
                alt={ownerName}
                fill
                priority
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60" />
            </div>

            {/* Desktop Headline & CTAs */}
            <div className="hidden sm:block absolute left-0 bottom-6 sm:bottom-10 z-20 space-y-4 max-w-md text-left drop-shadow-md">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-widest bg-[#D32F2F]/15 text-[#D32F2F]">
                Fullstack Web Developer
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none text-slate-900 dark:text-white">
                I&apos;M {ownerName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans max-w-sm">
                Siswa SMK Bhakti Mulia Pare yang membangun sistem web modern, scalable, dan aplikasi performa tinggi dari arsitektur backend hingga UI elegan.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#projects"
                  onClick={() => soundFx.playClick()}
                  className="px-6 py-2.5 rounded-full bg-[#D32F2F] hover:bg-[#B91C1C] text-white font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.03] cursor-pointer inline-flex items-center gap-2 shadow-xs"
                >
                  <span>EXPLORE PROJECTS</span>
                </a>

                <a
                  href="#about"
                  onClick={() => soundFx.playClick()}
                  className="px-6 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider transition-all hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer inline-flex items-center gap-2"
                >
                  <span>ABOUT ME</span>
                </a>
              </div>
            </div>

            {/* Mobile Headline & CTAs */}
            <div className="sm:hidden w-full z-20 space-y-3 text-center px-2 pt-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-[#D32F2F]/15 text-[#D32F2F] inline-block">
                Fullstack Developer
              </span>
              <h1 className="font-display text-3xl font-black uppercase tracking-tight leading-none text-slate-900 dark:text-white">
                I&apos;M {ownerName}
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans max-w-xs mx-auto">
                Pengembang web fullstack SMK Bhakti Mulia Pare. Spesialisasi Laravel, Next.js, PostgreSQL, dan Supabase.
              </p>

              <div className="flex items-center justify-center gap-3 pt-1">
                <a
                  href="#projects"
                  onClick={() => soundFx.playClick()}
                  className="px-5 py-2 rounded-full bg-[#D32F2F] text-white font-bold text-xs uppercase tracking-wider shadow-xs"
                >
                  PROJECTS
                </a>

                <a
                  href="#about"
                  onClick={() => soundFx.playClick()}
                  className="px-5 py-2 rounded-full border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider"
                >
                  ABOUT ME
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Smooth SVG Wave Divider */}
        <div className="absolute -bottom-[1px] left-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
          <svg
            className={`w-full h-16 sm:h-24 md:h-28 block fill-current transition-colors duration-300 ${
              isNight ? "text-[#0B0F17]" : "text-[#F8F9FA]"
            }`}
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path d="M0,40 C360,110 720,20 1080,90 1260,120 1440,40 1440,40 L1440,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* 3. ABOUT ME & 3D LANYARD SECTION */}
      <section
        id="about"
        className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-b border-slate-200 dark:border-slate-800/80"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Interactive 3D Physics Lanyard Photo Card */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-md h-[420px] sm:h-[580px] flex items-center justify-center overflow-visible">
              <Lanyard />
            </div>
          </div>

          {/* Right Column: About Me Bio */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D32F2F]/15 text-[#D32F2F] text-xs font-mono font-bold tracking-widest uppercase">
              <User className="w-3.5 h-3.5" />
              <span>ABOUT ME</span>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight leading-none text-slate-900 dark:text-slate-100">
                BRIMAS <span className="text-[#D32F2F]">PRADIKA UTAMA</span>
              </h2>
              <p className="text-xs sm:text-sm font-mono tracking-wide opacity-80 uppercase text-[#D32F2F]">
                Fullstack Web Developer &bull; SMK Bhakti Mulia Pare
              </p>
              <p className="text-xs sm:text-base opacity-90 leading-relaxed font-sans max-w-xl text-slate-600 dark:text-slate-300">
                {lang === "id"
                  ? "Siswa SMK Bhakti Mulia Pare yang aktif membangun aplikasi web end-to-end secara profesional. Berfokus pada Fullstack Development dengan PHP, Laravel, React, Next.js, MySQL/PostgreSQL, Prisma, Supabase, dan Docker. Bagi saya, coding bukan sekadar menulis sintaks, tapi bagaimana membangun sistem yang rapi, scalable, dan maintainable."
                  : "Student at SMK Bhakti Mulia Pare actively building end-to-end web applications. Specialized in Fullstack Development with PHP, Laravel, React, Next.js, MySQL/PostgreSQL, Prisma, Supabase, and Docker."}
              </p>
            </div>

            {/* Feature Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div
                className={`p-3 rounded-xl border space-y-1 transition-colors ${
                  isNight
                    ? "bg-[#0E1015] border-slate-800"
                    : "bg-white border-slate-200 shadow-xs"
                }`}
              >
                <div className="flex items-center gap-1.5 text-[#D32F2F]">
                  <MapPin className="w-4 h-4" />
                  <span className="text-[11px] font-mono font-bold uppercase">SCHOOL</span>
                </div>
                <p className="text-xs font-bold truncate text-slate-900 dark:text-slate-100">
                  SMK Bhakti Mulia Pare
                </p>
              </div>

              <div
                className={`p-3 rounded-xl border space-y-1 transition-colors ${
                  isNight
                    ? "bg-[#0E1015] border-slate-800"
                    : "bg-white border-slate-200 shadow-xs"
                }`}
              >
                <div className="flex items-center gap-1.5 text-[#D32F2F]">
                  <Code className="w-4 h-4" />
                  <span className="text-[11px] font-mono font-bold uppercase">ROLE</span>
                </div>
                <p className="text-xs font-bold truncate text-slate-900 dark:text-slate-100">
                  Fullstack Developer
                </p>
              </div>

              <div
                className={`p-3 rounded-xl border space-y-1 transition-colors ${
                  isNight
                    ? "bg-[#0E1015] border-slate-800"
                    : "bg-white border-slate-200 shadow-xs"
                }`}
              >
                <div className="flex items-center gap-1.5 text-[#D32F2F]">
                  <Layers className="w-4 h-4" />
                  <span className="text-[11px] font-mono font-bold uppercase">STACK</span>
                </div>
                <p className="text-xs font-bold truncate text-slate-900 dark:text-slate-100">
                  Laravel &bull; Next.js
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href="#projects"
                onClick={() => soundFx.playClick()}
                className="px-6 py-3 rounded-full bg-[#D32F2F] hover:bg-[#B91C1C] text-white font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.03] cursor-pointer inline-flex items-center gap-2 shadow-xs"
              >
                <span>{lang === "id" ? "LIHAT PROYEK" : "EXPLORE PROJECTS"}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/profile"
                onClick={() => soundFx.playClick()}
                className="px-6 py-3 rounded-full border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider transition-all hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer inline-flex items-center gap-2"
              >
                <span>{lang === "id" ? "PROFIL LENGKAP" : "FULL PROFILE"}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TECH STACK MATRIX SECTION */}
      <TechStackMatrix isNight={isNight} lang={lang} />

      {/* 5. PORTFOLIO PROJECTS SHOWCASE SECTION */}
      <ProjectShowcase
        isNight={isNight}
        lang={lang}
        onSelectProject={(proj) => setSelectedProject(proj)}
      />

      {/* 6. EXPERIENCE & JOURNEY TIMELINE SECTION */}
      <ExperienceTimeline isNight={isNight} lang={lang} />

      {/* 7. LATEST ARTICLES SECTION */}
      {initialArticles.length > 0 && (
        <section id="articles" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-b border-slate-200 dark:border-slate-800/80">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1 text-left">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Artikel & Wawasan Terbaru
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans">
                  Tulisan teknis, catatan riset web development, dan panduan arsitektur.
                </p>
              </div>

              <Link
                href="/posts"
                onClick={() => soundFx.playClick()}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#D32F2F] hover:underline cursor-pointer"
              >
                <span>Lihat Semua Artikel</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {initialArticles.slice(0, 3).map((art) => (
                <Link
                  key={art.id}
                  href={`/posts/${art.slug}`}
                  onClick={() => soundFx.playClick()}
                  className={`p-5 rounded-2xl border text-left flex flex-col justify-between space-y-4 group transition-all duration-200 ${
                    isNight
                      ? "bg-[#0E1015] border-slate-800 hover:border-slate-700"
                      : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-medium">
                        {art.category || "Tutorial"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#D32F2F]" />
                        {new Date(art.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-[#D32F2F] transition-colors leading-snug line-clamp-2">
                      {art.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-500 font-sans">
                    {art.readTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#D32F2F]" />
                        {art.readTime}
                      </span>
                    )}
                    <span className="text-[#D32F2F] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      Baca <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. COMMUNITY GUESTBOOK SECTION */}
      <GuestbookSection user={user} isNight={isNight} />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#D32F2F] text-white font-bold text-xs font-mono shadow-xl">
          {toastMsg}
        </div>
      )}

      {/* Footer */}
      <Footer isNight={isNight} />

      {/* Floating Mobile Bottom Navigation */}
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
    </div>
  );
}

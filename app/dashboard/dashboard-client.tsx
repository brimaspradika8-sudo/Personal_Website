"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  MapPin,
  Code,
  Layers,
  ShieldCheck,
  ArrowRight,
  LogOut,
  Calendar,
  Clock,
  ChevronRight,
  Menu,
  X,
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

const GREETINGS = [
  "HALO",
  "HELLO",
  "BONJOUR",
  "HALLO",
  "HOLA",
  "CIAO",
  "OLÁ",
  "こんにちは",
  "안녕하세요",
  "你好",
  "नमस्ते",
  "สวัสดี",
  "السلام عليكم",
  "ПРИВЕТ",
  "HABARI",
  "SUGENG RAWUH",
];

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
      if (savedMode === "night") return "night";
    }
    return "day";
  });
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [greetingIndex, setGreetingIndex] = useState(0);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % GREETINGS.length);
    }, 2200);
    return () => clearInterval(interval);
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
      className={`min-h-screen font-sans antialiased text-left selection:bg-[#DC2626] selection:text-white transition-colors duration-300 pb-20 md:pb-0 ${
        isNight ? "bg-[#0B0F17] text-slate-100" : "bg-[#F2F3F4] text-slate-900"
      }`}
    >
      {/* 1. FLOATING PILL TOP NAVBAR */}
      <header className="fixed top-4 sm:top-6 inset-x-0 z-50 px-4 pointer-events-none">
        <div
          className={`max-w-4xl mx-auto rounded-full border shadow-xl backdrop-blur-md px-6 py-2.5 flex items-center justify-between pointer-events-auto transition-all duration-300 ${
            isNight
              ? "bg-[#111622]/90 border-slate-800 text-slate-100 shadow-black/40"
              : "bg-white/95 border-slate-200/90 text-slate-900 shadow-slate-300/40"
          }`}
        >
          {/* Left: Red Circle B Logo & Brand Text */}
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#DC2626] text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-red-500/30 group-hover:scale-105 transition-transform">
              B
            </div>
            <span className="font-extrabold text-sm tracking-tight font-sans">
              Brimas<span className="font-normal opacity-60">Pradika</span>
            </span>
          </Link>

          {/* Middle: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-slate-200">
            <a
              href="#hero"
              onClick={() => soundFx.playClick()}
              className="hover:text-[#DC2626] dark:hover:text-[#DC2626] transition-colors"
            >
              HOME
            </a>
            <a
              href="#about"
              onClick={() => soundFx.playClick()}
              className="hover:text-[#DC2626] dark:hover:text-[#DC2626] transition-colors"
            >
              ABOUT
            </a>
            <a
              href="#projects"
              onClick={() => soundFx.playClick()}
              className="hover:text-[#DC2626] dark:hover:text-[#DC2626] transition-colors"
            >
              PROJECTS
            </a>
            <a
              href="/posts"
              onClick={() => soundFx.playClick()}
              className="hover:text-[#DC2626] dark:hover:text-[#DC2626] transition-colors"
            >
              BLOG
            </a>
          </nav>

          {/* Right: Controls & Auth Buttons */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                toggleLang();
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                isNight
                  ? "border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800"
                  : "border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100"
              }`}
            >
              {lang.toUpperCase()}
            </button>

            {/* Admin Badge */}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => soundFx.playClick()}
                className="px-3.5 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs hover:opacity-90 transition-opacity"
                title="Admin Panel"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#DC2626]" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}

            {/* Sign In Pill Button / Profile */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  onClick={() => soundFx.playClick()}
                  className="w-8 h-8 rounded-full bg-[#DC2626] text-white font-bold text-xs flex items-center justify-center shadow-md overflow-hidden relative hover:scale-105 active:scale-95 transition-transform"
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
                  className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => soundFx.playClick()}
                className="px-5 py-2 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold shadow-md shadow-red-500/25 transition-all cursor-pointer"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Header Menu Drawer */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden max-w-4xl mx-auto mt-2 p-4 rounded-3xl border shadow-xl backdrop-blur-xl pointer-events-auto space-y-3 ${
              isNight ? "bg-[#111622] border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold uppercase">
              <a
                href="#hero"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800"
              >
                HOME
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800"
              >
                ABOUT
              </a>
              <a
                href="#projects"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800"
              >
                PROJECTS
              </a>
              <a
                href="/posts"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800"
              >
                BLOG
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section
        id="hero"
        className={`relative min-h-[92vh] flex items-center pt-24 sm:pt-32 pb-8 overflow-hidden transition-colors duration-300 ${
          isNight ? "bg-[#0B0F17]" : "bg-[#F2F3F4]"
        }`}
      >
        {/* Backdrop Giant Moving Typography ("WELCOME" & "BRIMAS PRADIKA UTAMA") */}
        <div className="absolute top-10 inset-x-0 flex flex-col pointer-events-none select-none overflow-hidden z-0 pt-4 space-y-[-2vw]">
          {/* Line 1: Dynamic WELCOME Marquee */}
          <div className="animate-welcome-marquee flex gap-12 whitespace-nowrap">
            <h1
              className={`font-display text-[16vw] sm:text-[17vw] font-black uppercase tracking-tighter leading-none transition-colors ${
                isNight ? "text-slate-900/60" : "text-slate-200/80"
              }`}
            >
              {welcomeMarqueeText} &bull; {welcomeMarqueeText} &bull; {welcomeMarqueeText} &bull;
            </h1>
            <h1
              className={`font-display text-[16vw] sm:text-[17vw] font-black uppercase tracking-tighter leading-none transition-colors ${
                isNight ? "text-slate-900/60" : "text-slate-200/80"
              }`}
            >
              {welcomeMarqueeText} &bull; {welcomeMarqueeText} &bull; {welcomeMarqueeText} &bull;
            </h1>
          </div>

          {/* Line 2: BRIMAS PRADIKA UTAMA Marquee (Moving Reverse) */}
          <div className="animate-welcome-marquee-reverse flex gap-12 whitespace-nowrap">
            <h1
              className={`font-display text-[12vw] sm:text-[13vw] font-black uppercase tracking-tighter leading-none transition-colors ${
                isNight ? "text-slate-900/40" : "text-slate-200/60"
              }`}
            >
              BRIMAS PRADIKA UTAMA &bull; BRIMAS PRADIKA UTAMA &bull;
            </h1>
            <h1
              className={`font-display text-[12vw] sm:text-[13vw] font-black uppercase tracking-tighter leading-none transition-colors ${
                isNight ? "text-slate-900/40" : "text-slate-200/60"
              }`}
            >
              BRIMAS PRADIKA UTAMA &bull; BRIMAS PRADIKA UTAMA &bull;
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full min-h-[75vh] flex flex-col md:flex-row items-center justify-between relative z-10 gap-8">
          
          {/* Left Column Headline & CTAs */}
          <div className="w-full md:w-7/12 space-y-5 text-left py-4 sm:py-8 z-10">
            
            {/* 3-Line Headline: 1. Giant Multi-language Greeting -> 2. Single Line I'M BRIMAS PRADIKA -> 3. UTAMA */}
            <h1 className="font-serif font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[76px] text-slate-950 dark:text-white tracking-tight leading-[0.96] uppercase space-y-1">
              <span className="block text-[#DC2626] font-serif font-black transition-all duration-300">
                {GREETINGS[greetingIndex]}
              </span>
              <span className="block whitespace-nowrap">I’M BRIMAS PRADIKA</span>
              <span className="block text-[#DC2626]">UTAMA</span>
            </h1>

            {/* 3. Subtitle Paragraph */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed font-sans font-medium pt-1">
              Software &amp; AI Systems Developer focused on modern web architecture, interactive tech experiments, and high-performance digital solutions.
            </p>

            {/* 4. CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <a
                href="#projects"
                onClick={() => soundFx.playClick()}
                className="px-8 py-3.5 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-500/30 hover:scale-105 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>EXPLORE PROJECTS</span>
              </a>

              <a
                href="#about"
                onClick={() => soundFx.playClick()}
                className="px-8 py-3.5 rounded-full border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>ABOUT ME</span>
              </a>
            </div>

            {/* 5. Theme Switch Circle N' Button */}
            <div className="pt-6 sm:pt-10">
              <button
                type="button"
                onClick={handleToggleMode}
                className="w-11 h-11 rounded-full bg-[#1C1C1E] text-white dark:bg-white dark:text-slate-900 flex items-center justify-center font-serif text-sm font-bold shadow-lg hover:scale-110 transition-transform cursor-pointer"
                title="Ganti Mode Terang/Gelap"
              >
                N′
              </button>
            </div>
          </div>

          {/* Right Column Cutout Portrait Photo of Brimas (Flush at Bottom) */}
          <div className="w-full md:w-5/12 flex justify-center md:justify-end items-end h-full relative z-10">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg h-[480px] sm:h-[600px] lg:h-[680px] flex items-end justify-end">
              <Image
                src="/images/avatar.webp"
                alt="Brimas Pradika Utama"
                fill
                priority
                unoptimized
                className="object-contain object-bottom drop-shadow-2xl"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 3. ABOUT ME & 3D LANYARD SECTION */}
      <section
        id="about"
        className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-t border-b border-slate-200 dark:border-slate-800/80"
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DC2626]/15 text-[#DC2626] text-xs font-mono font-bold tracking-widest uppercase">
              <User className="w-3.5 h-3.5" />
              <span>ABOUT ME</span>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-3xl sm:text-5xl font-black uppercase tracking-tight leading-none text-slate-900 dark:text-slate-100">
                BRIMAS <span className="text-[#DC2626]">PRADIKA UTAMA</span>
              </h2>
              <p className="text-xs sm:text-sm font-mono tracking-wide opacity-80 uppercase text-[#DC2626]">
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
                <div className="flex items-center gap-1.5 text-[#DC2626]">
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
                <div className="flex items-center gap-1.5 text-[#DC2626]">
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
                <div className="flex items-center gap-1.5 text-[#DC2626]">
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
                className="px-6 py-3 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.03] cursor-pointer inline-flex items-center gap-2 shadow-xs"
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

      {/* 4. LATEST ARTICLES & INSIGHTS SECTION (Replaces Tech Stack Matrix) */}
      <section
        id="articles"
        className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-b border-slate-200 dark:border-slate-800/80"
      >
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DC2626]/15 text-[#DC2626] text-xs font-mono font-bold tracking-widest uppercase">
                <span>LATEST ARTICLES &amp; INSIGHTS</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100">
                ARTIKEL &amp; <span className="text-[#DC2626]">PANDUAN TEKNIS</span>
              </h2>
              <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 font-sans max-w-2xl">
                Tulisan teknis, eksperimen pengembangan web, catatan arsitektur sistem, dan panduan backend/frontend.
              </p>
            </div>

            <Link
              href="/posts"
              onClick={() => soundFx.playClick()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 shadow-md shadow-red-500/20 w-fit cursor-pointer"
            >
              <span>Lihat Semua Artikel</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(initialArticles && initialArticles.length > 0
              ? initialArticles
              : [
                  {
                    id: "1",
                    title: "Membangun Arsitektur Web Scalable dengan Next.js App Router & Server Components",
                    slug: "membangun-arsitektur-web-scalable-nextjs",
                    category: "Web Architecture",
                    readTime: "5 min read",
                    created_at: new Date().toISOString(),
                    cover_image: "/images/article1.png",
                  },
                  {
                    id: "2",
                    title: "Implementasi RESTful API & Eloquent Performance Optimization pada Laravel 11",
                    slug: "restful-api-performance-laravel-11",
                    category: "Backend Engineering",
                    readTime: "7 min read",
                    created_at: new Date().toISOString(),
                    cover_image: "/images/article2.png",
                  },
                  {
                    id: "3",
                    title: "Prisma ORM & PostgreSQL: Trik Query Optimization & Indexing untuk Production",
                    slug: "prisma-postgresql-query-optimization",
                    category: "Database & Systems",
                    readTime: "6 min read",
                    created_at: new Date().toISOString(),
                    cover_image: "/images/article3.png",
                  },
                ]
            )
              .slice(0, 3)
              .map((art, idx) => (
                <Link
                  key={art.id}
                  href={`/posts/${art.slug}`}
                  onClick={() => soundFx.playClick()}
                  className={`p-5 rounded-3xl border text-left flex flex-col justify-between space-y-4 group transition-all duration-300 hover:-translate-y-1.5 ${
                    isNight
                      ? "bg-[#0E1015] border-slate-800 hover:border-slate-700 shadow-lg"
                      : "bg-white border-slate-200 hover:border-slate-300 shadow-md"
                  }`}
                >
                  <div className="space-y-4">
                    {/* Article Thumbnail Image */}
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/50 dark:border-slate-800">
                      <Image
                        src={(art as any).cover_image || `/images/article${(idx % 3) + 1}.png`}
                        alt={art.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-sans">
                      <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[#DC2626] font-mono font-bold text-[11px] uppercase">
                        {art.category || "Tutorial"}
                      </span>
                      <span className="flex items-center gap-1.5 font-mono text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-[#DC2626]" />
                        {new Date(art.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-lg sm:text-xl text-slate-900 dark:text-slate-100 group-hover:text-[#DC2626] transition-colors leading-snug line-clamp-2">
                      {art.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 font-sans">
                    {art.readTime ? (
                      <span className="flex items-center gap-1.5 font-mono">
                        <Clock className="w-3.5 h-3.5 text-[#DC2626]" />
                        {art.readTime}
                      </span>
                    ) : (
                      <span className="font-mono text-[11px]">Artikel Teknis</span>
                    )}
                    <span className="text-[#DC2626] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1 font-mono uppercase text-xs">
                      Baca Artikel <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* 5. PORTFOLIO PROJECTS SHOWCASE SECTION */}
      <ProjectShowcase
        isNight={isNight}
        lang={lang}
        onSelectProject={(proj) => setSelectedProject(null)}
      />

      {/* 6. EXPERIENCE & JOURNEY TIMELINE SECTION */}
      <ExperienceTimeline isNight={isNight} lang={lang} />

      {/* 8. COMMUNITY GUESTBOOK SECTION */}
      <GuestbookSection user={user} isNight={isNight} />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#DC2626] text-white font-bold text-xs font-mono shadow-xl">
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

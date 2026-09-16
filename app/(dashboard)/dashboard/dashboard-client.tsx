"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import MobileBottomNav from "@/components/MobileBottomNav";
import { soundFx } from "@/lib/audio/sound";
import dynamic from "next/dynamic";
import type { ProjectData } from "@/components/ProjectModal";
import ProjectShowcase from "@/components/ProjectShowcase";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import TechStackBento from "@/components/TechStackBento";
import Footer from "@/components/Footer";
import { signOut } from "@/lib/actions/auth";
import { ArticleItem } from "@/lib/actions/article";
import { getSavedTheme, saveTheme } from "@/lib/theme";
import ReadingProgressBar from "@/components/ReadingProgressBar";

const CommandPalette = dynamic(() => import("@/components/CommandPalette"), {
  ssr: false,
});
const ProjectModal = dynamic(() => import("@/components/ProjectModal"), {
  ssr: false,
});
const QuickContactFAB = dynamic(() => import("@/components/QuickContactFAB"), {
  ssr: false,
});

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
  const { lang, toggleLang, dict } = useLanguage();
  const [mode, setMode] = useState<"day" | "night">("day");

  useEffect(() => {
    setMode(getSavedTheme());
  }, []);
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

    return () => {
      window.removeEventListener("open-command-palette", handleOpen);
    };
  }, []);

  useEffect(() => {
    saveTheme(mode);
  }, [mode]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % GREETINGS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const handleToggleMode = () => {
    const nextMode = mode === "day" ? "night" : "day";
    setMode(nextMode);
    saveTheme(nextMode);
    showToast(
      nextMode === "night"
        ? lang === "id"
          ? "Mode Malam Hari"
          : "Night Mode"
        : lang === "id"
        ? "Mode Siang Hari"
        : "Day Mode"
    );
  };

  const isLoggedIn = !!user;

  const navUserName = isLoggedIn
    ? dbUser?.name ||
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.email?.split("@")[0] ||
      "User"
    : "Visitor";

  const welcomeGreeting = isLoggedIn
    ? `WELCOME ${navUserName.toUpperCase()}`
    : "WELCOME VISITOR";

  const initialLetter =
    isLoggedIn && navUserName !== "Visitor"
      ? navUserName.charAt(0).toUpperCase()
      : "V";
  const isNight = mode === "night";

  return (
    <div
      className={`min-h-screen font-sans antialiased text-left selection:bg-[#DC2626] selection:text-white transition-colors duration-300 pb-20 md:pb-0 ${
        isNight ? "bg-[#0B0F17] text-slate-100" : "bg-[#F2F3F4] text-slate-900"
      }`}
    >
      {/* Scroll Reading Progress Bar */}
      <ReadingProgressBar />

      {/* 1. TOP NAVBAR (Capsule Floating Pill Header) */}
      <header className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl rounded-full border-2 sm:border-3 border-slate-900 dark:border-white bg-white/90 dark:bg-[#0E121D]/90 backdrop-blur-md transition-all duration-300 font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] px-3.5 sm:px-6 py-2 sm:py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Brand Logo & Capsule Icon */}
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="flex items-center gap-2 group cursor-pointer shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#DC2626] border-2 border-slate-900 dark:border-white text-white flex items-center justify-center font-mono font-black text-xs sm:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] group-hover:scale-105 transition-transform">

            </div>
            <span className="font-serif font-black text-xs sm:text-base tracking-tight uppercase text-slate-950 dark:text-white">
              BRIMAS<span className="text-[#DC2626]"> Pradika</span>
            </span>
          </Link>

          {/* Middle: Capsule Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 sm:gap-2 bg-slate-100/80 dark:bg-slate-900/80 px-3 py-1 rounded-full border border-slate-900/20 dark:border-white/20">
            <a
              href="#hero"
              onClick={() => soundFx.playClick()}
              className="px-3 py-1 rounded-full font-mono font-bold text-xs uppercase tracking-wider text-slate-950 dark:text-white hover:bg-[#DC2626] hover:text-white transition-all"
            >
              {dict.nav.home.toUpperCase()}
            </a>
            <a
              href="#about"
              onClick={() => soundFx.playClick()}
              className="px-3 py-1 rounded-full font-mono font-bold text-xs uppercase tracking-wider text-slate-950 dark:text-white hover:bg-[#DC2626] hover:text-white transition-all"
            >
              {dict.nav.about.toUpperCase()}
            </a>
            <a
              href="#projects"
              onClick={() => soundFx.playClick()}
              className="px-3 py-1 rounded-full font-mono font-bold text-xs uppercase tracking-wider text-slate-950 dark:text-white hover:bg-[#DC2626] hover:text-white transition-all"
            >
              {dict.nav.projects.toUpperCase()}
            </a>
            <Link
              href="/artikel"
              onClick={() => soundFx.playClick()}
              className="px-3 py-1 rounded-full font-mono font-bold text-xs uppercase tracking-wider text-slate-950 dark:text-white hover:bg-[#DC2626] hover:text-white transition-all"
            >
              {dict.nav.articles.toUpperCase()}
            </Link>
          </nav>

          {/* Right: Controls & Auth Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Language Toggle */}
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                toggleLang();
              }}
              className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-mono font-bold border-2 border-slate-900 dark:border-white bg-sky-400 text-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              {lang.toUpperCase()}
            </button>

            {/* Theme Switcher Button */}
            <button
              type="button"
              onClick={handleToggleMode}
              className="p-1.5 sm:p-2 rounded-full border-2 border-slate-900 dark:border-white bg-white dark:bg-slate-900 text-slate-950 dark:text-sky-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center justify-center"
              title={isNight ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isNight ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950" />}
            </button>

            {/* Admin Badge */}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => soundFx.playClick()}
                className="px-2.5 sm:px-3 py-1 rounded-full bg-[#DC2626] text-white border-2 border-slate-900 dark:border-white text-xs font-mono font-bold flex items-center gap-1 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                title="Admin Panel"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">ADMIN</span>
              </Link>
            )}

            {/* Sign In / Profile Capsule */}
            {isLoggedIn ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  href="/profile"
                  onClick={() => soundFx.playClick()}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-slate-900 dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  title="Profil Saya"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#DC2626] text-white font-mono font-bold text-xs flex items-center justify-center overflow-hidden relative border border-slate-900 dark:border-white">
                    {user?.user_metadata?.avatar_url || dbUser?.avatar ? (
                      <Image
                        src={user?.user_metadata?.avatar_url || dbUser?.avatar || ""}
                        alt={navUserName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      initialLetter
                    )}
                  </div>
                  <span className="hidden lg:inline text-xs font-mono font-bold truncate max-w-[100px] text-slate-950 dark:text-white">
                    {navUserName}
                  </span>
                </Link>

                <button
                  onClick={async () => {
                    soundFx.playClick();
                    await signOut();
                  }}
                  className="p-1.5 rounded-full hover:bg-red-500/10 text-slate-950 dark:text-white hover:text-[#DC2626] transition-colors cursor-pointer"
                  title="Sign Out (Logout)"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => soundFx.playClick()}
                className="px-3.5 sm:px-4 py-1 rounded-full bg-[#DC2626] border-2 border-slate-900 dark:border-white text-white text-xs font-mono font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                {dict.nav.login.toUpperCase()}
              </Link>
            )}

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-full border-2 border-slate-900 dark:border-white text-slate-950 dark:text-white"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Header Menu Drawer */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden mt-3 p-3 rounded-2xl border-2 border-slate-900 dark:border-white space-y-2 ${
              isNight ? "bg-[#0E121D]" : "bg-white"
            }`}
          >
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono font-bold uppercase">
              <a
                href="#hero"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-900 dark:border-white"
              >
                {dict.nav.home.toUpperCase()}
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-900 dark:border-white"
              >
                {dict.nav.about.toUpperCase()}
              </a>
              <a
                href="#projects"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-900 dark:border-white"
              >
                {dict.nav.projects.toUpperCase()}
              </a>
              <a
                href="/artikel"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-900 dark:border-white"
              >
                {dict.nav.articles.toUpperCase()}
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION (Neo-Brutalism Style) */}
      <section id="hero" className="relative min-h-[85vh] sm:min-h-[92vh] flex items-center justify-center pt-24 sm:pt-28 pb-12 overflow-hidden text-center">
        {/* Background Ticker / Running Text (Neo-Brutalist Marquee Bar - Hidden on mobile, active on desktop) */}
        <div className="hidden sm:block absolute top-24 sm:top-28 inset-x-0 overflow-hidden py-2.5 bg-sky-400 border-y-2 border-slate-900 text-slate-950 z-0 pointer-events-none font-mono font-bold text-xs sm:text-sm tracking-widest uppercase">
          <div className="whitespace-nowrap animate-marquee flex items-center gap-8">
            <span>{welcomeGreeting}, PERSONAL WEBSITE BRIMAS PRADIKA UTAMA &bull; JUNIOR PROGRAMMER &amp; AI SYSTEMS DEVELOPER </span>
            <span>{welcomeGreeting}, PERSONAL WEBSITE BRIMAS PRADIKA UTAMA &bull; JUNIOR PROGRAMMER &amp; AI SYSTEMS DEVELOPER </span>
            <span>{welcomeGreeting}, PERSONAL WEBSITE BRIMAS PRADIKA UTAMA &bull; JUNIOR PROGRAMMER &amp; AI SYSTEMS DEVELOPER </span>
            <span>{welcomeGreeting}, PERSONAL WEBSITE BRIMAS PRADIKA UTAMA &bull; JUNIOR PROGRAMMER &amp; AI SYSTEMS DEVELOPER </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 w-full min-h-[50vh] sm:min-h-[70vh] flex flex-col items-center justify-center text-center relative z-10 py-8 sm:py-12 space-y-4 sm:space-y-6"
        >
          {/* Headline with Neo-Brutalist Greeting Banner */}
          <h1 className="font-serif font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[84px] text-slate-950 dark:text-white tracking-tight leading-[0.96] uppercase space-y-2 sm:space-y-3">
            <span className="block min-h-[1.1em] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={greetingIndex}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="inline-block bg-[#DC2626] text-white border-2 border-slate-900 dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] px-5 py-1.5 rounded-2xl font-sans"
                >
                  {GREETINGS[greetingIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="block">I’M BRIMAS PRADIKA</span>
            <span className="block text-[#DC2626] underline decoration-4 underline-offset-4">UTAMA</span>
          </h1>

          {/* Subtitle Paragraph with Marker Highlighter Effect */}
          <p className="text-xs sm:text-lg text-slate-800 dark:text-slate-200 max-w-2xl leading-relaxed font-sans font-medium pt-1">
            Software &amp;{" "}
            <span className="bg-[#FFFF00] text-slate-950 px-2 py-0.5 border-2 border-slate-900 font-mono font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              AI SYSTEMS
            </span>{" "}
            Developer berfokus pada arsitektur web modern, integrasi AI agent, dan solusi digital performa tinggi.
          </p>

          {/* Neo-Brutalist CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              href="#projects"
              onClick={() => soundFx.playClick()}
              className="px-6 sm:px-8 py-3.5 rounded-xl bg-[#DC2626] border-2 border-slate-900 dark:border-white text-white font-mono font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>{lang === "id" ? "LIHAT PROYEK" : "EXPLORE PROJECTS"} &rarr;</span>
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              href="#about"
              onClick={() => soundFx.playClick()}
              className="px-6 sm:px-8 py-3.5 rounded-xl bg-white dark:bg-[#0E121D] border-2 border-slate-900 dark:border-white text-slate-950 dark:text-white font-mono font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>{lang === "id" ? "TENTANG SAYA" : "ABOUT ME"} &rarr;</span>
            </motion.a>
          </div>

        </motion.div>
      </section>

      {/* 3. ABOUT ME SECTION (Neo-Brutalism Style) */}
      <section
        id="about"
        className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20 border-t-2 border-b-2 border-slate-900 dark:border-white"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          
          {/* Left Column: Portrait Photo with Offset Background Frame */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full max-w-xs sm:max-w-md h-[260px] sm:h-[400px] lg:h-[460px] flex items-center justify-center bg-sky-400 dark:bg-[#0E121D] border-2 sm:border-3 border-slate-900 dark:border-white rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] p-4"
            >
              <Image
                src="/images/avatar.webp"
                alt="Brimas Pradika Utama"
                fill
                priority
                unoptimized
                className="object-contain object-bottom drop-shadow-xl hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
          </div>

          {/* Right Column: About Me Bio */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xl bg-[#DC2626] text-white border-2 border-slate-900 dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] text-xs font-mono font-bold tracking-widest uppercase">
              <User className="w-3.5 h-3.5 text-white" />
              <span>{lang === "id" ? "TENTANG SAYA" : "ABOUT ME"}</span>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <h2 className="font-serif text-2xl sm:text-5xl font-black uppercase tracking-tight leading-none text-slate-950 dark:text-white">
                BRIMAS <span className="text-[#DC2626]">PRADIKA UTAMA</span>
              </h2>
              <p className="text-xs sm:text-sm font-mono font-bold tracking-wide uppercase text-[#DC2626]">
                Junior Developer &bull; SMK Bhakti Mulia Pare
              </p>
              <p className="text-xs sm:text-base font-sans font-medium leading-relaxed max-w-xl text-slate-800 dark:text-slate-200">
                {lang === "id"
                  ? "Siswa SMK Bhakti Mulia Pare yang aktif membangun aplikasi web end-to-end secara profesional. Berfokus pada Fullstack Development dengan PHP, Laravel, React, Next.js, MySQL/PostgreSQL, Prisma, Supabase, dan Docker."
                  : "Student at SMK Bhakti Mulia Pare actively building end-to-end web applications. Specialized in Fullstack Development with PHP, Laravel, React, Next.js, MySQL/PostgreSQL, Prisma, Supabase, and Docker."}
              </p>
            </div>

            {/* Feature Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl border-2 border-slate-900 dark:border-white bg-white dark:bg-[#0E121D] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] space-y-1">
                <div className="flex items-center gap-1.5 text-[#DC2626]">
                  <MapPin className="w-4 h-4" />
                  <span className="text-[11px] font-mono font-bold uppercase">{lang === "id" ? "SEKOLAH" : "SCHOOL"}</span>
                </div>
                <p className="text-xs font-sans font-bold truncate text-slate-950 dark:text-white">
                  SMK Bhakti Mulia
                </p>
              </div>

              <div className="p-3.5 rounded-xl border-2 border-slate-900 dark:border-white bg-white dark:bg-[#0E121D] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] space-y-1">
                <div className="flex items-center gap-1.5 text-[#DC2626]">
                  <Code className="w-4 h-4" />
                  <span className="text-[11px] font-mono font-bold uppercase">{lang === "id" ? "PERAN" : "ROLE"}</span>
                </div>
                <p className="text-xs font-sans font-bold truncate text-slate-950 dark:text-white">
                  Junior Developer
                </p>
              </div>

              <div className="p-3.5 rounded-xl border-2 border-slate-900 dark:border-white bg-white dark:bg-[#0E121D] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] space-y-1">
                <div className="flex items-center gap-1.5 text-[#DC2626]">
                  <Layers className="w-4 h-4" />
                  <span className="text-[11px] font-mono font-bold uppercase">STACK</span>
                </div>
                <p className="text-xs font-sans font-bold truncate text-slate-950 dark:text-white">
                  Laravel &bull; Next.js
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href="#projects"
                onClick={() => soundFx.playClick()}
                className="px-6 py-3 rounded-xl bg-[#DC2626] border-2 border-slate-900 dark:border-white text-white font-mono font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>{lang === "id" ? "LIHAT PROYEK" : "EXPLORE PROJECTS"}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/profile"
                onClick={() => soundFx.playClick()}
                className="px-6 py-3 rounded-xl bg-white dark:bg-[#0E121D] border-2 border-slate-900 dark:border-white text-slate-950 dark:text-white font-mono font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>{lang === "id" ? "PROFIL LENGKAP" : "FULL PROFILE"}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3.5 BENTO GRID TECH STACK */}
      <TechStackBento isNight={isNight} lang={lang} />

      {/* 4. LATEST ARTICLES & INSIGHTS SECTION (Neo-Brutalist Magazine Style) */}
      <section
        id="articles"
        className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20 border-b-2 border-slate-900 dark:border-white text-left"
      >
        <div className="space-y-6 sm:space-y-10">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-2">
            <div className="space-y-2 sm:space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#DC2626] text-white border-2 border-slate-900 dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] text-[11px] font-mono font-bold tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </div>
              <h2 className="font-serif text-2xl sm:text-5xl font-black uppercase tracking-tight text-slate-950 dark:text-white leading-none">
                {lang === "id" ? (
                  <>ARTIKEL &amp; <span className="text-[#DC2626] underline decoration-4 underline-offset-4">PANDUAN TEKNIS</span></>
                ) : (
                  <>LATEST ARTICLES &amp; <span className="text-[#DC2626] underline decoration-4 underline-offset-4">TECHNICAL GUIDES</span></>
                )}
              </h2>
              <p className="text-xs sm:text-base text-slate-800 dark:text-slate-200 font-sans font-medium max-w-xl leading-relaxed">
                {lang === "id"
                  ? "Tulisan teknis, catatan arsitektur perangkat lunak, otomatisasi AI, dan panduan backend/frontend."
                  : "Technical articles, software architecture notes, AI automation, and backend/frontend engineering guides."}
              </p>
            </div>

            <Link
              href="/artikel"
              onClick={() => soundFx.playClick()}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all hover:bg-[#DC2626] dark:hover:bg-[#DC2626] dark:hover:text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] w-fit cursor-pointer group shrink-0"
            >
              <span>{lang === "id" ? "Lihat Semua Artikel" : "View All Articles"}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Editorial Articles Grid (Featured Big Card + Side Column Stack) */}
          {(() => {
            const articlesList =
              initialArticles && initialArticles.length > 0
                ? initialArticles
                : [
                    {
                      id: "1",
                      title: "Transisi Arsitektur Software: Membangun Enterprise AI Agent dan Automation Workflow Berbasis Next.js",
                      slug: "transisi-arsitektur-software-membangun-enterprise-ai-agent-nextjs",
                      category: "AI Systems",
                      readTime: "6 min read",
                      created_at: new Date().toISOString(),
                      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
                      content: "Perkembangan artificial intelligence telah bergeser dari sekadar prompt engineering sederhana menuju Agentic Workflows—sistem di mana AI mampu mengambil keputusan mandiri, memanggil tools, serta mengeksekusi urutan tugas yang kompleks secara otomatis.",
                    },
                    {
                      id: "2",
                      title: "Implementasi RESTful API & Eloquent Performance Optimization pada Laravel 11",
                      slug: "restful-api-performance-laravel-11",
                      category: "Backend Engineering",
                      readTime: "7 min read",
                      created_at: new Date().toISOString(),
                      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
                      content: "Optimasi kueri basis data dan pengelolaan memori pada arsitektur backend skala besar dengan Laravel 11 dan PostgreSQL.",
                    },
                    {
                      id: "3",
                      title: "Prisma ORM, Docker & PostgreSQL: Trik Query Optimization & Indexing",
                      slug: "prisma-postgresql-query-optimization",
                      category: "Database & Systems",
                      readTime: "6 min read",
                      created_at: new Date().toISOString(),
                      thumbnail: "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=1200&q=80",
                      content: "Teknik membuat indexing teratur dan optimasi koneksi database relasional dalam lingkungan kontainer Docker.",
                    },
                  ];

            const featured = articlesList[0];
            const sideArticles = articlesList.slice(1, 3);

            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-stretch">
                
                {/* Featured Big Hero Article (7 Cols) */}
                {featured && (
                  <div className="lg:col-span-7 flex">
                    <Link
                      href={`/artikel/${featured.slug}`}
                      onClick={() => soundFx.playClick()}
                      className={`w-full p-4 sm:p-7 rounded-2xl border-2 sm:border-3 border-slate-900 dark:border-white flex flex-col justify-between space-y-4 sm:space-y-6 group transition-all duration-200 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_0px_rgba(220,38,38,1)] ${
                        isNight
                          ? "bg-[#0E121D]"
                          : "bg-white"
                      }`}
                    >
                      <div className="space-y-6">
                        {/* Large Featured Image */}
                        <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden bg-slate-900 border-2 border-slate-900 dark:border-white">
                          <Image
                            src={featured.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"}
                            alt={featured.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                          <div className="absolute top-4 left-4 z-10">
                            <span className="px-3 py-1 rounded-lg bg-[#DC2626] text-white border-2 border-slate-900 dark:border-white text-[10px] font-mono font-black tracking-widest uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                              {lang === "id" ? "ARTIKEL UNGGULAN" : "FEATURED ARTICLE"}
                            </span>
                          </div>
                        </div>

                        {/* Article Metadata */}
                        <div className="flex items-center gap-3 text-xs text-slate-800 dark:text-slate-200 font-mono">
                          <span className="flex items-center gap-1.5 font-bold text-xs">
                            <Calendar className="w-3.5 h-3.5 text-[#DC2626]" />
                            {new Date(featured.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        {/* Title & Excerpt */}
                        <div className="space-y-3">
                          <h3 className="font-serif font-black text-2xl sm:text-3xl text-slate-950 dark:text-white group-hover:text-[#DC2626] transition-colors leading-tight">
                            {featured.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-sans font-medium leading-relaxed line-clamp-3">
                            {featured.content?.replace(/<[^>]*>?/gm, "").substring(0, 180)}...
                          </p>
                        </div>
                      </div>

                      {/* Footer Read Action */}
                      <div className="pt-4 border-t-2 border-slate-900 dark:border-white flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                          <Clock className="w-3.5 h-3.5 text-[#DC2626]" />
                          {featured.readTime || "5 min read"}
                        </span>
                        <span className="text-[#DC2626] font-black text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                          <span>BACA ARTIKEL</span>
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Side Stack Articles (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
                  {sideArticles.map((art) => (
                    <Link
                      key={art.id}
                      href={`/artikel/${art.slug}`}
                      onClick={() => soundFx.playClick()}
                      className={`flex-1 p-5 rounded-2xl border-2 sm:border-3 border-slate-900 dark:border-white flex flex-col justify-between space-y-4 group transition-all duration-200 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_0px_rgba(220,38,38,1)] ${
                        isNight
                          ? "bg-[#0E121D]"
                          : "bg-white"
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-900 border-2 border-slate-900 dark:border-white">
                          <Image
                            src={art.thumbnail || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80"}
                            alt={art.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                        </div>

                        <div className="flex items-center justify-end text-xs font-mono">
                          <span className="font-bold text-[11px] text-slate-800 dark:text-slate-200">
                            {art.readTime || "5 min read"}
                          </span>
                        </div>

                        <h4 className="font-serif font-black text-lg sm:text-xl text-slate-950 dark:text-white group-hover:text-[#DC2626] transition-colors leading-snug">
                          {art.title}
                        </h4>
                      </div>

                      <div className="pt-3 border-t-2 border-slate-900 dark:border-white flex items-center justify-between text-xs font-mono font-bold text-[#DC2626]">
                        <span>{lang === "id" ? "BACA SEKARANG" : "READ NOW"}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>

              </div>
            );
          })()}

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


      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#DC2626] text-white font-bold text-xs font-mono shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          {toastMsg}
        </div>
      )}

      {/* Footer */}
      <Footer isNight={isNight} />

      {/* Floating Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Quick Contact Floating Action Button & Drawer */}
      <QuickContactFAB />

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

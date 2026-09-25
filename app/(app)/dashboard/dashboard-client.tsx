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
  BookOpen,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import MobileBottomNav from "@/components/MobileBottomNav";
import { soundFx } from "@/lib/audio/sound";
import dynamic from "next/dynamic";
import type { ProjectData } from "@/components/ProjectModal";
const ProjectShowcase = dynamic(() => import("@/components/ProjectShowcase"), { ssr: false });
const ExperienceTimeline = dynamic(() => import("@/components/ExperienceTimeline"), { ssr: false });
import TechStackList from "@/components/TechStackList";
import Footer from "@/components/Footer";
import WorkflowSection from "@/components/WorkflowSection";
import { signOut } from "@/lib/actions/auth";
import { ArticleItem } from "@/lib/actions/article";
import { ProjectItem } from "@/lib/actions/project";
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
  initialProjects?: ProjectItem[];
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
  initialProjects = [],
  isAdmin = false,
}: DashboardClientProps) {
  const { lang, toggleLang, dict } = useLanguage();
  const [mode, setMode] = useState<"day" | "night">(() => getSavedTheme());

  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [showDeferredSections, setShowDeferredSections] = useState(false);
  const [articleCarouselIndex, setArticleCarouselIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    const anchor = document.getElementById("dashboard-deferred-anchor");
    if (!anchor) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShowDeferredSections(true);
          observer.disconnect();
        }
      },
      { rootMargin: "280px" }
    );

    observer.observe(anchor);
    return () => observer.disconnect();
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

  const articlePageSize = 3;
  const totalArticlePages = Math.max(1, Math.ceil(initialArticles.length / articlePageSize));
  const currentArticlePage = Math.min(articleCarouselIndex, totalArticlePages - 1);
  const visibleArticles = initialArticles.slice(
    currentArticlePage * articlePageSize,
    currentArticlePage * articlePageSize + articlePageSize
  );

  useEffect(() => {
    if (initialArticles.length <= 3) return;

    const interval = setInterval(() => {
      setArticleCarouselIndex((prev) => (prev + 1) % totalArticlePages);
    }, 4000);

    return () => clearInterval(interval);
  }, [initialArticles.length, totalArticlePages]);

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
      className={`min-h-screen antialiased text-left selection:bg-[#DC2626] selection:text-white transition-colors duration-300 pb-[calc(100px+env(safe-area-inset-bottom))] md:pb-0 ${
        isNight ? "bg-[#0B0F17] text-slate-100" : "bg-[#F2F3F4] text-slate-900"
      }`}
    >
      {/* Scroll Reading Progress Bar */}
      <ReadingProgressBar />

      {/* 1. TOP NAVBAR (Capsule Floating Pill Header) */}
      <header className="fixed top-2.5 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl">
        <div className="rounded-full border-2 sm:border-3 border-slate-900 dark:border-white bg-white/95 dark:bg-[#0E121D]/95 backdrop-blur-md transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-3 sm:gap-4">
          {/* Left: Brand Logo */}
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="flex items-center gap-2 group cursor-pointer shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#EAB308] border-2 border-slate-900 text-slate-950 flex items-center justify-center font-black text-xs sm:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] group-hover:scale-105 transition-transform">
              B
            </div>
            <span className="font-black text-xs sm:text-base tracking-tight uppercase text-slate-950 dark:text-white">
              BRIMAS<span className="text-[#166534]"> Pradika</span>
            </span>
          </Link>

          {/* Middle: Capsule Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-2 bg-slate-100/80 dark:bg-slate-900/80 px-3 py-1 rounded-full border border-slate-900/20 dark:border-white/20">
            <a
              href="#hero"
              onClick={() => soundFx.playClick()}
              className="px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider text-slate-950 dark:text-white hover:bg-[#166534] hover:text-white transition-all"
            >
              {dict.nav.home.toUpperCase()}
            </a>
            <Link
              href="/about"
              onClick={() => soundFx.playClick()}
              className="px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider text-slate-950 dark:text-white hover:bg-[#166534] hover:text-white transition-all"
            >
              {dict.nav.about.toUpperCase()}
            </Link>
            <Link
              href="/projects"
              onClick={() => soundFx.playClick()}
              className="px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider text-slate-950 dark:text-white hover:bg-[#166534] hover:text-white transition-all"
            >
              {dict.nav.projects.toUpperCase()}
            </Link>
            <Link
              href="/artikel"
              onClick={() => soundFx.playClick()}
              className="px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider text-slate-950 dark:text-white hover:bg-[#166534] hover:text-white transition-all"
            >
              {dict.nav.articles.toUpperCase()}
            </Link>
          </nav>

          {/* Right: Controls & Auth Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Language Toggle */}
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                toggleLang();
              }}
              className="px-3 py-1 rounded-full text-xs font-bold border-2 border-slate-900 dark:border-white bg-[#EAB308] text-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer min-h-[30px]"
            >
              {lang.toUpperCase()}
            </button>

            {/* Desktop Actions (sm+) */}
            <div className="hidden sm:flex items-center gap-2">
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => soundFx.playClick()}
                  className="px-3 py-1 rounded-full bg-[#166534] text-white border-2 border-slate-900 dark:border-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                  title="Admin Panel"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  <span>ADMIN</span>
                </Link>
              )}

              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/profile"
                    onClick={() => soundFx.playClick()}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-slate-900 dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                    title="Profil Saya"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#EAB308] text-slate-950 font-bold text-xs flex items-center justify-center overflow-hidden relative border border-slate-900 dark:border-white">
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
                    <span className="hidden lg:inline text-xs font-bold truncate max-w-[100px] text-slate-950 dark:text-white">
                      {navUserName}
                    </span>
                  </Link>

                  <button
                    onClick={async () => {
                      soundFx.playClick();
                      await signOut();
                    }}
                    className="p-1.5 rounded-full hover:bg-emerald-500/10 text-slate-950 dark:text-white hover:text-[#166534] transition-colors cursor-pointer"
                    title="Sign Out (Logout)"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => soundFx.playClick()}
                  className="px-4 py-1.5 rounded-full bg-[#EAB308] border-2 border-slate-900 dark:border-white text-slate-950 text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  {dict.nav.login.toUpperCase()}
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Toggle button for screens < sm */}
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="sm:hidden p-1.5 rounded-full border-2 border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-900 text-slate-950 dark:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-2 p-4 rounded-2xl border-2 sm:border-3 border-slate-900 dark:border-white bg-white/95 dark:bg-[#0E121D]/95 backdrop-blur-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex flex-col gap-2">
            <a
              href="#hero"
              onClick={() => {
                soundFx.playClick();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 dark:text-white hover:bg-[#166534] hover:text-white transition-all flex items-center justify-between"
            >
              <span>{dict.nav.home.toUpperCase()}</span>
              <ChevronRight className="w-4 h-4" />
            </a>
            <Link
              href="/about"
              onClick={() => {
                soundFx.playClick();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 dark:text-white hover:bg-[#166534] hover:text-white transition-all flex items-center justify-between"
            >
              <span>{dict.nav.about.toUpperCase()}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/projects"
              onClick={() => {
                soundFx.playClick();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 dark:text-white hover:bg-[#166534] hover:text-white transition-all flex items-center justify-between"
            >
              <span>{dict.nav.projects.toUpperCase()}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/artikel"
              onClick={() => {
                soundFx.playClick();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 dark:text-white hover:bg-[#166534] hover:text-white transition-all flex items-center justify-between"
            >
              <span>{dict.nav.articles.toUpperCase()}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <div className="border-t border-slate-900/20 dark:border-white/20 pt-2 flex items-center justify-between gap-2">
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => {
                    soundFx.playClick();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#166534] text-white border-2 border-slate-900 dark:border-white text-xs font-bold flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>ADMIN PANEL</span>
                </Link>
              )}

              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/profile"
                    onClick={() => {
                      soundFx.playClick();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border-2 border-slate-900 dark:border-white text-xs font-bold text-slate-950 dark:text-white"
                  >
                    <User className="w-4 h-4" />
                    <span>PROFIL</span>
                  </Link>

                  <button
                    onClick={async () => {
                      soundFx.playClick();
                      setMobileMenuOpen(false);
                      await signOut();
                    }}
                    className="p-1.5 rounded-xl border-2 border-slate-900 dark:border-white bg-red-500/10 text-red-600 dark:text-red-400"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => {
                    soundFx.playClick();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-[#EAB308] border-2 border-slate-900 dark:border-white text-slate-950 text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  {dict.nav.login.toUpperCase()}
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <section id="hero" className="relative flex flex-col items-center justify-start overflow-hidden text-center min-h-0 sm:min-h-[85vh]">
        {/* Ticker — in-flow, clears the fixed navbar naturally via section padding-top */}
        <div className="w-full pt-[72px] sm:pt-[88px]">
          <div className="overflow-hidden py-2 bg-[#EAB308] border-y-2 border-slate-900 text-slate-950 pointer-events-none font-bold text-[10px] sm:text-xs tracking-widest uppercase shadow-sm">
            <div className="whitespace-nowrap animate-marquee flex items-center gap-6 sm:gap-8">
              <span>{welcomeGreeting}, PERSONAL WEBSITE BRIMAS PRADIKA UTAMA &bull; JUNIOR WEB DEVELOPER &amp; AI SYSTEMS DEVELOPER </span>
              <span>{welcomeGreeting}, PERSONAL WEBSITE BRIMAS PRADIKA UTAMA &bull; JUNIOR WEB DEVELOPER &amp; AI SYSTEMS DEVELOPER </span>
              <span>{welcomeGreeting}, PERSONAL WEBSITE BRIMAS PRADIKA UTAMA &bull; JUNIOR WEB DEVELOPER &amp; AI SYSTEMS DEVELOPER </span>
              <span>{welcomeGreeting}, PERSONAL WEBSITE BRIMAS PRADIKA UTAMA &bull; JUNIOR WEB DEVELOPER &amp; AI SYSTEMS DEVELOPER </span>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 w-full flex flex-col items-center justify-center text-center relative z-10 pt-8 sm:pt-14 pb-8 sm:pb-12">

          {/* Greeting Badge */}
          <div className="mb-7 sm:mb-8 md:mb-10">
            <span className="inline-block bg-[#EAB308] text-slate-950 border-4 sm:border-[5px] border-slate-900 rounded-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] dark:sm:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] px-7 py-3 text-xl xs:text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.16em] transition-all hover:scale-105">
              {GREETINGS[greetingIndex]}
            </span>
          </div>

          {/* Headline Title */}
          <h1 className="font-black text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[84px] text-slate-950 dark:text-white tracking-[-0.04em] leading-[1.05] uppercase mb-4 sm:mb-5">
            <span className="block">I&apos;M BRIMAS PRADIKA</span>
            <span className="inline-flex items-center gap-2 text-[#166534] underline decoration-4 underline-offset-4">
              UTAMA
              <span className="w-3.5 h-3.5 sm:w-5 sm:h-5 bg-[#EAB308] border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block no-underline shrink-0" />
            </span>
          </h1>

          {/* Subtitle — AI SYSTEM badge aligned inline with surrounding text */}
          <p className="text-xs sm:text-base md:text-lg text-slate-800 dark:text-slate-200 max-w-2xl leading-[1.8] font-medium mb-6 sm:mb-8">
            Software &amp;
            <span className="inline-block align-middle mx-1.5 bg-[#EAB308] text-slate-950 px-2 py-0.5 border-2 border-slate-900 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs sm:text-base leading-normal">
              AI SYSTEM
            </span>
            Developer berfokus pada arsitektur web modern, integrasi AI agent, dan solusi digital performa tinggi.
          </p>

          {/* CTA Buttons */}
          <div className="w-full max-w-sm sm:max-w-none flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <a
              href="#projects"
              onClick={() => soundFx.playClick()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#EAB308] hover:bg-[#d9a207] border-2 sm:border-3 border-slate-900 dark:border-white text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <span>{lang === "id" ? "LIHAT PROYEK" : "EXPLORE PROJECTS"} &rarr;</span>
            </a>

            <a
              href="#about"
              onClick={() => soundFx.playClick()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#166534] hover:bg-[#14532D] border-2 sm:border-3 border-slate-900 dark:border-white text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <span>{lang === "id" ? "TENTANG SAYA" : "ABOUT ME"} &rarr;</span>
            </a>
          </div>

        </div>
      </section>
      {/* 3. ABOUT SECTION */}
      <section
        id="about"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16 md:py-20 border-t-2 border-b-2 border-slate-900 dark:border-white"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">

          {/* Profile Photo Yellow Box */}
          <div className="lg:col-span-5 flex justify-center items-start">
            <div className="relative w-full max-w-[260px] aspect-[4/5] sm:max-w-md sm:aspect-square flex items-center justify-center bg-[#FFE600] dark:bg-[#0E121D] border-3 border-slate-900 dark:border-white rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] p-3 sm:p-4 overflow-hidden">
              <Image
                src="/images/avatar.webp"
                alt="Brimas Pradika Utama"
                fill
                priority
                unoptimized
                className="object-contain object-bottom drop-shadow-xl hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-slate-950 text-white border-2 border-white px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10">
                SMK BM PARE &bull; RPL
              </div>
            </div>
          </div>

          {/* Profile Card — chip + heading + role + bio + info cards + buttons all inside one card */}
          <div className="lg:col-span-7 text-left">
            <div className={`rounded-2xl border-2 border-slate-900 dark:border-white p-5 sm:p-6 space-y-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] ${
              isNight ? "bg-[#0E121D]" : "bg-white"
            }`}>

              {/* Row 1: Label chips — TENTANG SAYA inside the card, above the heading */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#00E676] text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-bold tracking-widest uppercase">
                  <User className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                  <span>{lang === "id" ? "TENTANG SAYA" : "ABOUT ME"}</span>
                </div>
              </div>

              {/* Row 2: Name + role — clearly separated from chip above */}
              <div className="space-y-1.5">
                <h2 className="text-xl xs:text-2xl sm:text-4xl font-black uppercase tracking-tight leading-none text-slate-950 dark:text-white">
                  BRIMAS <span className="text-[#00C853]">PRADIKA UTAMA</span>
                </h2>
                <p className="text-[11px] sm:text-sm font-bold tracking-wide uppercase text-[#00C853]">
                  Junior Developer &bull; SMK Bhakti Mulia Pare
                </p>
              </div>

              {/* Row 3: Bio text */}
              <p className="text-sm sm:text-base font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                {lang === "id"
                  ? "Halo, saya Brimas Pradika Utama, seorang siswa Rekayasa Perangkat Lunak yang tertarik pada teknologi dan pengembangan software. Saya senang membuat website dan aplikasi sambil terus belajar hal baru. Fokus saat ini: Full-Stack Development dan mengubah ide menjadi produk digital yang bermanfaat."
                  : "Hi, I'm Brimas Pradika Utama, a Software Engineering student passionate about technology and software development. I enjoy building websites and apps while continuously learning. Currently focused on Full-Stack Development and turning ideas into useful digital products."}
              </p>

              {/* Row 4: Info cards grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 sm:p-4 rounded-xl border-2 border-slate-900 dark:border-white bg-[#F2F3F4] dark:bg-[#161B27] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)] flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-[#166534]">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[10px] font-bold uppercase">{lang === "id" ? "SEKOLAH" : "SCHOOL"}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white leading-tight">
                    SMK Bhakti Mulia
                  </p>
                </div>

                <div className="p-3 sm:p-4 rounded-xl border-2 border-slate-900 dark:border-white bg-[#F2F3F4] dark:bg-[#161B27] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)] flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-[#166534]">
                    <Code className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[10px] font-bold uppercase">{lang === "id" ? "PERAN" : "ROLE"}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white leading-tight">
                    Junior Developer
                  </p>
                </div>

                <div className="col-span-2 sm:col-span-1 p-3 sm:p-4 rounded-xl border-2 border-slate-900 dark:border-white bg-[#F2F3F4] dark:bg-[#161B27] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)] flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-[#166534]">
                    <Layers className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[10px] font-bold uppercase">STACK</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white leading-tight">
                    Laravel / Next.js
                  </p>
                </div>
              </div>

              {/* Row 5: Action buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <a
                  href="https://wa.me/6285854746684"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFx.playClick()}
                  className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-[#EAB308] hover:bg-[#d9a207] border-2 border-slate-900 dark:border-white text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>{lang === "id" ? "HUBUNGI SAYA" : "CONTACT ME"}</span>
                </a>

                <Link
                  href="/profile"
                  onClick={() => soundFx.playClick()}
                  className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-transparent border-2 border-slate-900 dark:border-white text-slate-950 dark:text-white font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <span>{lang === "id" ? "PROFIL LENGKAP" : "FULL PROFILE"}</span>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>


      <WorkflowSection />

      <div id="dashboard-deferred-anchor" aria-hidden="true" className="h-px w-full" />

      {showDeferredSections ? (
        <>
          <TechStackList isNight={isNight} lang={lang} />

          <section
            id="articles"
            className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20 border-b-2 border-slate-900 dark:border-white text-left"
          >
        <div className="space-y-6 sm:space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-2">
            <div className="space-y-2 sm:space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#166534] text-white border-2 border-slate-900 dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] text-[11px] font-bold tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </div>
              <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tight text-slate-950 dark:text-white leading-none">
                {lang === "id" ? (
                  <>ARTIKEL &amp; <span className="text-[#166534] underline decoration-4 underline-offset-4">PANDUAN TEKNIS</span></>
                ) : (
                  <>LATEST ARTICLES &amp; <span className="text-[#166534] underline decoration-4 underline-offset-4">TECHNICAL GUIDES</span></>
                )}
              </h2>
              <p className="text-xs sm:text-base text-slate-800 dark:text-slate-200 font-medium max-w-xl leading-relaxed">
                {lang === "id"
                  ? "Tulisan teknis, catatan arsitektur perangkat lunak, otomatisasi AI, dan panduan backend/frontend."
                  : "Technical articles, software architecture notes, AI automation, and backend/frontend engineering guides."}
              </p>
            </div>

            <Link
              href="/artikel"
              onClick={() => soundFx.playClick()}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider transition-all hover:bg-[#166534] hover:text-white dark:hover:bg-[#166534] dark:hover:text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] w-fit cursor-pointer group shrink-0"
            >
              <span>{lang === "id" ? "Lihat Semua Artikel" : "View All Articles"}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {initialArticles.length > 0 ? (
            <div className="space-y-4">
              {initialArticles.length > 3 && (
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setArticleCarouselIndex((prev) => (prev === 0 ? totalArticlePages - 1 : prev - 1))}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-900 bg-white text-slate-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition hover:-translate-y-0.5 dark:border-white dark:bg-[#0E121D] dark:text-white dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
                    aria-label="Previous articles"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setArticleCarouselIndex((prev) => (prev + 1) % totalArticlePages)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-900 bg-[#166534] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition hover:-translate-y-0.5"
                    aria-label="Next articles"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {visibleArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/artikel/${article.slug}`}
                    onClick={() => soundFx.playClick()}
                    className="group flex flex-col overflow-hidden rounded-2xl border-2 border-slate-900 dark:border-white bg-white dark:bg-[#0E121D] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(22,101,52,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(234,179,8,1)] transition-all"
                  >
                    <div className="relative h-36 overflow-hidden border-b-2 border-slate-900 dark:border-white bg-[#166534]">
                      {article.thumbnail ? (
                        <Image
                          src={article.thumbnail}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-5 text-center text-[#EAB308]">
                          <BookOpen className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-3 p-4">
                      <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400">
                        <span>{article.category || "Tutorial"}</span>
                        <span>{article.readTime || "3 min read"}</span>
                      </div>
                      <h3 className="line-clamp-2 text-lg font-black uppercase leading-tight text-slate-950 dark:text-white group-hover:text-[#166534] dark:group-hover:text-[#EAB308]">
                        {article.title}
                      </h3>
                      <div className="mt-auto flex items-center justify-between border-t-2 border-slate-900 pt-3 text-[11px] font-bold text-slate-700 dark:border-white dark:text-slate-300">
                        <span>{new Date(article.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                        <span className="inline-flex items-center gap-1 text-[#166534] dark:text-[#EAB308]">
                          BACA <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-900 p-6 text-center text-xs font-bold uppercase text-slate-600 dark:border-white dark:text-slate-400">
              {lang === "id" ? "Belum ada artikel untuk ditampilkan." : "No articles to display yet."}
            </div>
          )}
        </div>
      </section>

          <ProjectShowcase
            isNight={isNight}
            lang={lang}
            fetchedProjects={initialProjects}
            onSelectProject={(proj) => setSelectedProject(proj)}
          />

          <ExperienceTimeline isNight={isNight} lang={lang} />
        </>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20 text-left">
          <div className="h-52 rounded-2xl border-2 border-dashed border-slate-900/50 bg-white/40 animate-pulse" />
        </div>
      )}

      {toastMsg && (
        <div className="fixed bottom-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#166534] text-white font-bold text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          {toastMsg}
        </div>
      )}

      <Footer isNight={isNight} />

      <MobileBottomNav />

      <QuickContactFAB />

      <CommandPalette
        isOpen={cmdPaletteOpen}
        onClose={() => setCmdPaletteOpen(false)}
        onToggleTheme={handleToggleMode}
        isNight={isNight}
      />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}

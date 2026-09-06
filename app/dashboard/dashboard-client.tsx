"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mountain,
  Sun,
  Moon,
  Search,
  Menu,
  X,
  Mail,
  Sparkles,
  FolderGit2,
  ArrowUpRight,
  Send,
  Compass,
  Volume2,
  VolumeX,
  User,
  Check,
  Copy,
} from "lucide-react";

import dynamic from "next/dynamic";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import MobileBottomNav from "@/components/MobileBottomNav";
import { soundFx } from "@/lib/audio/sound";
import CommandPalette from "@/components/CommandPalette";
import ProjectModal, { ProjectData } from "@/components/ProjectModal";

const ThemeToggle = dynamic(() => import("@/components/ThemeToggle"), {
  ssr: false,
  loading: () => <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500/10 animate-pulse shrink-0" />,
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
}

export default function DashboardClient({ user, dbUser, dbProjects = [] }: DashboardClientProps) {
  const { lang, toggleLang, dict } = useLanguage();
  const [mode, setMode] = useState<"day" | "night">("day");
  const [loadSecondaryBg, setLoadSecondaryBg] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);

  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    soundFx.playClick();
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fullName = "BRIMAS PRADIKA UTAMA";
  const [typedText, setTypedText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    let index = 0;
    setTypedText("");
    setIsTypingDone(false);

    const timer = setInterval(() => {
      index++;
      setTypedText(fullName.slice(0, index));
      if (index >= fullName.length) {
        setIsTypingDone(true);
        clearInterval(timer);
      }
    }, 70);

    return () => clearInterval(timer);
  }, [fullName]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Load initial theme mode - Default is ALWAYS "day" (siang hari)
  useEffect(() => {
    setSfxEnabled(soundFx.getIsEnabled());
    const handleOpen = () => setCmdPaletteOpen(true);
    window.addEventListener("open-command-palette", handleOpen);

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const savedMode = localStorage.getItem("landscape_mode");
    if (savedMode === "night") {
      setMode("night");
      document.documentElement.classList.add("dark");
    } else {
      // Default ke mode Siang Hari ("day")
      setMode("day");
      document.documentElement.classList.remove("dark");
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("open-command-palette", handleOpen);
    };
  }, []);

  const handleToggleSfx = () => {
    const newState = soundFx.toggleMute();
    setSfxEnabled(newState);
    if (newState) soundFx.playClick();
    showToast(newState ? (lang === "id" ? "Efek Suara Diaktifkan 🔊" : "Sound FX Enabled 🔊") : (lang === "id" ? "Efek Suara Dimatikan 🔇" : "Sound FX Muted 🔇"));
  };

  const handleToggleLang = () => {
    toggleLang();
    showToast(lang === "id" ? "Language switched to English 🌐" : "Bahasa diubah ke Indonesia 🌐");
  };

  const handleToggleMode = () => {
    setLoadSecondaryBg(true);
    setMode((prev) => {
      const nextMode = prev === "day" ? "night" : "day";
      if (nextMode === "night") {
        document.documentElement.classList.add("dark");
        localStorage.setItem("landscape_mode", "night");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("landscape_mode", "day");
      }
      showToast(nextMode === "night" ? (lang === "id" ? "Mode Malam Hari Diaktifkan 🌙" : "Night Mode Activated 🌙") : (lang === "id" ? "Mode Siang Hari Diaktifkan ☀️" : "Day Mode Activated ☀️"));
      return nextMode;
    });
  };

  const t = {
    beranda: lang === "id" ? "Beranda" : "Home",
    tentang: lang === "id" ? "Tentang" : "About",
    project: lang === "id" ? "Project" : "Projects",
    kontak: lang === "id" ? "Kontak" : "Contact",
    tagline: lang === "id" ? "Personal Retreat & Portfolio" : "Personal Retreat & Portfolio",
    subtitle:
      lang === "id"
        ? "Membangun platform web berskala tinggi, solusi arsitektur AI modern, dan pengalaman antarmuka yang elegan dengan lanskap teknologi terkini."
        : "Building high-scalable web platforms, modern AI architecture solutions, and elegant UI experiences with cutting-edge tech.",
    metricsTitle: lang === "id" ? "Jejak & Ringkasan Metrik" : "Milestones & Metric Overview",
    projectsTitle: lang === "id" ? "Koleksi Project Explorasi" : "Exploration Project Collection",
    authTitle: lang === "id" ? "Status Autentikasi & Database" : "Authentication & Database Status",
    contactTitle:
      lang === "id"
        ? "Siap Berkolaborasi Dalam Eksplorasi Berikutnya?"
        : "Ready to Collaborate on the Next Exploration?",
    contactBtn: lang === "id" ? "Hubungi Saya" : "Contact Me",
  };

  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleCopyEmail = () => {
    const emailToCopy = "brimaspradika8@gmail.com";
    navigator.clipboard.writeText(emailToCopy);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Fixed Portfolio Owner Identity (Hero Section, Bio & Main Content)
  const ownerName = "BRIMAS PRADIKA UTAMA";
  const ownerAvatar = "/images/avatar.png";
  const ownerEmail = "brimaspradika8@gmail.com";

  // Dynamic Logged-in User Identity (Navbar Avatar Button & Auth Status Panel Only)
  const navUserName =
    dbUser?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Guest User";
  const navUserEmail = user?.email || "Belum Login (Guest)";
  const rawAvatar =
    dbUser?.avatar ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture;

  const [avatarImgError, setAvatarImgError] = useState(false);

  useEffect(() => {
    setAvatarImgError(false);
  }, [user?.id, dbUser?.id, rawAvatar]);

  const initialLetter = navUserName && navUserName !== "Guest User" ? navUserName.charAt(0).toUpperCase() : "G";

  const isValidAvatarUrl =
    Boolean(rawAvatar) &&
    typeof rawAvatar === "string" &&
    rawAvatar.trim() !== "" &&
    rawAvatar !== "null" &&
    rawAvatar !== "undefined";

  const showNavAvatarImg = Boolean(user) && isValidAvatarUrl && !avatarImgError;

  const isNight = mode === "night";

  return (
    <div className={`relative min-h-screen w-full overflow-x-hidden font-sans antialiased text-slate-100 transition-colors duration-700 selection:bg-amber-500 selection:text-stone-950 ${isNight ? "dark" : ""}`}>
      
      {/* ========================================================================= */}
      {/* FULL-BLEED LANDSCAPE BACKGROUND WITH SILKY SMOOTH GPU-ACCELERATED CROSSFADE */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* FULL-BLEED LANDSCAPE BACKGROUND WITH SILKY SMOOTH GPU-ACCELERATED CROSSFADE */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none transform-gpu">
        {/* Day Landscape Video */}
        {(!isNight || loadSecondaryBg) && (
          <video
            key={isMobile ? "day-mobile" : "day-desktop"}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={isMobile ? "/animations/day-landscape-mobile.webp" : "/animations/day-landscape.webp"}
            className={`absolute inset-0 object-cover w-full h-full transform-gpu will-change-opacity transition-opacity duration-1000 ease-in-out ${
              isNight ? "opacity-0" : "opacity-100"
            }`}
          >
            <source
              src={
                isMobile
                  ? "/animations/day-landscape-mobile.mp4"
                  : "/animations/day-landscape.mp4"
              }
              type="video/mp4"
            />
          </video>
        )}

        {/* Night Landscape Video */}
        {(isNight || loadSecondaryBg) && (
          <video
            key={isMobile ? "night-mobile" : "night-desktop"}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={isMobile ? "/animations/night-landscape-mobile.webp" : "/animations/night-landscape.webp"}
            className={`absolute inset-0 object-cover w-full h-full transform-gpu will-change-opacity transition-opacity duration-1000 ease-in-out ${
              isNight ? "opacity-100" : "opacity-0"
            }`}
          >
            <source
              src={
                isMobile
                  ? "/animations/night-landscape-mobile.mp4"
                  : "/animations/night-landscape.mp4"
              }
              type="video/mp4"
            />
          </video>
        )}

        {/* Ambient Overlay Gradients for Optimal Text & Card Legibility */}
        <div
          className={`absolute inset-0 transition-colors duration-1000 transform-gpu ${
            isNight
              ? "bg-gradient-to-b from-slate-950/75 via-indigo-950/40 to-slate-950/85"
              : "bg-gradient-to-b from-amber-950/45 via-transparent to-amber-950/75 opacity-90 md:opacity-100"
          }`}
        />
      </div>

      {/* ========================================================================= */}
      {/* OVERLAY NAVIGATION BAR                                                   */}
      {/* ========================================================================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          !isNight
            ? "bg-stone-950/30 md:bg-stone-950/40 backdrop-blur-sm md:backdrop-blur-md border-b border-white/10"
            : "bg-slate-950/60 backdrop-blur-md border-b border-white/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4 relative">
          
          {/* 1. BRIMAS (Brand Logo Text - Far Left) */}
          <a
            href="#hero"
            className="flex items-center group focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-xl p-1 shrink-0"
          >
            <span className="font-display text-lg sm:text-xl font-extrabold tracking-wider text-white drop-shadow-md leading-none hover:text-amber-300 transition-colors">
              BRIMAS
            </span>
          </a>

          {/* 2. Desktop Navigation Links: Beranda, Project, Blog, Tentang (Perfectly Centered) */}
          <nav className="hidden md:flex items-center justify-center gap-4 lg:gap-8 text-sm font-semibold absolute left-1/2 -translate-x-1/2">
            <a
              href="#hero"
              className="text-slate-200 hover:text-amber-300 hover:bg-white/10 px-4 py-1.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[44px] flex items-center"
            >
              {dict.nav.home}
            </a>
            <a
              href="#projects"
              className="text-slate-200 hover:text-amber-300 hover:bg-white/10 px-4 py-1.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[44px] flex items-center"
            >
              {dict.nav.projects}
            </a>
            <a
              href="#about"
              className="text-slate-200 hover:text-amber-300 hover:bg-white/10 px-4 py-1.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[44px] flex items-center"
            >
              {dict.nav.articles}
            </a>
            <a
              href="#about"
              className="text-slate-200 hover:text-amber-300 hover:bg-white/10 px-4 py-1.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[44px] flex items-center"
            >
              {dict.nav.about}
            </a>
          </nav>

          {/* 3. Far Right Controls: Search, Switch Tema, Profile Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
            
            {/* Search Button (Fungsional Command Palette Ctrl+K) */}
            <button
              onClick={() => {
                soundFx.playClick();
                setCmdPaletteOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-stone-900/80 hover:bg-amber-950/40 text-amber-200 border border-amber-400/35 hover:border-amber-400/70 backdrop-blur-xl transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer hover:scale-[1.02]"
              aria-label="Search Command Palette (Ctrl+K)"
              title="Cari Konten / Perintah (Ctrl + K)"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline text-[10px] font-mono font-bold text-amber-300/90 tracking-wide">
                SEARCH
              </span>
              <span className="hidden sm:inline text-[10px] font-mono font-semibold text-amber-200/80 bg-amber-500/20 px-1.5 py-0.5 rounded-lg border border-amber-400/30">
                ⌘K
              </span>
            </button>

            {/* DAY/NIGHT PILL SWITCH TOGGLE (Switch Tema) */}
            <button
              type="button"
              onClick={handleToggleMode}
              aria-label={isNight ? "Switch to Day Mode" : "Switch to Night Mode"}
              title={isNight ? "Switch to Day Mode" : "Switch to Night Mode"}
              className={`flex relative w-14 h-7 sm:w-16 sm:h-8 rounded-full p-1 border backdrop-blur-md transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer ${
                isNight
                  ? "bg-slate-900/80 border-indigo-400/50"
                  : "bg-amber-900/60 border-amber-300/60"
              }`}
            >
              <div
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                  isNight ? "translate-x-7 sm:translate-x-8 bg-indigo-950 text-amber-300" : "translate-x-0 bg-amber-100 text-amber-600"
                }`}
              >
                {isNight ? (
                  <Moon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-300" />
                ) : (
                  <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
                )}
              </div>
            </button>

            {/* Profile Avatar Button (Pojok Kanan - Always Rendered as link to /profile) */}
            <Link
              href="/profile"
              onClick={() => soundFx.playClick()}
              className="flex items-center group focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-full transition-transform hover:scale-105 shrink-0"
              title={user ? `Profil Saya (${navUserName})` : "Login / Profil (Mode Tamu)"}
              aria-label="Profil Saya"
            >
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.5)] shrink-0 bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 flex items-center justify-center font-extrabold text-stone-950">
                {user ? (
                  <>
                    {/* Fallback Solid Initial Circle (Always Present underneath Image) */}
                    <span className="w-full h-full text-stone-950 flex items-center justify-center font-extrabold text-xs sm:text-sm uppercase shadow-inner">
                      {initialLetter}
                    </span>

                    {/* Google / Provider Avatar Image Overlay */}
                    {showNavAvatarImg && (
                      <Image
                        src={rawAvatar!}
                        alt={navUserName}
                        fill
                        className="object-cover"
                        unoptimized={rawAvatar!.startsWith("http")}
                        onError={() => setAvatarImgError(true)}
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-stone-900/90 text-amber-300 flex items-center justify-center hover:bg-stone-800 transition-colors">
                    <User className="w-4.5 h-4.5 text-amber-300" />
                  </div>
                )}
              </div>
            </Link>

          </div>
        </div>
      </header>

      {/* Search Modal Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-stone-900/90 border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-amber-400" />
                <span>Cari di Portfolio</span>
              </h3>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Ketik kata kunci (misal: Analytics, React, Project)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              autoFocus
            />
            <p className="text-xs text-slate-400">
              Tekan tombol silang di kanan atas untuk menutup pencarian.
            </p>
          </div>
        </div>
      )}

      {/* Main Content Overlaid on GIF Background */}
      <main className="relative z-10 pt-20 sm:pt-28 pb-36 sm:pb-40 md:pb-24 space-y-12 sm:space-y-24 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION (Bespoke Mobile & Desktop Split Grid Layout)              */}
        {/* ========================================================================= */}
        <section id="hero" className="pt-8 sm:pt-16 md:pt-20 pb-10 sm:pb-16 w-full max-w-7xl mx-auto px-2 sm:px-4 box-border">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center">
            
            {/* LEFT COLUMN: Main Text Content & Actions (md:col-span-7) */}
            <div className="md:col-span-7 space-y-4 sm:space-y-6 text-left order-1">
              
              {/* 1. Small Gold Accent Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide backdrop-blur-md shadow-lg shadow-black/40 animate-[fadeIn_0.4s_ease-out_forwards]">
                <span>{dict.hero.badge}</span>
              </div>

              {/* 2. Mobile Profile Photo */}
              <div className="block md:hidden py-1 animate-[fadeIn_0.5s_ease-out_100ms_forwards]">
                <div className="relative group w-32 h-32 sm:w-36 sm:h-36">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/30 via-yellow-500/20 to-amber-600/10 blur-xl -z-10" />
                  <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-amber-300/80 shadow-[0_0_25px_rgba(245,158,11,0.3)] bg-stone-950">
                    <Image
                      src={ownerAvatar}
                      alt={ownerName}
                      fill
                      priority
                      sizes="144px"
                      className="object-cover filter brightness-95 contrast-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40 mix-blend-multiply pointer-events-none" />
                    <div className="absolute inset-0 bg-stone-950/20 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* 3. Headline */}
              <div className="space-y-1 sm:space-y-2 animate-[fadeIn_0.5s_ease-out_150ms_forwards]">
                <p className="text-xs sm:text-sm md:text-base font-mono font-semibold uppercase tracking-widest text-amber-300/90">
                  {dict.hero.role}
                </p>
                <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wide uppercase leading-tight text-white drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)] inline-flex items-center min-h-[1.2em]">
                  <span>{typedText}</span>
                  <span
                    className={`inline-block w-[3px] sm:w-[5px] h-[0.75em] ml-1.5 bg-amber-400 shadow-[0_0_12px_#f59e0b] rounded-full ${
                      isTypingDone ? "animate-pulse" : "animate-ping"
                    }`}
                  />
                </h1>
              </div>

              {/* 4. Sub-headline */}
              <h2 className="text-sm sm:text-base md:text-xl font-semibold text-amber-200/90 tracking-tight animate-[fadeIn_0.5s_ease-out_200ms_forwards]">
                {dict.hero.subheadline}
              </h2>

              {/* 5. Paragraf Deskripsi */}
              <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-xl leading-relaxed font-sans animate-[fadeIn_0.5s_ease-out_250ms_forwards]">
                {dict.hero.description}
              </p>

              {/* 6. Dua Tombol CTA & Social Links */}
              <div className="flex flex-wrap items-center justify-start gap-3 sm:gap-4 pt-1 animate-[fadeIn_0.5s_ease-out_300ms_forwards]">
                <a
                  href="#projects"
                  onClick={() => soundFx.playClick()}
                  className="min-h-[44px] px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-stone-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-[1.03] hover:brightness-110 active:scale-95 cursor-pointer"
                >
                  <FolderGit2 className="w-4 h-4" />
                  <span>{dict.hero.viewProjects}</span>
                </a>

                <a
                  href={`mailto:${ownerEmail}`}
                  onClick={() => soundFx.playClick()}
                  className="min-h-[44px] px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-amber-400/50 font-bold text-xs sm:text-sm backdrop-blur-md flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-amber-300" />
                  <span>{dict.hero.contactMe}</span>
                </a>

                {/* Social Icons */}
                <div className="flex items-center gap-2.5">
                  <a
                    href="https://github.com/brimaspradika8-sudo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full bg-white/10 hover:bg-amber-500/20 text-white border border-white/20 hover:border-amber-400/60 backdrop-blur-md transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-amber-400 hover:scale-105"
                    aria-label="GitHub"
                    title="GitHub"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full bg-white/10 hover:bg-amber-500/20 text-white border border-white/20 hover:border-amber-400/60 backdrop-blur-md transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-amber-400 hover:scale-105"
                    aria-label="LinkedIn"
                    title="LinkedIn"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* 7. Technologies Stack Row */}
              <div className="pt-4 border-t border-white/10 space-y-2 animate-[fadeIn_0.5s_ease-out_350ms_forwards]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {dict.hero.techHeader}
                </p>
                <div className="flex flex-nowrap md:flex-wrap items-center justify-start gap-2 overflow-x-auto no-scrollbar pb-1">
                  {["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "TailwindCSS"].map((tech) => (
                    <span
                      key={tech}
                      className="shrink-0 px-3 py-1 rounded-xl bg-stone-900/80 border border-white/15 text-slate-200 text-xs font-mono font-medium backdrop-blur-md shadow-sm hover:border-amber-400/50 hover:text-amber-300 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Desktop Profile Picture */}
            <div className="hidden md:flex md:col-span-5 relative justify-end items-center order-2 py-4 animate-[fadeIn_0.6s_ease-out_150ms_forwards]">
              <div className="relative group">
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full overflow-hidden border-3 border-amber-300/70 shadow-[0_0_45px_rgba(245,158,11,0.25)] bg-stone-950">
                  <Image
                    src={ownerAvatar}
                    alt={ownerName}
                    fill
                    priority
                    sizes="(max-width: 768px) 288px, 320px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-95 contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40 mix-blend-multiply pointer-events-none" />
                  <div className="absolute inset-0 bg-stone-950/20 pointer-events-none" />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. SECTION PROJECTS (Koleksi Project - Segera Hadir)                    */}
        {/* ========================================================================= */}
        <section id="projects" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-wide flex items-center gap-3">
                <Mountain className="w-6 h-6 text-amber-400" />
                <span>{dict.projects.title}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                {dict.projects.subtitle}
              </p>
            </div>

            <a
              href="https://github.com/brimaspradika8-sudo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-amber-300 hover:text-amber-200 inline-flex items-center gap-1.5 shrink-0"
            >
              <span>{dict.projects.githubRepo}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Segera Hadir (Coming Soon) Showcase Banner Card */}
          <div className={`relative overflow-hidden backdrop-blur-xl border rounded-3xl p-8 sm:p-12 shadow-2xl transition-all duration-300 text-center flex flex-col items-center justify-center space-y-5 ${
            isNight
              ? "bg-slate-950/60 border-indigo-500/30"
              : "bg-stone-950/60 border-amber-300/30"
          }`}>
            {/* Ambient Glow */}
            <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-amber-500/15 via-yellow-500/10 to-amber-600/5 blur-3xl pointer-events-none" />

            {/* Badge Segera Hadir */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold tracking-widest uppercase backdrop-blur-md shadow-md">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>{dict.projects.comingSoonBadge}</span>
            </div>

            {/* Title & Description */}
            <div className="space-y-2 max-w-xl">
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                {dict.projects.comingSoonTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {dict.projects.comingSoonDesc}
              </p>
            </div>

            {/* GitHub Action Link */}
            <div className="pt-2">
              <a
                href="https://github.com/brimaspradika8-sudo"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFx.playClick()}
                className="min-h-[44px] px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-stone-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/20 inline-flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-[1.03] active:scale-95 cursor-pointer"
              >
                <FolderGit2 className="w-4 h-4" />
                <span>{dict.projects.githubMonitor}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. SECTION CONTACT / RETREAT CTA                                         */}
        {/* ========================================================================= */}
        <section id="contact" className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-r from-amber-950/60 via-stone-950/70 to-indigo-950/70 p-8 sm:p-12 rounded-3xl border border-amber-300/30 text-white shadow-2xl text-center sm:text-left">
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-amber-300 border border-white/20 backdrop-blur-md">
                <Send className="w-3.5 h-3.5" />
                <span>{lang === "id" ? "Mari Terhubung" : "Let's Connect"}</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-wide">
                {dict.contact.title}
              </h2>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                {dict.contact.desc}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <a
                href={`mailto:${ownerEmail}`}
                className="min-h-[44px] px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <Mail className="w-4 h-4" />
                <span>{dict.contact.btn}</span>
              </a>

              <button
                onClick={handleCopyEmail}
                className="min-h-[44px] px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedEmail ? dict.contact.copied : dict.contact.copyEmail}</span>
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* UI 1: Ambient Gold Cursor Glow Follower (Desktop Only) */}
      <div
        className="pointer-events-none fixed z-30 hidden md:block w-80 h-80 rounded-full bg-amber-500/10 blur-3xl transition-transform duration-200 ease-out -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
        }}
      />

      {/* UX 2: Floating Toast Notification Overlay */}
      {toastMsg && (
        <div className="fixed bottom-24 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-stone-950/95 border border-amber-400/60 text-amber-300 text-xs sm:text-sm font-extrabold shadow-2xl backdrop-blur-xl animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 backdrop-blur-md bg-stone-950/60 py-8 pb-24 md:pb-8 text-center text-xs text-slate-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-display font-medium text-amber-200/90">
            © {new Date().getFullYear()} {ownerName} — Personal Portfolio & Retreat. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#hero" className="hover:text-amber-300 transition-colors">{dict.nav.home}</a>
            <a href="#about" className="hover:text-amber-300 transition-colors">{dict.nav.about}</a>
            <a href="#projects" className="hover:text-amber-300 transition-colors">{dict.nav.projects}</a>
            <a href="#contact" className="hover:text-amber-300 transition-colors">{dict.nav.contact}</a>
          </div>
        </div>
      </footer>

      {/* Floating Center Mobile Bottom Tab Bar */}
      <MobileBottomNav />

      {/* Command Palette Keyboard Shortcut Modal */}
      <CommandPalette
        isOpen={cmdPaletteOpen}
        onClose={() => setCmdPaletteOpen(false)}
        onToggleTheme={handleToggleMode}
        isNight={isNight}
      />

      {/* Project Detail Preview Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

    </div>
  );
}

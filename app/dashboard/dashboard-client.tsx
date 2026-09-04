"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { signOut } from "@/lib/actions/auth";
import {
  Mountain,
  TreePine,
  Sun,
  Moon,
  Search,
  Menu,
  X,
  Mail,
  ExternalLink,
  Code2,
  Sparkles,
  FolderGit2,
  LogOut,
  Copy,
  Check,
  ShieldCheck,
  ArrowUpRight,
  Send,
  GitBranch,
  Activity,
  Briefcase,
  Compass,
} from "lucide-react";

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
    };
  };
  dbUser: {
    id: string;
    email: string;
    name: string | null;
    created_at: Date | string;
  } | null;
}

export default function DashboardClient({ user, dbUser }: DashboardClientProps) {
  // Theme mode: "day" | "night"
  const [mode, setMode] = useState<"day" | "night">("day");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Load initial theme mode
  useEffect(() => {
    const savedMode = localStorage.getItem("landscape_mode");
    if (savedMode === "day" || savedMode === "night") {
      setMode(savedMode);
      if (savedMode === "night") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialMode = prefersDark ? "night" : "day";
      setMode(initialMode);
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
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
      return nextMode;
    });
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyEmail = () => {
    const emailToCopy = user.email || "brimaspradika8@gmail.com";
    navigator.clipboard.writeText(emailToCopy);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const userName =
    dbUser?.name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    "Brimas Pradika Utama";
  const userEmail = user.email || "brimaspradika8@gmail.com";
  const avatarSrc = user.user_metadata?.avatar_url || "/images/avatar.png";

  const isNight = mode === "night";

  return (
    <div className={`relative min-h-screen w-full overflow-x-hidden font-sans antialiased text-slate-100 transition-colors duration-700 selection:bg-amber-500 selection:text-stone-950 ${isNight ? "dark" : ""}`}>
      
      {/* ========================================================================= */}
      {/* FULL-BLEED GIF LANDSCAPE BACKGROUND WITH SILKY SMOOTH CROSSFADE          */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        {/* Desktop Day Landscape GIF (768px+) */}
        <Image
          src="/animations/day-landscape.gif"
          alt="Daylight Landscape Desktop"
          fill
          priority
          unoptimized
          className={`hidden md:block object-cover w-full h-full transition-opacity duration-1000 ease-in-out ${
            isNight ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Desktop Night Landscape GIF (768px+) */}
        <Image
          src="/animations/night-landscape.gif"
          alt="Night Landscape Desktop"
          fill
          priority
          unoptimized
          className={`hidden md:block object-cover w-full h-full transition-opacity duration-1000 ease-in-out ${
            isNight ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Mobile Day Landscape GIF (<768px) */}
        <Image
          src="/animations/day-landscape-mobile.gif"
          alt="Daylight Landscape Mobile"
          fill
          priority
          unoptimized
          className={`block md:hidden object-cover w-full h-full transition-opacity duration-1000 ease-in-out ${
            isNight ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Mobile Night Landscape GIF (<768px) */}
        <Image
          src="/animations/night-landscape-mobile.gif"
          alt="Night Landscape Mobile"
          fill
          priority
          unoptimized
          className={`block md:hidden object-cover w-full h-full transition-opacity duration-1000 ease-in-out ${
            isNight ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Ambient Overlay Gradients for Optimal Text & Card Legibility */}
        <div
          className={`absolute inset-0 transition-colors duration-1000 ${
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Logo Mark + Brand Name */}
          <a
            href="#hero"
            className="flex items-center gap-2 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-xl p-1 shrink-0"
          >
            <div className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border backdrop-blur-md transition-all duration-300 ${
              isNight
                ? "bg-indigo-950/60 border-indigo-400/40 text-amber-300 shadow-indigo-500/20"
                : "bg-amber-950/40 border-amber-300/40 text-amber-300 shadow-amber-500/20"
            } shadow-lg group-hover:scale-105`}>
              <TreePine className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="hidden sm:inline-block font-display text-base sm:text-xl font-bold tracking-wider text-white drop-shadow-md leading-none">
              BRIMAS
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a
              href="#hero"
              className="text-slate-200 hover:text-amber-300 transition-colors py-1 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-md"
            >
              Beranda
            </a>
            <a
              href="#about"
              className="text-slate-200 hover:text-amber-300 transition-colors py-1 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-md"
            >
              Tentang
            </a>
            <a
              href="#projects"
              className="text-slate-200 hover:text-amber-300 transition-colors py-1 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-md"
            >
              Project
            </a>
            <a
              href="#contact"
              className="text-slate-200 hover:text-amber-300 transition-colors py-1 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-md"
            >
              Kontak
            </a>
          </nav>

          {/* Far Right: Search Button + Day/Night Pill Switch Toggle + Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            
            {/* Search Trigger Button - Desktop & sm+ */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label="Search"
              title="Search"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* DAY/NIGHT PILL SWITCH TOGGLE - Desktop & sm+ */}
            <button
              type="button"
              onClick={handleToggleMode}
              aria-label={isNight ? "Switch to Day Mode" : "Switch to Night Mode"}
              title={isNight ? "Switch to Day Mode" : "Switch to Night Mode"}
              className={`hidden sm:flex relative w-14 h-7 sm:w-16 sm:h-8 rounded-full p-1 border backdrop-blur-md transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer ${
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

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 sm:p-2.5 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-stone-950/95 backdrop-blur-2xl border-b border-white/15 px-4 py-5 space-y-4 shadow-2xl animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 gap-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider truncate">
                Navigasi Portfolio
              </span>

              <div className="flex items-center gap-2 shrink-0">
                {/* Mobile Search Button */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchOpen(true);
                  }}
                  className="p-1.5 px-2.5 rounded-full bg-white/10 text-white text-xs border border-white/20 flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5 text-amber-300" />
                  <span>Cari</span>
                </button>

                {/* Mobile Day/Night Toggle */}
                <button
                  type="button"
                  onClick={handleToggleMode}
                  className={`p-1.5 px-2.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${
                    isNight
                      ? "bg-slate-900 border-indigo-400/50 text-indigo-300"
                      : "bg-amber-900/60 border-amber-300/60 text-amber-200"
                  }`}
                >
                  {isNight ? (
                    <>
                      <Moon className="w-3.5 h-3.5 text-indigo-300" />
                      <span>Night 🌙</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Day ☀️</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <a
                href="#hero"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white hover:text-amber-300 p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all"
              >
                <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Beranda</span>
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white hover:text-amber-300 p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all"
              >
                <Activity className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Tentang</span>
              </a>
              <a
                href="#projects"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white hover:text-amber-300 p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all"
              >
                <Mountain className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Project</span>
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white hover:text-amber-300 p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all"
              >
                <Send className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Kontak</span>
              </a>
            </div>
          </div>
        )}
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
      <main className="relative z-10 pt-20 sm:pt-28 pb-16 sm:pb-20 space-y-12 sm:space-y-24 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION (Landscape Full-Bleed Viewport Overlay)                  */}
        {/* ========================================================================= */}
        <section id="hero" className="min-h-[70vh] sm:min-h-[85vh] flex flex-col justify-center items-center text-center space-y-6 sm:space-y-10 py-6 sm:py-12 w-full max-w-full px-2 sm:px-4 box-border">
          
          {/* Circular Profile Avatar with Thick White/Gold Border & Subtle Glow */}
          <div className="relative group shrink-0">
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 blur-md opacity-80 group-hover:opacity-100 transition duration-500 animate-pulse" />
            <div className="relative w-24 h-24 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white dark:border-amber-200/80 shadow-2xl">
              <Image
                src={avatarSrc}
                alt={userName}
                fill
                priority
                className="object-cover"
                unoptimized={avatarSrc.startsWith("http")}
              />
            </div>
          </div>

          {/* Large Name in Display Serif Font */}
          <div className="space-y-3 sm:space-y-5 w-full max-w-5xl mx-auto px-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold bg-white/10 text-amber-300 border border-white/20 backdrop-blur-md shadow-inner max-w-full truncate">
              <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">Personal Retreat & Portfolio</span>
            </div>
            
            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight sm:tracking-wider text-white drop-shadow-lg uppercase leading-tight md:whitespace-nowrap max-w-full">
              {userName}
            </h1>
            
            <p className="font-display text-xs sm:text-lg lg:text-xl text-amber-200/90 font-medium tracking-normal sm:tracking-wide drop-shadow-md leading-relaxed max-w-sm sm:max-w-xl mx-auto break-words">
              Wilderness Explorer & Full-Stack Architect
            </p>
          </div>

          {/* Tagline & Short Description inside Glassmorphism Card */}
          <div className="w-full max-w-sm sm:max-w-xl mx-auto backdrop-blur-md bg-stone-950/40 border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl space-y-4 sm:space-y-6 box-border">
            <p className="text-xs sm:text-base text-slate-200 leading-relaxed break-words">
              Membangun platform web berskala tinggi, solusi arsitektur AI modern, dan pengalaman antarmuka yang elegan dengan lanskap teknologi terkini.
            </p>

            {/* Social Media Link Buttons Row */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <a
                href="https://github.com/brimaspradika8-sudo"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-amber-500/20 text-white border border-white/20 hover:border-amber-400/60 backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
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
                className="p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-amber-500/20 text-white border border-white/20 hover:border-amber-400/60 backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/10 hover:bg-amber-500/20 text-white border border-white/20 hover:border-amber-400/60 backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="Twitter X"
                title="Twitter / X"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              <a
                href={`mailto:${userEmail}`}
                className="p-3 rounded-full bg-white/10 hover:bg-amber-500/20 text-white border border-white/20 hover:border-amber-400/60 backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="Email"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. SECTION STATS (Organic Glassmorphism Cards)                           */}
        {/* ========================================================================= */}
        <section id="about" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-wide flex items-center gap-3">
              <Activity className="w-6 h-6 text-amber-400" />
              <span>Jejak & Ringkasan Metrik</span>
            </h2>
            <span className="text-xs font-semibold text-amber-200/80 tracking-widest uppercase">
              Wilderness Milestones
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Stat Card 1 */}
            {/* REPLACE: Update this metric with live dynamic API / DB query later */}
            <div className={`backdrop-blur-md border rounded-3xl p-6 shadow-xl transition-all duration-300 group ${
              isNight
                ? "bg-slate-950/40 border-indigo-500/30 hover:border-indigo-400/60"
                : "bg-amber-950/30 border-amber-300/30 hover:border-amber-400/60"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                  Project Selesai
                </span>
                <div className="p-2.5 rounded-2xl bg-white/10 text-amber-300 group-hover:scale-110 transition-transform">
                  <FolderGit2 className="w-4 h-4" />
                </div>
              </div>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                18+
              </p>
              <p className="text-xs text-slate-300 mt-1">Aplikasi & platform aktif</p>
            </div>

            {/* Stat Card 2 */}
            {/* REPLACE: Update this metric with live dynamic API / DB query later */}
            <div className={`backdrop-blur-md border rounded-3xl p-6 shadow-xl transition-all duration-300 group ${
              isNight
                ? "bg-slate-950/40 border-indigo-500/30 hover:border-indigo-400/60"
                : "bg-amber-950/30 border-amber-300/30 hover:border-amber-400/60"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                  Pengalaman
                </span>
                <div className="p-2.5 rounded-2xl bg-white/10 text-amber-300 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                4+ Thn
              </p>
              <p className="text-xs text-slate-300 mt-1">Pengembangan software</p>
            </div>

            {/* Stat Card 3 */}
            {/* REPLACE: Update this metric with live dynamic API / DB query later */}
            <div className={`backdrop-blur-md border rounded-3xl p-6 shadow-xl transition-all duration-300 group ${
              isNight
                ? "bg-slate-950/40 border-indigo-500/30 hover:border-indigo-400/60"
                : "bg-amber-950/30 border-amber-300/30 hover:border-amber-400/60"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                  Artikel & Riset
                </span>
                <div className="p-2.5 rounded-2xl bg-white/10 text-amber-300 group-hover:scale-110 transition-transform">
                  <Code2 className="w-4 h-4" />
                </div>
              </div>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                25+
              </p>
              <p className="text-xs text-slate-300 mt-1">Publikasi & wawasan</p>
            </div>

            {/* Stat Card 4 */}
            {/* REPLACE: Update this metric with live dynamic API / DB query later */}
            <div className={`backdrop-blur-md border rounded-3xl p-6 shadow-xl transition-all duration-300 group ${
              isNight
                ? "bg-slate-950/40 border-indigo-500/30 hover:border-indigo-400/60"
                : "bg-amber-950/30 border-amber-300/30 hover:border-amber-400/60"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                  GitHub Commits
                </span>
                <div className="p-2.5 rounded-2xl bg-white/10 text-amber-300 group-hover:scale-110 transition-transform">
                  <GitBranch className="w-4 h-4" />
                </div>
              </div>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                1,200+
              </p>
              <p className="text-xs text-slate-300 mt-1">Kontribusi tahunan</p>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. SECTION PROJECTS (Restyled Landscape Warm/Cool Accent Palette)       */}
        {/* ========================================================================= */}
        <section id="projects" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-wide flex items-center gap-3">
                <Mountain className="w-6 h-6 text-amber-400" />
                <span>Koleksi Project Explorasi</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Karya pilihan yang dibangun dengan perhatian terhadap detail dan estetika
              </p>
            </div>

            <a
              href="https://github.com/brimaspradika8-sudo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-amber-300 hover:text-amber-200 inline-flex items-center gap-1.5 shrink-0"
            >
              <span>GitHub Repository</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Project Card 1: DevPulse Analytics */}
            <div className={`backdrop-blur-md border rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col group ${
              isNight
                ? "bg-slate-950/50 border-indigo-500/30 hover:border-indigo-400/60"
                : "bg-stone-950/40 border-amber-300/30 hover:border-amber-400/60"
            }`}>
              <div className="relative w-full h-48 bg-stone-900 overflow-hidden">
                <Image
                  src="/images/project1.png"
                  alt="DevPulse Analytics"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent" />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    DevPulse Analytics
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    Dashboard analitik real-time untuk memantau metrik performa server, visualisasi data interaktif, dan notifikasi anomali.
                  </p>
                </div>

                <div className="space-y-4 pt-3 border-t border-white/10">
                  {/* Tech Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-200 border border-amber-400/30">
                      Next.js 16
                    </span>
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                      TypeScript
                    </span>
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-orange-500/20 text-orange-200 border border-orange-400/30">
                      Prisma
                    </span>
                  </div>

                  {/* Links */}
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <a
                      href="https://github.com/brimaspradika8-sudo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:text-white flex items-center gap-1.5"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                      <span>Code</span>
                    </a>
                    <a
                      href="#projects"
                      className="text-amber-300 hover:underline flex items-center gap-1"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Card 2: OmniCommerce AI */}
            <div className={`backdrop-blur-md border rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col group ${
              isNight
                ? "bg-slate-950/50 border-indigo-500/30 hover:border-indigo-400/60"
                : "bg-stone-950/40 border-amber-300/30 hover:border-amber-400/60"
            }`}>
              <div className="relative w-full h-48 bg-stone-900 overflow-hidden">
                <Image
                  src="/images/project2.png"
                  alt="OmniCommerce AI"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent" />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    OmniCommerce AI
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    Platform belanja e-commerce cerdas dengan rekomendasi AI otomatis dan checkout pembayaran instan.
                  </p>
                </div>

                <div className="space-y-4 pt-3 border-t border-white/10">
                  {/* Tech Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                      Supabase
                    </span>
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-200 border border-amber-400/30">
                      React 19
                    </span>
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-orange-500/20 text-orange-200 border border-orange-400/30">
                      OpenAI
                    </span>
                  </div>

                  {/* Links */}
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <a
                      href="https://github.com/brimaspradika8-sudo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:text-white flex items-center gap-1.5"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                      <span>Code</span>
                    </a>
                    <a
                      href="#projects"
                      className="text-amber-300 hover:underline flex items-center gap-1"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Card 3: Wilderness Sync Workspace */}
            <div className={`backdrop-blur-md border rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col group ${
              isNight
                ? "bg-slate-950/50 border-indigo-500/30 hover:border-indigo-400/60"
                : "bg-stone-950/40 border-amber-300/30 hover:border-amber-400/60"
            }`}>
              <div className="relative w-full h-48 bg-gradient-to-br from-amber-950 via-stone-900 to-indigo-950 p-6 flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between z-10">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-widest">
                    Wilderness Realtime
                  </span>
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                </div>
                <div className="space-y-1 z-10">
                  <p className="text-xs text-amber-200 font-medium">Multiplayer Collaboration</p>
                  <p className="font-display text-xl font-extrabold text-white">SyncBoard Retreat</p>
                </div>
                <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-amber-500/20 blur-2xl pointer-events-none" />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    SyncBoard Retreat
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    Ruang kerja kolaboratif dengan animasi lanskap interaktif, kursor multiplayer langsung, dan berbagi snippet.
                  </p>
                </div>

                <div className="space-y-4 pt-3 border-t border-white/10">
                  {/* Tech Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-200 border border-amber-400/30">
                      Next.js
                    </span>
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                      WebSockets
                    </span>
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                      PostgreSQL
                    </span>
                  </div>

                  {/* Links */}
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <a
                      href="https://github.com/brimaspradika8-sudo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:text-white flex items-center gap-1.5"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                      <span>Code</span>
                    </a>
                    <a
                      href="#projects"
                      className="text-amber-300 hover:underline flex items-center gap-1"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. SYSTEM STATUS & AUTHENTICATION INTEGRATION PANEL                      */}
        {/* ========================================================================= */}
        <section className="backdrop-blur-md bg-stone-950/40 border border-white/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/10 text-amber-300 border border-white/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">Status Autentikasi & Database</h3>
                <p className="text-xs text-slate-300">Supabase Auth Session & Prisma PostgreSQL Connection</p>
              </div>
            </div>

            <form action={signOut}>
              <button
                type="submit"
                className="px-4 py-2 rounded-2xl text-xs font-bold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-400/30 transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <p className="text-xs text-slate-300 font-medium">Email Terdaftar</p>
              <p className="text-xs font-semibold text-white truncate">{userEmail}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <p className="text-xs text-slate-300 font-medium">Status Prisma DB</p>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-300">
                  {dbUser ? "Connected (#" + dbUser.id + ")" : "Active"}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-300 font-medium">Supabase User ID</p>
                <button
                  onClick={handleCopyId}
                  className="text-xs text-amber-300 hover:underline font-bold"
                >
                  {copiedId ? "Tersalin!" : "Salin"}
                </button>
              </div>
              <p className="text-[11px] font-mono text-slate-200 truncate">{user.id}</p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. SECTION CONTACT / RETREAT CTA (Bottom Section)                         */}
        {/* ========================================================================= */}
        <section id="contact" className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-r from-amber-950/60 via-stone-950/70 to-indigo-950/70 p-8 sm:p-12 rounded-3xl border border-amber-300/30 text-white shadow-2xl text-center sm:text-left">
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-amber-300 border border-white/20 backdrop-blur-md">
                <Send className="w-3.5 h-3.5" />
                <span>Mari Terhubung</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-wide">
                Siap Berkolaborasi Dalam Eksplorasi Berikutnya?
              </h2>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                Saya selalu terbuka untuk diskusi project baru, pengembangan aplikasi berskala besar, dan konsultasi teknis.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <a
                href={`mailto:${userEmail}`}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <Mail className="w-4 h-4" />
                <span>Hubungi Saya</span>
              </a>

              <button
                onClick={handleCopyEmail}
                className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedEmail ? "Email Tersalin!" : "Salin Email"}</span>
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 backdrop-blur-md bg-stone-950/60 py-8 text-center text-xs text-slate-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-display font-medium text-amber-200/90">
            © {new Date().getFullYear()} {userName} — Wilderness & Personal Retreat. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#hero" className="hover:text-amber-300 transition-colors">Beranda</a>
            <a href="#about" className="hover:text-amber-300 transition-colors">Tentang</a>
            <a href="#projects" className="hover:text-amber-300 transition-colors">Project</a>
            <a href="#contact" className="hover:text-amber-300 transition-colors">Kontak</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

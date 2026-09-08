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
} from "lucide-react";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import MobileBottomNav from "@/components/MobileBottomNav";
import { soundFx } from "@/lib/audio/sound";
import CommandPalette from "@/components/CommandPalette";
import ProjectModal, { ProjectData } from "@/components/ProjectModal";
import TechStackMatrix from "@/components/TechStackMatrix";
import ProjectShowcase from "@/components/ProjectShowcase";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import Lanyard from "@/components/Lanyard";
import UnmaskRevealPhoto from "@/components/UnmaskRevealPhoto";
import ScrollReveal from "@/components/ScrollReveal";
import SupabaseUserFetchWidget from "@/components/SupabaseUserFetchWidget";

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

export default function DashboardClient({ user, dbUser, dbProjects }: DashboardClientProps) {
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

  const ownerName = "BRIMAS PRADIKA UTAMA";
  const ownerAvatar = "/images/avatar.webp";

  const navUserName =
    dbUser?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Guest User";

  const displayName = navUserName;
  const userAvatar = dbUser?.avatar || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "";
  const avatarSrc = userAvatar;

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

  const handleToggleSfx = () => {
    const next = soundFx.toggleMute();
    setSfxEnabled(next);
    showToast(next ? (lang === "id" ? "Suara Aktif" : "Sound Enabled") : (lang === "id" ? "Suara Senyap" : "Sound Muted"));
  };

  return (
    <div className={`min-h-screen font-sans antialiased text-left selection:bg-[#DC2626] selection:text-white transition-colors duration-300 pb-20 md:pb-0 ${
      isNight ? "bg-[#12160F] text-[#F1EFE9]" : "bg-[#ffffff] text-[#1A1A1A]"
    }`}>
      
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

          {/* Search Bar Center */}
          <div className="hidden md:flex items-center flex-1 max-w-xs relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full py-1 pl-7 pr-3 text-xs rounded-full bg-white/20 border border-white/30 text-white placeholder-white/70 focus:bg-white/30 transition-all outline-none"
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 text-white/80" />
          </div>

          {/* Navigation Menu Items */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium tracking-wide text-white/90">
            {[
              { label: "Beranda", href: "#hero" },
              { label: "About", href: "#about" },
              { label: "Project", href: "#projects" },
              { label: "Blog", href: "#blog" },
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
            <div
              className="text-emerald-400 font-mono text-[11px] font-bold flex items-center gap-1.5 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30 shadow-sm"
              title="Supabase Database Live Integrated"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>SUPABASE LIVE</span>
            </div>
          </nav>

          {/* Right Action Icons & Profile Avatar */}
          <div className="flex items-center gap-2.5 shrink-0 text-white/80">
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

            <button
              onClick={handleToggleSfx}
              className="p-1.5 rounded-full hover:bg-white/10 transition-all cursor-pointer"
              title={sfxEnabled ? "Mute Sound FX" : "Unmute Sound FX"}
            >
              {sfxEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-50" />}
            </button>

            {/* Profile Avatar / Login Action Button */}
            {user ? (
              <Link
                href="/profile"
                onClick={() => soundFx.playClick()}
                className="relative w-8 h-8 rounded-full overflow-hidden border border-[#DC2626] shrink-0 flex items-center justify-center font-bold text-xs transition-transform hover:scale-105 bg-[#DC2626] text-white shadow-md shadow-[#DC2626]/30"
                title="Buka Profil Saya"
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
                  <span>{initialLetter}</span>
                )}
              </Link>
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
                Sign In
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION (100% MATCHING BUCKETLISTLY EDITORIAL STYLE) */}
      <section id="hero" className={`relative min-h-[85vh] lg:min-h-[92vh] flex flex-col justify-between overflow-hidden transition-colors duration-300 ${
        isNight ? "bg-[#181D15]" : "bg-gradient-to-b from-[#a3a3a0] via-[#92928f] to-[#7f7f7c]"
      }`}>
        
        {/* Giant Moving Backdrop Typography ("WELCOME" & "BRIMAS PRADIKA UTAMA") Behind Head */}
        <div className="absolute top-1 inset-x-0 flex flex-col pointer-events-none select-none overflow-hidden z-0 pt-1 -space-y-4 sm:-space-y-8">
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
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 w-full flex-1 flex flex-col justify-between pt-2 sm:pt-6 pb-6 sm:pb-12">
          

          {/* Main Hero Center Container */}
          <div className="relative w-full flex flex-col sm:flex-row items-center justify-center min-h-[50vh] sm:min-h-[55vh] my-auto gap-6 sm:gap-0">
            
            {/* Centerpiece Portrait Photo (z-20) */}
            <div className="hero-photo-wrapper relative z-20 w-[270px] h-[360px] sm:w-[380px] sm:h-[480px] md:w-[420px] md:h-[530px] max-w-full overflow-hidden flex items-center justify-center pointer-events-auto">
              <UnmaskRevealPhoto
                maskedSrc="/images/image-masked.png"
                realSrc="/images/avatar.webp"
                alt={ownerName}
                className="w-full h-full"
              />
            </div>

            {/* Desktop Headline & CTAs (Absolute Left) */}
            <div className="hidden sm:block absolute left-0 bottom-6 sm:bottom-12 z-20 space-y-4 max-w-md text-left text-white drop-shadow-md">
              <h1 className="font-display text-5xl md:text-6xl font-black uppercase tracking-tight leading-none">
                I&apos;M {ownerName}
              </h1>
              <p className="text-sm text-white/90 leading-relaxed font-sans max-w-sm">
                AI Systems Developer &amp; Software Explorer. Saya membangun aplikasi berbasis kecerdasan buatan, sistem pintar, dan peranti lunak performa tinggi.
              </p>

              {/* Two CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#projects"
                  onClick={() => soundFx.playClick()}
                  className="px-6 py-2.5 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.03] cursor-pointer inline-flex items-center gap-2 shadow-lg shadow-[#DC2626]/40 border border-white/20"
                >
                  <span>EXPLORE PROJECTS</span>
                </a>

                <a
                  href="#about"
                  onClick={() => soundFx.playClick()}
                  className="px-6 py-2.5 rounded-full border border-white text-white font-bold text-xs uppercase tracking-wider transition-all hover:bg-white hover:text-black cursor-pointer inline-flex items-center gap-2 shadow-lg"
                >
                  <span>ABOUT ME</span>
                </a>
              </div>
            </div>

            {/* Mobile Headline & CTAs (Stacked Cleanly Below Photo) */}
            <div className="sm:hidden w-full z-20 space-y-3.5 text-center text-white px-2 pt-2">
              <h1 className="font-display text-4xl font-black uppercase tracking-tight leading-none drop-shadow-md">
                I&apos;M {ownerName}
              </h1>
              <p className="text-sm text-white/95 leading-relaxed font-sans max-w-xs mx-auto drop-shadow-sm font-medium">
                AI Systems Developer &amp; Software Explorer. Saya membangun aplikasi berbasis kecerdasan buatan, sistem pintar, dan peranti lunak performa tinggi.
              </p>

              {/* Two Mobile CTA Buttons */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <a
                  href="#projects"
                  onClick={() => soundFx.playClick()}
                  className="px-5 py-2.5 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#DC2626]/40 hover:scale-105 transition-transform border border-white/20"
                >
                  PROJECTS
                </a>

                <a
                  href="#about"
                  onClick={() => soundFx.playClick()}
                  className="px-5 py-2.5 rounded-full border border-white text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-white hover:text-black transition-all"
                >
                  ABOUT ME
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Smooth Organic SVG Wave Divider (Absolute Bottom z-10 underneath content) */}
        <div className="absolute -bottom-[1px] left-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
          <svg
            className={`w-full h-16 sm:h-24 md:h-28 block fill-current transition-colors duration-300 ${
              isNight ? "text-[#12160F]" : "text-[#ffffff]"
            }`}
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path d="M0,40 C360,110 720,20 1080,90 1260,120 1440,40 1440,40 L1440,120 L0,120 Z" />
          </svg>
        </div>

      </section>



      {/* 4. SECTION "ABOUT ME" WITH 3D LANYARD CARD */}
      <ScrollReveal direction="up" delayMs={50}>
        <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-b border-current/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Interactive 3D Physics Lanyard Photo Card */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-full max-w-md h-[520px] sm:h-[580px] flex items-center justify-center overflow-visible">
                <Lanyard />
              </div>
            </div>

            {/* Right Column: About Me Bio & Details */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DC2626]/15 text-[#DC2626] text-xs font-mono font-bold tracking-widest uppercase">
                <User className="w-3.5 h-3.5" />
                <span>ABOUT ME</span>
              </div>

              <div className="space-y-3">
                <h2 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none">
                  BRIMAS <span className="text-[#DC2626]">PRADIKA UTAMA</span>
                </h2>
                <p className="text-xs sm:text-sm font-mono tracking-wide opacity-80 uppercase text-[#DC2626]">
                  AI Systems Developer &bull; SMK Bhakti Mulia Pare
                </p>
                <p className="text-sm sm:text-base opacity-90 leading-relaxed font-sans max-w-xl">
                  {lang === "id"
                    ? "Siswa SMK Bhakti Mulia Pare yang aktif membangun aplikasi berbasis kecerdasan buatan & sistem AI secara profesional. Berfokus pada AI Systems Development, LLM Integration, React, Next.js, Python, Supabase, dan Cloud Systems. Bagi saya, coding bukan sekadar menulis sintaks, tapi bagaimana membangun sistem pintar yang rapi, scalable, dan maintainable."
                    : "Student at SMK Bhakti Mulia Pare actively building AI-powered applications & intelligent systems. Specialized in AI Systems Development, LLM Integration, React, Next.js, Python, Supabase, and Cloud Systems. Focused on writing clean, scalable, and maintainable intelligent systems."}
                </p>
              </div>

              {/* Feature Badges Grid */}
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

              {/* Action Buttons */}
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

            </div>

          </div>
        </section>
      </ScrollReveal>

      {/* 4.5 SUPABASE USER DATA FETCHING DEMO WIDGET */}
      <ScrollReveal direction="up" delayMs={50}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <SupabaseUserFetchWidget isNight={isNight} user={user} dbUser={dbUser} />
        </section>
      </ScrollReveal>

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

    </div>
  );
}

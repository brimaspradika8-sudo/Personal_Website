"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mountain,
  Sun,
  Moon,
  Search,
  Mail,
  FolderGit2,
  ArrowUpRight,
  Send,
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
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);

  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    soundFx.playClick();
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fullName = "Brimas Pradika Utama";
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
      setMode("day");
      document.documentElement.classList.remove("dark");
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("open-command-palette", handleOpen);
    };
  }, []);

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
      showToast(nextMode === "night" ? (lang === "id" ? "Mode Malam Hari" : "Night Mode") : (lang === "id" ? "Mode Siang Hari" : "Day Mode"));
      return nextMode;
    });
  };

  const handleCopyEmail = () => {
    const emailToCopy = "brimaspradika8@gmail.com";
    navigator.clipboard.writeText(emailToCopy);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const ownerName = "Brimas Pradika Utama";
  const ownerAvatar = "/images/avatar.webp";
  const ownerEmail = "brimaspradika8@gmail.com";

  const navUserName =
    dbUser?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Guest User";
  
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
    <div className="relative min-h-screen w-full overflow-x-hidden font-sans antialiased text-[#F1EFE9] selection:bg-[#3B5D42] selection:text-[#F1EFE9]">
      
      {/* Mountain Landscape Illustration Background Container (Light-Balanced Pine & Ember) */}
      <div
        className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none bg-cover bg-top bg-fixed bg-no-repeat saturate-[0.85] brightness-[0.9] contrast-[1.05] transition-all duration-1000"
        style={{
          backgroundImage: `url(${
            isNight
              ? isMobile
                ? "/animations/night-landscape-mobile.webp"
                : "/animations/night-landscape.webp"
              : isMobile
              ? "/animations/day-landscape-mobile.webp"
              : "/animations/day-landscape.webp"
          })`,
        }}
      >
        {(!isNight || loadSecondaryBg) && (
          <video
            key={isMobile ? "day-mobile" : "day-desktop"}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={isMobile ? "/animations/day-landscape-mobile.webp" : "/animations/day-landscape.webp"}
            className={`absolute inset-0 object-cover object-top w-full h-full transform-gpu transition-opacity duration-1000 ease-in-out saturate-[0.85] brightness-[0.9] contrast-[1.05] ${
              isNight ? "opacity-0" : "opacity-100"
            }`}
          >
            <source
              src={isMobile ? "/animations/day-landscape-mobile.mp4" : "/animations/day-landscape.mp4"}
              type="video/mp4"
            />
          </video>
        )}

        {(isNight || loadSecondaryBg) && (
          <video
            key={isMobile ? "night-mobile" : "night-desktop"}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={isMobile ? "/animations/night-landscape-mobile.webp" : "/animations/night-landscape.webp"}
            className={`absolute inset-0 object-cover object-top w-full h-full transform-gpu transition-opacity duration-1000 ease-in-out saturate-[0.85] brightness-[0.9] contrast-[1.05] ${
              isNight ? "opacity-100" : "opacity-0"
            }`}
          >
            <source
              src={isMobile ? "/animations/night-landscape-mobile.mp4" : "/animations/night-landscape.mp4"}
              type="video/mp4"
            />
          </video>
        )}

        {/* 1. Directional Gradient Overlay (Darker on text left, natural & clear on right) */}
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(18,22,15,0.75)_0%,rgba(18,22,15,0.55)_35%,rgba(18,22,15,0.25)_65%,rgba(18,22,15,0.15)_100%)] mix-blend-multiply pointer-events-none transition-colors duration-1000" />
        
        {/* 2. Warm Ember Radial Glow Focal Point (Soft warmth near top right sky) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(166,83,45,0.18)_0%,transparent_45%)] mix-blend-soft-light pointer-events-none transition-colors duration-1000" />
        
        {/* 3. Subtle Top Header & Bottom Fade Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#12160F]/40 via-transparent to-[#12160F]/30 pointer-events-none transition-colors duration-1000" />
      </div>

      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A211A]/90 border-b border-[#2A2F26] backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 relative">
          
          {/* Brand Logo Text */}
          <a
            href="#hero"
            className="flex items-center group focus:outline-none focus:ring-1 focus:ring-[#3B5D42] rounded-lg p-1 shrink-0"
          >
            <span className="font-display text-lg font-bold tracking-tight text-[#F1EFE9]">
              Brimas
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center justify-center gap-2 text-sm font-medium absolute left-1/2 -translate-x-1/2">
            <a
              href="#hero"
              className="text-[#A8A79C] hover:text-[#F1EFE9] hover:bg-[#212A20] px-3.5 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-[#3B5D42]"
            >
              {dict.nav.home}
            </a>
            <a
              href="#projects"
              className="text-[#A8A79C] hover:text-[#F1EFE9] hover:bg-[#212A20] px-3.5 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-[#3B5D42]"
            >
              {dict.nav.projects}
            </a>
            <a
              href="#about"
              className="text-[#A8A79C] hover:text-[#F1EFE9] hover:bg-[#212A20] px-3.5 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-[#3B5D42]"
            >
              {dict.nav.articles}
            </a>
            <a
              href="#about"
              className="text-[#A8A79C] hover:text-[#F1EFE9] hover:bg-[#212A20] px-3.5 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-[#3B5D42]"
            >
              {dict.nav.about}
            </a>
          </nav>

          {/* Controls: Search, Theme Toggle, Profile */}
          <div className="flex items-center gap-2.5 shrink-0 ml-auto">
            
            {/* Search Command Palette Trigger */}
            <button
              onClick={() => {
                soundFx.playClick();
                setCmdPaletteOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1A211A] hover:bg-[#212A20] text-[#A8A79C] hover:text-[#F1EFE9] border border-[#2A2F26] transition-colors text-xs font-medium cursor-pointer"
              aria-label="Search Command Palette"
            >
              <Search className="w-3.5 h-3.5 text-[#A8A79C]" />
              <span className="hidden sm:inline">Cari</span>
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={handleToggleMode}
              aria-label={isNight ? "Switch to Day Mode" : "Switch to Night Mode"}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1A211A] hover:bg-[#212A20] border border-[#2A2F26] text-[#F1EFE9] transition-colors cursor-pointer"
            >
              {isNight ? (
                <Moon className="w-4 h-4 text-[#A8A79C]" />
              ) : (
                <Sun className="w-4 h-4 text-[#F1EFE9]" />
              )}
            </button>

            {/* Profile Avatar Link */}
            <Link
              href="/profile"
              onClick={() => soundFx.playClick()}
              className="flex items-center rounded-full shrink-0"
              title={user ? `Profil (${navUserName})` : "Profil"}
              aria-label="Profil"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-[#3B5D42] bg-[#1A211A] flex items-center justify-center font-bold text-[#F1EFE9] text-xs">
                {user ? (
                  <>
                    <span className="w-full h-full flex items-center justify-center">
                      {initialLetter}
                    </span>
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
                  <User className="w-4 h-4 text-[#F1EFE9]" />
                )}
              </div>
            </Link>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-32 sm:pb-24 space-y-20 max-w-5xl w-full mx-auto px-4 sm:px-6">
        
        {/* 1. HERO SECTION */}
        <section id="hero" className="pt-6 sm:pt-12 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Text Content */}
            <div className="md:col-span-7 space-y-5 text-left">
              
              {/* Mobile Profile Photo */}
              <div className="block md:hidden py-1">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border border-[#2A2F26] bg-[#1A211A]">
                  <Image
                    src={ownerAvatar}
                    alt={ownerName}
                    fill
                    priority
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Name & Role Headline */}
              <div className="space-y-2">
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F1EFE9] leading-tight min-h-[1.2em]">
                  <span>{typedText}</span>
                  <span
                    className={`inline-block w-1 h-[0.75em] ml-1 bg-[#A6532D] rounded-xs ${
                      isTypingDone ? "opacity-40" : "animate-pulse"
                    }`}
                  />
                </h1>
                <p className="text-base sm:text-lg font-medium text-[#F1EFE9]">
                  {dict.hero.role}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-[#A8A79C] max-w-xl leading-relaxed">
                {dict.hero.description}
              </p>

              {/* Action CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {/* 1 Ember CTA for Section */}
                <a
                  href="#projects"
                  onClick={() => soundFx.playClick()}
                  className="px-5 py-2.5 rounded-lg bg-[#A6532D] hover:bg-[#8A4425] text-[#F1EFE9] font-medium text-sm transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <FolderGit2 className="w-4 h-4" />
                  <span>{dict.hero.viewProjects}</span>
                </a>

                {/* Secondary Button */}
                <a
                  href={`mailto:${ownerEmail}`}
                  onClick={() => soundFx.playClick()}
                  className="px-5 py-2.5 rounded-lg bg-[#1A211A] hover:bg-[#212A20] text-[#F1EFE9] border border-[#2A2F26] font-medium text-sm transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-[#A8A79C]" />
                  <span>{dict.hero.contactMe}</span>
                </a>

                {/* Social Icons */}
                <div className="flex items-center gap-2">
                  <a
                    href="https://github.com/brimaspradika8-sudo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-[#1A211A] hover:bg-[#212A20] text-[#F1EFE9] border border-[#2A2F26] transition-colors flex items-center justify-center"
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
                    className="w-9 h-9 rounded-lg bg-[#1A211A] hover:bg-[#212A20] text-[#F1EFE9] border border-[#2A2F26] transition-colors flex items-center justify-center"
                    aria-label="LinkedIn"
                    title="LinkedIn"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Technologies Stack Row */}
              <div className="pt-4 border-t border-[#2A2F26]/70 space-y-2">
                <p className="text-xs font-medium text-[#A8A79C]">
                  {dict.hero.techHeader}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "TailwindCSS"].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-lg bg-[#1A211A]/80 backdrop-blur-md border border-[#2A2F26]/70 text-[#F1EFE9] text-xs font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Desktop Profile Picture with Vignette Framing */}
            <div className="hidden md:flex md:col-span-5 justify-end items-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden border-2 border-[#3B5D42]/60 bg-[#1A211A]/80 backdrop-blur-md shadow-2xl group">
                <Image
                  src={ownerAvatar}
                  alt={ownerName}
                  fill
                  priority
                  sizes="288px"
                  className="object-cover"
                />
                {/* Soft Inset Vignette Overlay to blend photo background seamlessly with website theme */}
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_35px_10px_rgba(18,22,15,0.55)] pointer-events-none z-10 border border-[#2A2F26]/40" />
              </div>
            </div>

          </div>
        </section>

        {/* 2. PROJECTS SECTION */}
        <section id="projects" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2A2F26]/70 pb-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#F1EFE9] tracking-tight flex items-center gap-2.5">
                <Mountain className="w-5 h-5 text-[#3B5D42]" />
                <span>{dict.projects.title}</span>
              </h2>
              <p className="text-sm text-[#A8A79C] mt-1">
                {dict.projects.subtitle}
              </p>
            </div>

            <a
              href="https://github.com/brimaspradika8-sudo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-[#A8A79C] hover:text-[#F1EFE9] inline-flex items-center gap-1 shrink-0 transition-colors"
            >
              <span>{dict.projects.githubRepo}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Frosted Glassmorphism Coming Soon Card */}
          <div className="bg-[#1A211A]/80 backdrop-blur-md border border-[#2A2F26]/70 rounded-xl p-8 sm:p-10 space-y-4 shadow-xl">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F1EFE9]">
              {dict.projects.comingSoonTitle}
            </h3>
            <p className="text-sm text-[#A8A79C] max-w-xl leading-relaxed">
              {dict.projects.comingSoonDesc}
            </p>

            {/* 1 Ember CTA for Projects Section */}
            <div className="pt-2">
              <a
                href="https://github.com/brimaspradika8-sudo"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFx.playClick()}
                className="px-5 py-2.5 rounded-lg bg-[#A6532D] hover:bg-[#8A4425] text-[#F1EFE9] font-medium text-sm inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <FolderGit2 className="w-4 h-4" />
                <span>{dict.projects.githubMonitor}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* 3. CONTACT SECTION */}
        <section id="contact" className="bg-[#1A211A]/80 backdrop-blur-md border border-[#2A2F26]/70 p-8 sm:p-10 rounded-xl space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#F1EFE9]">
                {dict.contact.title}
              </h2>
              <p className="text-sm text-[#A8A79C] leading-relaxed">
                {dict.contact.desc}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
              <a
                href={`mailto:${ownerEmail}`}
                className="px-5 py-2.5 rounded-lg bg-[#3B5D42] hover:bg-[#2F4A34] text-[#F1EFE9] font-medium text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>{dict.contact.btn}</span>
              </a>

              <button
                onClick={handleCopyEmail}
                className="px-5 py-2.5 rounded-lg bg-[#1A211A] hover:bg-[#212A20] border border-[#2A2F26] text-[#F1EFE9] font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-[#3B5D42]" /> : <Copy className="w-4 h-4 text-[#A8A79C]" />}
                <span>{copiedEmail ? dict.contact.copied : dict.contact.copyEmail}</span>
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-20 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1A211A] border border-[#2A2F26] text-[#F1EFE9] text-xs font-medium">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#2A2F26] bg-[#1A211A]/80 backdrop-blur-md py-8 text-xs text-[#A8A79C]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} {ownerName}. {dict.footer.rights}
          </p>
          <div className="flex items-center gap-4">
            <a href="#hero" className="hover:text-[#F1EFE9] transition-colors">{dict.nav.home}</a>
            <a href="#about" className="hover:text-[#F1EFE9] transition-colors">{dict.nav.about}</a>
            <a href="#projects" className="hover:text-[#F1EFE9] transition-colors">{dict.nav.projects}</a>
            <a href="#contact" className="hover:text-[#F1EFE9] transition-colors">{dict.nav.contact}</a>
          </div>
        </div>
      </footer>

      {/* Mobile Navigation */}
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

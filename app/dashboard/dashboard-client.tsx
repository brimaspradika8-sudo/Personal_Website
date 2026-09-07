"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mountain,
  Sun,
  Moon,
  Mail,
  FolderGit2,
  ArrowUpRight,
  User,
  Check,
  Copy,
  Cpu,
  Layers,
  Globe,
  Database,
  Smartphone,
  Play,
  Sparkles,
  ArrowRight,
  Volume2,
  VolumeX,
} from "lucide-react";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import MobileBottomNav from "@/components/MobileBottomNav";
import { soundFx } from "@/lib/audio/sound";
import CommandPalette from "@/components/CommandPalette";
import ProjectModal, { ProjectData } from "@/components/ProjectModal";
import InteractiveCharacter from "@/components/InteractiveCharacter";

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
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
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

  const initialLetter = navUserName && navUserName !== "Guest User" ? navUserName.charAt(0).toUpperCase() : "G";
  const isNight = mode === "night";

  return (
    <div className="min-h-screen bg-[#12160F] text-[#F1EFE9] font-sans antialiased text-left selection:bg-[#3B5D42] selection:text-[#F1EFE9]">
      
      {/* Sticky Top Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#12160F]/90 border-b border-[#2A2F26] backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="text-base font-bold tracking-tight text-[#F1EFE9] hover:text-[#3B5D42] transition-colors flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#A6532D]" />
            <span>{ownerName}</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                toggleLang();
              }}
              className="px-2.5 py-1 rounded-md bg-[#1A211A] hover:bg-[#212A20] border border-[#2A2F26] text-[#F1EFE9] text-xs font-mono transition-colors cursor-pointer"
            >
              {lang.toUpperCase()}
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => {
                const next = soundFx.toggleMute();
                setSfxEnabled(next);
                showToast(next ? (lang === "id" ? "Suara Aktif" : "Sound Enabled") : (lang === "id" ? "Suara Senyap" : "Sound Muted"));
              }}
              className="p-1.5 rounded-md bg-[#1A211A] hover:bg-[#212A20] border border-[#2A2F26] text-[#A8A79C] hover:text-[#F1EFE9] transition-colors cursor-pointer"
              title={sfxEnabled ? "Mute Sound FX" : "Enable Sound FX"}
            >
              {sfxEnabled ? <Volume2 className="w-4 h-4 text-[#3B5D42]" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={handleToggleMode}
              aria-label={isNight ? "Switch to Day Mode" : "Switch to Night Mode"}
              className="p-1.5 rounded-md bg-[#1A211A] hover:bg-[#212A20] border border-[#2A2F26] text-[#F1EFE9] transition-colors cursor-pointer"
            >
              {isNight ? <Moon className="w-4 h-4 text-[#A8A79C]" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* User Profile Badge */}
            <Link
              href="/profile"
              onClick={() => soundFx.playClick()}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1A211A] border border-[#2A2F26] hover:border-[#3B5D42] text-xs font-bold font-mono transition-colors"
              title={user ? `Profil (${navUserName})` : "Profil"}
            >
              {user ? initialLetter : <User className="w-4 h-4 text-[#A8A79C]" />}
            </Link>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-32 space-y-20">

        {/* 1. EDITORIAL HERO SECTION WITH INTERACTIVE CHARACTER */}
        <section id="hero" className="relative pt-6 sm:pt-12 pb-12 overflow-hidden">
          
          {/* Giant Backdrop Display Typography ("WELCOME I'M BRIMAS") */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-10 sm:opacity-[0.14] z-0">
            <h1 className="font-display text-[13vw] sm:text-[14vw] font-black uppercase tracking-tighter text-[#F1EFE9] whitespace-nowrap leading-none">
              WELCOME I&apos;M BRIMAS
            </h1>
          </div>

          {/* Main Hero Grid */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6 sm:pt-10">
            
            {/* Left Bio Column */}
            <div className="lg:col-span-5 space-y-6 text-left order-2 lg:order-1">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3B5D42]/20 border border-[#3B5D42]/50 text-[#F1EFE9] text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5 text-[#A6532D]" />
                <span>Full-Stack Architect & AI Systems</span>
              </div>

              <div className="space-y-3">
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F1EFE9] leading-tight min-h-[1.2em]">
                  <span>{typedText}</span>
                  <span
                    className={`inline-block w-1 h-[0.75em] ml-1 bg-[#A6532D] rounded-xs ${
                      isTypingDone ? "opacity-40" : "animate-pulse"
                    }`}
                  />
                </h1>
                <p className="text-sm sm:text-base text-[#A8A79C] leading-relaxed">
                  {dict.hero.description}
                </p>
              </div>

              {/* Action CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#projects"
                  onClick={() => soundFx.playClick()}
                  className="px-5 py-2.5 rounded-lg bg-[#A6532D] hover:bg-[#8A4425] text-[#F1EFE9] font-medium text-sm transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer inline-flex items-center gap-2"
                >
                  <FolderGit2 className="w-4 h-4" />
                  <span>{dict.hero.viewProjects}</span>
                </a>

                <a
                  href={`mailto:${ownerEmail}`}
                  onClick={() => soundFx.playClick()}
                  className="px-5 py-2.5 rounded-lg bg-[#1A211A] hover:bg-[#212A20] text-[#F1EFE9] border border-[#2A2F26] font-medium text-sm transition-all hover:scale-[1.02] cursor-pointer inline-flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-[#A8A79C]" />
                  <span>{dict.hero.contactMe}</span>
                </a>
              </div>

              {/* Tech Stack Chips */}
              <div className="pt-4 border-t border-[#2A2F26]/70 space-y-2">
                <p className="text-xs font-mono text-[#A8A79C]">
                  {dict.hero.techHeader}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "TailwindCSS"].map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md bg-[#1A211A] border border-[#2A2F26] text-[#F1EFE9] text-xs font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Center Column: Interactive Character (3D Tilt & Hair Bounce Animation) */}
            <div className="lg:col-span-4 flex justify-center items-center order-1 lg:order-2">
              <InteractiveCharacter avatarSrc={ownerAvatar} name={ownerName} />
            </div>

            {/* Right Column: Floating Featured Card Accent */}
            <div className="lg:col-span-3 space-y-4 order-3">
              <div className="bg-[#1A211A]/90 backdrop-blur-md border border-[#2A2F26] rounded-2xl p-4 shadow-xl space-y-3 relative group overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#A6532D] tracking-wide uppercase">
                    <span className="w-2 h-2 rounded-full bg-[#A6532D] animate-ping" />
                    Featured System
                  </span>
                  <span className="text-[10px] font-mono text-[#A8A79C]">v2.4 Live</span>
                </div>

                <div className="relative w-full h-28 rounded-lg overflow-hidden border border-[#2A2F26] bg-[#12160F]">
                  <Image
                    src="/images/project1.png"
                    alt="AI Agent System"
                    fill
                    sizes="200px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#A6532D] text-[#F1EFE9] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <h3 className="text-xs font-bold text-[#F1EFE9]">
                    AI Agent System Platform
                  </h3>
                  <p className="text-[11px] text-[#A8A79C] line-clamp-2 leading-tight">
                    Platform agen kecerdasan buatan berbasis Next.js & Supabase untuk otomasi workflow.
                  </p>
                </div>

                <a
                  href="#projects"
                  onClick={() => soundFx.playClick()}
                  className="w-full py-2 px-3 rounded-lg bg-[#212A20] hover:bg-[#3B5D42] text-[#F1EFE9] text-xs font-medium border border-[#2A2F26] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Lihat Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

          {/* Slanted Angle Divider */}
          <div className="relative w-full h-12 sm:h-16 overflow-hidden mt-12 z-10 pointer-events-none">
            <svg
              className="absolute bottom-0 w-full h-full text-[#1A211A] fill-current"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path d="M0,0 L1200,80 L1200,120 L0,120 Z" />
            </svg>
          </div>

        </section>

        {/* 2. DOMAIN EXPLORATION GRID ("WHERE DO YOU WANT TO EXPLORE?") */}
        <section className="space-y-6 pt-2 text-left">
          <div className="text-center space-y-1">
            <p className="text-xs font-mono uppercase tracking-widest text-[#A6532D]">
              Interactive Navigation
            </p>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#F1EFE9]">
              WHERE DO YOU WANT TO EXPLORE?
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "AI Systems", icon: Cpu, count: "03 Projects" },
              { label: "Distributed Backend", icon: Layers, count: "05 Projects" },
              { label: "Web Architecture", icon: Globe, count: "08 Projects" },
              { label: "Database & Cloud", icon: Database, count: "04 Projects" },
              { label: "Mobile Apps", icon: Smartphone, count: "02 Projects" },
            ].map((domain) => {
              const IconComp = domain.icon;
              return (
                <a
                  key={domain.label}
                  href="#projects"
                  onClick={() => soundFx.playClick()}
                  className="bg-[#1A211A]/80 backdrop-blur-md border border-[#2A2F26]/70 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2 hover:border-[#3B5D42] hover:bg-[#212A20] transition-all group cursor-pointer shadow-lg hover:scale-[1.03]"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#12160F] border border-[#2A2F26] flex items-center justify-center text-[#A8A79C] group-hover:text-[#F1EFE9] group-hover:border-[#3B5D42] transition-colors">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-[#F1EFE9] group-hover:text-[#A6532D] transition-colors">
                    {domain.label}
                  </span>
                  <span className="text-[10px] font-mono text-[#A8A79C]">
                    {domain.count}
                  </span>
                </a>
              );
            })}
          </div>
        </section>

        {/* 3. PROJECTS SECTION */}
        <section id="projects" className="space-y-6 text-left">
          
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
              className="text-xs font-mono text-[#A8A79C] hover:text-[#F1EFE9] inline-flex items-center gap-1 shrink-0 transition-colors"
            >
              <span>{dict.projects.githubRepo}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-[#1A211A]/80 backdrop-blur-md border border-[#2A2F26]/70 rounded-2xl p-8 sm:p-10 space-y-4 shadow-xl text-left">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F1EFE9]">
              {dict.projects.comingSoonTitle}
            </h3>
            <p className="text-sm text-[#A8A79C] max-w-xl leading-relaxed">
              {dict.projects.comingSoonDesc}
            </p>

            <div className="pt-2">
              <a
                href="https://github.com/brimaspradika8-sudo"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFx.playClick()}
                className="px-5 py-2.5 rounded-lg bg-[#A6532D] hover:bg-[#8A4425] text-[#F1EFE9] font-medium text-sm inline-flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <FolderGit2 className="w-4 h-4" />
                <span>{dict.projects.githubMonitor}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </section>

        {/* 4. CONTACT SECTION */}
        <section id="contact" className="bg-[#1A211A]/80 backdrop-blur-md border border-[#2A2F26]/70 p-8 sm:p-10 rounded-2xl space-y-6 shadow-xl text-left">
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
                className="px-5 py-2.5 rounded-lg bg-[#12160F] hover:bg-[#1A211A] border border-[#2A2F26] text-[#F1EFE9] font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
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
        <div className="fixed bottom-20 right-6 z-50 px-4 py-2.5 rounded-lg bg-[#1A211A] border border-[#2A2F26] text-[#F1EFE9] text-xs font-mono shadow-xl">
          {toastMsg}
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#2A2F26] bg-[#12160F] py-8 text-xs text-[#A8A79C] text-left">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {ownerName}. {dict.footer.rights}</p>
          <div className="flex items-center gap-4">
            <a href="#hero" className="hover:text-[#F1EFE9] transition-colors">{dict.nav.home}</a>
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

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  FolderGit2,
  ArrowUpRight,
  User,
  Check,
  Copy,
  Globe,
  Sun,
  Moon,
  Volume2,
  VolumeX,
} from "lucide-react";

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
      
      {/* Header / Sticky Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#12160F]/90 border-b border-[#2A2F26] backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="text-base font-bold tracking-tight text-[#F1EFE9] hover:text-[#3B5D42] transition-colors"
          >
            {ownerName}
          </Link>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
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

            {/* Profile Avatar / User Badge */}
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-16">

        {/* 1. Hero Section */}
        <section id="hero" className="space-y-6 text-left">
          
          <div className="inline-block px-3 py-1 rounded-md bg-[#3B5D42]/20 border border-[#3B5D42]/40 text-[#F1EFE9] text-xs font-mono">
            Full-Stack Architect & AI Developer
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F1EFE9] leading-tight">
              {ownerName}
            </h1>
            <p className="text-base sm:text-lg text-[#A8A79C] leading-relaxed max-w-2xl">
              {dict.hero.description}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#projects"
              onClick={() => soundFx.playClick()}
              className="px-5 py-2.5 rounded-lg bg-[#A6532D] hover:bg-[#8A4425] text-[#F1EFE9] font-medium text-sm transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <FolderGit2 className="w-4 h-4" />
              <span>{dict.hero.viewProjects}</span>
            </a>

            <a
              href={`mailto:${ownerEmail}`}
              onClick={() => soundFx.playClick()}
              className="px-5 py-2.5 rounded-lg bg-[#1A211A] hover:bg-[#212A20] text-[#F1EFE9] border border-[#2A2F26] font-medium text-sm transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-[#A8A79C]" />
              <span>{dict.hero.contactMe}</span>
            </a>
          </div>

          {/* Tech Stack List */}
          <div className="pt-4 border-t border-[#2A2F26] space-y-2 text-left">
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

        </section>

        {/* 2. Projects Section */}
        <section id="projects" className="space-y-6 text-left">
          
          <div className="flex items-center justify-between border-b border-[#2A2F26] pb-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#F1EFE9]">
                {dict.projects.title}
              </h2>
              <p className="text-sm text-[#A8A79C] mt-1">
                {dict.projects.subtitle}
              </p>
            </div>

            <a
              href="https://github.com/brimaspradika8-sudo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-[#A8A79C] hover:text-[#F1EFE9] inline-flex items-center gap-1 transition-colors"
            >
              <span>{dict.projects.githubRepo}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Project Items / Grid */}
          <div className="space-y-4">
            {dbProjects.length > 0 ? (
              dbProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-6 rounded-xl bg-[#1A211A] border border-[#2A2F26] space-y-3 transition-colors hover:border-[#3B5D42]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-bold text-[#F1EFE9]">
                      {proj.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {proj.demo_url && (
                        <a
                          href={proj.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-[#A6532D] hover:underline inline-flex items-center gap-1"
                        >
                          <span>Live Demo</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                      {proj.repository_url && (
                        <a
                          href={proj.repository_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-[#A8A79C] hover:text-[#F1EFE9] inline-flex items-center gap-1"
                        >
                          <span>Code</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-[#A8A79C] leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-6 sm:p-8 rounded-xl bg-[#1A211A] border border-[#2A2F26] space-y-3 text-left">
                <h3 className="text-lg font-bold text-[#F1EFE9]">
                  {dict.projects.comingSoonTitle}
                </h3>
                <p className="text-sm text-[#A8A79C] leading-relaxed max-w-xl">
                  {dict.projects.comingSoonDesc}
                </p>
                <div className="pt-2">
                  <a
                    href="https://github.com/brimaspradika8-sudo"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundFx.playClick()}
                    className="px-4 py-2 rounded-lg bg-[#3B5D42] hover:bg-[#2F4A34] text-[#F1EFE9] font-medium text-xs inline-flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <FolderGit2 className="w-4 h-4" />
                    <span>{dict.projects.githubMonitor}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>

        </section>

        {/* 3. Contact Section */}
        <section id="contact" className="p-6 sm:p-8 rounded-xl bg-[#1A211A] border border-[#2A2F26] space-y-6 text-left">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#F1EFE9]">
              {dict.contact.title}
            </h2>
            <p className="text-sm text-[#A8A79C] leading-relaxed max-w-xl">
              {dict.contact.desc}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${ownerEmail}`}
              className="px-5 py-2.5 rounded-lg bg-[#3B5D42] hover:bg-[#2F4A34] text-[#F1EFE9] font-medium text-sm inline-flex items-center gap-2 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>{dict.contact.btn}</span>
            </a>

            <button
              onClick={handleCopyEmail}
              className="px-5 py-2.5 rounded-lg bg-[#12160F] hover:bg-[#1A211A] border border-[#2A2F26] text-[#F1EFE9] font-medium text-sm inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              {copiedEmail ? <Check className="w-4 h-4 text-[#3B5D42]" /> : <Copy className="w-4 h-4 text-[#A8A79C]" />}
              <span>{copiedEmail ? dict.contact.copied : dict.contact.copyEmail}</span>
            </button>
          </div>
        </section>

      </main>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-20 right-6 z-50 px-4 py-2 rounded-lg bg-[#1A211A] border border-[#2A2F26] text-[#F1EFE9] text-xs font-mono shadow-lg">
          {toastMsg}
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#2A2F26] py-8 text-xs text-[#A8A79C] text-left">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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

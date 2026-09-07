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
  Camera,
  Globe,
  Video,
  ChevronDown,
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

export default function DashboardClient({ user, dbUser }: DashboardClientProps) {
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

  const ownerName = "BRIMAS P.";
  const ownerAvatar = "/images/avatar.png";

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

  const welcomeMarqueeText = isLoggedIn && activeUserName
    ? `WELCOME ${activeUserName.toUpperCase()}`
    : "WELCOME";

  const initialLetter = navUserName && navUserName !== "Guest User" ? navUserName.charAt(0).toUpperCase() : "G";
  const isNight = mode === "night";

  return (
    <div className={`min-h-screen font-sans antialiased text-left selection:bg-[#F5B301] selection:text-black transition-colors duration-300 ${
      isNight ? "bg-[#12160F] text-[#F1EFE9]" : "bg-[#ffffff] text-[#1A1A1A]"
    }`}>
      
      {/* 1. TOP NAVIGATION HEADER (MATCHING BUCKETLISTLY STYLE) */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${
        isNight ? "bg-[#12160F]/90 border-[#2A2F26]" : "bg-[#8a8a88]/90 border-[#7a7a78] text-white"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          
          {/* Logo (Icon Bulat Kuning + Blog Name) */}
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="flex items-center gap-2 shrink-0 group"
          >
            <div className="w-6 h-6 rounded-full bg-[#F5B301] flex items-center justify-center text-black font-bold text-xs shadow-md group-hover:scale-105 transition-transform">
              B
            </div>
            <span className="font-bold tracking-tight text-sm font-sans">
              BucketListly <span className="font-normal opacity-80">Blog</span>
            </span>
          </Link>

          {/* Search Bar Center */}
          <div className="hidden md:flex items-center flex-1 max-w-xs relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the blog"
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
              { label: "Profile", href: "/profile" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => soundFx.playClick()}
                className="transition-colors hover:text-[#F5B301] flex items-center gap-0.5"
              >
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          {/* Right Action Icons & Socials */}
          <div className="flex items-center gap-3 shrink-0 text-white/80">
            <a href="#" className="hover:text-white transition-colors"><Camera className="w-3.5 h-3.5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Globe className="w-3.5 h-3.5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Video className="w-3.5 h-3.5" /></a>

            {/* Language & Sound Toggles */}
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                toggleLang();
              }}
              className="px-2 py-0.5 rounded border border-white/30 text-[10px] font-mono hover:bg-white/10 transition-colors"
            >
              {lang.toUpperCase()}
            </button>

            <button
              type="button"
              onClick={() => {
                const next = soundFx.toggleMute();
                setSfxEnabled(next);
                showToast(next ? (lang === "id" ? "Suara Aktif" : "Sound Enabled") : (lang === "id" ? "Suara Senyap" : "Sound Muted"));
              }}
              className="p-1 rounded hover:bg-white/10 transition-colors"
            >
              {sfxEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#F5B301]" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={handleToggleMode}
              aria-label="Toggle Mode"
              className="p-1 rounded hover:bg-white/10 transition-colors"
            >
              {isNight ? <Moon className="w-3.5 h-3.5 text-[#F5B301]" /> : <Sun className="w-3.5 h-3.5 text-[#F5B301]" />}
            </button>

            {/* Profile Avatar Badge */}
            <Link
              href="/profile"
              onClick={() => soundFx.playClick()}
              className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F5B301] text-black font-bold text-[11px] shadow-sm hover:scale-105 transition-transform ml-1"
            >
              {user ? initialLetter : <User className="w-3.5 h-3.5 text-black" />}
            </Link>

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
          <div className="animate-welcome-marquee flex gap-4 whitespace-nowrap">
            <h1 className={`font-display text-[18vw] sm:text-[20vw] font-black uppercase tracking-tighter leading-none transition-colors ${
              isNight ? "text-[#242C20]" : "text-[#bcbcb9]/40"
            }`}>
              {welcomeMarqueeText} <span className="mx-2 opacity-50">&bull;</span> {welcomeMarqueeText} <span className="mx-2 opacity-50">&bull;</span>
            </h1>
            <h1 className={`font-display text-[18vw] sm:text-[20vw] font-black uppercase tracking-tighter leading-none transition-colors ${
              isNight ? "text-[#242C20]" : "text-[#bcbcb9]/40"
            }`}>
              {welcomeMarqueeText} <span className="mx-2 opacity-50">&bull;</span> {welcomeMarqueeText} <span className="mx-2 opacity-50">&bull;</span>
            </h1>
          </div>

          {/* Line 2: BRIMAS PRADIKA UTAMA Marquee (Moving Reverse) */}
          <div className="animate-welcome-marquee-reverse flex gap-4 whitespace-nowrap">
            <h1 className={`font-display text-[13vw] sm:text-[15vw] font-black uppercase tracking-tighter leading-none transition-colors ${
              isNight ? "text-[#20271C]" : "text-[#bcbcb9]/30"
            }`}>
              BRIMAS PRADIKA UTAMA <span className="mx-2 opacity-50">&bull;</span> BRIMAS PRADIKA UTAMA <span className="mx-2 opacity-50">&bull;</span>
            </h1>
            <h1 className={`font-display text-[13vw] sm:text-[15vw] font-black uppercase tracking-tighter leading-none transition-colors ${
              isNight ? "text-[#20271C]" : "text-[#bcbcb9]/30"
            }`}>
              BRIMAS PRADIKA UTAMA <span className="mx-2 opacity-50">&bull;</span> BRIMAS PRADIKA UTAMA <span className="mx-2 opacity-50">&bull;</span>
            </h1>
          </div>
        </div>

        {/* Hero Content Overlay Grid */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full flex-1 flex flex-col justify-between pt-6 pb-12">
          
          {/* Top Right Bio Teaser */}
          <div className="flex justify-end pt-2">
            <div className="max-w-xs text-right text-xs text-white/90 leading-relaxed space-y-1 drop-shadow">
              <p>I am a travel blogger based in Indonesia, specializing in backpacking, hiking, and photography. <a href="#about" className="font-bold underline hover:text-[#F5B301] transition-colors">Learn more here.</a></p>
            </div>
          </div>

          {/* Main Hero Center Container */}
          <div className="relative w-full flex items-center justify-center min-h-[55vh] my-auto">
            
            {/* Centerpiece Grayscale Portrait Photo */}
            <div className="relative z-10 w-72 h-96 sm:w-96 sm:h-[480px] md:w-[420px] md:h-[520px] max-w-full flex items-end justify-center pointer-events-none">
              <Image
                src={ownerAvatar}
                alt={ownerName}
                fill
                priority
                sizes="(max-width: 768px) 360px, 450px"
                className="object-contain object-bottom filter grayscale contrast-110 drop-shadow-2xl"
              />
            </div>

            {/* Left Overlapping Headline & CTAs */}
            <div className="absolute left-0 bottom-6 sm:bottom-12 z-20 space-y-4 max-w-md text-left text-white drop-shadow-md">
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none">
                I&apos;M {ownerName}
              </h1>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-sans max-w-xs sm:max-w-sm">
                I create travel guides and backpacking itineraries from around the world, as well as sharing photography resources and more.
              </p>

              {/* Two CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#projects"
                  onClick={() => soundFx.playClick()}
                  className="px-6 py-2.5 rounded-full bg-[#F5B301] hover:bg-[#E0A200] text-black font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.03] cursor-pointer inline-flex items-center gap-2 shadow-lg"
                >
                  <span>READ MY BLOG</span>
                </a>

                <a
                  href="#vlog"
                  onClick={() => soundFx.playClick()}
                  className="px-6 py-2.5 rounded-full border border-white text-white font-bold text-xs uppercase tracking-wider transition-all hover:bg-white hover:text-black cursor-pointer inline-flex items-center gap-2 shadow-lg"
                >
                  <span>WATCH MY VIDEOS</span>
                </a>
              </div>
            </div>

            {/* Right Overlapping Simple Video Card Accent (Opsi B) */}
            <div className="absolute right-0 bottom-6 sm:bottom-12 z-20 hidden sm:flex flex-col items-end">
              
              <div className={`rounded-2xl p-3 shadow-2xl space-y-2.5 w-48 sm:w-56 group border transition-colors ${
                isNight ? "bg-[#1A211A] border-[#2A2F26] text-white" : "bg-white border-black/10 text-black"
              }`}>
                {/* Thumbnail: Warna solid/gradient gelap polos + tombol play kuning bulat */}
                <div className="relative w-full h-28 rounded-xl overflow-hidden bg-gradient-to-br from-[#2F362B] via-[#1E241A] to-[#12160F] flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300">
                  <div className="w-9 h-9 rounded-full bg-[#F5B301] text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                  {/* Judul SUMATRA di Kiri Bawah Thumbnail (Font Simple) */}
                  <div className="absolute bottom-2 left-2 font-display text-[10px] font-bold text-white tracking-widest uppercase bg-black/60 px-1.5 py-0.5 rounded">
                    SUMATRA
                  </div>
                </div>

                {/* Label Based in Indonesia + Pin Icon DI DALAM PADDING CARD */}
                <div className="flex items-center gap-1.5 text-[11px] font-mono opacity-85 pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#F5B301] shrink-0" />
                  <span className="truncate">Based in Indonesia</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Slanted White Slope Divider */}
        <div className="relative w-full h-16 sm:h-24 overflow-hidden z-20 pointer-events-none -mb-1">
          <svg
            className={`absolute bottom-0 w-full h-full fill-current transition-colors duration-300 ${
              isNight ? "text-[#12160F]" : "text-[#ffffff]"
            }`}
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path d="M0,40 L1200,120 L0,120 Z" />
          </svg>
        </div>

      </section>

      {/* 3. SECTION "WHERE DO YOU WANT TO GO?" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-center">
        
        <div className="flex items-center justify-center gap-4">
          <div className="h-px bg-current opacity-20 flex-1 max-w-xs" />
          <h2 className="text-xs font-bold uppercase tracking-widest font-mono text-[#1A1A1A] dark:text-[#F1EFE9]">
            WHERE DO YOU WANT TO GO?
          </h2>
          <div className="h-px bg-current opacity-20 flex-1 max-w-xs" />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-4 items-center justify-items-center">
          {[
            { label: "THAILAND", code: "TH" },
            { label: "ITALY", code: "IT" },
            { label: "ICELAND", code: "IS" },
            { label: "ALBANIA", code: "AL" },
            { label: "SOUTHEAST ASIA", code: "SEA" },
            { label: "EUROPE", code: "EU" },
            { label: "SOUTH AMERICA", code: "SA" },
            { label: "CENTRAL ASIA", code: "CA" },
          ].map((dest) => (
            <a
              key={dest.label}
              href="#projects"
              onClick={() => soundFx.playClick()}
              className="flex flex-col items-center gap-2 group cursor-pointer p-2 transition-transform hover:scale-105"
            >
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xs font-mono font-bold transition-colors ${
                isNight
                  ? "bg-[#1A211A] border-[#2A2F26] group-hover:border-[#F5B301] group-hover:text-[#F5B301]"
                  : "bg-[#F7F7F5] border-[#E2E2DF] group-hover:border-[#F5B301] group-hover:text-[#F5B301]"
              }`}>
                {dest.code}
              </div>
              <span className="text-[10px] font-bold tracking-wider text-center group-hover:text-[#F5B301] transition-colors">
                {dest.label}
              </span>
            </a>
          ))}

          <a
            href="#projects"
            onClick={() => soundFx.playClick()}
            className="flex flex-col items-center gap-2 group cursor-pointer p-2 transition-transform hover:scale-105"
          >
            <div className="w-12 h-12 rounded-xl border bg-[#F5B301] border-[#F5B301] text-black flex items-center justify-center">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <span className="text-[10px] font-bold tracking-wider text-center group-hover:text-[#F5B301] transition-colors">
              EXPLORE MORE
            </span>
          </a>
        </div>

      </section>

      {/* 4. SECTION "DISCOVER THE WORLD" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-b border-current/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 flex justify-center items-center">
            <div className="relative w-full max-w-lg aspect-[16/9] flex items-center justify-center p-4">
              <svg
                viewBox="0 0 1000 500"
                className="w-full h-full text-[#F5B301] fill-current opacity-85 hover:opacity-100 transition-opacity"
              >
                <path d="M150 120 Q180 100 250 110 T300 200 T220 280 T140 200 Z" />
                <path d="M220 300 Q260 290 310 330 T280 440 T210 380 Z" />
                <path d="M450 100 Q520 80 580 120 T540 220 T460 180 Z" />
                <path d="M460 230 Q530 220 590 280 T550 420 T480 340 Z" />
                <path d="M600 90 Q720 70 850 100 T900 240 T700 220 Z" />
                <path d="M800 320 Q860 300 910 350 T880 430 T810 390 Z" />
              </svg>

              {[
                { x: "25%", y: "30%", title: "North America" },
                { x: "48%", y: "25%", title: "Europe" },
                { x: "72%", y: "40%", title: "Asia" },
                { x: "78%", y: "70%", title: "Indonesia" },
              ].map((pin, i) => (
                <div
                  key={i}
                  className="absolute z-10 flex flex-col items-center group cursor-pointer"
                  style={{ left: pin.x, top: pin.y }}
                >
                  <MapPin className="w-5 h-5 text-[#F5B301] fill-[#F5B301] animate-bounce" />
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono bg-black text-white px-1.5 py-0.5 rounded shadow-md pointer-events-none">
                    {pin.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="space-y-3">
              <h2 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none">
                DISCOVER THE <span className="text-[#F5B301]">WORLD</span>
              </h2>
              <p className="text-sm sm:text-base opacity-80 leading-relaxed font-sans max-w-lg">
                We have written over 600+ travel guides and backpacking itineraries to provide all the information you need to plan your dream trip around the world.
              </p>
            </div>

            <div>
              <a
                href="#projects"
                onClick={() => soundFx.playClick()}
                className={`px-6 py-3 rounded-full border font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.03] cursor-pointer inline-flex items-center gap-2 ${
                  isNight
                    ? "border-white text-white hover:bg-[#F5B301] hover:border-[#F5B301] hover:text-black"
                    : "border-black text-black hover:bg-[#F5B301] hover:border-[#F5B301] hover:text-black"
                }`}
              >
                <span>Explore Destinations</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-20 right-6 z-50 px-4 py-2.5 rounded-lg bg-[#F5B301] text-black font-bold text-xs font-mono shadow-xl">
          {toastMsg}
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 text-xs opacity-75 text-left border-t border-current/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} BucketListly Blog. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#hero" className="hover:text-[#F5B301] transition-colors">Home</a>
            <a href="#projects" className="hover:text-[#F5B301] transition-colors">Destinations</a>
            <a href="#contact" className="hover:text-[#F5B301] transition-colors">About</a>
          </div>
        </div>
      </footer>

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

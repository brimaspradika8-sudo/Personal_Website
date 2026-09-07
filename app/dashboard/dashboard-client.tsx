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
  Compass,
  MapPin,
  Globe2,
  Camera,
  BookOpen,
  Video,
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

  const ownerName = "BRIMAS.";
  const ownerAvatar = "/images/avatar.webp";

  const navUserName =
    dbUser?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Guest User";

  const initialLetter = navUserName && navUserName !== "Guest User" ? navUserName.charAt(0).toUpperCase() : "G";
  const isNight = mode === "night";

  return (
    <div className={`min-h-screen font-sans antialiased text-left selection:bg-[#F5B301] selection:text-black transition-colors duration-300 ${
      isNight ? "bg-[#12160F] text-[#F1EFE9]" : "bg-[#F7F7F5] text-[#1A1A1A]"
    }`}>
      
      {/* 1. TOP NAVIGATION HEADER */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${
        isNight ? "bg-[#12160F]/90 border-[#2A2F26]" : "bg-[#F7F7F5]/90 border-[#E2E2DF]"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo (Icon Bulat Kuning + Blog Name) */}
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <div className="w-8 h-8 rounded-full bg-[#F5B301] flex items-center justify-center text-black font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
              B
            </div>
            <span className="font-bold tracking-tight text-base font-sans">
              BucketListly <span className="font-normal opacity-70">Blog</span>
            </span>
          </Link>

          {/* Search Bar Center */}
          <div className="hidden md:flex items-center flex-1 max-w-xs relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the blog..."
              className={`w-full py-1.5 pl-8 pr-3 text-xs rounded-full border transition-all outline-none ${
                isNight
                  ? "bg-[#1A211A] border-[#2A2F26] text-[#F1EFE9] focus:border-[#F5B301]"
                  : "bg-white border-[#E2E2DF] text-[#1A1A1A] focus:border-[#F5B301]"
              }`}
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 text-[#A8A79C]" />
          </div>

          {/* Navigation Menu Items */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium tracking-wide">
            {["Planning", "Destinations", "About", "Vlog", "Inspiration", "Resources", "Shop"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => soundFx.playClick()}
                className={`transition-colors hover:text-[#F5B301] ${
                  item === "Shop" ? "flex items-center gap-1 text-[#F5B301] font-bold" : ""
                }`}
              >
                {item}
                {item === "Shop" && <span className="w-1.5 h-1.5 rounded-full bg-[#F5B301] animate-ping" />}
              </a>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Shopping Bag Icon */}
            <button
              type="button"
              onClick={() => showToast(lang === "id" ? "Shop dibuka" : "Shop Opened")}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>

            {/* Language Toggle */}
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                toggleLang();
              }}
              className="px-2 py-0.5 rounded-md border text-[11px] font-mono transition-colors cursor-pointer"
            >
              {lang.toUpperCase()}
            </button>

            {/* Sound FX Toggle */}
            <button
              type="button"
              onClick={() => {
                const next = soundFx.toggleMute();
                setSfxEnabled(next);
                showToast(next ? (lang === "id" ? "Suara Aktif" : "Sound Enabled") : (lang === "id" ? "Suara Senyap" : "Sound Muted"));
              }}
              className="p-1.5 rounded-md border text-[#A8A79C] hover:text-[#F5B301] transition-colors cursor-pointer"
              title={sfxEnabled ? "Mute Sound FX" : "Enable Sound FX"}
            >
              {sfxEnabled ? <Volume2 className="w-4 h-4 text-[#F5B301]" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Day / Night Theme Toggle */}
            <button
              type="button"
              onClick={handleToggleMode}
              aria-label={isNight ? "Switch to Day Mode" : "Switch to Night Mode"}
              className="p-1.5 rounded-md border transition-colors cursor-pointer"
            >
              {isNight ? <Moon className="w-4 h-4 text-[#F5B301]" /> : <Sun className="w-4 h-4 text-[#F5B301]" />}
            </button>

            {/* User Profile Badge */}
            <Link
              href="/profile"
              onClick={() => soundFx.playClick()}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F5B301] text-black font-bold text-xs shadow-sm hover:scale-105 transition-transform"
              title={user ? `Profil (${navUserName})` : "Profil"}
            >
              {user ? initialLetter : <User className="w-4 h-4 text-black" />}
            </Link>

          </div>

        </div>
      </header>

      {/* 2. HERO SECTION (BucketListly Travel Editorial Style) */}
      <section id="hero" className={`relative pt-8 pb-16 overflow-hidden transition-colors duration-300 ${
        isNight ? "bg-[#161B13]" : "bg-[#EAEAE7]"
      }`}>
        
        {/* Giant Translucent Backdrop Display Typography ("WELCOME") */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.12] sm:opacity-[0.16] z-0">
          <h1 className="font-display text-[22vw] font-black uppercase tracking-tighter text-current whitespace-nowrap leading-none">
            WELCOME
          </h1>
        </div>

        {/* Hero Grid Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4 sm:pt-8">
          
          {/* Left Column: Headline, Bio, & CTAs */}
          <div className="lg:col-span-5 space-y-6 text-left order-2 lg:order-1">
            
            <div className="space-y-2">
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none">
                I&apos;M {ownerName}
              </h1>
              <p className="text-sm sm:text-base opacity-80 leading-relaxed font-sans max-w-md pt-2">
                I create travel guides, backpacking itineraries, and software architecture systems from around the world, as well as sharing photography resources and more.
              </p>
            </div>

            {/* Two Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              
              {/* Primary Solid Yellow Button */}
              <a
                href="#projects"
                onClick={() => soundFx.playClick()}
                className="px-6 py-3 rounded-full bg-[#F5B301] hover:bg-[#E0A200] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg hover:scale-[1.03] cursor-pointer inline-flex items-center gap-2"
              >
                <span>Read My Blog</span>
              </a>

              {/* Secondary Outline White/Dark Button */}
              <a
                href="#vlog"
                onClick={() => soundFx.playClick()}
                className={`px-6 py-3 rounded-full border font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.03] cursor-pointer inline-flex items-center gap-2 ${
                  isNight
                    ? "border-white text-white hover:bg-white hover:text-black"
                    : "border-black text-black hover:bg-black hover:text-white"
                }`}
              >
                <span>Watch My Videos</span>
              </a>

            </div>

          </div>

          {/* Center Column: Grayscale Centerpiece Avatar with 3D Tilt & Hair Bounce */}
          <div className="lg:col-span-4 flex justify-center items-center order-1 lg:order-2">
            <InteractiveCharacter avatarSrc={ownerAvatar} name={ownerName} />
          </div>

          {/* Right Column: Floating Video Thumbnail Card & Location Badge */}
          <div className="lg:col-span-3 space-y-4 order-3 flex flex-col items-start lg:items-end">
            
            {/* Top Supporting Bio Teaser */}
            <div className="hidden lg:block text-right max-w-xs text-xs opacity-75 leading-relaxed space-y-1">
              <p>I am a travel blogger based in Indonesia, specializing in backpacking, system architecture, and photography.</p>
              <a href="#about" className="font-bold underline hover:text-[#F5B301] transition-colors">
                Learn more here
              </a>
            </div>

            {/* Floating Video Card */}
            <div className={`w-full max-w-xs rounded-2xl border p-3 shadow-xl space-y-3 relative group overflow-hidden transition-transform duration-300 hover:scale-[1.02] ${
              isNight ? "bg-[#1A211A] border-[#2A2F26]" : "bg-white border-[#E2E2DF]"
            }`}>
              
              <div className="flex items-center justify-between text-[11px] font-mono text-[#A8A79C]">
                <span className="uppercase tracking-wider">Latest Video</span>
                <span className="flex items-center gap-1 text-[#F5B301] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F5B301] animate-ping" />
                  4K
                </span>
              </div>

              {/* Video Thumbnail */}
              <div className="relative w-full h-32 rounded-xl overflow-hidden bg-black group">
                <Image
                  src="/images/project1.png"
                  alt="Sumatra Travel Video"
                  fill
                  sizes="260px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#F5B301] text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 font-display text-sm font-bold text-white tracking-widest uppercase bg-black/60 px-2 py-0.5 rounded">
                  SUMATRA
                </div>
              </div>

              {/* Location Badge */}
              <div className="flex items-center justify-between pt-1 text-[11px]">
                <div className="flex items-center gap-1.5 opacity-80 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-[#F5B301]" />
                  <span>Based in Indonesia</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Slanted Angle Slope Divider */}
        <div className="relative w-full h-12 sm:h-16 overflow-hidden mt-12 z-10 pointer-events-none">
          <svg
            className={`absolute bottom-0 w-full h-full fill-current transition-colors duration-300 ${
              isNight ? "text-[#12160F]" : "text-[#F7F7F5]"
            }`}
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path d="M0,0 L1200,80 L1200,120 L0,120 Z" />
          </svg>
        </div>

      </section>

      {/* 3. SECTION "WHERE DO YOU WANT TO GO?" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-center">
        
        {/* Header with Decorative Horizontal Lines */}
        <div className="flex items-center justify-center gap-4">
          <div className="h-px bg-current opacity-20 flex-1 max-w-xs" />
          <h2 className="text-xs font-bold uppercase tracking-widest font-mono">
            WHERE DO YOU WANT TO GO?
          </h2>
          <div className="h-px bg-current opacity-20 flex-1 max-w-xs" />
        </div>

        {/* Country Outline Icons Row */}
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
              {/* Outline Country Map Silhouette Badge */}
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xs font-mono font-bold transition-colors ${
                isNight
                  ? "bg-[#1A211A] border-[#2A2F26] group-hover:border-[#F5B301] group-hover:text-[#F5B301]"
                  : "bg-white border-[#E2E2DF] group-hover:border-[#F5B301] group-hover:text-[#F5B301]"
              }`}>
                {dest.code}
              </div>
              <span className="text-[10px] font-bold tracking-wider text-center group-hover:text-[#F5B301] transition-colors">
                {dest.label}
              </span>
            </a>
          ))}

          {/* Explore More Arrow */}
          <a
            href="#projects"
            onClick={() => soundFx.playClick()}
            className="flex flex-col items-center gap-2 group cursor-pointer p-2 transition-transform hover:scale-105"
          >
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${
              isNight
                ? "bg-[#F5B301] border-[#F5B301] text-black"
                : "bg-[#F5B301] border-[#F5B301] text-black"
            }`}>
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
          
          {/* Left Column: Flat Silhouette World Map with Gold Pins */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <div className="relative w-full max-w-lg aspect-[16/9] flex items-center justify-center p-4">
              
              {/* World Map SVG Illustration */}
              <svg
                viewBox="0 0 1000 500"
                className="w-full h-full text-[#F5B301] fill-current opacity-85 hover:opacity-100 transition-opacity"
              >
                {/* Simplified Continents Silhouette Paths */}
                <path d="M150 120 Q180 100 250 110 T300 200 T220 280 T140 200 Z" />
                <path d="M220 300 Q260 290 310 330 T280 440 T210 380 Z" />
                <path d="M450 100 Q520 80 580 120 T540 220 T460 180 Z" />
                <path d="M460 230 Q530 220 590 280 T550 420 T480 340 Z" />
                <path d="M600 90 Q720 70 850 100 T900 240 T700 220 Z" />
                <path d="M800 320 Q860 300 910 350 T880 430 T810 390 Z" />
              </svg>

              {/* Gold Location Pins */}
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

          {/* Right Column: Title, Description, & CTA */}
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

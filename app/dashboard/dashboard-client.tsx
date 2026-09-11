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
  ShieldCheck,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import MobileBottomNav from "@/components/MobileBottomNav";
import { soundFx } from "@/lib/audio/sound";
import CommandPalette from "@/components/CommandPalette";
import ProjectModal, { ProjectData } from "@/components/ProjectModal";
import TechStackMatrix from "@/components/TechStackMatrix";
import ProjectShowcase from "@/components/ProjectShowcase";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import ScrollReveal from "@/components/ScrollReveal";

const Lanyard = dynamic(() => import("@/components/Lanyard"), {
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
    role?: string | null;
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
  /** Ditentukan di Server Component berdasarkan role dari database — tidak bisa di-bypass dari client */
  isAdmin?: boolean;
}

const GREETINGS = [
  "Halo",
  "Hello",
  "こんにちは",
  "안녕하세요",
  "你好",
  "Bonjour",
  "Hola",
  "Ciao",
  "Hallo",
  "Olá",
  "Привет",
  "مرحبا",
  "नमस्ते",
  "Merhaba",
  "Γεια σου",
];

export default function DashboardClient({ user, dbUser, dbProjects, isAdmin = false }: DashboardClientProps) {
  const { lang, toggleLang } = useLanguage();
  const [mode, setMode] = useState<"day" | "night">("day");
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [greetingIndex, setGreetingIndex] = useState(0);

  const showToast = (msg: string) => {
    soundFx.playClick();
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % GREETINGS.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

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

  // Avatar & Nama user aktif yang sedang login (identik dengan halaman /profile)
  const userAvatarSrc = dbUser?.avatar || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "";
  const userDisplayName =
    dbUser?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  // Brand identity statis pemilik situs (Brimas Pradika Utama)
  const displayName = "Brimas Pradika Utama";
  const avatarSrc = "/images/avatar.webp";

  // Teks marquee sapaan dinamis (Line 1 marquee Hero)
  const isLoggedIn = !!user;
  const activeUserName = (
    dbUser?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    (user?.email ? user.email.split("@")[0] : "")
  ).toUpperCase();

  const greetingPrefix = lang === "en" ? "HELLO," : "HALO,";
  const defaultGuestName = lang === "en" ? "VISITOR" : "PENGUNJUNG";

  const welcomeMarqueeText = isLoggedIn && activeUserName
    ? `${greetingPrefix} ${activeUserName}`
    : `${greetingPrefix} ${defaultGuestName}`;

  const initialLetter = displayName ? displayName.charAt(0).toUpperCase() : "G";
  const isNight = mode === "night";

  const [heroMousePos, setHeroMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMoveHero = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setHeroMousePos({ x, y });
  };

  const handleToggleSfx = () => {
    const next = soundFx.toggleMute();
    setSfxEnabled(next);
    showToast(next ? (lang === "id" ? "Suara Aktif" : "Sound Enabled") : (lang === "id" ? "Suara Senyap" : "Sound Muted"));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.15,
      }}
      className={`min-h-screen font-sans antialiased text-left selection:bg-[#DC2626] selection:text-white transition-colors duration-300 pb-20 md:pb-0 ${isNight ? "bg-[#0A0A0B] text-[#FAF9F6]" : "bg-[#FAF9F6] text-[#1A1A1A]"
        }`}
    >
      {/* 1. TOP NAVIGATION HEADER (FLOATING CAPSULE NAVBAR) */}
      <header className="sticky top-4 z-50 max-w-5xl mx-auto px-4 sm:px-6 w-full pointer-events-auto">
        <div className={`h-14 px-5 sm:px-6 rounded-full border backdrop-blur-xl flex items-center justify-between gap-4 transition-all duration-300 ${
          isNight
            ? "bg-black/40 border-white/15 shadow-2xl shadow-black/60 text-white"
            : "bg-white/60 border-slate-300/80 shadow-lg text-slate-900"
        }`}>

          {/* Logo (Icon Bulat Merah Spider-Man + Personal Brand Name) */}
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#B91C1C] to-[#DC2626] flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-[#DC2626]/40 group-hover:scale-105 transition-transform border border-white/20">
              B
            </div>
            <span className="font-bold tracking-tight text-sm font-sans">
              Brimas <span className="font-normal opacity-70">Pradika</span>
            </span>
          </Link>

          {/* Navigation Menu Items */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold tracking-wider uppercase opacity-90">
            {[
              { label: lang === "id" ? "Beranda" : "Home", href: "#hero" },
              { label: lang === "id" ? "Tentang" : "About", href: "#about" },
              { label: lang === "id" ? "Proyek" : "Projects", href: "#projects" },
              { label: lang === "id" ? "Artikel" : "Blog", href: "/posts" },
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
          </nav>

          {/* Right Action Icons & Profile Avatar */}
          <div className="flex items-center gap-3 shrink-0">

            {/* Language & Sound Toggles */}
            <button
              onClick={() => {
                soundFx.playClick();
                toggleLang();
              }}
              className={`p-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border px-2.5 ${
                isNight ? "border-white/10 hover:bg-white/10" : "border-black/10 hover:bg-black/5"
              }`}
              title="Ganti Bahasa / Switch Language"
            >
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* Admin Hub Link (Hanya untuk Admin) */}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => soundFx.playClick()}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:from-[#B91C1C] hover:to-[#991B1B] text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-[#DC2626]/30 border border-white/20 hover:scale-105"
                title="Admin Hub"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Hub</span>
              </Link>
            )}

            {/* Profile Avatar / Login Action Button */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  prefetch={false}
                  onClick={() => soundFx.playClick()}
                  className="relative w-8 h-8 rounded-full overflow-hidden border border-[#DC2626] shrink-0 flex items-center justify-center font-bold text-xs transition-transform hover:scale-105 bg-[#DC2626] text-white shadow-lg shadow-[#DC2626]/30"
                  title={lang === "id" ? "Buka Profil Saya" : "Open My Profile"}
                >
                  {userAvatarSrc ? (
                    <Image
                      src={userAvatarSrc}
                      alt={userDisplayName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span>{(userDisplayName || "U").charAt(0).toUpperCase()}</span>
                  )}
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => {
                  try {
                    soundFx.playClick();
                  } catch { }
                }}
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:from-[#B91C1C] hover:to-[#991B1B] text-white text-xs font-bold transition-all hover:scale-105 shadow-md shadow-[#DC2626]/30 border border-white/20 relative z-10 cursor-pointer inline-flex items-center justify-center"
              >
                {lang === "id" ? "Masuk Akun" : "Sign In"}
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section
        id="hero"
        onMouseMove={handleMouseMoveHero}
        className={`relative min-h-[88vh] lg:min-h-[94vh] flex flex-col justify-between overflow-hidden transition-colors duration-500 pt-12 sm:pt-16 md:pt-20 ${isNight ? "bg-[#0D0D0E]" : "bg-gradient-to-b from-[#F3F4F6] via-[#E5E7EB] to-[#FAF9F6]"
          }`}
      >
        {/* Giant Moving Backdrop Typography Watermark */}
        <div className="absolute top-12 sm:top-16 inset-x-0 flex flex-col pointer-events-none select-none overflow-hidden z-0 pt-1 -space-y-4 sm:-space-y-8">
          {/* Line 1: Dynamic WELCOME Marquee */}
          <div
            className="animate-welcome-marquee flex gap-4 whitespace-nowrap will-change-transform"
            style={{ animation: "welcomeMarquee 28s linear infinite" }}
          >
            <h1 className={`font-display text-[22vw] sm:text-[24vw] font-black uppercase tracking-tighter leading-none transition-colors ${isNight ? "text-white/[0.05]" : "text-black/[0.06]"
              }`}>
              {welcomeMarqueeText} <span className="mx-2 opacity-50">&bull;</span> {welcomeMarqueeText} <span className="mx-2 opacity-50">&bull;</span>
            </h1>
            <h1 className={`font-display text-[22vw] sm:text-[24vw] font-black uppercase tracking-tighter leading-none transition-colors ${isNight ? "text-white/[0.05]" : "text-black/[0.06]"
              }`}>
              {welcomeMarqueeText} <span className="mx-2 opacity-50">&bull;</span> {welcomeMarqueeText} <span className="mx-2 opacity-50">&bull;</span>
            </h1>
          </div>

          {/* Line 2: BRIMAS PRADIKA UTAMA Marquee (Moving Reverse) */}
          <div
            className="animate-welcome-marquee-reverse flex gap-4 whitespace-nowrap will-change-transform"
            style={{ animation: "welcomeMarqueeReverse 34s linear infinite" }}
          >
            <h1 className={`font-display text-[16vw] sm:text-[18vw] font-black uppercase tracking-tighter leading-none transition-colors ${isNight ? "text-white/[0.04]" : "text-black/[0.05]"
              }`}>
              BRIMAS PRADIKA UTAMA <span className="mx-2 opacity-50">&bull;</span> BRIMAS PRADIKA UTAMA <span className="mx-2 opacity-50">&bull;</span>
            </h1>
            <h1 className={`font-display text-[16vw] sm:text-[18vw] font-black uppercase tracking-tighter leading-none transition-colors ${isNight ? "text-white/[0.04]" : "text-black/[0.05]"
              }`}>
              BRIMAS PRADIKA UTAMA <span className="mx-2 opacity-50">&bull;</span> BRIMAS PRADIKA UTAMA <span className="mx-2 opacity-50">&bull;</span>
            </h1>
          </div>
        </div>

        {/* Hero Content Overlay Grid */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 w-full flex-1 flex flex-col justify-between pt-6 sm:pt-10 pb-12 sm:pb-16">

          {/* Main Hero Center Container */}
          <div className="relative w-full flex flex-col sm:flex-row items-center justify-between min-h-[50vh] sm:min-h-[55vh] my-auto gap-6 sm:gap-0">

            {/* Centerpiece Portrait Photo (z-20) seamlessly blending with background */}
            <div className="hero-photo-wrapper relative z-20 order-2 shrink-0 w-[270px] h-[360px] sm:w-[380px] sm:h-[480px] md:w-[420px] md:h-[530px] max-w-full flex items-center justify-center pointer-events-auto">

              {/* Hero Portrait Photo (Seamless Radial Edge Feather Masking) */}
              <div
                className="relative w-full h-full overflow-hidden pointer-events-none"
                style={{
                  maskImage: "radial-gradient(ellipse 75% 82% at center, black 55%, transparent 98%)",
                  WebkitMaskImage: "radial-gradient(ellipse 75% 82% at center, black 55%, transparent 98%)",
                }}
              >
                <Image
                  src="/images/avatar.webp"
                  alt="Brimas Pradika Utama"
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 768px) 380px, 460px"
                  className="object-cover object-center w-full h-full pointer-events-none filter brightness-[1.05] contrast-[1.08]"
                />
              </div>
            </div>

            {/* Desktop Headline & CTAs */}
            <div className="hidden sm:flex flex-col order-1 z-20 space-y-4 max-w-2xl text-left drop-shadow-md">
              {/* Animated Multilingual Greeting Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DC2626]/10 border border-[#DC2626]/30 text-[#DC2626] font-mono text-xs font-bold tracking-wider uppercase shadow-sm backdrop-blur-md w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DC2626] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DC2626]"></span>
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={GREETINGS[greetingIndex]}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block"
                  >
                    {GREETINGS[greetingIndex]} 👋
                  </motion.span>
                </AnimatePresence>
              </div>

              <h1 className="font-display text-4xl lg:text-6xl font-black uppercase tracking-tight leading-[0.95]">
                <span className="whitespace-nowrap">{lang === "id" ? "SAYA BRIMAS PRADIKA" : "I'M BRIMAS PRADIKA"}</span>
                <br />
                <span className="text-[#DC2626]">UTAMA</span>
              </h1>
              <p className={`text-sm sm:text-base leading-relaxed font-sans max-w-md font-medium ${isNight ? "text-white/80" : "text-slate-700"}`}>
                {lang === "id"
                  ? "Pengembang Perangkat Lunak & Sistem AI yang berfokus pada arsitektur web modern, eksperimen teknologi interaktif, serta solusi digital performa tinggi."
                  : "Software & AI Systems Developer focused on modern web architecture, interactive tech experiments, and high-performance digital solutions."}
              </p>

              {/* Two CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <a
                  href="#projects"
                  onClick={() => soundFx.playClick()}
                  className="px-7 py-3 rounded-full bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:from-[#B91C1C] hover:to-[#991B1B] text-white font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.03] cursor-pointer inline-flex items-center gap-2 shadow-xl shadow-[#DC2626]/30 border border-white/20"
                >
                  <span>{lang === "id" ? "JELAJAH PROYEK" : "EXPLORE PROJECTS"}</span>
                </a>

                <a
                  href="#about"
                  onClick={() => soundFx.playClick()}
                  className={`px-7 py-3 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer inline-flex items-center gap-2 shadow-md hover:scale-[1.03] ${
                    isNight
                      ? "border-white/25 text-white hover:bg-white hover:text-black hover:border-white"
                      : "border-black/30 text-black hover:bg-black hover:text-white hover:border-black"
                  }`}
                >
                  <span>{lang === "id" ? "TENTANG SAYA" : "ABOUT ME"}</span>
                </a>
              </div>
            </div>

            {/* Mobile Headline & CTAs (Stacked Cleanly Below Photo) */}
            <div className="sm:hidden w-full z-20 space-y-4 text-center px-2 pt-2 pb-4 flex flex-col items-center">
              {/* Animated Multilingual Greeting Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DC2626]/10 border border-[#DC2626]/30 text-[#DC2626] font-mono text-xs font-bold tracking-wider uppercase shadow-sm backdrop-blur-md w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DC2626] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DC2626]"></span>
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={GREETINGS[greetingIndex]}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block"
                  >
                    {GREETINGS[greetingIndex]} 👋
                  </motion.span>
                </AnimatePresence>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none drop-shadow-md">
                <span className="whitespace-nowrap">{lang === "id" ? "SAYA BRIMAS PRADIKA" : "I'M BRIMAS PRADIKA"}</span>
                <br />
                <span className="text-[#DC2626]">UTAMA</span>
              </h1>
              <p className={`text-sm leading-relaxed font-sans max-w-xs mx-auto font-medium ${isNight ? "text-white/80" : "text-slate-700"}`}>
                {lang === "id"
                  ? "Pengembang Perangkat Lunak & Sistem AI yang berfokus pada arsitektur web modern, eksperimen interaktif, serta solusi digital performa tinggi."
                  : "Software & AI Systems Developer focused on modern web architecture, interactive tech experiments, and high-performance digital solutions."}
              </p>

              {/* Two Mobile CTA Buttons */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <a
                  href="#projects"
                  onClick={() => soundFx.playClick()}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:from-[#B91C1C] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#DC2626]/30 hover:scale-105 transition-transform border border-white/20"
                >
                  {lang === "id" ? "PROYEK" : "PROJECTS"}
                </a>

                <a
                  href="#about"
                  onClick={() => soundFx.playClick()}
                  className={`px-6 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider shadow-md transition-all duration-200 ${
                    isNight
                      ? "border-white/30 text-white hover:bg-white hover:text-black"
                      : "border-black/30 text-black hover:bg-black hover:text-white"
                  }`}
                >
                  {lang === "id" ? "TENTANG SAYA" : "ABOUT ME"}
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Ultra-Smooth Organic SVG Wave Divider */}
        <div className="absolute -bottom-[1px] left-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
          <svg
            className={`w-full h-12 sm:h-20 md:h-24 block fill-current transition-colors duration-300 ${isNight ? "text-[#12160F]" : "text-[#ffffff]"
              }`}
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path d="M0,64 C480,112 960,16 1440,64 L1440,120 L0,120 Z" />
          </svg>
        </div>

      </section>



      {/* 4. SECTION "ABOUT ME" WITH STAGGERED SCROLL ANIMATIONS */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-b border-current/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Interactive 3D Physics Lanyard Photo Card */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <ScrollReveal direction="right" delayMs={100} durationMs={800} className="w-full flex justify-center">
              <div className="relative w-full max-w-md h-[520px] sm:h-[580px] flex items-center justify-center overflow-visible">
                <Lanyard />
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: About Me Bio & Details */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <ScrollReveal direction="up" delayMs={200} durationMs={700}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DC2626]/15 text-[#DC2626] text-xs font-mono font-bold tracking-widest uppercase">
                <User className="w-3.5 h-3.5" />
                <span>ABOUT ME</span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delayMs={250} durationMs={700}>
              <div className="space-y-3">
                <h2 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none">
                  BRIMAS PRADIKA UTAMA
                </h2>
                <p className="text-xs sm:text-sm font-mono tracking-wide opacity-80 uppercase text-[#DC2626]">
                  AI Systems Developer • SMK Bhakti Mulia Pare
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delayMs={350} durationMs={700}>
              <p className="text-sm sm:text-base opacity-90 leading-relaxed font-sans max-w-xl">
                {lang === "id"
                  ? "Siswa SMK Bhakti Mulia Pare yang aktif membangun aplikasi berbasis kecerdasan buatan & sistem AI secara profesional. Berfokus pada AI Systems Development, LLM Integration, React, Next.js, Python, Supabase, dan Cloud Systems. Bagi saya, coding bukan sekadar menulis sintaks, tapi bagaimana membangun sistem pintar yang rapi, scalable, dan maintainable."
                  : "Student at SMK Bhakti Mulia Pare actively building AI-powered applications & intelligent systems. Specialized in AI Systems Development, LLM Integration, React, Next.js, Python, Supabase, and Cloud Systems. Focused on writing clean, scalable, and maintainable intelligent systems."}
              </p>
            </ScrollReveal>

            {/* Feature Badges Grid */}
            <ScrollReveal direction="zoom" delayMs={450} durationMs={700}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className={`p-3 rounded-xl border space-y-1 transition-colors ${isNight ? "bg-[#1A211A] border-[#2A2F26]" : "bg-[#F8F8F6] border-[#E5E5E2]"
                  }`}>
                  <div className="flex items-center gap-1.5 text-[#DC2626]">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-mono font-bold uppercase">SCHOOL</span>
                  </div>
                  <p className="text-xs font-bold truncate">SMK Bhakti Mulia Pare</p>
                </div>

                <div className={`p-3 rounded-xl border space-y-1 transition-colors ${isNight ? "bg-[#1A211A] border-[#2A2F26]" : "bg-[#F8F8F6] border-[#E5E5E2]"
                  }`}>
                  <div className="flex items-center gap-1.5 text-[#DC2626]">
                    <Code className="w-4 h-4" />
                    <span className="text-xs font-mono font-bold uppercase">ROLE</span>
                  </div>
                  <p className="text-xs font-bold truncate">AI Systems Developer</p>
                </div>

                <div className={`p-3 rounded-xl border space-y-1 transition-colors ${isNight ? "bg-[#1A211A] border-[#2A2F26]" : "bg-[#F8F8F6] border-[#E5E5E2]"
                  }`}>
                  <div className="flex items-center gap-1.5 text-[#DC2626]">
                    <Layers className="w-4 h-4" />
                    <span className="text-xs font-mono font-bold uppercase">STACK</span>
                  </div>
                  <p className="text-xs font-bold truncate">Laravel &bull; Next.js</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Action Buttons */}
            <ScrollReveal direction="up" delayMs={550} durationMs={700}>
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
                  className={`px-6 py-3 rounded-full border font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.03] cursor-pointer inline-flex items-center gap-2 ${isNight
                      ? "border-white/40 text-white hover:border-[#DC2626] hover:text-[#DC2626]"
                      : "border-black/40 text-black hover:border-[#DC2626] hover:text-[#DC2626]"
                    }`}
                >
                  <span>{lang === "id" ? "PROFIL LENGKAP" : "FULL PROFILE"}</span>
                </Link>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>



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

    </motion.div>
  );
}

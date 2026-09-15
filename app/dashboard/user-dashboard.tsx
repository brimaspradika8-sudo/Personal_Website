"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  User,
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  BookOpen,
  ArrowRight,
  Shield,
  MessageSquare,
  Sparkles,
  Calendar,
  Clock,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { soundFx } from "@/lib/audio/sound";
import { signOut } from "@/lib/actions/auth";
import { ArticleItem } from "@/lib/actions/article";
import MobileBottomNav from "@/components/MobileBottomNav";

interface UserDashboardProps {
  user: SupabaseUser | null;
  dbUser: {
    id?: string;
    email?: string;
    name?: string | null;
    avatar?: string | null;
    created_at?: Date | string;
  } | null;
  articles?: ArticleItem[];
}

export default function UserDashboard({
  user,
  dbUser,
  articles = [],
}: UserDashboardProps) {
  const [isNight, setIsNight] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("dashboard_theme");
    if (saved === "day") {
      setIsNight(false);
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (isNight) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dashboard_theme", "night");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("dashboard_theme", "day");
    }
  }, [isNight]);

  const toggleTheme = () => {
    soundFx.playClick();
    setIsNight((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("dashboard_theme", "night");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("dashboard_theme", "day");
      }
      return next;
    });
  };

  const displayName =
    dbUser?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    (user?.email ? user.email.split("@")[0] : "User");

  const avatarUrl =
    dbUser?.avatar ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture;

  const initialLetter = displayName ? displayName.charAt(0).toUpperCase() : "U";

  const USER_NAV_ITEMS = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard", active: true },
    { label: "My Profile", icon: User, href: "/profile" },
    { label: "Artikel", icon: BookOpen, href: "/posts" },
  ];

  const filteredArticles = articles.filter((art) =>
    searchQuery
      ? art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.category?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 pb-20 md:pb-0 ${
        isNight ? "bg-[#0b0c10] text-[#c5c6c7]" : "bg-[#f4f7f6] text-[#2c3e50]"
      }`}
    >
      {/* 1. TOP NAVBAR */}
      <header
        className={`h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0 backdrop-blur-xl border-b transition-colors duration-300 ${
          isNight
            ? "bg-[#111216]/80 border-white/5"
            : "bg-white/80 border-[#e0e0e0] shadow-xs"
        }`}
      >
        <div className="flex items-center gap-3 md:gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#DC2626] to-[#991b1b] flex items-center justify-center text-white font-black text-sm shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
              B
            </div>
            <h1
              className={`text-base sm:text-lg font-bold font-display uppercase tracking-tight hidden sm:block ${
                isNight ? "text-white" : "text-black"
              }`}
            >
              User <span className="text-[#DC2626]">Dashboard</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {USER_NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => soundFx.playClick()}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 text-xs font-medium ${
                  item.active
                    ? isNight
                      ? "bg-white/10 text-white shadow-xs"
                      : "bg-[#DC2626]/10 text-[#DC2626] font-semibold"
                    : isNight
                    ? "text-white/60 hover:bg-white/5 hover:text-white"
                    : "text-black/60 hover:bg-black/5 hover:text-black"
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Bar */}
          <div
            className={`hidden sm:flex items-center px-3 py-1.5 rounded-full border transition-colors ${
              isNight
                ? "bg-white/5 border-white/10"
                : "bg-black/5 border-black/10"
            }`}
          >
            <Search className="w-3.5 h-3.5 opacity-50 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari artikel..."
              className="bg-transparent text-xs outline-none w-32 sm:w-40 placeholder:opacity-50"
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isNight
                ? "hover:bg-white/10 text-amber-400"
                : "hover:bg-black/10 text-slate-700"
            }`}
            title="Ganti Mode Terang/Gelap"
          >
            {isNight ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile Dropdown Button */}
          <Link
            href="/profile"
            onClick={() => soundFx.playClick()}
            className="flex items-center gap-2 p-1 pl-2 rounded-full border border-white/10 hover:border-[#DC2626] transition-all cursor-pointer"
          >
            <span
              className={`text-xs font-semibold max-w-[100px] truncate hidden md:inline-block ${
                isNight ? "text-white" : "text-black"
              }`}
            >
              {displayName}
            </span>
            <div className="w-7 h-7 rounded-full bg-[#DC2626] text-white font-bold text-xs flex items-center justify-center overflow-hidden relative">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={displayName} fill className="object-cover" />
              ) : (
                initialLetter
              )}
            </div>
          </Link>

          {/* Sign Out Button */}
          <button
            onClick={async () => {
              soundFx.playClick();
              await signOut();
            }}
            className="p-2 rounded-full text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
            title="Keluar (Sign Out)"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden p-4 border-b space-y-3 animate-in slide-in-from-top-4 duration-300 ${
            isNight ? "bg-[#111216] border-white/10" : "bg-white border-slate-200"
          }`}
        >
          <div className="grid grid-cols-2 gap-2">
            {USER_NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => {
                  soundFx.playClick();
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
                  item.active
                    ? "bg-[#DC2626] text-white"
                    : isNight
                    ? "bg-white/5 text-slate-200"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 2. MAIN USER DASHBOARD CONTENT */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-8">
        
        {/* Welcome Banner Card */}
        <div
          className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border transition-all shadow-xl ${
            isNight
              ? "bg-gradient-to-r from-[#161a23] via-[#111216] to-[#1c1214] border-white/10"
              : "bg-gradient-to-r from-white via-slate-50 to-red-50/30 border-slate-200"
          }`}
        >
          <div className="relative z-10 space-y-4 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-widest bg-[#DC2626]/15 text-[#DC2626]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AUTHENTICATED MEMBER DASHBOARD</span>
            </div>

            <h2
              className={`font-display text-3xl sm:text-4xl font-black uppercase tracking-tight leading-tight ${
                isNight ? "text-white" : "text-slate-900"
              }`}
            >
              Selamat Datang Kembali, <span className="text-[#DC2626]">{displayName}</span>!
            </h2>

            <p className="text-xs sm:text-sm opacity-80 leading-relaxed font-sans">
              Anda terautentikasi sebagai pengguna aktif. Gunakan dashboard ini untuk mengelola profil, membaca riset &amp; artikel teknis terbaru, atau meninggalkan pesan di buku tamu.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/profile"
                onClick={() => soundFx.playClick()}
                className="px-5 py-2.5 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 shadow-md shadow-red-500/20 inline-flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Pengaturan Profil</span>
              </Link>

              <Link
                href="/posts"
                onClick={() => soundFx.playClick()}
                className={`px-5 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 inline-flex items-center gap-2 ${
                  isNight
                    ? "border-white/20 text-white hover:bg-white/10"
                    : "border-slate-300 text-slate-800 hover:bg-slate-100"
                }`}
              >
                <BookOpen className="w-4 h-4 text-[#DC2626]" />
                <span>Jelajahi Artikel</span>
              </Link>
            </div>
          </div>

          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#DC2626]/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Quick Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <Link
            href="/profile"
            onClick={() => soundFx.playClick()}
            className={`p-6 rounded-2xl border transition-all duration-300 group text-left flex flex-col justify-between space-y-4 ${
              isNight
                ? "bg-[#111216] border-white/10 hover:border-[#DC2626]/50"
                : "bg-white border-slate-200 hover:border-[#DC2626]/50 shadow-xs"
            }`}
          >
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-[#DC2626]/15 text-[#DC2626] w-fit group-hover:scale-110 transition-transform">
                <User className="w-5 h-5" />
              </div>
              <h3
                className={`font-bold text-base font-display tracking-tight group-hover:text-[#DC2626] transition-colors ${
                  isNight ? "text-white" : "text-slate-900"
                }`}
              >
                Profil Saya
              </h3>
              <p className="text-xs opacity-70 leading-relaxed">
                Kelola informasi nama, avatar foto profil, dan kredensial akun Anda.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-[#DC2626] group-hover:translate-x-1 transition-transform">
              <span>Buka Profil</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <Link
            href="/posts"
            onClick={() => soundFx.playClick()}
            className={`p-6 rounded-2xl border transition-all duration-300 group text-left flex flex-col justify-between space-y-4 ${
              isNight
                ? "bg-[#111216] border-white/10 hover:border-[#DC2626]/50"
                : "bg-white border-slate-200 hover:border-[#DC2626]/50 shadow-xs"
            }`}
          >
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-blue-500/15 text-blue-500 w-fit group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3
                className={`font-bold text-base font-display tracking-tight group-hover:text-blue-500 transition-colors ${
                  isNight ? "text-white" : "text-slate-900"
                }`}
              >
                Artikel &amp; Riset
              </h3>
              <p className="text-xs opacity-70 leading-relaxed">
                Baca publikasi seputar Next.js, Laravel, arsitektur database, dan web dev.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-blue-500 group-hover:translate-x-1 transition-transform">
              <span>Lihat Artikel</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <div
            className={`p-6 rounded-2xl border transition-all duration-300 text-left flex flex-col justify-between space-y-4 ${
              isNight
                ? "bg-[#111216] border-white/10"
                : "bg-white border-slate-200 shadow-xs"
            }`}
          >
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-500 w-fit">
                <Shield className="w-5 h-5" />
              </div>
              <h3
                className={`font-bold text-base font-display tracking-tight ${
                  isNight ? "text-white" : "text-slate-900"
                }`}
              >
                Status Akun
              </h3>
              <p className="text-xs opacity-70 leading-relaxed truncate">
                {user?.email || "Email Terdaftar"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-500">
                Sesi Aktif &amp; Terverifikasi
              </span>
            </div>
          </div>
        </div>

        {/* Recent Articles Section */}
        {filteredArticles.length > 0 && (
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h3
                className={`text-xl font-bold font-display tracking-tight ${
                  isNight ? "text-white" : "text-slate-900"
                }`}
              >
                Artikel Rekomendasi
              </h3>
              <Link
                href="/posts"
                className="text-xs font-bold text-[#DC2626] hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua ({articles.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredArticles.slice(0, 3).map((art) => (
                <Link
                  key={art.id}
                  href={`/posts/${art.slug}`}
                  onClick={() => soundFx.playClick()}
                  className={`p-5 rounded-2xl border text-left flex flex-col justify-between space-y-4 group transition-all duration-200 ${
                    isNight
                      ? "bg-[#111216] border-white/10 hover:border-white/20"
                      : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] opacity-70 font-sans">
                      <span className="px-2 py-0.5 rounded-full bg-[#DC2626]/10 text-[#DC2626] font-semibold">
                        {art.category || "Tutorial"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#DC2626]" />
                        {new Date(art.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>

                    <h4
                      className={`font-bold text-sm leading-snug line-clamp-2 group-hover:text-[#DC2626] transition-colors ${
                        isNight ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {art.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] opacity-70 font-sans">
                    {art.readTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#DC2626]" />
                        {art.readTime}
                      </span>
                    )}
                    <span className="text-[#DC2626] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      Baca <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Users,
  MessageSquare,
  Plus,
  ArrowRight,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  LogOut,
  Globe,
  ExternalLink,
  FolderGit2,
} from "lucide-react";
import { User } from "@supabase/supabase-js";
import { soundFx } from "@/lib/audio/sound";
import { signOut } from "@/lib/actions/auth";

interface DashboardStats {
  projectsCount: number;
  articlesCount: number;
  usersCount: number;
  commentsCount: number;
}

interface ProjectRecord {
  id: string;
  title: string;
  thumbnail?: string | null;
  created_at: string | Date;
}

interface ArticleRecord {
  id: string;
  title: string;
  slug: string;
  created_at: string | Date;
}

interface AdminDashboardProps {
  user: User | null;
  dbUser: { name?: string; avatar?: string | null } | null;
  stats: DashboardStats;
  recentProjects: ProjectRecord[];
  recentArticles: ArticleRecord[];
}

export default function AdminDashboard({
  user,
  dbUser,
  stats,
  recentProjects,
  recentArticles,
}: AdminDashboardProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("dashboard_theme", "day");
  }, []);

  const displayName = dbUser?.name || user?.user_metadata?.full_name || "Admin";
  const avatarSrc = dbUser?.avatar || user?.user_metadata?.avatar_url || "";
  const initial = displayName.charAt(0).toUpperCase();

  const NAV_ITEMS = [
    { label: "OVERVIEW", icon: LayoutDashboard, href: "/admin", active: true, external: false },
    { label: "ARTIKEL (CRUD)", icon: FileText, href: "/admin/artikel", active: false, external: false },
    { label: "PROYEK (CRUD)", icon: FolderKanban, href: "/admin/proyek", active: false, external: false },
    { label: "LIHAT WEBSITE", icon: Globe, href: "/dashboard", active: false, external: true },
  ];

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#05080E] text-black dark:text-white font-mono selection:bg-[#FFFF00] selection:text-black">
      
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 1. SIDEBAR (Neo-Brutalist Sharp Border & Blocky Tabs) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:flex lg:flex-col lg:shrink-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-white dark:bg-[#0A0D14] border-r-4 border-black dark:border-white shadow-[6px_0px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_0px_0px_0px_rgba(255,255,255,1)]`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b-4 border-black dark:border-white bg-[#FFFF00] text-black">
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-none bg-black text-white flex items-center justify-center font-mono font-black text-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              B
            </div>
            <span className="font-serif font-black text-base tracking-tight uppercase">
              BRIMAS <span className="underline">ADMIN</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-black hover:scale-110 cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">
          <div className="text-[10px] font-mono font-black text-neutral-500 uppercase tracking-widest px-1">
            MENU UTAMA
          </div>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              onClick={() => soundFx.playClick()}
              className={`flex items-center justify-between px-4 py-3 rounded-none border-3 border-black dark:border-white text-xs font-mono font-black uppercase transition-all cursor-pointer ${
                item.active
                  ? "bg-[#FFFF00] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white dark:bg-[#0E131F] text-black dark:text-white hover:bg-[#FEF9C3] dark:hover:bg-slate-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <item.icon className="w-4 h-4 stroke-[2.5]" />
                <span>{item.label}</span>
              </div>
              {item.external ? (
                <ExternalLink className="w-3.5 h-3.5" />
              ) : item.active ? (
                <div className="w-2.5 h-2.5 bg-black rounded-none border border-black" />
              ) : null}
            </Link>
          ))}
        </nav>

        {/* User Card & Logout Button */}
        <div className="p-4 border-t-4 border-black dark:border-white space-y-3 bg-slate-50 dark:bg-[#0E131F]">
          <div className="p-3 rounded-none border-3 border-black dark:border-white bg-white dark:bg-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] flex items-center gap-3">
            <div className="w-8 h-8 rounded-none bg-[#EAB308] border-2 border-black flex shrink-0 items-center justify-center text-black font-black text-xs overflow-hidden relative">
              {avatarSrc ? <Image src={avatarSrc} alt={displayName} fill className="object-cover" /> : initial}
            </div>
            <div className="truncate">
              <p className="text-xs font-mono font-black truncate text-black dark:text-white uppercase">{displayName}</p>
              <p className="text-[10px] text-neutral-500 font-mono font-bold truncate uppercase">ADMINISTRATOR</p>
            </div>
          </div>

          <button
            onClick={async () => {
              soundFx.playClick();
              await signOut();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-none bg-red-600 text-white border-3 border-black font-mono font-black text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-red-800 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>KELUAR (LOGOUT)</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Sticky Header Topbar */}
        <header className="h-16 shrink-0 flex items-center justify-between px-4 sm:px-8 bg-white dark:bg-[#0A0D14] border-b-4 border-black dark:border-white sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-none border-2 border-black bg-[#FFFF00] text-black"
            >
              <Menu className="w-5 h-5 stroke-[3]" />
            </button>
            <h1 className="text-base sm:text-xl font-serif font-black uppercase tracking-tight text-black dark:text-white">
              DASHBOARD OVERVIEW
            </h1>
          </div>

          <Link
            href="/dashboard"
            target="_blank"
            onClick={() => soundFx.playClick()}
            className="px-3.5 py-1.5 rounded-none border-3 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white text-xs font-mono font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:bg-[#FFFF00] hover:text-black transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Globe className="w-4 h-4 text-[#166534]" />
            <span className="hidden sm:inline">LIHAT WEBSITE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </header>

        {/* Dashboard Main Scroll Container */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 space-y-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* A. HEADER WELCOME BANNER WITH 2 TOP BUTTONS (Wireframe Top Row) */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b-4 border-black dark:border-white">
              <div className="space-y-2">
                <span className="text-xs font-mono font-black uppercase text-neutral-500">
                  SELAMAT DATANG KEMBALI,
                </span>
                <div>
                  <span className="bg-[#FFFF00] text-black px-3.5 py-1 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-serif font-black uppercase text-2xl sm:text-4xl inline-block">
                    {displayName}
                  </span>
                </div>
              </div>

              {/* Wireframe Top Right 2 Action Buttons (Green & Yellow) */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {/* Green Button: + TAMBAH PROYEK */}
                <Link
                  href="/admin/proyek/tambah"
                  onClick={() => soundFx.playClick()}
                  className="px-5 py-2.5 rounded-none bg-[#166534] hover:bg-[#14532D] text-white border-3 border-black dark:border-white font-mono font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>TAMBAH PROYEK</span>
                </Link>

                {/* Yellow Button: + KELOLA ARTIKEL */}
                <Link
                  href="/admin/artikel"
                  onClick={() => soundFx.playClick()}
                  className="px-5 py-2.5 rounded-none bg-[#FFFF00] hover:bg-[#E5E500] text-black border-3 border-black dark:border-white font-mono font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>KELOLA ARTIKEL</span>
                </Link>
              </div>
            </div>

            {/* B. 4 STAT CARDS ROW (Wireframe 4 Grid Cards across with green badges) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              {/* Stat 1: Total Proyek */}
              <div className="relative p-5 bg-white dark:bg-[#0A0D14] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black uppercase text-neutral-600 dark:text-neutral-400">
                    TOTAL PROYEK
                  </span>
                  {/* Top Right Green Badge Icon */}
                  <div className="w-8 h-8 rounded-none bg-[#00FF66] text-black border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <FolderKanban className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-serif font-black text-black dark:text-white">
                  {stats.projectsCount}
                </div>
                <div className="inline-block px-2 py-0.5 bg-[#FEF9C3] text-black border border-black text-[10px] font-mono font-black uppercase">
                  PUBLISHED
                </div>
              </div>

              {/* Stat 2: Total Artikel */}
              <div className="relative p-5 bg-white dark:bg-[#0A0D14] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black uppercase text-neutral-600 dark:text-neutral-400">
                    TOTAL ARTIKEL
                  </span>
                  {/* Top Right Green Badge Icon */}
                  <div className="w-8 h-8 rounded-none bg-[#00FF66] text-black border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <FileText className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-serif font-black text-black dark:text-white">
                  {stats.articlesCount}
                </div>
                <div className="inline-block px-2 py-0.5 bg-[#DCFCE7] text-black border border-black text-[10px] font-mono font-black uppercase">
                  LIVE ARTICLES
                </div>
              </div>

              {/* Stat 3: Pengguna Terdaftar */}
              <div className="relative p-5 bg-white dark:bg-[#0A0D14] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black uppercase text-neutral-600 dark:text-neutral-400">
                    PENGGUNA TERDAFTAR
                  </span>
                  {/* Top Right Green Badge Icon */}
                  <div className="w-8 h-8 rounded-none bg-[#00FF66] text-black border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Users className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-serif font-black text-black dark:text-white">
                  {stats.usersCount}
                </div>
                <div className="inline-block px-2 py-0.5 bg-[#FEF9C3] text-black border border-black text-[10px] font-mono font-black uppercase">
                  MEMBERS
                </div>
              </div>

              {/* Stat 4: Komentar Masuk */}
              <div className="relative p-5 bg-white dark:bg-[#0A0D14] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black uppercase text-neutral-600 dark:text-neutral-400">
                    KOMENTAR MASUK
                  </span>
                  {/* Top Right Green Badge Icon */}
                  <div className="w-8 h-8 rounded-none bg-[#00FF66] text-black border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <MessageSquare className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-serif font-black text-black dark:text-white">
                  {stats.commentsCount}
                </div>
                <div className="inline-block px-2 py-0.5 bg-[#DCFCE7] text-black border border-black text-[10px] font-mono font-black uppercase">
                  INTERACTIONS
                </div>
              </div>

            </div>

            {/* C. BOTTOM 2 PANELS SIDE-BY-SIDE (Wireframe Panel 1 & Panel 2) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Panel 1: PROYEK TERBARU */}
              <div className="p-6 bg-white dark:bg-[#0A0D14] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] flex flex-col justify-between space-y-5">
                
                {/* Panel Header */}
                <div className="flex items-center justify-between border-b-3 border-black dark:border-white pb-3">
                  <h3 className="font-serif font-black text-lg uppercase text-black dark:text-white flex items-center gap-2">
                    <FolderKanban className="w-5 h-5 text-[#166534] dark:text-[#EAB308]" />
                    <span>PROYEK TERBARU</span>
                  </h3>
                  
                  {/* Wireframe Header Right Button: [KELOLA] */}
                  <Link
                    href="/admin/proyek"
                    onClick={() => soundFx.playClick()}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-900 border-2 border-black dark:border-white text-xs font-mono font-black uppercase text-black dark:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:bg-[#FFFF00] hover:text-black transition-colors flex items-center gap-1"
                  >
                    <span>KELOLA</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* List of Item Cards inside Panel */}
                <div className="space-y-3 flex-1">
                  {recentProjects.length > 0 ? (
                    recentProjects.map((p) => (
                      <div
                        key={p.id}
                        className="p-3.5 bg-slate-50 dark:bg-[#121824] border-3 border-black dark:border-white flex items-center justify-between gap-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-10 h-10 border-2 border-black bg-slate-200 dark:bg-slate-900 relative shrink-0 overflow-hidden">
                            {p.thumbnail ? (
                              <Image src={p.thumbnail} alt={p.title} fill unoptimized className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FolderGit2 className="w-5 h-5 text-neutral-500" />
                              </div>
                            )}
                          </div>
                          <div className="truncate">
                            <h4 className="text-xs font-mono font-black uppercase truncate text-black dark:text-white">
                              {p.title}
                            </h4>
                            <p className="text-[10px] font-mono text-neutral-500">
                              {new Date(p.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          </div>
                        </div>

                        {/* Wireframe Yellow Action Button on Right of Item */}
                        <Link
                          href="/admin/proyek"
                          onClick={() => soundFx.playClick()}
                          className="px-3 py-1 bg-[#FFFF00] text-black border-2 border-black text-xs font-mono font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-colors shrink-0"
                        >
                          DETAIL
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 border-2 border-dashed border-black dark:border-white text-center text-xs font-mono font-black uppercase text-neutral-500">
                      BELUM ADA PROYEK
                    </div>
                  )}
                </div>

              </div>

              {/* Panel 2: ARTIKEL TERBARU */}
              <div className="p-6 bg-white dark:bg-[#0A0D14] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] flex flex-col justify-between space-y-5">
                
                {/* Panel Header */}
                <div className="flex items-center justify-between border-b-3 border-black dark:border-white pb-3">
                  <h3 className="font-serif font-black text-lg uppercase text-black dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#166534] dark:text-[#EAB308]" />
                    <span>ARTIKEL TERBARU</span>
                  </h3>

                  {/* Wireframe Header Right Button: [KELOLA] */}
                  <Link
                    href="/admin/artikel"
                    onClick={() => soundFx.playClick()}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-900 border-2 border-black dark:border-white text-xs font-mono font-black uppercase text-black dark:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:bg-[#FFFF00] hover:text-black transition-colors flex items-center gap-1"
                  >
                    <span>KELOLA</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* List of Item Cards inside Panel */}
                <div className="space-y-3 flex-1">
                  {recentArticles.length > 0 ? (
                    recentArticles.map((a) => (
                      <div
                        key={a.id}
                        className="p-3.5 bg-slate-50 dark:bg-[#121824] border-3 border-black dark:border-white flex items-center justify-between gap-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-10 h-10 border-2 border-black bg-[#FEF9C3] text-black flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 stroke-[2.5]" />
                          </div>
                          <div className="truncate">
                            <h4 className="text-xs font-mono font-black uppercase truncate text-black dark:text-white">
                              {a.title}
                            </h4>
                            <p className="text-[10px] font-mono text-neutral-500">
                              {new Date(a.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          </div>
                        </div>

                        {/* Wireframe Yellow Action Button on Right of Item */}
                        <Link
                          href={`/artikel/${a.slug}`}
                          onClick={() => soundFx.playClick()}
                          className="px-3 py-1 bg-[#FFFF00] text-black border-2 border-black text-xs font-mono font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-colors shrink-0"
                        >
                          BACA
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 border-2 border-dashed border-black dark:border-white text-center text-xs font-mono font-black uppercase text-neutral-500">
                      BELUM ADA ARTIKEL
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        </div>
      </main>

    </div>
  );
}

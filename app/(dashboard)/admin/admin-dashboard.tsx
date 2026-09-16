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
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  LogOut,
  Globe,
  ExternalLink,
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
  const [isNight, setIsNight] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("dashboard_theme", "day");
  }, []);

  const displayName = dbUser?.name || user?.user_metadata?.full_name || "Admin";
  const avatarSrc = dbUser?.avatar || user?.user_metadata?.avatar_url || "";
  const initial = displayName.charAt(0).toUpperCase();

  const NAV_ITEMS = [
    { label: "Overview", icon: LayoutDashboard, href: "/admin", active: true, external: false },
    { label: "Artikel (CRUD)", icon: FileText, href: "/admin/artikel", active: false, external: false },
    { label: "Lihat Website", icon: Globe, href: "/dashboard", active: false, external: true },
  ];

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isNight ? "bg-[#0B0F17] text-slate-100" : "bg-[#F8F9FA] text-slate-900"}`}>
      
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:flex lg:flex-col lg:shrink-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} ${isNight ? "bg-[#0E1015] border-r border-slate-800" : "bg-white border-r border-slate-200"}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-[#D32F2F] flex items-center justify-center text-white font-bold text-xs shadow-xs">
              B
            </div>
            <span className="font-bold text-sm tracking-tight font-sans text-slate-900 dark:text-slate-100">
              Brimas <span className="font-normal text-slate-500 dark:text-slate-400">Admin</span>
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto font-sans">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-2">Menu Utama</div>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              onClick={() => soundFx.playClick()}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                item.active
                  ? "bg-[#D32F2F] text-white font-bold shadow-xs"
                  : isNight
                  ? "text-slate-300 hover:bg-slate-900 hover:text-white"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span className="text-xs font-semibold">{item.label}</span>
              </div>
              {item.external && <ExternalLink className="w-3.5 h-3.5 opacity-60" />}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2 font-sans">
          <div className={`p-3 rounded-xl flex items-center justify-between gap-3 ${isNight ? "bg-slate-900 border border-slate-800" : "bg-slate-100/80 border border-slate-200"}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#D32F2F] flex shrink-0 items-center justify-center text-white font-bold text-xs shadow-xs overflow-hidden relative">
                {avatarSrc ? <Image src={avatarSrc} alt={displayName} fill className="object-cover" /> : initial}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold truncate text-slate-900 dark:text-slate-100">{displayName}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-sans">Administrator</p>
              </div>
            </div>
          </div>

          <button
            onClick={async () => {
              soundFx.playClick();
              await signOut();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white dark:text-red-400 text-xs font-bold transition-colors border border-red-500/20 cursor-pointer"
            title="Keluar dari Akun Admin"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        <header className={`h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0 backdrop-blur-md border-b transition-colors duration-300 ${isNight ? "bg-[#0B0F17]/80 border-slate-800" : "bg-white/90 border-slate-200 shadow-xs"}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Dashboard Overview
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard"
              target="_blank"
              onClick={() => soundFx.playClick()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
              title="Buka Website Publik"
            >
              <Globe className="w-3.5 h-3.5 text-[#D32F2F]" />
              <span>Lihat Website</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>

          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Header Welcome */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-sans font-medium">Selamat datang kembali,</p>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                  {displayName}
                </h2>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    try {
                      sessionStorage.removeItem("hasSeenRiveIntro");
                    } catch {}
                    alert("Animasi Rive Intro berhasil di-reset!");
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D32F2F]" />
                  <span>Reset Intro Rive</span>
                </button>

                <Link
                  href="/admin/artikel"
                  onClick={() => soundFx.playClick()}
                  className="px-4 py-2 rounded-xl bg-[#D32F2F] hover:bg-[#B91C1C] text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Kelola Artikel</span>
                </Link>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Proyek", value: stats.projectsCount, icon: FolderKanban },
                { label: "Total Artikel", value: stats.articlesCount, icon: FileText },
                { label: "Pengguna Terdaftar", value: stats.usersCount, icon: Users },
                { label: "Komentar Masuk", value: stats.commentsCount, icon: MessageSquare },
              ].map((stat, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border ${isNight ? "bg-[#0E1015] border-slate-800" : "bg-white border-slate-200 shadow-xs"}`}>
                  <div className="flex items-center justify-between mb-3 text-slate-400">
                    <stat.icon className="w-5 h-5 text-[#D32F2F]" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">{stat.value}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-sans font-medium mt-1">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Projects */}
              <div className={`rounded-2xl border flex flex-col ${isNight ? "bg-[#0E1015] border-slate-800" : "bg-white border-slate-200 shadow-xs"}`}>
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <FolderKanban className="w-4 h-4 text-[#D32F2F]" />
                    <span>Proyek Terbaru</span>
                  </h3>
                </div>
                <div className="p-4 flex-1 space-y-3 font-sans">
                  {recentProjects.length > 0 ? recentProjects.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-lg border flex-shrink-0 bg-cover bg-center bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800" style={{ backgroundImage: `url(${p.thumbnail || '/placeholder.png'})` }} />
                      <div className="flex-1 min-w-0">
                        <Link href={`#projects`} className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#D32F2F] transition-colors truncate block">
                          {p.title}
                        </Link>
                        <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                          {new Date(p.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#D32F2F] transition-colors" />
                    </div>
                  )) : (
                    <div className="h-full flex items-center justify-center text-slate-500 dark:text-slate-400 text-xs font-semibold font-sans py-8">
                      Belum ada proyek
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Articles */}
              <div className={`rounded-2xl border flex flex-col ${isNight ? "bg-[#0E1015] border-slate-800" : "bg-white border-slate-200 shadow-xs"}`}>
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#D32F2F]" />
                    <span>Artikel Terbaru</span>
                  </h3>
                  <Link href="/admin/artikel" className="text-xs text-[#D32F2F] font-bold hover:underline flex items-center gap-1">
                    <span>Kelola</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="p-4 flex-1 space-y-3 font-sans">
                  {recentArticles.length > 0 ? recentArticles.map((a) => (
                    <div key={a.id} className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center border shrink-0 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400">
                        <FileText className="w-4 h-4 text-[#D32F2F]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/artikel/${a.slug}`} className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#D32F2F] transition-colors truncate block">
                          {a.title}
                        </Link>
                        <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                          {new Date(a.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#D32F2F] transition-colors" />
                    </div>
                  )) : (
                    <div className="h-full flex items-center justify-center text-slate-500 dark:text-slate-400 text-xs font-semibold font-sans py-8">
                      Belum ada artikel
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

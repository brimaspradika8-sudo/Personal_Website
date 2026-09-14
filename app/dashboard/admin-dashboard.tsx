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
import { soundFx } from "@/lib/audio/sound";
import { signOut } from "@/lib/actions/auth";

interface DashboardStats {
  projectsCount: number;
  articlesCount: number;
  usersCount: number;
  commentsCount: number;
}

interface AdminDashboardProps {
  user: any;
  dbUser: any;
  stats: DashboardStats;
  recentProjects: any[];
  recentArticles: any[];
}

export default function AdminDashboard({
  user,
  dbUser,
  stats,
  recentProjects,
  recentArticles,
}: AdminDashboardProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dashboard_theme");
    if (saved === "night") {
      setIsNight(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsNight(false);
      document.documentElement.classList.remove("dark");
      localStorage.setItem("dashboard_theme", "day");
    }
  }, []);

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

  const displayName = dbUser?.name || user?.user_metadata?.full_name || "Admin";
  const avatarSrc = dbUser?.avatar || user?.user_metadata?.avatar_url || "";
  const initial = displayName.charAt(0).toUpperCase();

  const NAV_ITEMS = [
    { label: "Overview", icon: LayoutDashboard, href: "/admin", active: true, external: false },
    { label: "Artikel (CRUD)", icon: FileText, href: "/admin/articles", active: false, external: false },
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
            <span className="font-semibold text-sm tracking-tight font-sans">
              Brimas <span className="font-normal text-slate-500">Admin</span>
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto font-sans">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">Menu Utama</div>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              onClick={() => soundFx.playClick()}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${item.active ? "bg-[#D32F2F] text-white font-medium shadow-xs" : (isNight ? "text-slate-400 hover:bg-slate-900 hover:text-slate-100" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900")}`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span className="text-xs font-medium">{item.label}</span>
              </div>
              {item.external && <ExternalLink className="w-3.5 h-3.5 opacity-50" />}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2 font-sans">
          <div className={`p-3 rounded-xl flex items-center justify-between gap-3 ${isNight ? "bg-slate-900 border border-slate-800" : "bg-slate-50 border border-slate-200"}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#D32F2F] flex shrink-0 items-center justify-center text-white font-bold text-xs shadow-xs overflow-hidden relative">
                {avatarSrc ? <Image src={avatarSrc} alt={displayName} fill className="object-cover" /> : initial}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold truncate text-slate-900 dark:text-slate-100">{displayName}</p>
                <p className="text-[11px] text-slate-500 truncate font-sans">Administrator</p>
              </div>
            </div>
          </div>

          <button
            onClick={async () => {
              soundFx.playClick();
              await signOut();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-medium transition-colors border border-red-500/20 cursor-pointer"
            title="Keluar dari Akun Admin"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        <header className={`h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0 backdrop-blur-md border-b transition-colors duration-300 ${isNight ? "bg-[#0B0F17]/80 border-slate-800" : "bg-white/80 border-slate-200 shadow-xs"}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Dashboard Overview
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard"
              target="_blank"
              onClick={() => soundFx.playClick()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-slate-400 transition-colors cursor-pointer"
              title="Buka Website Publik"
            >
              <Globe className="w-3.5 h-3.5 text-[#D32F2F]" />
              <span>Lihat Website</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>

            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
            >
              {isNight ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Header Welcome */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-sans">Selamat datang kembali,</p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
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
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-medium transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D32F2F]" />
                  <span>Reset Intro Rive</span>
                </button>

                <Link
                  href="/admin/articles"
                  onClick={() => soundFx.playClick()}
                  className="px-4 py-2 rounded-xl bg-[#D32F2F] hover:bg-[#B91C1C] text-white text-xs font-medium transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
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
                    <stat.icon className="w-4 h-4 text-[#D32F2F]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{stat.value}</h3>
                    <p className="text-xs text-slate-500 font-sans mt-0.5">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Projects */}
              <div className={`rounded-2xl border flex flex-col ${isNight ? "bg-[#0E1015] border-slate-800" : "bg-white border-slate-200 shadow-xs"}`}>
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <FolderKanban className="w-4 h-4 text-[#D32F2F]" />
                    <span>Proyek Terbaru</span>
                  </h3>
                </div>
                <div className="p-4 flex-1 space-y-3 font-sans">
                  {recentProjects.length > 0 ? recentProjects.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-lg border flex-shrink-0 bg-cover bg-center bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800" style={{ backgroundImage: `url(${p.thumbnail || '/placeholder.png'})` }} />
                      <div className="flex-1 min-w-0">
                        <Link href={`#projects`} className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#D32F2F] transition-colors truncate block">
                          {p.title}
                        </Link>
                        <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                          {new Date(p.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#D32F2F] transition-colors" />
                    </div>
                  )) : (
                    <div className="h-full flex items-center justify-center text-slate-500 text-xs font-sans py-8">
                      Belum ada proyek
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Articles */}
              <div className={`rounded-2xl border flex flex-col ${isNight ? "bg-[#0E1015] border-slate-800" : "bg-white border-slate-200 shadow-xs"}`}>
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#D32F2F]" />
                    <span>Artikel Terbaru</span>
                  </h3>
                  <Link href="/admin/articles" className="text-xs text-[#D32F2F] font-medium hover:underline flex items-center gap-1">
                    <span>Kelola</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="p-4 flex-1 space-y-3 font-sans">
                  {recentArticles.length > 0 ? recentArticles.map((a) => (
                    <div key={a.id} className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center border shrink-0 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/posts/${a.slug}`} className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#D32F2F] transition-colors truncate block">
                          {a.title}
                        </Link>
                        <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                          {new Date(a.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#D32F2F] transition-colors" />
                    </div>
                  )) : (
                    <div className="h-full flex items-center justify-center text-slate-500 text-xs font-sans py-8">
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

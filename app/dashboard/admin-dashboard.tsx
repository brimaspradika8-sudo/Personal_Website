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
  Settings,
  Plus,
  ArrowRight,
  Activity,
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  LogOut,
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
  const [isNight, setIsNight] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("dashboard_theme");
    if (saved === "day") {
      setIsNight(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsNight(true);
      document.documentElement.classList.add("dark");
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
    { label: "Overview", icon: LayoutDashboard, href: "/admin", active: true },
    { label: "Projects", icon: FolderKanban, href: "/admin/projects" },
    { label: "Articles", icon: FileText, href: "/admin/articles" },
    { label: "Users", icon: Users, href: "/admin/users" },
    { label: "Comments", icon: MessageSquare, href: "/admin/comments" },
  ];

  return (
    <div className={`min-h-screen flex transition-colors duration-500 ${isNight ? "bg-[#0b0c10] text-[#c5c6c7]" : "bg-[#f4f7f6] text-[#2c3e50]"}`}>
      
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:flex lg:flex-col lg:shrink-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} ${isNight ? "bg-[#111216] border-r border-white/5" : "bg-white border-r border-[#e0e0e0]"}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-inherit">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#DC2626] to-[#991b1b] flex items-center justify-center text-white font-black text-sm shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform">
              B
            </div>
            <span className={`font-bold tracking-tight text-sm font-sans ${isNight ? "text-white" : "text-black"}`}>
              Brimas <span className="opacity-70 font-normal">Admin</span>
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 opacity-70 hover:opacity-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#DC2626] mb-4 px-2">Menu Utama</div>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => soundFx.playClick()}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${item.active ? (isNight ? "bg-white/10 text-white shadow-sm" : "bg-[#DC2626]/10 text-[#DC2626] font-semibold") : (isNight ? "text-white/60 hover:bg-white/5 hover:text-white" : "text-black/60 hover:bg-black/5 hover:text-black")}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
          
          <div className="mt-8 text-[10px] font-bold uppercase tracking-widest text-[#DC2626] mb-4 px-2">Pengaturan</div>
          <Link href="/dashboard/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isNight ? "text-white/60 hover:bg-white/5 hover:text-white" : "text-black/60 hover:bg-black/5 hover:text-black"}`}>
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-inherit space-y-2">
          <div className={`p-3 rounded-xl flex items-center justify-between gap-3 ${isNight ? "bg-white/5" : "bg-black/5"}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-[#DC2626] flex shrink-0 items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden relative">
                {avatarSrc ? <Image src={avatarSrc} alt={displayName} fill className="object-cover" /> : initial}
              </div>
              <div className="truncate">
                <p className={`text-xs font-bold truncate ${isNight ? "text-white" : "text-black"}`}>{displayName}</p>
                <p className="text-[10px] opacity-60 truncate">Admin</p>
              </div>
            </div>
          </div>

          <button
            onClick={async () => {
              soundFx.playClick();
              await signOut();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white text-xs font-bold transition-all border border-red-500/20 cursor-pointer"
            title="Keluar dari Akun Admin"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        <header className={`h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0 backdrop-blur-xl border-b transition-colors duration-300 ${isNight ? "bg-[#111216]/80 border-white/5" : "bg-white/80 border-[#e0e0e0]"}`}>
          <div className="flex items-center gap-3 md:gap-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 group">
              <h1 className={`text-lg sm:text-xl font-bold font-display uppercase tracking-tight ${isNight ? "text-white" : "text-black"}`}>
                Dashboard <span className="text-[#DC2626]">Overview</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className={`hidden sm:flex items-center px-3 py-1.5 rounded-full border transition-colors ${isNight ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>
              <Search className="w-4 h-4 opacity-50 mr-2" />
              <input type="text" placeholder="Search..." className="bg-transparent text-xs outline-none w-32 placeholder:opacity-50" />
            </div>

            <Link
              href="/dashboard"
              onClick={() => soundFx.playClick()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#DC2626]/10 border border-[#DC2626]/30 text-[#DC2626] text-xs font-bold hover:bg-[#DC2626] hover:text-white transition-all shadow-sm"
              title="Lihat Tampilan Portfolio / Site"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tampilan Site</span>
            </Link>

            <button onClick={toggleTheme} className={`p-2 rounded-full transition-all ${isNight ? "hover:bg-white/10 text-white/80" : "hover:bg-black/10 text-black/80"}`}>
              {isNight ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <button className={`p-2 rounded-full transition-all relative ${isNight ? "hover:bg-white/10 text-white/80" : "hover:bg-black/10 text-black/80"}`}>
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#DC2626] rounded-full"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-sm font-mono text-[#DC2626] uppercase tracking-widest mb-1">Welcome back, Boss</p>
                <h2 className={`font-display text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none ${isNight ? "text-white" : "text-black"}`}>
                  {displayName}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 shadow-lg shadow-[#DC2626]/30 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>New Project</span>
                </button>
                <button className={`px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 flex items-center gap-2 ${isNight ? "border-white/20 text-white hover:bg-white/10" : "border-black/20 text-black hover:bg-black/5"}`}>
                  <FileText className="w-4 h-4" />
                  <span>Write Post</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Projects", value: stats.projectsCount, icon: FolderKanban, color: "text-blue-500", bg: "bg-blue-500/10" },
                { label: "Total Articles", value: stats.articlesCount, icon: FileText, color: "text-[#DC2626]", bg: "bg-[#DC2626]/10" },
                { label: "Registered Users", value: stats.usersCount, icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { label: "User Comments", value: stats.commentsCount, icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-500/10" },
              ].map((stat, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] ${isNight ? "bg-white/5 border-white/10 hover:border-white/20" : "bg-white border-[#e0e0e0] shadow-sm hover:shadow-md"}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <Activity className="w-4 h-4 opacity-30" />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-black font-display tracking-tight ${isNight ? "text-white" : "text-black"}`}>{stat.value}</h3>
                    <p className="text-xs font-medium opacity-70 mt-1 uppercase tracking-wider">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 line-clamp-2">
              
              <div className={`rounded-2xl border flex flex-col ${isNight ? "bg-white/5 border-white/10" : "bg-white border-[#e0e0e0] shadow-sm"}`}>
                <div className="p-5 border-b border-inherit flex items-center justify-between">
                  <h3 className={`font-bold font-display uppercase tracking-tight flex items-center gap-2 ${isNight ? "text-white" : "text-black"}`}>
                    <FolderKanban className="w-4 h-4 text-[#DC2626]" /> Recent Projects
                  </h3>
                  <Link href="/dashboard/projects" className="text-xs text-[#DC2626] font-bold hover:underline flex items-center">
                    View All <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
                <div className="p-5 flex-1 space-y-4">
                  {recentProjects.length > 0 ? recentProjects.map((p) => (
                    <div key={p.id} className="flex items-center gap-4 group">
                      <div className={`w-12 h-12 rounded-xl border flex-shrink-0 bg-cover bg-center ${isNight ? "border-white/10" : "border-black/5"}`} style={{ backgroundImage: `url(${p.thumbnail || '/placeholder.png'})` }}>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/project/${p.slug}`} className={`text-sm font-bold truncate group-hover:text-[#DC2626] transition-colors block ${isNight ? "text-white" : "text-black"}`}>
                          {p.title}
                        </Link>
                        <p className="text-[10px] opacity-60 truncate font-mono mt-0.5">
                          {new Date(p.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#DC2626]" />
                    </div>
                  )) : (
                    <div className="h-full flex items-center justify-center opacity-50 text-sm font-medium py-8">
                      Belum ada project
                    </div>
                  )}
                </div>
              </div>

              <div className={`rounded-2xl border flex flex-col ${isNight ? "bg-white/5 border-white/10" : "bg-white border-[#e0e0e0] shadow-sm"}`}>
                <div className="p-5 border-b border-inherit flex items-center justify-between">
                  <h3 className={`font-bold font-display uppercase tracking-tight flex items-center gap-2 ${isNight ? "text-white" : "text-black"}`}>
                    <FileText className="w-4 h-4 text-[#DC2626]" /> Recent Articles
                  </h3>
                  <Link href="/dashboard/articles" className="text-xs text-[#DC2626] font-bold hover:underline flex items-center">
                    View All <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
                <div className="p-5 flex-1 space-y-4">
                  {recentArticles.length > 0 ? recentArticles.map((a) => (
                    <div key={a.id} className="flex items-center gap-4 group">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${isNight ? "bg-white/5 border-white/10 text-white/50" : "bg-black/5 border-black/10 text-black/50"}`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/posts/${a.slug}`} className={`text-sm font-bold truncate group-hover:text-[#DC2626] transition-colors block ${isNight ? "text-white" : "text-black"}`}>
                          {a.title}
                        </Link>
                        <p className="text-[10px] opacity-60 truncate font-mono mt-0.5">
                          {new Date(a.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#DC2626]" />
                    </div>
                  )) : (
                    <div className="h-full flex items-center justify-center opacity-50 text-sm font-medium py-8">
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

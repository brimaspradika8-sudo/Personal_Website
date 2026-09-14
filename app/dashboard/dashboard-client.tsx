"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  Globe,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { ArticleItem, deleteArticle } from "@/lib/actions/article";
import { soundFx } from "@/lib/audio/sound";
import { signOut } from "@/lib/actions/auth";

interface DashboardClientProps {
  user?: {
    id: string;
    email?: string;
    user_metadata?: { full_name?: string; avatar_url?: string };
  } | null;
  dbUser?: Record<string, unknown> | null;
  initialArticles: ArticleItem[];
  isAdmin?: boolean;
}

export default function DashboardClient({ user, initialArticles }: DashboardClientProps) {
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNight, setIsNight] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("dashboard_theme") === "night";
    }
    return false;
  });
  const [alertMsg, setAlertMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  const handleDelete = async (id: string, title: string) => {
    soundFx.playClick();
    if (!confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) {
      return;
    }

    const res = await deleteArticle(id);
    if (res.error) {
      setAlertMsg({ type: "error", text: res.error });
    } else {
      setAlertMsg({ type: "success", text: "Artikel berhasil dihapus." });
      setArticles((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Pemilik";
  const avatarSrc = user?.user_metadata?.avatar_url || "";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isNight ? "bg-[#0B0F17] text-slate-100" : "bg-[#F8F9FA] text-slate-900"}`}>
      
      {/* Mobile Drawer Overlay */}
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
              Brimas <span className="font-normal text-slate-500 dark:text-slate-400">Dashboard</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 font-sans overflow-y-auto">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-2">Menu Kelola</div>
          
          <Link
            href="/dashboard"
            onClick={() => {
              soundFx.playClick();
              setSidebarOpen(false);
            }}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all bg-[#D32F2F] text-white font-bold shadow-xs"
          >
            <FileText className="w-4 h-4" />
            <span className="text-xs font-semibold">Artikel Saya</span>
          </Link>

          <Link
            href="/posts"
            target="_blank"
            onClick={() => {
              soundFx.playClick();
              setSidebarOpen(false);
            }}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${isNight ? "text-slate-300 hover:bg-slate-900 hover:text-white" : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"}`}
          >
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-semibold">Lihat Blog Publik</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2 font-sans">
          <div className={`p-3 rounded-xl flex items-center justify-between gap-3 ${isNight ? "bg-slate-900 border border-slate-800" : "bg-slate-100/80 border border-slate-200"}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#D32F2F] flex shrink-0 items-center justify-center text-white font-bold text-xs shadow-xs overflow-hidden relative">
                {avatarSrc ? <Image src={avatarSrc} alt={displayName} fill className="object-cover" /> : initial}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold truncate text-slate-900 dark:text-slate-100">{displayName}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-sans">{user?.email}</p>
              </div>
            </div>
          </div>

          <button
            onClick={async () => {
              soundFx.playClick();
              await signOut();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white dark:text-red-400 text-xs font-bold transition-colors border border-red-500/20 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className={`h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0 backdrop-blur-md border-b transition-colors duration-300 ${isNight ? "bg-[#0B0F17]/80 border-slate-800" : "bg-white/90 border-slate-200 shadow-xs"}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
              aria-label="Buka Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100 truncate">
              Dashboard Pemilik — Kelola Artikel
            </h1>
          </div>

          <div className="flex items-center gap-2 font-sans shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
              title="Ganti Tema"
            >
              {isNight ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-800" />}
            </button>

            <Link
              href="/dashboard/artikel/tambah"
              onClick={() => soundFx.playClick()}
              className="px-3.5 py-2 rounded-full bg-[#D32F2F] hover:bg-[#B91C1C] text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">Artikel Baru</span>
            </Link>
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 pb-28 sm:pb-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Alert Banner */}
            {alertMsg && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-medium flex items-center justify-between gap-2 ${
                  alertMsg.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-500/10 border-red-500/20 text-red-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  {alertMsg.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{alertMsg.text}</span>
                </div>
                <button onClick={() => setAlertMsg(null)} className="text-xs opacity-70 hover:opacity-100 cursor-pointer">
                  Dismiss
                </button>
              </div>
            )}

            {/* Search & Stats Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between font-sans">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul artikel atau slug..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-sans focus:outline-none focus:border-[#D32F2F] transition-all shadow-xs"
                />
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-400 font-sans font-medium self-end sm:self-auto">
                Total Artikel: <span className="font-extrabold text-slate-900 dark:text-slate-100">{filteredArticles.length}</span>
              </div>
            </div>

            {/* Articles Table */}
            <div className={`rounded-2xl border overflow-hidden ${isNight ? "bg-[#0E1015] border-slate-800" : "bg-white border-slate-200 shadow-xs"}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans">
                  <thead>
                    <tr className={`border-b text-xs font-bold uppercase tracking-wider ${isNight ? "border-slate-800 text-slate-300 bg-slate-900/80" : "border-slate-200 text-slate-700 bg-slate-100/80"}`}>
                      <th className="py-4 px-4">Judul Artikel</th>
                      <th className="py-4 px-4">Tanggal Dibuat</th>
                      <th className="py-4 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 text-xs">
                    {filteredArticles.length > 0 ? (
                      filteredArticles.map((art) => (
                        <tr key={art.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                          
                          {/* Column 1: Judul */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg shrink-0 border overflow-hidden relative bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800">
                                {art.thumbnail ? (
                                  <Image src={art.thumbnail} alt={art.title} fill className="object-cover" />
                                ) : (
                                  <FileText className="w-4 h-4 m-auto text-slate-400" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <Link
                                  href={`/posts/${art.slug}`}
                                  target="_blank"
                                  className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#D32F2F] transition-colors truncate block max-w-[180px] sm:max-w-md"
                                >
                                  {art.title}
                                </Link>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono truncate max-w-[180px] sm:max-w-md">/{art.slug}</span>
                              </div>
                            </div>
                          </td>

                          {/* Column 2: Tanggal Dibuat */}
                          <td className="py-4 px-4 text-xs text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">
                            {new Date(art.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </td>

                          {/* Column 3: Tombol Edit & Hapus */}
                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/posts/${art.slug}`}
                                target="_blank"
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                                title="Lihat di Blog"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>

                              <Link
                                href={`/dashboard/artikel/edit/${art.id}`}
                                onClick={() => soundFx.playClick()}
                                className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white dark:text-amber-400 transition-all font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                                title="Edit Artikel"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Edit</span>
                              </Link>

                              <button
                                onClick={() => handleDelete(art.id, art.title)}
                                className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors cursor-pointer"
                                title="Hapus Artikel"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-slate-500 font-medium text-xs">
                          {searchQuery ? "Tidak ada artikel yang cocok dengan pencarian." : "Belum ada artikel."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}

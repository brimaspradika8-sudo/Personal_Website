"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  Search,
  LogOut,
  Sun,
  Moon,
  ExternalLink,
  Globe,
  LayoutDashboard,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { ArticleItem, deleteArticle } from "@/lib/actions/article";
import { soundFx } from "@/lib/audio/sound";
import { signOut } from "@/lib/actions/auth";

interface DashboardClientProps {
  user: any;
  dbUser: any;
  initialArticles: ArticleItem[];
  isAdmin: boolean;
}

export default function DashboardClient({
  user,
  dbUser,
  initialArticles,
  isAdmin,
}: DashboardClientProps) {
  const router = useRouter();
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNight, setIsNight] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [alertMsg, setAlertMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  // Subtask 9: Hapus artikel dengan konfirmasi & refresh list
  const handleDeleteArticle = async (id: string, title: string) => {
    soundFx.playClick();
    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`);
    if (!confirmed) return;

    setDeletingId(id);
    setAlertMsg(null);

    const res = await deleteArticle(id);
    setDeletingId(null);

    if (res.error) {
      setAlertMsg({ type: "error", text: res.error });
    } else {
      setAlertMsg({ type: "success", text: `Artikel "${title}" berhasil dihapus!` });
      setArticles((prev) => prev.filter((a) => a.id !== id));
      router.refresh();
    }
  };

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${isNight ? "bg-[#0B0F17] text-slate-100" : "bg-[#F8F9FA] text-slate-900"}`}>
      
      {/* Sidebar */}
      <aside className={`w-64 shrink-0 hidden lg:flex lg:flex-col ${isNight ? "bg-[#0E1015] border-r border-slate-800" : "bg-white border-r border-slate-200"}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-[#D32F2F] flex items-center justify-center text-white font-bold text-xs shadow-xs">
              B
            </div>
            <span className="font-semibold text-sm tracking-tight font-sans">
              Pemilik <span className="font-normal text-slate-500">Dashboard</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">Menu Utama</div>
          
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all bg-[#D32F2F] text-white font-medium shadow-xs"
          >
            <FileText className="w-4 h-4" />
            <span className="text-xs font-medium">Daftar Artikel</span>
          </Link>

          {/* Subtask 5 Link */}
          <Link
            href="/dashboard/artikel/tambah"
            onClick={() => soundFx.playClick()}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${isNight ? "text-slate-400 hover:bg-slate-900 hover:text-slate-100" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
          >
            <Plus className="w-4 h-4 text-[#D32F2F]" />
            <span className="text-xs font-medium">Tambah Artikel Baru</span>
          </Link>

          <Link
            href="/posts"
            target="_blank"
            onClick={() => soundFx.playClick()}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${isNight ? "text-slate-400 hover:bg-slate-900 hover:text-slate-100" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
          >
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium">Lihat Blog Publik</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-50" />
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <div className="px-2 py-1.5 text-xs text-slate-500 truncate">
            Owner: <span className="font-semibold text-slate-700 dark:text-slate-300">{user?.email}</span>
          </div>
          <button
            onClick={async () => {
              soundFx.playClick();
              await signOut();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-medium transition-colors border border-red-500/20 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className={`h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0 backdrop-blur-md border-b transition-colors duration-300 ${isNight ? "bg-[#0B0F17]/80 border-slate-800" : "bg-white/80 border-slate-200 shadow-xs"}`}>
          <div className="flex items-center gap-3">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Dashboard Pemilik — Kelola Artikel
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
            >
              {isNight ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Subtask 5: Button Tambah Artikel */}
            <Link
              href="/dashboard/artikel/tambah"
              onClick={() => soundFx.playClick()}
              className="px-4 py-1.5 rounded-full bg-[#D32F2F] hover:bg-[#B91C1C] text-white text-xs font-medium transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Artikel Baru</span>
            </Link>
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
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
                <button onClick={() => setAlertMsg(null)} className="text-xs opacity-70 hover:opacity-100">
                  Dismiss
                </button>
              </div>
            )}

            {/* Search & Stats Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul artikel atau slug..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-sans focus:outline-none focus:border-[#D32F2F] transition-all"
                />
              </div>

              <div className="text-xs text-slate-500 font-sans">
                Total Artikel: <span className="font-semibold text-slate-900 dark:text-slate-100">{filteredArticles.length}</span>
              </div>
            </div>

            {/* Subtask 3: Tabel Articles (Judul, Tanggal Dibuat, Edit & Hapus) */}
            <div className={`rounded-2xl border overflow-hidden ${isNight ? "bg-[#0E1015] border-slate-800" : "bg-white border-slate-200 shadow-xs"}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans">
                  <thead>
                    <tr className={`border-b text-xs font-semibold uppercase tracking-wider ${isNight ? "border-slate-800 text-slate-400 bg-slate-900/50" : "border-slate-200 text-slate-500 bg-slate-50"}`}>
                      <th className="py-3.5 px-4">Judul Artikel</th>
                      <th className="py-3.5 px-4">Tanggal Dibuat</th>
                      <th className="py-3.5 px-4 text-right">Aksi</th>
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
                                  className="font-semibold text-slate-900 dark:text-slate-100 hover:text-[#D32F2F] transition-colors truncate block max-w-xs sm:max-w-md"
                                >
                                  {art.title}
                                </Link>
                                <span className="text-[11px] text-slate-500 block font-mono">/{art.slug}</span>
                              </div>
                            </div>
                          </td>

                          {/* Column 2: Tanggal Dibuat */}
                          <td className="py-4 px-4 text-xs text-slate-500 whitespace-nowrap">
                            {new Date(art.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </td>

                          {/* Column 3: Tombol Edit & Hapus */}
                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              
                              {/* External View Link */}
                              <Link
                                href={`/posts/${art.slug}`}
                                target="_blank"
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                                title="Lihat di Blog"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>

                              {/* Subtask 8: Tombol Edit -> /dashboard/artikel/edit/[id] */}
                              <Link
                                href={`/dashboard/artikel/edit/${art.id}`}
                                onClick={() => soundFx.playClick()}
                                className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white dark:text-amber-400 transition-all font-medium text-xs flex items-center gap-1.5 cursor-pointer"
                                title="Edit Artikel"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </Link>

                              {/* Subtask 9: Tombol Hapus artikel dengan konfirmasi & refresh */}
                              <button
                                onClick={() => handleDeleteArticle(art.id, art.title)}
                                disabled={deletingId === art.id}
                                className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all font-medium text-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                                title="Hapus Artikel"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>{deletingId === art.id ? "Menghapus..." : "Hapus"}</span>
                              </button>

                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-12 text-center text-slate-500 text-xs font-sans">
                          Belum ada artikel ditemukan. Klik &quot;Artikel Baru&quot; untuk membuat artikel pertama Anda.
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

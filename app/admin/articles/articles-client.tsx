"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  Plus,
  Trash2,
  Edit3,
  Search,
  ArrowLeft,
  X,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  LogOut,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { ArticleItem, createArticle, updateArticle, deleteArticle } from "@/lib/actions/article";
import { soundFx } from "@/lib/audio/sound";
import { signOut } from "@/lib/actions/auth";

interface AdminArticlesClientProps {
  user: any;
  dbUser: any;
  initialArticles: ArticleItem[];
}

export default function AdminArticlesClient({
  user,
  dbUser,
  initialArticles,
}: AdminArticlesClientProps) {
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dashboard_theme");
    if (saved === "night") {
      setIsNight(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsNight(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  const handleOpenCreateModal = () => {
    soundFx.playClick();
    setEditingArticle(null);
    setTitle("");
    setSlug("");
    setContent("");
    setThumbnail("");
    setStatusMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (article: ArticleItem) => {
    soundFx.playClick();
    setEditingArticle(article);
    setTitle(article.title);
    setSlug(article.slug);
    setContent(article.content);
    setThumbnail(article.thumbnail || "");
    setStatusMsg(null);
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingArticle) {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-");
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!title.trim() || !slug.trim() || !content.trim()) {
      setStatusMsg({ type: "error", text: "Judul, slug, dan konten wajib diisi." });
      return;
    }

    setLoading(true);

    if (editingArticle) {
      const res = await updateArticle(editingArticle.id, {
        title,
        slug,
        content,
        thumbnail,
      });

      if (res.error) {
        setStatusMsg({ type: "error", text: res.error });
      } else {
        setStatusMsg({ type: "success", text: "Artikel berhasil diperbarui!" });
        setArticles((prev) =>
          prev.map((a) =>
            a.id === editingArticle.id
              ? {
                  ...a,
                  title,
                  slug,
                  content,
                  thumbnail: thumbnail || null,
                }
              : a
          )
        );
        setTimeout(() => setIsModalOpen(false), 1200);
      }
    } else {
      const res = await createArticle({
        title,
        slug,
        content,
        thumbnail,
      });

      if (res.error) {
        setStatusMsg({ type: "error", text: res.error });
      } else {
        setStatusMsg({ type: "success", text: "Artikel baru berhasil dibuat!" });
        if (res.article) {
          const newArt: ArticleItem = {
            id: res.article.id,
            title: res.article.title,
            slug: res.article.slug,
            content: res.article.content,
            thumbnail: res.article.thumbnail,
            category: "Web Dev",
            readTime: "3 min read",
            created_at: new Date().toISOString(),
            likeCount: 0,
            dislikeCount: 0,
            commentCount: 0,
          };
          setArticles((prev) => [newArt, ...prev]);
        }
        setTimeout(() => setIsModalOpen(false), 1200);
      }
    }

    setLoading(false);
  };

  const handleDelete = async (id: string, title: string) => {
    soundFx.playClick();
    if (!confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) {
      return;
    }

    const res = await deleteArticle(id);
    if (res.error) {
      alert(`Gagal menghapus: ${res.error}`);
    } else {
      setArticles((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayName = dbUser?.name || user?.user_metadata?.full_name || "Admin";

  return (
    <div className={`min-h-screen flex transition-colors duration-500 ${isNight ? "bg-[#0A0A0B] text-[#FAF9F6]" : "bg-[#FAF9F6] text-[#1A1A1A]"}`}>
      
      {/* Sidebar */}
      <aside className={`w-64 shrink-0 hidden lg:flex lg:flex-col ${isNight ? "bg-[#0D0D0E] border-r border-white/10" : "bg-white border-r border-slate-200"}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-inherit">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#B91C1C] to-[#DC2626] flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[#DC2626]/30 group-hover:scale-105 transition-transform border border-white/20">
              B
            </div>
            <span className={`font-bold tracking-tight text-sm font-sans ${isNight ? "text-white" : "text-black"}`}>
              Brimas <span className="opacity-70 font-normal">Admin</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#DC2626] mb-4 px-2">Menu Utama</div>
          
          <Link
            href="/admin"
            onClick={() => soundFx.playClick()}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 ${isNight ? "text-white/60 hover:bg-white/5 hover:text-white" : "text-black/60 hover:bg-black/5 hover:text-black"}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Overview</span>
          </Link>

          <Link
            href="/admin/articles"
            onClick={() => soundFx.playClick()}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 bg-[#DC2626] text-white font-semibold shadow-lg shadow-[#DC2626]/30"
          >
            <FileText className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Artikel (CRUD)</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-inherit space-y-2">
          <button
            onClick={async () => {
              soundFx.playClick();
              await signOut();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white text-xs font-bold transition-all border border-red-500/20 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className={`h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0 backdrop-blur-xl border-b transition-colors duration-300 ${isNight ? "bg-[#0D0D0E]/80 border-white/10 shadow-2xl" : "bg-white/80 border-slate-200 shadow-sm"}`}>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="lg:hidden p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className={`text-lg sm:text-xl font-bold font-display uppercase tracking-tight ${isNight ? "text-white" : "text-black"}`}>
              Kelola <span className="text-[#DC2626]">Artikel (CRUD)</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold font-mono transition-all cursor-pointer shadow-sm ${
                isNight
                  ? "bg-white/10 border-white/15 text-white hover:bg-white/20"
                  : "bg-black/5 border-black/10 text-slate-900 hover:bg-black/10"
              }`}
            >
              {isNight ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">MODE TERANG</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700" />
                  <span className="hidden sm:inline">MODE GELAP</span>
                </>
              )}
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:from-[#B91C1C] hover:to-[#991B1B] text-white text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 shadow-lg shadow-[#DC2626]/30 flex items-center gap-2 border border-white/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Artikel Baru</span>
            </button>
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Search & Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari artikel berdasarkan judul atau slug..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-mono transition-all ${
                    isNight
                      ? "bg-white/5 border-white/10 text-white placeholder-white/40 focus:border-[#DC2626]"
                      : "bg-white border-slate-300 text-black placeholder-slate-400 focus:border-[#DC2626]"
                  }`}
                />
              </div>

              <div className="text-xs font-mono opacity-60">
                Total Artikel: <span className="font-bold text-[#DC2626]">{filteredArticles.length}</span>
              </div>
            </div>

            {/* Articles Table */}
            <div className={`rounded-2xl border overflow-hidden ${isNight ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b text-[11px] font-mono uppercase tracking-wider ${isNight ? "border-white/10 text-white/60 bg-white/5" : "border-slate-200 text-slate-500 bg-slate-50"}`}>
                      <th className="py-3.5 px-4 font-bold">Artikel</th>
                      <th className="py-3.5 px-4 font-bold">Slug</th>
                      <th className="py-3.5 px-4 font-bold">Tanggal</th>
                      <th className="py-3.5 px-4 font-bold text-center">Interaksi</th>
                      <th className="py-3.5 px-4 font-bold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-inherit text-xs">
                    {filteredArticles.length > 0 ? (
                      filteredArticles.map((art) => (
                        <tr key={art.id} className={`transition-colors ${isNight ? "hover:bg-white/5 border-white/5" : "hover:bg-slate-50 border-slate-100"}`}>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg shrink-0 border overflow-hidden relative ${isNight ? "bg-white/10 border-white/10" : "bg-slate-100 border-slate-200"}`}>
                                {art.thumbnail ? (
                                  <Image src={art.thumbnail} alt={art.title} fill className="object-cover" />
                                ) : (
                                  <FileText className="w-5 h-5 m-auto text-white/40" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <Link
                                  href={`/posts/${art.slug}`}
                                  target="_blank"
                                  className={`font-bold hover:text-[#DC2626] transition-colors truncate block max-w-xs sm:max-w-md ${isNight ? "text-white" : "text-slate-900"}`}
                                >
                                  {art.title}
                                </Link>
                                <span className="text-[10px] font-mono opacity-50 block">{art.category || "Tutorial"}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 font-mono text-[11px] opacity-70">
                            {art.slug}
                          </td>

                          <td className="py-4 px-4 font-mono text-[11px] opacity-70 whitespace-nowrap">
                            {new Date(art.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>

                          <td className="py-4 px-4 text-center whitespace-nowrap">
                            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#DC2626]/10 text-[#DC2626]">
                              ❤️ {art.likeCount} • 💬 {art.commentCount}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/posts/${art.slug}`}
                                target="_blank"
                                className={`p-2 rounded-lg transition-colors ${isNight ? "hover:bg-white/10 text-white/70" : "hover:bg-black/5 text-slate-600"}`}
                                title="Pratinjau Artikel"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>

                              <button
                                onClick={() => handleOpenEditModal(art)}
                                className={`p-2 rounded-lg transition-colors text-amber-500 ${isNight ? "hover:bg-amber-500/10" : "hover:bg-amber-50"}`}
                                title="Edit Artikel"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDelete(art.id, art.title)}
                                className={`p-2 rounded-lg transition-colors text-red-500 ${isNight ? "hover:bg-red-500/10" : "hover:bg-red-50"}`}
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
                        <td colSpan={5} className="py-12 text-center opacity-50 font-mono text-xs">
                          Belum ada artikel ditemukan. Klik tombol &quot;Artikel Baru&quot; untuk menambahkan.
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

      {/* Modal Form Tambah / Edit Artikel */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className={`w-full max-w-2xl rounded-2xl border p-6 space-y-6 shadow-2xl relative ${isNight ? "bg-[#141414] border-white/10 text-white" : "bg-white border-slate-200 text-black"}`}>
            
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-inherit pb-4">
              <h2 className="font-display text-xl font-bold uppercase tracking-tight">
                {editingArticle ? "Edit Artikel" : "Tambah Artikel Baru"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg opacity-70 hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {statusMsg && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                  statusMsg.type === "success"
                    ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400"
                    : "bg-red-950/40 border-red-500/30 text-red-400"
                }`}
              >
                {statusMsg.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{statusMsg.text}</span>
              </div>
            )}

            {/* Form Inputs */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold font-mono uppercase opacity-80">Judul Artikel</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Contoh: Membangun Web Modern dengan Next.js"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-sans focus:outline-none focus:border-[#DC2626] ${
                    isNight ? "bg-[#1A1A1A] border-white/10 text-white" : "bg-slate-50 border-slate-300 text-black"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold font-mono uppercase opacity-80">Slug URL</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="membangun-web-modern-dengan-nextjs"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono focus:outline-none focus:border-[#DC2626] ${
                    isNight ? "bg-[#1A1A1A] border-white/10 text-white" : "bg-slate-50 border-slate-300 text-black"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold font-mono uppercase opacity-80">Thumbnail Image URL (Unsplash/Supabase Storage)</label>
                <input
                  type="url"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono focus:outline-none focus:border-[#DC2626] ${
                    isNight ? "bg-[#1A1A1A] border-white/10 text-white" : "bg-slate-50 border-slate-300 text-black"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold font-mono uppercase opacity-80">Konten Artikel (Markdown Format)</label>
                <textarea
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tulis konten artikel di sini dalam format Markdown..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono focus:outline-none focus:border-[#DC2626] leading-relaxed ${
                    isNight ? "bg-[#1A1A1A] border-white/10 text-white" : "bg-slate-50 border-slate-300 text-black"
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-inherit">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold opacity-70 hover:opacity-100"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:from-[#B91C1C] hover:to-[#991B1B] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#DC2626]/30 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Menyimpan..." : editingArticle ? "Simpan Perubahan" : "Terbitkan Artikel"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

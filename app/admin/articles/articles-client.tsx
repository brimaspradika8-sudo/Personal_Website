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
  ExternalLink,
  Upload,
  MessageSquare,
  Eye,
  FileCode,
  Globe,
} from "lucide-react";
import {
  ArticleItem,
  createArticle,
  updateArticle,
  deleteArticle,
  getAllAdminComments,
  deleteArticleComment,
} from "@/lib/actions/article";
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
      localStorage.setItem("dashboard_theme", "day");
    }
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [editorTab, setEditorTab] = useState<"write" | "preview">("write");

  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [adminComments, setAdminComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

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
    setEditorTab("write");
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
    setEditorTab("write");
    setStatusMsg(null);
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setStatusMsg({ type: "error", text: "Ukuran file maksimal 5MB." });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setThumbnail(event.target.result as string);
        setStatusMsg({ type: "success", text: "Foto thumbnail berhasil diunggah!" });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenCommentsModal = async () => {
    soundFx.playClick();
    setIsCommentsModalOpen(true);
    setLoadingComments(true);
    const comments = await getAllAdminComments();
    setAdminComments(comments);
    setLoadingComments(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    soundFx.playClick();
    if (!confirm("Apakah Anda yakin ingin menghapus komentar ini?")) return;
    const res = await deleteArticleComment(commentId);
    if (res.error) {
      alert(`Gagal menghapus komentar: ${res.error}`);
    } else {
      setAdminComments((prev) => prev.filter((c) => c.id !== commentId));
    }
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

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isNight ? "bg-[#0B0F17] text-slate-100" : "bg-[#F8F9FA] text-slate-900"}`}>
      
      {/* Sidebar */}
      <aside className={`w-64 shrink-0 hidden lg:flex lg:flex-col ${isNight ? "bg-[#0E1015] border-r border-slate-800" : "bg-white border-r border-slate-200"}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-[#D32F2F] flex items-center justify-center text-white font-bold text-xs shadow-xs">
              B
            </div>
            <span className="font-semibold text-sm tracking-tight font-sans">
              Brimas <span className="font-normal text-slate-500">Admin</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">Menu Utama</div>
          
          <Link
            href="/admin"
            onClick={() => soundFx.playClick()}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${isNight ? "text-slate-400 hover:bg-slate-900 hover:text-slate-100" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-xs font-medium">Overview</span>
          </Link>

          <Link
            href="/admin/articles"
            onClick={() => soundFx.playClick()}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all bg-[#D32F2F] text-white font-medium shadow-xs"
          >
            <FileText className="w-4 h-4" />
            <span className="text-xs font-medium">Artikel (CRUD)</span>
          </Link>

          <Link
            href="/dashboard"
            target="_blank"
            onClick={() => soundFx.playClick()}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${isNight ? "text-slate-400 hover:bg-slate-900 hover:text-slate-100" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
          >
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-[#D32F2F]" />
              <span className="text-xs font-medium">Lihat Website</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-50" />
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
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
            <Link
              href="/admin"
              className="lg:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Kelola Artikel (CRUD)
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleOpenCommentsModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-slate-400 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#D32F2F]" />
              <span className="hidden sm:inline">Moderasi Komentar</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
            >
              {isNight ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-1.5 rounded-full bg-[#D32F2F] hover:bg-[#B91C1C] text-white text-xs font-medium transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Artikel Baru</span>
            </button>
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Search & Actions Bar */}
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

            {/* Articles Table */}
            <div className={`rounded-2xl border overflow-hidden ${isNight ? "bg-[#0E1015] border-slate-800" : "bg-white border-slate-200 shadow-xs"}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans">
                  <thead>
                    <tr className={`border-b text-xs font-semibold uppercase tracking-wider ${isNight ? "border-slate-800 text-slate-400 bg-slate-900/50" : "border-slate-200 text-slate-500 bg-slate-50"}`}>
                      <th className="py-3.5 px-4">Artikel</th>
                      <th className="py-3.5 px-4">Slug</th>
                      <th className="py-3.5 px-4">Tanggal</th>
                      <th className="py-3.5 px-4 text-center">Interaksi</th>
                      <th className="py-3.5 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 text-xs">
                    {filteredArticles.length > 0 ? (
                      filteredArticles.map((art) => (
                        <tr key={art.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
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
                                <span className="text-[11px] text-slate-500 block">{art.category || "Tutorial"}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 font-mono text-xs text-slate-500">
                            {art.slug}
                          </td>

                          <td className="py-4 px-4 text-xs text-slate-500 whitespace-nowrap">
                            {new Date(art.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>

                          <td className="py-4 px-4 text-center whitespace-nowrap">
                            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-sans bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                              👁️ {art.views || 0} · ❤️ {art.likeCount} · 💬 {art.commentCount}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                href={`/posts/${art.slug}`}
                                target="_blank"
                                className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                                title="Pratinjau"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>

                              <button
                                onClick={() => handleOpenEditModal(art)}
                                className="p-1.5 rounded-md hover:bg-amber-500/10 text-amber-500 transition-colors"
                                title="Edit"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDelete(art.id, art.title)}
                                className="p-1.5 rounded-md hover:bg-red-500/10 text-red-500 transition-colors"
                                title="Hapus"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-500 text-xs font-sans">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className={`w-full max-w-2xl rounded-2xl border p-6 space-y-6 shadow-lg relative ${isNight ? "bg-[#0E1015] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"}`}>
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-bold tracking-tight">
                {editingArticle ? "Edit Artikel" : "Tambah Artikel Baru"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {statusMsg && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                  statusMsg.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-500/10 border-red-500/20 text-red-500"
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

            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Judul Artikel</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Contoh: Membangun Web Modern dengan Next.js"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-[#D32F2F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Slug URL</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="membangun-web-modern-dengan-nextjs"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-[#D32F2F]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Thumbnail Image URL / Upload File
                  </label>
                  <label className="cursor-pointer bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://images.unsplash.com/... atau upload file"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-[#D32F2F]"
                />
                {thumbnail && (
                  <div className="relative w-full h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 mt-2">
                    <Image src={thumbnail} alt="Thumbnail preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Konten Artikel (Markdown Format)
                  </label>
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setEditorTab("write")}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                        editorTab === "write"
                          ? "bg-[#D32F2F] text-white"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <FileCode className="w-3 h-3 inline mr-1" />
                      Tulis
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorTab("preview")}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                        editorTab === "preview"
                          ? "bg-[#D32F2F] text-white"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <Eye className="w-3 h-3 inline mr-1" />
                      Pratinjau
                    </button>
                  </div>
                </div>

                {editorTab === "write" ? (
                  <textarea
                    rows={8}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Tulis konten artikel di sini dalam format Markdown..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-mono leading-relaxed focus:outline-none focus:border-[#D32F2F]"
                  />
                ) : (
                  <div className="w-full h-64 p-4 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-auto text-xs leading-relaxed">
                    {content.trim() ? (
                      <div className="space-y-3 whitespace-pre-wrap font-sans">
                        {content}
                      </div>
                    ) : (
                      <p className="text-xs opacity-40 italic text-center py-10">
                        Belum ada konten untuk dipratinjau.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-[#D32F2F] hover:bg-[#B91C1C] text-white text-xs font-medium transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Menyimpan..." : editingArticle ? "Simpan Perubahan" : "Terbitkan Artikel"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Modal Moderasi Komentar */}
      {isCommentsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className={`w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl border p-6 space-y-4 shadow-lg relative ${isNight ? "bg-[#0E1015] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"}`}>
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0 font-sans">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#D32F2F]" />
                <h2 className="text-base font-bold">
                  Moderasi Komentar Artikel
                </h2>
              </div>
              <button
                onClick={() => setIsCommentsModalOpen(false)}
                className="p-1 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 font-sans">
              {loadingComments ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  Memuat daftar komentar...
                </div>
              ) : adminComments.length > 0 ? (
                adminComments.map((c) => (
                  <div
                    key={c.id}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                      isNight ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold">{c.user.name}</span>
                        <span className="text-[11px] text-slate-500">({c.user.email})</span>
                        <span className="text-[11px] text-slate-500">· {new Date(c.created_at).toLocaleDateString("id-ID")}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">&quot;{c.content}&quot;</p>
                      <div className="text-[11px] text-[#D32F2F] truncate font-mono">
                        Artikel: {c.article.title}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-medium transition-colors border border-red-500/20 shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-slate-500 font-sans">
                  Belum ada komentar dari pengunjung.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end shrink-0 font-sans">
              <button
                onClick={() => setIsCommentsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium hover:opacity-90"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Sun,
  Moon,
  ArrowLeft,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  MessageSquare,
  Globe,
  LogOut,
  Save,
  BookOpen,
} from "lucide-react";
import { User } from "@supabase/supabase-js";
import ConfirmModal from "@/components/ConfirmModal";
import {
  ArticleItem,
  createArticle,
  updateArticle,
  deleteArticle,
  uploadArticleImage,
  getAllAdminComments,
  deleteArticleComment,
  AdminCommentItem,
} from "@/lib/actions/article";
import { soundFx } from "@/lib/audio/sound";
import { signOut } from "@/lib/actions/auth";
import { useDebouncedAction } from "@/lib/hooks/useDebouncedAction";
import { useDebounce } from "@/lib/hooks/useDebounce";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-72 rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center text-xs text-slate-400 gap-2">
      <div className="w-6 h-6 border-2 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
      <span>Memuat Editor Artikel...</span>
    </div>
  ),
});

interface ArticlesClientProps {
  initialArticles: ArticleItem[];
  user?: User | null;
  dbUser?: Record<string, unknown> | null;
}

export default function AdminArticlesClient({ initialArticles }: ArticlesClientProps) {
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [isNight, setIsNight] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("dashboard_theme");
    if (savedTheme === "night") {
      setIsNight(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Modal State (Create / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const debouncedTitle = useDebounce(title, 400);
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  // Auto generate slug when title changes for new articles
  useEffect(() => {
    if (!editingArticle && debouncedTitle.trim()) {
      const generatedSlug = debouncedTitle
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-");
      setSlug(generatedSlug);
    }
  }, [debouncedTitle, editingArticle]);
  
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Comments Moderation Modal State
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [adminComments, setAdminComments] = useState<AdminCommentItem[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

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

  const handleOpenCommentsModal = async () => {
    soundFx.playClick();
    setIsCommentsModalOpen(true);
    setLoadingComments(true);
    const comments = await getAllAdminComments();
    setAdminComments(comments);
    setLoadingComments(false);
  };

  // Confirm Modal State
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    isLoading: boolean;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: "",
    description: "",
    isLoading: false,
    onConfirm: async () => {},
  });

  const handleDeleteComment = (commentId: string) => {
    soundFx.playClick();
    setConfirmModalState({
      isOpen: true,
      title: "Hapus Komentar?",
      description: "Apakah Anda yakin ingin menghapus komentar ini secara permanen?",
      isLoading: false,
      onConfirm: async () => {
        setConfirmModalState((prev) => ({ ...prev, isLoading: true }));
        const res = await deleteArticleComment(commentId);
        if (res.error) {
          alert(`Gagal menghapus komentar: ${res.error}`);
          setConfirmModalState((prev) => ({ ...prev, isLoading: false }));
        } else {
          setAdminComments((prev) => prev.filter((c) => c.id !== commentId));
          setConfirmModalState((prev) => ({ ...prev, isOpen: false, isLoading: false }));
        }
      },
    });
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
  };

  const debouncedSubmit = useDebouncedAction(async () => {
    setStatusMsg(null);

    if (!title.trim() || !content.trim()) {
      setStatusMsg({ type: "error", text: "Judul dan konten wajib diisi." });
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
  }, 700);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    await debouncedSubmit();
  };

  const handleDelete = (id: string, title: string) => {
    soundFx.playClick();
    setConfirmModalState({
      isOpen: true,
      title: "Hapus Artikel?",
      description: `Apakah Anda yakin ingin menghapus artikel "${title}"? Tindakan ini permanen dan tidak dapat dibatalkan.`,
      isLoading: false,
      onConfirm: async () => {
        setConfirmModalState((prev) => ({ ...prev, isLoading: true }));
        const res = await deleteArticle(id);
        if (res.error) {
          alert(`Gagal menghapus: ${res.error}`);
          setConfirmModalState((prev) => ({ ...prev, isLoading: false }));
        } else {
          setArticles((prev) => prev.filter((a) => a.id !== id));
          setConfirmModalState((prev) => ({ ...prev, isOpen: false, isLoading: false }));
        }
      },
    });
  };

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      a.slug.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
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
            <span className="font-bold text-sm tracking-tight font-sans text-slate-900 dark:text-slate-100">
              Brimas <span className="font-normal text-slate-500 dark:text-slate-400">Admin</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 font-sans">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-2">Menu Utama</div>
          
          <Link
            href="/admin"
            onClick={() => soundFx.playClick()}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${isNight ? "text-slate-300 hover:bg-slate-900 hover:text-white" : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-xs font-semibold">Overview</span>
          </Link>

          <Link
            href="/admin/artikel"
            onClick={() => soundFx.playClick()}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all bg-[#D32F2F] text-white font-bold shadow-xs"
          >
            <FileText className="w-4 h-4" />
            <span className="text-xs font-semibold">Artikel Admin (HQ)</span>
          </Link>

          <Link
            href="/dashboard/artikel"
            onClick={() => soundFx.playClick()}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${isNight ? "text-slate-300 hover:bg-slate-900 hover:text-white" : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"}`}
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 text-[#EAB308]" />
              <span className="text-xs font-semibold">Studio Artikel Member</span>
            </div>
          </Link>

          <Link
            href="/dashboard"
            target="_blank"
            onClick={() => soundFx.playClick()}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${isNight ? "text-slate-300 hover:bg-slate-900 hover:text-white" : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"}`}
          >
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-[#D32F2F]" />
              <span className="text-xs font-semibold">Lihat Website</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2 font-sans">
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
            <Link
              href="/admin"
              className="lg:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Kelola Artikel (CRUD)
            </h1>
          </div>

          <div className="flex items-center gap-2.5 font-sans">
            <button
              onClick={handleOpenCommentsModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#D32F2F]" />
              <span className="hidden sm:inline">Moderasi Komentar</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            >
              {isNight ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-800" />}
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-1.5 rounded-full bg-[#D32F2F] hover:bg-[#B91C1C] text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
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

              <div className="text-xs text-slate-600 dark:text-slate-400 font-sans font-medium">
                Total Artikel: <span className="font-extrabold text-slate-900 dark:text-slate-100">{filteredArticles.length}</span>
              </div>
            </div>

            {/* Articles Table */}
            <div className={`rounded-2xl border overflow-hidden ${isNight ? "bg-[#0E1015] border-slate-800" : "bg-white border-slate-200 shadow-xs"}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans">
                  <thead>
                    <tr className={`border-b text-xs font-bold uppercase tracking-wider ${isNight ? "border-slate-800 text-slate-300 bg-slate-900/80" : "border-slate-200 text-slate-700 bg-slate-100/80"}`}>
                      <th className="py-4 px-4">Artikel</th>
                      <th className="py-4 px-4">Slug</th>
                      <th className="py-4 px-4">Tanggal</th>
                      <th className="py-4 px-4 text-center">Interaksi</th>
                      <th className="py-4 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 text-xs">
                    {filteredArticles.length > 0 ? (
                      filteredArticles.map((art) => (
                        <tr key={art.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                          
                          {/* Column 1: Artikel */}
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
                                  href={`/artikel/${art.slug}`}
                                  target="_blank"
                                  className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#D32F2F] transition-colors truncate block max-w-xs sm:max-w-md"
                                >
                                  {art.title}
                                </Link>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">{art.category || "Tutorial"}</span>
                              </div>
                            </div>
                          </td>

                          {/* Column 2: Slug */}
                          <td className="py-4 px-4 font-mono text-xs text-slate-600 dark:text-slate-400 font-medium">
                            {art.slug}
                          </td>

                          {/* Column 3: Tanggal */}
                          <td className="py-4 px-4 text-xs text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">
                            {new Date(art.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>

                          {/* Column 4: Interaksi */}
                          <td className="py-4 px-4 text-center whitespace-nowrap">
                            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800">
                              👁️ {art.views || 0} · ❤️ {art.likeCount} · 💬 {art.commentCount}
                            </span>
                          </td>

                          {/* Column 5: Aksi */}
                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/artikel/${art.slug}`}
                                target="_blank"
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                                title="Lihat di Blog"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>

                              <button
                                onClick={() => handleOpenEditModal(art)}
                                className="p-2 rounded-lg hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 transition-colors cursor-pointer"
                                title="Edit Artikel"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

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
                        <td colSpan={5} className="py-8 text-center text-slate-500 font-medium text-xs">
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

      {/* Modal Moderasi Komentar */}
      {isCommentsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className={`w-full max-w-2xl rounded-3xl border p-6 space-y-6 shadow-2xl ${isNight ? "bg-[#0E1015] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"}`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#D32F2F]" />
                <span>Moderasi Komentar Masuk</span>
              </h2>
              <button onClick={() => setIsCommentsModalOpen(false)} className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {loadingComments ? (
                <div className="py-8 text-center text-xs text-slate-500">Memuat komentar...</div>
              ) : adminComments.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">Belum ada komentar dari pengguna.</div>
              ) : (
                adminComments.map((com) => (
                  <div key={com.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs">{com.user.name}</span>
                        <span className="text-[11px] text-slate-500 font-sans ml-2">({com.user.email})</span>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(com.id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Hapus Komentar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">{com.content}</p>
                    <div className="text-[11px] text-slate-400 font-mono pt-1">
                      Artikel: {com.article.title}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full-Page Overlay Editor Form Create / Edit Artikel (Image 1 Structure - Light Theme) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#F8F9FA] text-slate-900 overflow-y-auto font-sans p-4 sm:p-6 lg:p-10 space-y-8">
          
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all text-slate-600 hover:text-slate-900"
                title="Tutup Editor"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                EDITOR / {editingArticle ? "EDIT ENTRY" : "NEW ENTRY"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-sans text-amber-800 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>{editingArticle ? "Mengedit artikel" : "Draft baru (belum terbit)"}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Page Heading & Sub-text */}
          <div className="space-y-2 max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {editingArticle ? "Edit Artikel" : "Tulis Artikel Baru"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-2xl leading-relaxed">
              Tuangkan pemikiran, dokumentasikan insight baru, atau bagikan eksperimen teknis kamu.
            </p>
          </div>

          {/* Notification Message */}
          {statusMsg && (
            <div className="max-w-7xl mx-auto">
              <div
                className={`p-4 rounded-2xl border text-xs font-medium flex items-center gap-2.5 ${
                  statusMsg.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                {statusMsg.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0" />
                )}
                <span>{statusMsg.text}</span>
              </div>
            </div>
          )}

          {/* Form Utama Layout 2 Kolom */}
          <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* KOLOM KIRI: Main Editor (8 Cols) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Field Judul Artikel (Heading Input Besar + Ghost Placeholder) */}
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Ketik judul artikel..."
                    className="w-full bg-transparent text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all py-1 border-b border-transparent focus:border-slate-300"
                  />
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500 pt-1">
                    <span className="font-semibold text-slate-400">URL Preview:</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[#D32F2F] font-bold border border-slate-200">
                      /artikel/{slug || "judul-artikel"}
                    </span>
                  </div>
                </div>

                {/* Field Konten Artikel dengan Rich Text Editor */}
                <div className="space-y-2 pt-2">
                  <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden p-1 shadow-sm">
                    <RichTextEditor
                      content={content}
                      onChange={setContent}
                      placeholder="Tulis konten artikel dan sisipkan gambar di sini..."
                    />
                  </div>
                </div>

              </div>

              {/* KOLOM KANAN: Sidebar Options (4 Cols) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Section 01: COVER IMAGE */}
                <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
                  <div className="text-[11px] font-bold text-slate-500 font-mono tracking-wider">
                    01 COVER IMAGE
                  </div>

                  {/* Box Upload Gambar Cover (Dashed Style) */}
                  <div className="space-y-3">
                    <label className="relative border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50 hover:bg-slate-100/80 group min-h-[160px]">
                      {thumbnail ? (
                        <div className="relative w-full h-36 rounded-lg overflow-hidden border border-slate-200">
                          <Image src={thumbnail} alt="Cover preview" fill className="object-cover" />
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <span className="text-xs font-medium text-white bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700">
                              Ganti Gambar
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-slate-900 shadow-xs transition-colors mb-2">
                            <Plus className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                            {uploadingThumbnail ? "Mengunggah..." : "Unggah gambar cover"}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono mt-1">
                            JPG, PNG atau WebP sampai 5MB
                          </span>
                        </>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploadingThumbnail(true);
                          setStatusMsg(null);
                          try {
                            const formData = new FormData();
                            formData.append("file", file);
                            const res = await uploadArticleImage(formData);
                            if ("url" in res && res.url) {
                              setThumbnail(res.url);
                              setStatusMsg({ type: "success", text: "Thumbnail gambar berhasil diunggah ke Supabase Storage!" });
                            } else if ("error" in res && res.error) {
                              setStatusMsg({ type: "error", text: res.error });
                            }
                          } catch (err: unknown) {
                            setStatusMsg({ type: "error", text: (err as Error)?.message || "Gagal mengunggah thumbnail." });
                          } finally {
                            setUploadingThumbnail(false);
                          }
                        }}
                        disabled={uploadingThumbnail}
                        className="hidden"
                      />
                    </label>

                    {/* Fallback Input URL Manual */}
                    <input
                      type="text"
                      value={thumbnail}
                      onChange={(e) => setThumbnail(e.target.value)}
                      placeholder="Atau tempel URL gambar di sini..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-[#D32F2F] transition-all"
                    />

                    {thumbnail && (
                      <button
                        type="button"
                        onClick={() => setThumbnail("")}
                        className="text-[11px] text-red-600 hover:text-red-700 font-medium inline-flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Hapus Gambar Cover
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 font-sans leading-relaxed pt-1">
                    Gambar cover akan ditampilkan di header artikel, kartu daftar jurnal, dan OpenGraph preview.
                  </p>
                </div>

                {/* Section 02: PUBLIKASI */}
                <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
                  <div className="text-[11px] font-bold text-slate-500 font-mono tracking-wider">
                    02 PUBLIKASI
                  </div>

                  <div className="space-y-3 font-sans text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Status</span>
                      <span className="font-medium text-emerald-600 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Live saat disimpan
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-500">Format</span>
                      <span className="font-medium text-slate-900">Artikel / Jurnal</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 space-y-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-[#D32F2F] hover:bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? "Menyimpan..." : editingArticle ? "Simpan Perubahan" : "Terbitkan Artikel"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="block w-full py-2.5 text-center rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </form>

        </div>
      )}

      {/* Modern Custom Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModalState.isOpen}
        title={confirmModalState.title}
        description={confirmModalState.description}
        isLoading={confirmModalState.isLoading}
        onConfirm={confirmModalState.onConfirm}
        onCancel={() => setConfirmModalState((prev) => ({ ...prev, isOpen: false }))}
        isNight={isNight}
      />

    </div>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  X,
  MessageSquare,
} from "lucide-react";
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
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-72 rounded-none border-3 border-black bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center text-xs font-mono gap-2">
      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      <span>Memuat Editor Artikel...</span>
    </div>
  ),
});

interface AdminArticlesPanelProps {
  initialArticles?: ArticleItem[];
}

export default function AdminArticlesPanel({ initialArticles = [] }: AdminArticlesPanelProps) {
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State (Create / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Comments Moderation Modal State
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [adminComments, setAdminComments] = useState<AdminCommentItem[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

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

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus komentar ini secara permanen?")) return;
    soundFx.playClick();
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
        setTimeout(() => setIsModalOpen(false), 1000);
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
        setTimeout(() => setIsModalOpen(false), 1000);
      }
    }

    setLoading(false);
  };

  const handleDelete = async (id: string, articleTitle: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus artikel "${articleTitle}"?`)) return;
    soundFx.playClick();
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
    <div className="space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-4 border-black dark:border-white">
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 bg-[#FFFF00] text-black border-3 border-black text-xs font-mono font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
            <FileText className="w-4 h-4 text-black" />
            KELOLA ARTIKEL ({articles.length})
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleOpenCommentsModal}
            className="px-4 py-2 bg-white dark:bg-[#0E131F] text-black dark:text-white border-3 border-black dark:border-white font-mono font-black text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:bg-[#FEF9C3] dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4 text-red-600" />
            <span>MODERASI KOMENTAR</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-5 py-2 bg-[#166534] hover:bg-[#14532D] text-white border-3 border-black dark:border-white font-mono font-black text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>ARTIKEL BARU</span>
          </button>
        </div>
      </div>

      {/* Action & Filter Bar */}
      <div className="p-4 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul artikel atau slug..."
            className="w-full pl-9 pr-4 py-2 border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-900 text-xs font-mono text-black dark:text-white focus:outline-none"
          />
        </div>

        <div className="text-xs text-neutral-600 dark:text-neutral-400 font-black uppercase">
          Total Terfilter: {filteredArticles.length}
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] overflow-hidden font-mono">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-4 border-black dark:border-white text-xs font-black uppercase tracking-wider bg-[#FFFF00] text-black">
                <th className="py-3.5 px-4 border-r-2 border-black">Artikel</th>
                <th className="py-3.5 px-4 border-r-2 border-black">Slug</th>
                <th className="py-3.5 px-4 border-r-2 border-black">Tanggal</th>
                <th className="py-3.5 px-4 border-r-2 border-black text-center">Interaksi</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black dark:divide-white text-xs">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 border-2 border-black bg-slate-200 dark:bg-slate-900 relative shrink-0 overflow-hidden">
                          {art.thumbnail ? (
                            <Image src={art.thumbnail} alt={art.title} fill unoptimized className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-500">
                              <FileText className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/artikel/${art.slug}`}
                            target="_blank"
                            className="font-black text-black dark:text-white hover:underline truncate block max-w-xs sm:max-w-md uppercase"
                          >
                            {art.title}
                          </Link>
                          <span className="text-[10px] text-neutral-500 uppercase">{art.category || "Tutorial"}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-bold text-neutral-600 dark:text-neutral-400">
                      {art.slug}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-neutral-600 dark:text-neutral-400">
                      {new Date(art.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 border border-black bg-[#FEF9C3] text-black text-[10px] font-black">
                        ❤️ {art.likeCount} · 💬 {art.commentCount}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/artikel/${art.slug}`}
                          target="_blank"
                          className="p-1.5 border border-black bg-white dark:bg-slate-900 hover:bg-[#FFFF00] text-black dark:text-white transition-colors"
                          title="Lihat Artikel"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(art)}
                          className="p-1.5 border border-black bg-[#FFFF00] text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                          title="Edit Artikel"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(art.id, art.title)}
                          className="p-1.5 border border-black bg-red-600 text-white hover:bg-red-800 transition-colors cursor-pointer"
                          title="Hapus Artikel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-500 font-bold uppercase text-xs">
                    {searchQuery ? "TIDAK ADA ARTIKEL BERDASARKAN PENCARIAN" : "BELUM ADA ARTIKEL"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comments Moderation Modal */}
      {isCommentsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-mono">
          <div className="w-full max-w-2xl bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white p-6 space-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between pb-3 border-b-3 border-black dark:border-white">
              <h2 className="text-base font-black uppercase text-black dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-red-600" />
                <span>MODERASI KOMENTAR</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsCommentsModalOpen(false)}
                className="p-1 text-black dark:text-white hover:bg-red-600 hover:text-white border border-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {loadingComments ? (
                <div className="py-8 text-center text-xs text-neutral-500 font-bold">MEMUAT KOMENTAR...</div>
              ) : adminComments.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-500 font-bold">BELUM ADA KOMENTAR.</div>
              ) : (
                adminComments.map((com) => (
                  <div key={com.id} className="p-4 border-2 border-black bg-slate-50 dark:bg-slate-900 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-black text-xs uppercase text-black dark:text-white">{com.user.name}</span>
                        <span className="text-[10px] text-neutral-500 ml-2">({com.user.email})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(com.id)}
                        className="p-1 bg-red-600 text-white border border-black hover:bg-red-800 cursor-pointer"
                        title="Hapus Komentar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">{com.content}</p>
                    <div className="text-[10px] text-neutral-500 font-bold uppercase pt-1">
                      ARTIKEL: {com.article.title}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal Overlay for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-[#05080E] text-black dark:text-white overflow-y-auto font-mono p-4 sm:p-6 lg:p-10 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b-4 border-black dark:border-white max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border-2 border-black dark:border-white text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFFF00] hover:text-black transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>KEMBALI</span>
              </button>
              <span className="px-3 py-1 bg-[#FFFF00] text-black border-2 border-black text-xs font-black uppercase">
                {editingArticle ? "EDIT ARTIKEL" : "TULIS ARTIKEL BARU"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="p-1.5 bg-red-600 text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-800 cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>
          </div>

          {statusMsg && (
            <div className="max-w-7xl mx-auto">
              <div
                className={`p-4 border-4 border-black font-mono font-black text-xs flex items-center gap-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                  statusMsg.type === "success" ? "bg-[#00FF66] text-slate-950" : "bg-red-500 text-white"
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

          <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-4">
                <div>
                  <label className="block text-xs font-mono font-black uppercase text-black dark:text-white mb-1">
                    JUDUL ARTIKEL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Judul artikel utama..."
                    className="w-full px-4 py-3 border-3 border-black dark:border-white bg-slate-50 dark:bg-slate-900 text-black dark:text-white text-base sm:text-lg font-black focus:outline-none"
                  />
                  <div className="text-[11px] font-mono text-neutral-500 pt-1">
                    Slug Preview: <span className="text-[#166534] font-bold">/artikel/{slug || "judul-artikel"}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-black uppercase text-black dark:text-white mb-1">
                    KONTEN ARTIKEL <span className="text-red-500">*</span>
                  </label>
                  <div className="border-3 border-black dark:border-white bg-white dark:bg-[#0E131F] p-1">
                    <RichTextEditor content={content} onChange={setContent} placeholder="Tulis konten artikel di sini..." />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="p-5 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4">
                  <div className="text-xs font-mono font-black uppercase text-black dark:text-white border-b-2 border-black dark:border-white pb-2">
                    01 COVER THUMBNAIL
                  </div>

                  <div className="space-y-3">
                    {thumbnail && (
                      <div className="relative w-full h-40 border-2 border-black overflow-hidden">
                        <Image src={thumbnail} alt="Cover" fill unoptimized className="object-cover" />
                      </div>
                    )}

                    <input
                      type="url"
                      value={thumbnail}
                      onChange={(e) => setThumbnail(e.target.value)}
                      placeholder="URL Gambar Thumbnail..."
                      className="w-full px-3 py-2 border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-900 text-xs font-mono"
                    />

                    <label className="block w-full py-2.5 bg-[#FFFF00] text-black border-2 border-black text-center text-xs font-mono font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-colors cursor-pointer">
                      {uploadingThumbnail ? "MENGUNGGAH..." : "UNGGAH GAMBAR COVER"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploadingThumbnail(true);
                          const formData = new FormData();
                          formData.append("file", file);
                          const res = await uploadArticleImage(formData);
                          if ("url" in res && res.url) {
                            setThumbnail(res.url);
                          }
                          setUploadingThumbnail(false);
                        }}
                        disabled={uploadingThumbnail}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 border-3 border-black text-xs font-mono font-black uppercase bg-slate-200 text-black hover:bg-slate-300"
                  >
                    BATAL
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-[#00FF66] text-black border-3 border-black font-mono font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#EAB308] cursor-pointer disabled:opacity-50"
                  >
                    {loading ? "MENYIMPAN..." : "SIMPAN ARTIKEL"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

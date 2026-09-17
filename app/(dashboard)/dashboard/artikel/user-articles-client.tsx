"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  Search,
  Crown,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  ThumbsUp,
  MessageSquare,
  ShieldAlert,
  ArrowLeft,
  Filter,
  ArrowUpDown,
  Zap,
} from "lucide-react";
import { deleteArticle, ArticleItem } from "@/lib/actions/article";
import { soundFx } from "@/lib/audio/sound";
import MobileBottomNav from "@/components/MobileBottomNav";

interface UserArticlesClientProps {
  user: any;
  dbUser: any;
  userTier: string;
  permission: { allowed: boolean; reason?: string; currentCount?: number; maxLimit?: number };
  isAdmin: boolean;
  initialArticles: ArticleItem[];
}

export default function UserArticlesClient({
  user,
  dbUser,
  userTier,
  permission,
  isAdmin,
  initialArticles,
}: UserArticlesClientProps) {
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "likes">("latest");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const categories = ["Semua", "AI Systems", "Web Dev", "Tutorial", "Database"];

  const filteredArticles = articles
    .filter((art) => {
      const matchSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (art.category && art.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCat =
        selectedCategory === "Semua" ||
        (art.category && art.category.toLowerCase() === selectedCategory.toLowerCase());

      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === "popular") {
        return (b.likeCount + b.commentCount) - (a.likeCount + a.commentCount);
      }
      if (sortBy === "likes") {
        return b.likeCount - a.likeCount;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const totalLikes = articles.reduce((acc, a) => acc + (a.likeCount || 0), 0);
  const totalComments = articles.reduce((acc, a) => acc + (a.commentCount || 0), 0);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) return;

    try { soundFx.playClick(); } catch {}
    setDeletingId(id);
    const res = await deleteArticle(id);
    setDeletingId(null);

    if (res.error) {
      showToast(res.error);
    } else {
      showToast("Artikel berhasil dihapus!");
      setArticles((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const isKawan = userTier === "KAWAN_BRIMAS";
  const isSahabat = userTier === "SAHABAT_BRIMAS";
  const isFree = userTier === "FREE";

  const quotaPercent = Math.min(
    100,
    Math.round(((permission.currentCount || 0) / (permission.maxLimit || 3)) * 100)
  );

  return (
    <div className="min-h-screen bg-[#F4F4F0] dark:bg-[#05080E] text-black dark:text-white font-mono pb-24 sm:pb-16 antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#EAB308] text-black border-4 border-black px-5 py-3 rounded-none font-mono font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-bounce flex items-center gap-2">
          <Zap className="w-5 h-5 fill-black" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-6">
        
        {/* Navigation Back */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-900 border-3 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:bg-[#EAB308] dark:hover:bg-[#EAB308] hover:text-black transition-all text-xs font-black uppercase"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </Link>

          {isAdmin && (
            <Link
              href="/admin/artikel"
              onClick={() => soundFx.playClick()}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#EAB308] text-black border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#166534] hover:text-white transition-all text-xs font-black uppercase"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Dashboard Admin HQ</span>
            </Link>
          )}
        </div>

        {/* Header Creator Studio Banner */}
        <div className="p-6 sm:p-8 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          {/* Subtle Neo Accent Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#166534]/10 dark:bg-[#EAB308]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          <div className="space-y-3 z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#166534] text-white border-2 border-black dark:border-white text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <BookOpen className="w-4 h-4 text-[#EAB308]" />
                <span>STUDIO PENULIS MEMBER</span>
              </span>

              {isKawan && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#166534] text-[#00FF66] border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Crown className="w-4 h-4 fill-[#00FF66]" /> KAWAN BRIMAS
                </span>
              )}
              {isSahabat && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAB308] text-slate-950 border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Crown className="w-4 h-4 fill-[#EAB308]" /> SAHABAT VIP
                </span>
              )}
              {isFree && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-200 text-slate-800 border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  FREE MEMBER
                </span>
              )}
            </div>

            <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-black dark:text-white">
              STUDIO ARTIKEL SAYA
            </h1>
            
            <p className="text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed">
              Ruang kerja pribadi Anda untuk mengelola artikel, memantau interaksi pembaca, dan mempublikasikan karya terbaik Anda ke platform.
            </p>
          </div>

          <div className="z-10 shrink-0">
            <Link
              href={permission.allowed ? "/admin/artikel/tambah" : "/upgrade?reason=limit_reached"}
              onClick={() => soundFx.playClick()}
              className={`inline-flex items-center gap-2.5 px-6 py-4 border-4 border-black font-black uppercase text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all ${
                permission.allowed
                  ? "bg-[#00FF66] text-slate-950 hover:bg-[#EAB308]"
                  : "bg-[#EAB308] text-slate-950 hover:bg-amber-400"
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              <span>{permission.allowed ? "Tulis Artikel Baru" : "Upgrade Untuk Menulis"}</span>
            </Link>
          </div>
        </div>

        {/* Membership Status & Quota Progress Box */}
        <div className="p-5 sm:p-6 border-4 border-black dark:border-white bg-white dark:bg-[#0E131F] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
          {isFree ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-xs uppercase">
                  <AlertCircle className="w-4 h-4" />
                  <span>AKSES GRATIS (HANYA BACA & KOMENTAR)</span>
                </div>
                <p className="text-xs font-mono text-slate-800 dark:text-slate-200">
                  Anda belum berlangganan membership. Upgrade ke **Kawan Brimas** (Rp 5.000/bln) atau **Sahabat Brimas VIP** untuk membuka Studio Penulisan Artikel.
                </p>
              </div>
              <Link
                href="/upgrade"
                onClick={() => soundFx.playClick()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#EAB308] text-black border-3 border-black font-black text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#166534] hover:text-white transition-all shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>PILIH MEMBERSHIP</span>
              </Link>
            </div>
          ) : isSahabat ? (
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3 text-[#166534] dark:text-[#00FF66]">
                <CheckCircle2 className="w-6 h-6 text-[#EAB308] shrink-0" />
                <div>
                  <p className="text-xs font-black uppercase text-black dark:text-white tracking-wider">
                    STATUS MEMBERSHIP: SAHABAT BRIMAS VIP (UNLIMITED PUBLISH)
                  </p>
                  <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
                    Akses tanpa batas untuk menulis, mengedit, dan mempublikasikan artikel kapan saja dengan fitur VIP lengkap.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-[#EAB308] text-slate-950 border-2 border-black font-mono font-black text-xs uppercase">
                BEBAS KUOTA ♾️
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <p className="text-xs font-black uppercase text-black dark:text-white flex items-center gap-2">
                    <Crown className="w-4 h-4 text-[#00FF66]" />
                    KUOTA PUBLIKASI ARTIKEL: {permission.currentCount || 0} / {permission.maxLimit || 3} (7 HARI ROLLING)
                  </p>
                  <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
                    {permission.reason || "Kawan Brimas berhak menerbitkan maksimal 3 artikel setiap 7 hari berjalan."}
                  </p>
                </div>
                <span className="text-xs font-mono font-black text-slate-900 dark:text-amber-400 self-end sm:self-auto">
                  {quotaPercent}% Kuota Terpakai
                </span>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-800 h-4 border-3 border-black dark:border-white relative overflow-hidden p-0.5">
                <div
                  className={`h-full transition-all duration-500 ${
                    quotaPercent >= 100 ? "bg-red-500" : quotaPercent >= 66 ? "bg-amber-400" : "bg-[#00FF66]"
                  }`}
                  style={{ width: `${quotaPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Member Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-black uppercase text-slate-600 dark:text-slate-400 tracking-wider">
                Artikel Dipublikasikan
              </p>
              <p className="text-3xl font-black text-black dark:text-white font-mono">{articles.length}</p>
            </div>
            <div className="p-3 bg-[#166534]/10 dark:bg-[#166534]/30 border-2 border-black dark:border-white">
              <BookOpen className="w-7 h-7 text-[#166534] dark:text-[#EAB308]" />
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-black uppercase text-slate-600 dark:text-slate-400 tracking-wider">
                Total Apresiasi Suka
              </p>
              <p className="text-3xl font-black text-black dark:text-white font-mono">{totalLikes}</p>
            </div>
            <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/30 border-2 border-black dark:border-white">
              <ThumbsUp className="w-7 h-7 text-[#00FF66]" />
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-black uppercase text-slate-600 dark:text-slate-400 tracking-wider">
                Total Komentar Pembaca
              </p>
              <p className="text-3xl font-black text-black dark:text-white font-mono">{totalComments}</p>
            </div>
            <div className="p-3 bg-amber-500/10 dark:bg-amber-500/30 border-2 border-black dark:border-white">
              <MessageSquare className="w-7 h-7 text-[#EAB308]" />
            </div>
          </div>
        </div>

        {/* Search, Filter Pills & Sorting Bar */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              <Filter className="w-4 h-4 text-slate-500 shrink-0 mr-1" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedCategory(cat);
                  }}
                  className={`px-3 py-1.5 text-xs font-mono font-black uppercase border-2 border-black transition-all shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#166534] text-white dark:bg-[#EAB308] dark:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input & Sort Dropdown */}
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari artikel..."
                  className="w-full pl-9 pr-4 py-2 border-2 border-black dark:border-white bg-white dark:bg-[#05080E] text-xs font-mono font-bold focus:outline-none focus:bg-amber-50 dark:focus:bg-slate-900"
                />
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <ArrowUpDown className="w-4 h-4 text-slate-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border-2 border-black dark:border-white bg-white dark:bg-[#05080E] text-xs font-mono font-bold cursor-pointer focus:outline-none"
                >
                  <option value="latest">Terbaru</option>
                  <option value="popular">Terpopuler</option>
                  <option value="likes">Suka Terbanyak</option>
                </select>
              </div>
            </div>
          </div>

          {/* Article Grid / List */}
          {filteredArticles.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4">
              <BookOpen className="w-14 h-14 mx-auto text-slate-400" />
              <div className="space-y-1">
                <h3 className="font-serif font-black text-xl uppercase text-black dark:text-white">
                  {searchQuery || selectedCategory !== "Semua"
                    ? "Tidak ada artikel yang sesuai filter."
                    : "Belum Ada Artikel Dipublikasikan."}
                </h3>
                <p className="text-xs font-mono text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  {searchQuery || selectedCategory !== "Semua"
                    ? "Coba sesuaikan kata kunci pencarian atau kategori yang dipilih."
                    : "Mulai bagikan gagasan, tutorial, dan insight teknologi Anda lewat tulisan artikel."}
                </p>
              </div>

              {!searchQuery && selectedCategory === "Semua" && (
                <Link
                  href={permission.allowed ? "/admin/artikel/tambah" : "/upgrade"}
                  onClick={() => soundFx.playClick()}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#00FF66] text-black border-3 border-black font-black text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#EAB308] transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Tulis Artikel Pertama</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredArticles.map((art) => (
                <div
                  key={art.id}
                  className="p-5 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] flex flex-col md:flex-row md:items-center justify-between gap-5 transition-transform hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    {art.thumbnail ? (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 border-3 border-black dark:border-white relative shrink-0 overflow-hidden hidden sm:block">
                        <Image
                          src={art.thumbnail}
                          alt={art.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#166534] border-3 border-black dark:border-white shrink-0 hidden sm:flex items-center justify-center text-white font-mono font-black text-2xl">
                        {art.title.charAt(0)}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 bg-[#EAB308] text-black text-[10px] font-mono font-black uppercase border border-black">
                          {art.category || "Tutorial"}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          {new Date(art.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <h3 className="font-serif font-black text-lg sm:text-xl uppercase text-black dark:text-white line-clamp-1">
                        {art.title}
                      </h3>

                      <div className="flex items-center gap-4 text-xs font-mono text-slate-600 dark:text-slate-400 pt-1">
                        <span className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                          <ThumbsUp className="w-3.5 h-3.5" /> {art.likeCount} Suka
                        </span>
                        <span className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300">
                          <MessageSquare className="w-3.5 h-3.5" /> {art.commentCount} Komentar
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 border-t-2 md:border-t-0 pt-3 md:pt-0 border-slate-200 dark:border-slate-800 shrink-0">
                    <Link
                      href={`/artikel/${art.slug}`}
                      onClick={() => soundFx.playClick()}
                      className="p-2.5 bg-slate-100 dark:bg-slate-900 border-2 border-black dark:border-white text-black dark:text-white hover:bg-[#EAB308] hover:text-black transition-all"
                      title="Lihat Artikel"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <Link
                      href={`/admin/artikel/edit/${art.id}`}
                      onClick={() => soundFx.playClick()}
                      className="p-2.5 bg-slate-100 dark:bg-slate-900 border-2 border-black dark:border-white text-black dark:text-white hover:bg-[#00FF66] hover:text-black transition-all"
                      title="Edit Artikel"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleDelete(art.id, art.title)}
                      disabled={deletingId === art.id}
                      className="p-2.5 bg-red-100 dark:bg-red-950 border-2 border-black dark:border-white text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
                      title="Hapus Artikel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}

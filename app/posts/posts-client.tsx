"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Search,
  Sparkles,
  Heart,
  MessageSquare,
  ChevronRight,
  RefreshCw,
  Tag,
  SlidersHorizontal,
} from "lucide-react";

import { ArticleItem, seedSampleArticlesIfEmpty } from "@/lib/actions/article";
import { soundFx } from "@/lib/audio/sound";

interface PostsClientProps {
  initialArticles: ArticleItem[];
  user: {
    id: string;
    email?: string;
    user_metadata?: { full_name?: string; avatar_url?: string };
  } | null;
  isAdmin?: boolean;
}

const CATEGORIES = ["Semua", "AI Systems", "Web Dev", "Database", "Tutorial"];

export default function PostsClient({ initialArticles, user, isAdmin = false }: PostsClientProps) {
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "popular">("latest");
  const [isPending, startTransition] = useTransition();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    try {
      soundFx.playClick();
    } catch {}
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter & Sort Logic
  const filteredArticles = articles
    .filter((article) => {
      const matchSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCategory =
        selectedCategory === "Semua" ||
        article.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortBy === "popular") {
        return (b.likeCount + b.commentCount) - (a.likeCount + a.commentCount);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const handleSeedArticles = () => {
    startTransition(async () => {
      const res = await seedSampleArticlesIfEmpty();
      if (res.seeded) {
        showToast(`Berhasil menambahkan ${res.count} artikel sampel ke database!`);
        window.location.reload();
      } else {
        showToast("Database sudah memiliki data artikel.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans selection:bg-[#DC2626] selection:text-white pb-20">
      
      {/* Top Header Light Red Glow */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#DC2626]/10 via-[#DC2626]/5 to-transparent pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">

        {/* 1. TOP NAV & BREADCRUMB */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-black/15 text-xs font-mono text-black/70 hover:text-black hover:border-black/30 transition-all cursor-pointer shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Beranda</span>
          </Link>

          {isAdmin && (
            <button
              onClick={handleSeedArticles}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-mono hover:bg-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
              title="Isi sampel artikel ke database jika kosong"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPending ? "animate-spin" : ""}`} />
              <span>{isPending ? "Proses..." : "Seed Artikel"}</span>
            </button>
          )}
        </div>

        {/* 2. HERO TITLE SECTION */}
        <div className="space-y-3 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DC2626]/10 border border-[#DC2626]/30 text-[#DC2626] text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Katalog Artikel & Wawasan</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#1A1A1A] leading-none">
            Artikel <span className="text-[#DC2626]">&amp; Tutorial</span>
          </h1>

          <p className="text-sm text-black/70 font-sans max-w-2xl leading-relaxed">
            Kumpulan tulisan teknis, dokumentasi riset AI Systems, serta panduan arsitektur web modern oleh Brimas Pradika Utama.
          </p>
        </div>

        {/* 3. SEARCH & FILTER BAR */}
        <div className="p-4 rounded-2xl border border-black/10 bg-white shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            
            {/* Search Bar Input */}
            <div className="relative w-full flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
              <input
                type="text"
                placeholder="Cari judul artikel atau topik..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/5 border border-black/10 text-black placeholder:text-black/40 text-xs font-sans focus:outline-none focus:border-[#DC2626] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-black/50 hover:text-black"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Selector Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-black/50 hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-black/5 border border-black/10 text-black text-xs font-mono focus:outline-none focus:border-[#DC2626] cursor-pointer"
              >
                <option value="latest">Urutkan: Terbaru</option>
                <option value="popular">Urutkan: Terpopuler</option>
                <option value="oldest">Urutkan: Terlama</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <Tag className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedCategory(cat);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all shrink-0 cursor-pointer border ${
                    isActive
                      ? "bg-[#DC2626] text-white border-[#DC2626] shadow-md shadow-[#DC2626]/30 font-bold"
                      : "bg-black/5 text-black/70 border-black/10 hover:border-black/30 hover:text-black"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. ARTICLES GRID LIST */}
        {filteredArticles.length === 0 ? (
          <div className="py-16 text-center space-y-3 rounded-2xl border border-black/10 bg-white shadow-sm">
            <BookOpen className="w-10 h-10 text-black/20 mx-auto" />
            <h3 className="text-base font-bold text-black">Tidak Ada Artikel Ditemukan</h3>
            <p className="text-xs text-black/50 font-mono">
              Coba kata kunci pencarian lain atau pilih kategori yang berbeda.
            </p>
            {(searchQuery || selectedCategory !== "Semua") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Semua");
                }}
                className="px-4 py-2 rounded-full bg-[#DC2626] text-white text-xs font-bold hover:bg-[#B91C1C] transition-all cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/posts/${article.slug}`}
                onClick={() => soundFx.playClick()}
                className="group flex flex-col rounded-2xl border border-black/10 bg-white overflow-hidden hover:border-[#DC2626]/60 transition-all duration-300 hover:-translate-y-1.5 shadow-md hover:shadow-xl"
              >
                {/* Thumbnail Header */}
                <div className="relative w-full h-48 bg-gray-100 overflow-hidden shrink-0">
                  {article.thumbnail ? (
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-black/20 group-hover:scale-110 text-[#DC2626] transition-transform" />
                    </div>
                  )}

                  {/* Category Pill Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-black/10 text-[10px] font-mono font-bold uppercase text-black tracking-wider shadow-sm">
                    {article.category || "Tutorial"}
                  </div>

                  {/* Estimated Read Time Badge */}
                  {article.readTime && (
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-black/10 text-[10px] font-mono text-black/80 flex items-center gap-1 shadow-sm">
                      <Clock className="w-3 h-3 text-[#DC2626]" />
                      <span>{article.readTime}</span>
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-base leading-snug text-[#1A1A1A] group-hover:text-[#DC2626] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-black/60 line-clamp-3 leading-relaxed font-sans">
                      {article.content.replace(/[#*`]/g, "").slice(0, 140)}...
                    </p>
                  </div>

                  {/* Footer Meta Details */}
                  <div className="pt-3 border-t border-black/10 flex items-center justify-between text-xs text-black/50 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#DC2626]" />
                      <span>{new Date(article.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 hover:text-[#DC2626]">
                        <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/20" />
                        <span>{article.likeCount}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                        <span>{article.commentCount}</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-black/40 group-hover:text-[#DC2626] group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>

      {/* Toast popup notification */}
      {toastMsg && (
        <div className="fixed bottom-10 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#DC2626] text-white font-bold text-xs font-mono shadow-xl">
          {toastMsg}
        </div>
      )}
    </div>
  );
}

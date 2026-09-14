"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Search,
  Heart,
  MessageSquare,
  ChevronRight,
  RefreshCw,
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

function ArticleThumbnail({ src, title }: { src?: string | null; title: string }) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!src || hasError) {
    return (
      <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <BookOpen className="w-10 h-10 text-slate-400" />
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center z-10">
          <BookOpen className="w-6 h-6 text-slate-400" />
        </div>
      )}
      <Image
        src={src}
        alt={title}
        fill
        unoptimized
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      />
    </>
  );
}

export default function PostsClient({ initialArticles, isAdmin = false }: PostsClientProps) {
  const [articles] = useState<ArticleItem[]>(initialArticles);
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
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 font-sans selection:bg-[#D32F2F] selection:text-white pb-20">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">

        {/* 1. TOP NAV & BREADCRUMB */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-sans text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-xs group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Beranda</span>
          </Link>

          {isAdmin && (
            <button
              onClick={handleSeedArticles}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
              title="Isi sampel artikel ke database jika kosong"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPending ? "animate-spin" : ""}`} />
              <span>{isPending ? "Proses..." : "Seed Artikel"}</span>
            </button>
          )}
        </div>

        {/* 2. HERO TITLE SECTION */}
        <div className="space-y-2 text-left">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Artikel & Wawasan Teknis
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans max-w-2xl leading-relaxed">
            Tulisan teknis, catatan riset AI Systems, serta panduan arsitektur web modern oleh Brimas Pradika Utama.
          </p>
        </div>

        {/* 3. SEARCH & FILTER BAR */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0E1015] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            
            {/* Search Bar Input */}
            <div className="relative w-full flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari judul artikel atau topik..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs font-sans focus:outline-none focus:border-[#D32F2F] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Selector Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "latest" | "oldest" | "popular")}
                className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-sans focus:outline-none focus:border-[#D32F2F] cursor-pointer"
              >
                <option value="latest">Urutkan: Terbaru</option>
                <option value="popular">Urutkan: Terpopuler</option>
                <option value="oldest">Urutkan: Terlama</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedCategory(cat);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer border ${
                    isActive
                      ? "bg-[#D32F2F] text-white border-[#D32F2F] shadow-xs"
                      : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
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
          <div className="py-16 text-center space-y-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1015] shadow-xs">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tidak Ada Artikel Ditemukan</h3>
            <p className="text-xs text-slate-500 font-sans">
              Coba kata kunci pencarian lain atau pilih kategori yang berbeda.
            </p>
            {(searchQuery || selectedCategory !== "Semua") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Semua");
                }}
                className="px-4 py-2 rounded-full bg-[#D32F2F] text-white text-xs font-medium hover:bg-[#B91C1C] transition-all cursor-pointer shadow-xs"
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
                className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0E1015] overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 shadow-xs cursor-pointer"
              >
                {/* Thumbnail Header */}
                <div className="relative w-full h-44 bg-slate-100 dark:bg-slate-900 overflow-hidden shrink-0">
                  <ArticleThumbnail src={article.thumbnail} title={article.title} />

                  {/* Category Pill Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/80 text-slate-200 backdrop-blur-md border border-white/10 text-[11px] font-sans font-medium shadow-xs">
                    {article.category || "Tutorial"}
                  </div>

                  {/* Estimated Read Time Badge */}
                  {article.readTime && (
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-slate-900/80 text-slate-200 backdrop-blur-md border border-white/10 text-[11px] font-sans flex items-center gap-1 shadow-xs">
                      <Clock className="w-3 h-3 text-[#D32F2F]" />
                      <span>{article.readTime}</span>
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-base leading-snug text-slate-900 dark:text-slate-100 group-hover:text-[#D32F2F] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed font-sans">
                      {article.content.replace(/[#*`]/g, "").slice(0, 140)}...
                    </p>
                  </div>

                  {/* Footer Meta Details */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-sans">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#D32F2F]" />
                      <span>{new Date(article.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-[#D32F2F]" />
                        <span>{article.likeCount}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                        <span>{article.commentCount}</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#D32F2F] transition-colors" />
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
        <div className="fixed bottom-10 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#D32F2F] text-white font-medium text-xs shadow-md">
          {toastMsg}
        </div>
      )}
    </div>
  );
}

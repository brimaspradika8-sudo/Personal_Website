"use client";

import { useState, useTransition, useEffect } from "react";
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
  Plus,
  LayoutDashboard,
  Bookmark,
} from "lucide-react";

import { ArticleItem, seedSampleArticlesIfEmpty } from "@/lib/actions/article";
import { soundFx } from "@/lib/audio/sound";
import MobileBottomNav from "@/components/MobileBottomNav";
import { isBookmarked, toggleBookmark, subscribeBookmarks } from "@/lib/bookmarks";

function BookmarkCardButton({ article }: { article: ArticleItem }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isBookmarked(article.id) || isBookmarked(article.slug));
    return subscribeBookmarks(() => {
      setSaved(isBookmarked(article.id) || isBookmarked(article.slug));
    });
  }, [article.id, article.slug]);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark({
          id: article.id,
          title: article.title,
          slug: article.slug,
          thumbnail: article.thumbnail,
          created_at: article.created_at,
        });
      }}
      className={`p-2 rounded-none border-2 border-black font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
        saved ? "bg-[#FFFF00] text-black" : "bg-white text-black hover:bg-[#FF0000] hover:text-white"
      }`}
      title={saved ? "Tersimpan di Profil" : "Simpan Artikel"}
    >
      <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-black" : ""}`} />
    </button>
  );
}


interface ArtikelClientProps {
  initialArticles: ArticleItem[];
  user: {
    id: string;
    email?: string;
    user_metadata?: { full_name?: string; avatar_url?: string };
  } | null;
  userTier?: string;
  isAdmin?: boolean;
}

function ArticleThumbnail({ src, title }: { src?: string | null; title: string }) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!src || hasError) {
    return (
      <div className="w-full h-full bg-black border-b-3 border-black dark:border-white flex items-center justify-center">
        <BookOpen className="w-10 h-10 text-[#FFFF00]" />
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 bg-black border-b-3 border-black dark:border-white animate-pulse flex items-center justify-center z-10">
          <BookOpen className="w-6 h-6 text-[#FFFF00]" />
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
        className={`object-cover group-hover:scale-105 transition-transform duration-500 ease-out ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      />
    </>
  );
}

export default function ArtikelClient({ initialArticles, isAdmin = false }: ArtikelClientProps) {
  const [articles] = useState<ArticleItem[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState("");
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
      return (
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
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
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-[#FF0000] selection:text-white pb-28 sm:pb-20">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-8">

        {/* 1. TOP NAV & BREADCRUMB (Pure Brutalism Sharp Button) */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/dashboard"
              onClick={() => soundFx.playClick()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-white dark:bg-black border-3 border-black dark:border-white text-xs font-mono font-black text-black dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer group uppercase"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#FF0000]" />
              <span>BERANDA</span>
            </Link>

            <Link
              href="/admin/artikel"
              onClick={() => soundFx.playClick()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-[#FF0000] border-3 border-black dark:border-white text-white text-xs font-mono font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer uppercase"
              title="Dashboard Kelola Artikel (Tambah, Edit, & Hapus - Khusus Member)"
            >
              <LayoutDashboard className="w-4 h-4 text-white" />
              <span>DASHBOARD ARTIKEL</span>
            </Link>
          </div>

          {isAdmin && (
            <button
              onClick={handleSeedArticles}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-[#FFFF00] border-3 border-black text-black text-xs font-mono font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer disabled:opacity-50 uppercase"
              title="Isi sampel artikel ke database jika kosong"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPending ? "animate-spin" : ""}`} />
              <span>{isPending ? "PROSES..." : "SEED ARTIKEL"}</span>
            </button>
          )}
        </div>

        {/* 2. HERO TITLE SECTION */}
        <div className="space-y-3 text-left">
          <h1 className="font-mono text-3xl sm:text-5xl font-black uppercase tracking-tight text-black dark:text-white leading-none">
            ARTIKEL 
          </h1>
          <p className="text-xs sm:text-base text-black dark:text-white font-mono font-bold max-w-2xl leading-relaxed">
            Tulisan teknis, catatan riset AI Systems, serta panduan arsitektur web modern oleh Brimas Pradika Utama.
          </p>
        </div>

        {/* 3. SEARCH & SORT BAR */}
        <div className="p-4 sm:p-6 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            
            {/* Search Bar Input */}
            <div className="relative w-full flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black dark:text-white" />
              <input
                type="text"
                placeholder="CARI JUDUL ARTIKEL ATAU TOPIK..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-none bg-neutral-100 dark:bg-neutral-900 border-3 border-black dark:border-white text-black dark:text-white placeholder:text-neutral-500 text-xs font-mono font-black uppercase focus:outline-none focus:ring-2 focus:ring-[#FF0000] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-black text-[#FF0000] hover:underline cursor-pointer"
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* Sort Selector Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-black dark:text-white hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "latest" | "oldest" | "popular")}
                className="w-full sm:w-auto px-4 py-2.5 rounded-none bg-[#FFFF00] text-black border-3 border-black dark:border-white text-xs font-mono font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:outline-none cursor-pointer uppercase"
              >
                <option value="latest">URUTKAN: TERBARU</option>
                <option value="popular">URUTKAN: TERPOPULER</option>
                <option value="oldest">URUTKAN: TERLAMA</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. ARTICLES GRID LIST */}
        {filteredArticles.length === 0 ? (
          <div className="py-16 text-center space-y-3 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
            <BookOpen className="w-8 h-8 text-[#FF0000] mx-auto" />
            <h3 className="text-base font-mono font-black uppercase text-black dark:text-white">TIDAK ADA ARTIKEL DITEMUKAN</h3>
            <p className="text-xs text-black dark:text-white font-mono font-bold">
              Coba kata kunci pencarian lain.
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-5 py-2.5 rounded-none bg-[#FF0000] text-white border-3 border-black dark:border-white text-xs font-mono font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer uppercase"
              >
                RESET PENCARIAN
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/artikel/${article.slug}`}
                onClick={() => soundFx.playClick()}
                className="group flex flex-col rounded-none border-4 border-black dark:border-white bg-white dark:bg-black overflow-hidden transition-all duration-150 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(255,0,0,1)] cursor-pointer"
              >
                {/* Thumbnail Header */}
                <div className="relative w-full h-48 bg-black border-b-4 border-black dark:border-white overflow-hidden shrink-0">
                  <ArticleThumbnail src={article.thumbnail} title={article.title} />

                  {/* Bookmark Button Top Left */}
                  <div className="absolute top-3 left-3 z-10">
                    <BookmarkCardButton article={article} />
                  </div>

                  {/* Estimated Read Time Badge */}
                  {article.readTime && (
                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-none bg-[#FFFF00] text-black border-2 border-black text-[10px] font-mono font-black flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <Clock className="w-3 h-3 text-black" />
                      <span>{article.readTime}</span>
                    </div>
                  )}
                </div>


                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-mono font-black uppercase text-lg sm:text-xl leading-snug text-black dark:text-white group-hover:text-[#FF0000] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-black dark:text-white line-clamp-3 leading-relaxed font-mono font-bold">
                      {article.content.replace(/[#*`]/g, "").slice(0, 140)}...
                    </p>
                  </div>

                  {/* Footer Meta Details */}
                  <div className="pt-3 border-t-3 border-black dark:border-white flex items-center justify-between text-xs font-mono font-black text-black dark:text-white uppercase">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#FF0000]" />
                      <span>{new Date(article.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-[#FF0000] fill-[#FF0000]" />
                        <span>{article.likeCount}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-black dark:text-white" />
                        <span>{article.commentCount}</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-black dark:text-white group-hover:translate-x-1 group-hover:text-[#FF0000] transition-all" />
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
        <div className="fixed bottom-20 right-6 z-50 px-4 py-2.5 rounded-none bg-[#FF0000] text-white border-3 border-black font-mono font-black text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase">
          {toastMsg}
        </div>
      )}

      {/* Floating Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}

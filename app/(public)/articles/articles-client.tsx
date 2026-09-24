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
  Bookmark,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

import { ArticleItem, seedSampleArticlesIfEmpty } from "@/lib/actions/article";
import { soundFx } from "@/lib/audio/sound";
import MobileBottomNav from "@/components/MobileBottomNav";
import { isBookmarked, toggleBookmark, subscribeBookmarks } from "@/lib/bookmarks";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useDebounce } from "@/lib/hooks/useDebounce";

function BookmarkCardButton({ article }: { article: ArticleItem }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isBookmarked(article.id) || isBookmarked(article.slug));
    return subscribeBookmarks(() => {
      setSaved(isBookmarked(article.id) || isBookmarked(article.slug));
    });
  }, [article.id, article.slug]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      soundFx.playClick();
    } catch {}
    toggleBookmark({
      id: article.id,
      slug: article.slug,
      title: article.title,
      thumbnail: article.thumbnail,
      created_at: article.created_at,
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`p-2 rounded-xl border-2 border-slate-900 text-xs font-bold transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center justify-center ${
        saved
          ? "bg-[#EAB308] text-slate-950 hover:bg-amber-400"
          : "bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white hover:bg-[#166534] hover:text-white"
      }`}
      title={saved ? "Hapus dari Simpanan" : "Simpan Artikel"}
    >
      <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-slate-950 text-slate-950" : ""}`} />
    </button>
  );
}

function ArticleThumbnail({ src, title }: { src: string | null; title: string }) {
  const [err, setErr] = useState(false);

  if (src && !err) {
    return (
      <Image
        src={src}
        alt={title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        onError={() => setErr(true)}
      />
    );
  }

  return (
    <div className="w-full h-full bg-[#166534] flex flex-col items-center justify-center p-4 text-center">
      <BookOpen className="w-10 h-10 text-[#EAB308] mb-2" />
      <span className="text-white font-bold text-xs uppercase line-clamp-1">
        {title}
      </span>
    </div>
  );
}

interface ArtikelClientProps {
  initialArticles: ArticleItem[];
  user?: any;
  isAdmin?: boolean;
}

export default function ArtikelClient({ initialArticles, isAdmin }: ArtikelClientProps) {
  const { lang } = useLanguage();
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "popular">("latest");
  const [isPending, startTransition] = useTransition();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSeedArticles = () => {
    soundFx.playClick();
    startTransition(async () => {
      const res = await seedSampleArticlesIfEmpty();
      if (res.seeded) {
        setToastMsg(lang === "id" ? `Berhasil menambahkan artikel sampel!` : `Sample articles added successfully!`);
        window.location.reload();
      } else if (res.error) {
        setToastMsg(res.error);
      } else {
        setToastMsg(lang === "id" ? "Database sudah terisi artikel." : "Database already populated.");
      }
      setTimeout(() => setToastMsg(null), 3500);
    });
  };

  const filteredArticles = articles
    .filter((article) => {
      const q = debouncedSearchQuery.toLowerCase();
      const matchesQuery =
        article.title.toLowerCase().includes(q) ||
        article.content.toLowerCase().includes(q) ||
        (article.category && article.category.toLowerCase().includes(q));

      return matchesQuery;
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

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0A0D14] text-slate-900 dark:text-white selection:bg-[#EAB308] selection:text-slate-950 pb-28 sm:pb-20">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-8">

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap ">
            <Link
              href="/dashboard"
              onClick={() => soundFx.playClick()}
              aria-label={lang === "id" ? "Kembali ke Beranda" : "Back to Home"}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#166534] text-white border-2 border-slate-900 text-xs font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer uppercase hover:bg-emerald-800"
            >
              <ArrowLeft className="w-4 h-4 text-[#EAB308]" />
              <span>{lang === "id" ? "BERANDA" : "HOME"}</span>
            </Link>

            <Link
              href="/dashboard/artikel"
              onClick={() => soundFx.playClick()}
              aria-label={lang === "id" ? "Studio Artikel Saya" : "My Article Studio"}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EAB308] text-slate-950 border-2 border-slate-900 text-xs font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer uppercase hover:bg-amber-400"
                  title={lang === "id" ? "Studio Artikel Saya" : "My Article Studio"}
            >
              <LayoutDashboard className="w-4 h-4 text-slate-950" />
              <span>{lang === "id" ? "STUDIO ARTIKEL SAYA" : "MY ARTICLE STUDIO"}</span>
            </Link>
          </div>
        </div>

        {/* 2. HERO TITLE SECTION */}
        <div className="space-y-3 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAB308] text-slate-950 border-2 border-slate-900 text-xs font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>{lang === "id" ? "JURNAL & INSIGHT ARTIKEL" : "JOURNAL & ARTICLE INSIGHTS"}</span>
          </div>

          <h1 className="font-black text-3xl sm:text-5xl uppercase tracking-tight text-slate-950 dark:text-white leading-none">
            {lang === "id" ? "EKSPLORASI ARTIKEL & ARSITEKTUR WEB" : "ARTICLE EXPLORATION & WEB ARCHITECTURE"}
          </h1>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium max-w-2xl leading-relaxed">
            {lang === "id" ? (
              <>Tulisan teknis, catatan riset AI Systems, serta panduan pengembangan web modern oleh <span className="font-bold text-[#166534] dark:text-[#EAB308]">Brimas Pradika Utama</span>.</>
            ) : (
              <>Technical writing, AI Systems research notes, and modern web engineering guides by <span className="font-bold text-[#166534] dark:text-[#EAB308]">Brimas Pradika Utama</span>.</>
            )}
          </p>
        </div>

        {/* 3. SEARCH & SORT BAR */}
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-3 border-slate-900 dark:border-white bg-white dark:bg-[#0E121D] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            
            {/* Search Bar Input */}
            <div className="relative w-full flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                aria-label={lang === "id" ? "Cari judul artikel" : "Search article title"}
                placeholder={lang === "id" ? "Cari judul artikel atau kata kunci..." : "Search article title or keywords..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border-2 border-slate-900 dark:border-white text-slate-950 dark:text-white placeholder:text-slate-400 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#166534] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label={lang === "id" ? "Hapus kata kunci pencarian" : "Clear search query"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#166534] dark:text-[#EAB308] hover:underline cursor-pointer"
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* Sort Selector Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 ">
              <SlidersHorizontal className="w-4 h-4 text-slate-700 dark:text-slate-300 hidden sm:block" />
              <select
                aria-label={lang === "id" ? "Urutkan artikel" : "Sort articles"}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "latest" | "oldest" | "popular")}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#EAB308] text-slate-950 border-2 border-slate-900 text-xs font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:outline-none cursor-pointer uppercase"
              >
                <option value="latest">{lang === "id" ? "URUTKAN: TERBARU" : "SORT: LATEST"}</option>
                <option value="popular">{lang === "id" ? "URUTKAN: TERPOPULER" : "SORT: POPULAR"}</option>
                <option value="oldest">{lang === "id" ? "URUTKAN: TERLAMA" : "SORT: OLDEST"}</option>
              </select>
            </div>
          </div>

        </div>

        {/* 4. ARTICLES GRID LIST */}
        {filteredArticles.length === 0 ? (
          <div className="py-16 text-center space-y-3 rounded-2xl sm:rounded-3xl border-3 border-slate-900 dark:border-white bg-white dark:bg-[#0E121D] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
            <BookOpen className="w-10 h-10 text-[#166534] dark:text-[#EAB308] mx-auto" />
            <h3 className="text-base font-black uppercase text-slate-950 dark:text-white">
              {lang === "id" ? "TIDAK ADA ARTIKEL DITEMUKAN" : "NO ARTICLES FOUND"}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {lang === "id" ? "Coba kata kunci pencarian lain." : "Try a different search query."}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="px-5 py-2.5 rounded-xl bg-[#166534] text-white border-2 border-slate-900 text-xs font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer uppercase"
              >
                {lang === "id" ? "RESET PENCARIAN" : "RESET SEARCH"}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                onClick={() => soundFx.playClick()}
                className="group flex flex-col rounded-3xl border-3 border-slate-900 dark:border-white bg-white dark:bg-[#0E121D] overflow-hidden transition-all duration-200 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(22,101,52,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(234,179,8,1)] cursor-pointer"
              >
                {/* Thumbnail Header */}
                <div className="relative w-full h-48 bg-slate-900 border-b-3 border-slate-900 dark:border-white overflow-hidden shrink-0">
                  <ArticleThumbnail src={article.thumbnail} title={article.title} />

                  {/* Bookmark Button Top Left */}
                  <div className="absolute top-3 left-3 z-10">
                    <BookmarkCardButton article={article} />
                  </div>

                  {/* Estimated Read Time Badge Bottom Right */}
                  {article.readTime && (
                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-[#EAB308] text-slate-950 border-2 border-slate-900 text-[10px] font-bold flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <Clock className="w-3 h-3 text-slate-950" />
                      <span>{article.readTime}</span>
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-black uppercase text-lg sm:text-xl leading-snug text-slate-950 dark:text-white group-hover:text-[#166534] dark:group-hover:text-[#EAB308] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed font-medium">
                      {article.content.replace(/[#*`]/g, "").slice(0, 140)}...
                    </p>
                  </div>

                  {/* Footer Meta Details */}
                  <div className="pt-3 border-t-2 border-slate-900 dark:border-white flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#166534] dark:text-[#EAB308]" />
                      <span>{new Date(article.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                        <span>{article.likeCount}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                        <span>{article.commentCount}</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-950 dark:text-white group-hover:translate-x-1 group-hover:text-[#166534] dark:group-hover:text-[#EAB308] transition-all" />
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
        <div className="fixed bottom-24 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#166534] text-white border-2 border-slate-900 font-bold text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase">
          {toastMsg}
        </div>
      )}

      {/* Floating Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}

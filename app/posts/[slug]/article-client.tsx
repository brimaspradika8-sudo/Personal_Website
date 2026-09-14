"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Heart,
  ThumbsDown,
  MessageSquare,
  Share2,
  Check,
  Send,
  Trash2,
  BookOpen,
  Copy,
  List,
} from "lucide-react";

import {
  ArticleDetail,
  ArticleItem,
  toggleArticleReaction,
  addArticleComment,
  deleteArticleComment,
} from "@/lib/actions/article";
import { soundFx } from "@/lib/audio/sound";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface ArticleClientProps {
  article: ArticleDetail;
  relatedArticles: ArticleItem[];
  user: {
    id: string;
    email?: string;
    user_metadata?: { full_name?: string; avatar_url?: string };
  } | null;
}

export default function ArticleClient({
  article: initialArticle,
  relatedArticles,
  user,
}: ArticleClientProps) {
  const [article, setArticle] = useState<ArticleDetail>(initialArticle);
  const [commentText, setCommentText] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Feature 2.1: Reading Progress Bar State
  const [scrollProgress, setScrollProgress] = useState(0);

  // Feature 2.3: Table of Contents State
  const [toc] = useState<TocItem[]>(() => {
    if (!initialArticle.content) return [];
    const lines = initialArticle.content.split("\n");
    const items: TocItem[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("## ")) {
        const text = trimmed.replace("## ", "");
        const id = text.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-");
        items.push({ id, text, level: 2 });
      } else if (trimmed.startsWith("### ")) {
        const text = trimmed.replace("### ", "");
        const id = text.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-");
        items.push({ id, text, level: 3 });
      }
    });

    return items;
  });

  // Feature 2.1: Calculate Reading Scroll Progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showToast = (msg: string) => {
    try {
      soundFx.playClick();
    } catch {}
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleReaction = (type: "LIKE" | "DISLIKE") => {
    if (!user) {
      showToast("Silakan masuk akun terlebih dahulu untuk memberikan reaksi.");
      return;
    }

    setArticle((prev) => {
      const current = prev.userReaction;
      let newLikeCount = prev.likeCount;
      let newDislikeCount = prev.dislikeCount;
      let newReaction: "LIKE" | "DISLIKE" | null = type;

      if (current === type) {
        newReaction = null;
        if (type === "LIKE") newLikeCount = Math.max(0, newLikeCount - 1);
        if (type === "DISLIKE") newDislikeCount = Math.max(0, newDislikeCount - 1);
      } else {
        if (current === "LIKE") newLikeCount = Math.max(0, newLikeCount - 1);
        if (current === "DISLIKE") newDislikeCount = Math.max(0, newDislikeCount - 1);

        if (type === "LIKE") newLikeCount += 1;
        if (type === "DISLIKE") newDislikeCount += 1;
      }

      return {
        ...prev,
        likeCount: newLikeCount,
        dislikeCount: newDislikeCount,
        userReaction: newReaction,
      };
    });

    startTransition(async () => {
      const res = await toggleArticleReaction(article.id, type);
      if (res.error) {
        showToast(res.error);
      } else {
        soundFx.playClick();
      }
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!user) {
      showToast("Silakan masuk akun terlebih dahulu untuk menulis komentar.");
      return;
    }

    const text = commentText.trim();
    setCommentText("");

    startTransition(async () => {
      const res = await addArticleComment(article.id, text);
      if (res.error) {
        showToast(res.error);
      } else if (res.comment) {
        soundFx.playClick();
        showToast("Komentar berhasil ditambahkan!");
        setArticle((prev) => ({
          ...prev,
          commentCount: prev.commentCount + 1,
          comments: [res.comment!, ...prev.comments],
        }));
      }
    });
  };

  const handleDeleteComment = (commentId: string) => {
    startTransition(async () => {
      const res = await deleteArticleComment(commentId);
      if (res.error) {
        showToast(res.error);
      } else {
        showToast("Komentar telah dihapus.");
        setArticle((prev) => ({
          ...prev,
          commentCount: Math.max(0, prev.commentCount - 1),
          comments: prev.comments.filter((c) => c.id !== commentId),
        }));
      }
    });
  };

  // Feature 2.2: Copy Link Handler
  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      showToast("Tautan artikel berhasil disalin ke clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Feature 2.2: Social Media Share Links
  const handleSocialShare = (platform: "wa" | "tw" | "li") => {
    const url = encodeURIComponent(window.location.href);
    const titleText = encodeURIComponent(article.title);

    let shareUrl = "";
    if (platform === "wa") shareUrl = `https://api.whatsapp.com/send?text=${titleText}%20${url}`;
    if (platform === "tw") shareUrl = `https://twitter.com/intent/tweet?text=${titleText}&url=${url}`;
    if (platform === "li") shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;

    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  };

  const handleCopyCode = (codeText: string, index: number) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(codeText);
      setCopiedCodeIndex(index);
      showToast("Kode berhasil disalin!");
      setTimeout(() => setCopiedCodeIndex(null), 2000);
    }
  };

  const renderContent = (content: string) => {
    const blocks = content.split("```");
    return blocks.map((block, idx) => {
      if (idx % 2 === 1) {
        const firstLineEnd = block.indexOf("\n");
        const lang = firstLineEnd !== -1 ? block.slice(0, firstLineEnd).trim() : "code";
        const code = firstLineEnd !== -1 ? block.slice(firstLineEnd + 1).trim() : block.trim();

        return (
          <div key={idx} className="my-6 rounded-xl border border-slate-800 bg-[#0B0F17] text-slate-100 overflow-hidden shadow-xs">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between font-mono text-xs text-slate-400">
              <span className="font-mono text-[#D32F2F]">{lang || "code"}</span>
              <button
                onClick={() => handleCopyCode(code, idx)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer text-xs font-mono"
              >
                {copiedCodeIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      const lines = block.split("\n");
      return (
        <div key={idx} className="space-y-4">
          {lines.map((line, lIdx) => {
            const trimmed = line.trim();
            if (!trimmed) return null;

            if (trimmed.startsWith("## ")) {
              const text = trimmed.replace("## ", "");
              const id = text.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-");
              return (
                <h2 key={lIdx} id={id} className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 pt-6 border-b border-slate-200 dark:border-slate-800/80 pb-2 scroll-mt-20">
                  {text}
                </h2>
              );
            }
            if (trimmed.startsWith("### ")) {
              const text = trimmed.replace("### ", "");
              const id = text.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-");
              return (
                <h3 key={lIdx} id={id} className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 pt-4 scroll-mt-20">
                  {text}
                </h3>
              );
            }
            if (trimmed.startsWith("---")) {
              return <hr key={lIdx} className="border-slate-200 dark:border-slate-800/80 my-6" />;
            }
            if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
              return (
                <li key={lIdx} className="ml-5 list-disc text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                  {trimmed.replace(/^[-*]\s+/, "")}
                </li>
              );
            }

            return (
              <p key={lIdx} className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                {trimmed}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 font-sans selection:bg-[#D32F2F] selection:text-white pb-20">
      
      {/* Feature 2.1: Fixed Reading Progress Bar Top Indicator */}
      <div
        style={{ width: `${scrollProgress}%` }}
        className="fixed top-0 left-0 h-1 bg-[#D32F2F] z-50 transition-all duration-75 ease-out shadow-xs"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* 1. TOP NAV BREADCRUMB */}
        <div className="flex items-center justify-between">
          <Link
            href="/posts"
            onClick={() => soundFx.playClick()}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-sans text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-xs group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Artikel</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-xs"
              title="Salin Link Artikel"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 2. ARTICLE HEADER META */}
        <div className="space-y-4 text-left">
          <div className="flex flex-wrap items-center gap-3 text-xs font-sans text-slate-500">
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              {article.category || "Tutorial"}
            </span>

            {article.readTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#D32F2F]" />
                <span>{article.readTime}</span>
              </span>
            )}

            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#D32F2F]" />
              <span>{new Date(article.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
            {article.title}
          </h1>

          {/* Author Card */}
          <div className="flex items-center gap-3 pt-2 pb-4 border-b border-slate-200 dark:border-slate-800/80">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#D32F2F]">
              <Image
                src={article.authorAvatar || "/images/avatar.webp"}
                alt={article.authorName || "Author"}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{article.authorName || "Brimas Pradika Utama"}</p>
              <p className="text-xs text-slate-500 font-sans">AI Systems Developer · SMK Bhakti Mulia Pare</p>
            </div>
          </div>
        </div>

        {/* 3. HERO THUMBNAIL IMAGE */}
        {article.thumbnail && (
          <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-xs">
            <Image
              src={article.thumbnail}
              alt={article.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        {/* 4. MAIN ARTICLE CONTENT WITH SIDEBAR TABLE OF CONTENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Feature 2.3: Interactive Table of Contents Sidebar */}
          {toc.length > 0 && (
            <aside className="lg:col-span-1 order-2 lg:order-1">
              <div className="sticky top-24 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0E1015] space-y-3 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <List className="w-4 h-4 text-[#D32F2F]" />
                  <span>Daftar Isi</span>
                </div>
                <nav className="space-y-1.5 text-xs font-sans">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(item.id);
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`block py-1 px-2 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-[#D32F2F] ${
                        item.level === 3 ? "pl-4 text-[11px]" : "font-medium text-xs"
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Article Text Content */}
          <main className={`${toc.length > 0 ? "lg:col-span-3 order-1 lg:order-2" : "col-span-4"}`}>
            <article className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0E1015] shadow-xs space-y-6">
              {renderContent(article.content)}
            </article>
          </main>

        </div>

        {/* 5. REACTION & Feature 2.2 SOCIAL SHARE BAR */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0E1015] flex flex-wrap items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleReaction("LIKE")}
              disabled={isPending}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium transition-all cursor-pointer ${
                article.userReaction === "LIKE"
                  ? "bg-[#D32F2F] text-white border-[#D32F2F]"
                  : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
              }`}
            >
              <Heart className={`w-4 h-4 ${article.userReaction === "LIKE" ? "fill-white" : "text-[#D32F2F]"}`} />
              <span>Suka ({article.likeCount})</span>
            </button>

            <button
              onClick={() => handleReaction("DISLIKE")}
              disabled={isPending}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium transition-all cursor-pointer ${
                article.userReaction === "DISLIKE"
                  ? "bg-slate-700 text-white border-slate-600"
                  : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
              }`}
            >
              <ThumbsDown className="w-4 h-4 text-slate-500" />
              <span>Tidak Suka ({article.dislikeCount})</span>
            </button>
          </div>

          {/* Feature 2.2: Social Media Share Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Bagikan:</span>
            
            <button
              onClick={() => handleSocialShare("wa")}
              className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-all cursor-pointer shadow-xs"
              title="Bagikan ke WhatsApp"
            >
              WhatsApp
            </button>

            <button
              onClick={() => handleSocialShare("tw")}
              className="px-3 py-1.5 rounded-full bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium transition-all cursor-pointer shadow-xs"
              title="Bagikan ke X (Twitter)"
            >
              X / Twitter
            </button>

            <button
              onClick={() => handleSocialShare("li")}
              className="px-3 py-1.5 rounded-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-medium transition-all cursor-pointer shadow-xs"
              title="Bagikan ke LinkedIn"
            >
              LinkedIn
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-xs"
              title="Salin Tautan"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6. COMMENTS SECTION */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100">
            <MessageSquare className="w-5 h-5 text-[#D32F2F]" />
            <span>Komentar ({article.commentCount})</span>
          </div>

          {/* Add Comment Box */}
          <form onSubmit={handleAddComment} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0E1015] space-y-3 shadow-xs">
            {user ? (
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Menulis sebagai <strong className="text-slate-900 dark:text-slate-100">{user.user_metadata?.full_name || user.email?.split("@")[0]}</strong></span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-sans flex items-center justify-between gap-2">
                <span>Anda belum masuk akun. Silakan login untuk mengirim komentar.</span>
                <Link
                  href="/login"
                  className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-medium hover:bg-amber-400 transition-all shrink-0"
                >
                  Masuk Akun
                </Link>
              </div>
            )}

            <textarea
              rows={3}
              placeholder="Tuliskan pandangan Anda..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={!user || isPending}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs font-sans focus:outline-none focus:border-[#D32F2F] transition-all disabled:opacity-50"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!user || !commentText.trim() || isPending}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D32F2F] hover:bg-[#B91C1C] text-white text-xs font-medium transition-all disabled:opacity-40 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Komentar</span>
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {article.comments.length === 0 ? (
              <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1015] text-center text-slate-500 font-sans text-xs shadow-xs">
                Belum ada komentar.
              </div>
            ) : (
              article.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0E1015] space-y-2 text-left shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#D32F2F] text-white font-bold text-xs flex items-center justify-center">
                        {comment.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-slate-900 dark:text-slate-100">{comment.user.name}</p>
                        <p className="text-[11px] text-slate-500 font-sans">
                          {new Date(comment.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>

                    {user && user.id === comment.user_id && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={isPending}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        title="Hapus komentar saya"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans pl-9">
                    {comment.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 7. RELATED ARTICLES */}
        {relatedArticles.length > 0 && (
          <section className="space-y-4 pt-8 border-t border-slate-200 dark:border-slate-800/80">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Artikel Terkait
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArticles.slice(0, 2).map((rel) => (
                <Link
                  key={rel.id}
                  href={`/posts/${rel.slug}`}
                  onClick={() => soundFx.playClick()}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0E1015] hover:border-slate-300 dark:hover:border-slate-700 transition-all flex gap-3 items-center group shadow-xs cursor-pointer"
                >
                  <div className="relative w-20 h-16 rounded-lg bg-slate-100 dark:bg-slate-900 overflow-hidden shrink-0">
                    {rel.thumbnail ? (
                      <Image src={rel.thumbnail} alt={rel.title} fill className="object-cover group-hover:scale-105 transition-transform" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-900">
                        <BookOpen className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 group-hover:text-[#D32F2F] transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-sans">{rel.readTime || "5 min read"}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Toast Popup Notification */}
      {toastMsg && (
        <div className="fixed bottom-10 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#D32F2F] text-white font-medium text-xs shadow-md">
          {toastMsg}
        </div>
      )}
    </div>
  );
}

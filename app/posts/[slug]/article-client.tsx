"use client";

import { useState, useTransition } from "react";
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
} from "lucide-react";

import {
  ArticleDetail,
  ArticleItem,
  toggleArticleReaction,
  addArticleComment,
  deleteArticleComment,
} from "@/lib/actions/article";
import { soundFx } from "@/lib/audio/sound";

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

  const showToast = (msg: string) => {
    try {
      soundFx.playClick();
    } catch {}
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // 1. Handle Like / Dislike Reaction
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

  // 2. Handle Adding Comment
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

  // 3. Handle Deleting Comment
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

  // 4. Share Article URL
  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      showToast("Link artikel berhasil disalin ke clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // 5. Copy Code Snippet
  const handleCopyCode = (codeText: string, index: number) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(codeText);
      setCopiedCodeIndex(index);
      showToast("Kode berhasil disalin!");
      setTimeout(() => setCopiedCodeIndex(null), 2000);
    }
  };

  // Render article content with code blocks & markdown elements
  const renderContent = (content: string) => {
    const blocks = content.split("```");
    return blocks.map((block, idx) => {
      if (idx % 2 === 1) {
        const firstLineEnd = block.indexOf("\n");
        const lang = firstLineEnd !== -1 ? block.slice(0, firstLineEnd).trim() : "code";
        const code = firstLineEnd !== -1 ? block.slice(firstLineEnd + 1).trim() : block.trim();

        return (
          <div key={idx} className="my-6 rounded-xl border border-black/15 bg-[#1E293B] text-white overflow-hidden shadow-xl">
            <div className="px-4 py-2.5 bg-[#0F172A] border-b border-white/10 flex items-center justify-between font-mono text-xs text-white/70">
              <span className="uppercase tracking-wider font-bold text-[#DC2626]">{lang || "CODE"}</span>
              <button
                onClick={() => handleCopyCode(code, idx)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer text-[11px]"
              >
                {copiedCodeIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Kode</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-xs sm:text-sm font-mono text-emerald-300 overflow-x-auto leading-relaxed">
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
              return (
                <h2 key={lIdx} className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1A1A1A] pt-6 border-b border-black/10 pb-2">
                  {trimmed.replace("## ", "")}
                </h2>
              );
            }
            if (trimmed.startsWith("### ")) {
              return (
                <h3 key={lIdx} className="text-lg sm:text-xl font-bold text-[#1A1A1A] pt-4">
                  {trimmed.replace("### ", "")}
                </h3>
              );
            }
            if (trimmed.startsWith("---")) {
              return <hr key={lIdx} className="border-black/10 my-6" />;
            }
            if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
              return (
                <li key={lIdx} className="ml-5 list-disc text-sm text-black/80 leading-relaxed font-sans">
                  {trimmed.replace(/^[-*]\s+/, "")}
                </li>
              );
            }

            return (
              <p key={lIdx} className="text-sm sm:text-base text-black/85 leading-relaxed font-sans">
                {trimmed}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans selection:bg-[#DC2626] selection:text-white pb-20">
      
      {/* Top Header Light Red Glow */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#DC2626]/10 via-[#DC2626]/5 to-transparent pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* 1. TOP NAV BREADCRUMB */}
        <div className="flex items-center justify-between">
          <Link
            href="/posts"
            onClick={() => soundFx.playClick()}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-black/15 text-xs font-mono text-black/70 hover:text-black hover:border-black/30 transition-all cursor-pointer shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Daftar Artikel</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white border border-black/15 text-black/80 hover:text-black hover:bg-gray-100 transition-all cursor-pointer shadow-sm"
              title="Bagikan Artikel"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 2. ARTICLE HEADER META */}
        <div className="space-y-4 text-left">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="px-3 py-1 rounded-full bg-[#DC2626]/10 border border-[#DC2626]/30 text-[#DC2626] font-bold uppercase tracking-wider">
              {article.category || "Tutorial"}
            </span>

            {article.readTime && (
              <span className="flex items-center gap-1.5 text-black/60">
                <Clock className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>{article.readTime}</span>
              </span>
            )}

            <span className="flex items-center gap-1.5 text-black/60">
              <Calendar className="w-3.5 h-3.5 text-[#DC2626]" />
              <span>{new Date(article.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#1A1A1A] leading-tight">
            {article.title}
          </h1>

          {/* Author Card */}
          <div className="flex items-center gap-3 pt-2 pb-4 border-b border-black/10">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#DC2626] bg-[#DC2626]">
              <Image
                src={article.authorAvatar || "/images/avatar.webp"}
                alt={article.authorName || "Author"}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <p className="font-bold text-sm text-[#1A1A1A]">{article.authorName || "Brimas Pradika Utama"}</p>
              <p className="text-xs text-black/60 font-mono">AI Systems Developer &bull; SMK Bhakti Mulia Pare</p>
            </div>
          </div>
        </div>

        {/* 3. HERO THUMBNAIL IMAGE */}
        {article.thumbnail && (
          <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden border border-black/10 shadow-xl bg-gray-100">
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 4. ARTICLE BODY CONTENT */}
        <article className="p-6 sm:p-8 rounded-2xl border border-black/10 bg-white shadow-xl space-y-6">
          {renderContent(article.content)}
        </article>

        {/* 5. REACTION & SHARE BAR */}
        <div className="p-4 rounded-2xl border border-black/10 bg-white flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            {/* Like Button */}
            <button
              onClick={() => handleReaction("LIKE")}
              disabled={isPending}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-mono font-bold transition-all cursor-pointer ${
                article.userReaction === "LIKE"
                  ? "bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30"
                  : "bg-black/5 border-black/10 text-black/80 hover:border-red-500/50 hover:text-black"
              }`}
            >
              <Heart className={`w-4 h-4 ${article.userReaction === "LIKE" ? "fill-white" : "text-red-500"}`} />
              <span>Suka ({article.likeCount})</span>
            </button>

            {/* Dislike Button */}
            <button
              onClick={() => handleReaction("DISLIKE")}
              disabled={isPending}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-mono font-bold transition-all cursor-pointer ${
                article.userReaction === "DISLIKE"
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-black/5 border-black/10 text-black/80 hover:border-black/30 hover:text-black"
              }`}
            >
              <ThumbsDown className="w-4 h-4 text-black/60" />
              <span>Tidak Suka ({article.dislikeCount})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-mono font-bold transition-all cursor-pointer shadow-md shadow-[#DC2626]/30"
            >
              <Share2 className="w-4 h-4" />
              <span>Bagikan</span>
            </button>
          </div>
        </div>

        {/* 6. COMMENTS SECTION */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center gap-2 font-display text-xl font-black uppercase text-[#1A1A1A]">
            <MessageSquare className="w-5 h-5 text-[#DC2626]" />
            <span>Komentar Pembaca ({article.commentCount})</span>
          </div>

          {/* Add Comment Box */}
          <form onSubmit={handleAddComment} className="p-4 rounded-2xl border border-black/10 bg-white space-y-3 shadow-md">
            {user ? (
              <div className="flex items-center gap-2 text-xs font-mono text-black/70">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Menulis sebagai <strong className="text-black">{user.user_metadata?.full_name || user.email?.split("@")[0]}</strong></span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs font-mono flex items-center justify-between gap-2">
                <span>Anda belum masuk akun. Silakan login untuk mengirim komentar.</span>
                <Link
                  href="/login"
                  className="px-3 py-1 rounded-full bg-amber-500 text-black font-bold hover:bg-amber-400 transition-all shrink-0"
                >
                  Masuk Akun
                </Link>
              </div>
            )}

            <textarea
              rows={3}
              placeholder="Tuliskan pandangan atau pertanyaan Anda mengenai artikel ini..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={!user || isPending}
              className="w-full p-3 rounded-xl bg-black/5 border border-black/10 text-black placeholder:text-black/40 text-xs font-sans focus:outline-none focus:border-[#DC2626] transition-all disabled:opacity-50"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!user || !commentText.trim() || isPending}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-mono font-bold transition-all disabled:opacity-40 cursor-pointer shadow-md shadow-[#DC2626]/30"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Komentar</span>
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {article.comments.length === 0 ? (
              <div className="p-6 rounded-xl border border-black/10 bg-white text-center text-black/40 font-mono text-xs shadow-sm">
                Belum ada komentar. Jadilah pembaca pertama yang berdiskusi!
              </div>
            ) : (
              article.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 rounded-xl border border-black/10 bg-white space-y-2 text-left shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#DC2626] text-white font-bold text-xs flex items-center justify-center">
                        {comment.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-[#1A1A1A]">{comment.user.name}</p>
                        <p className="text-[10px] text-black/40 font-mono">
                          {new Date(comment.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>

                    {user && user.id === comment.user_id && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={isPending}
                        className="text-black/40 hover:text-red-600 transition-colors p-1"
                        title="Hapus komentar saya"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-black/80 leading-relaxed font-sans pl-9">
                    {comment.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 7. RELATED ARTICLES */}
        {relatedArticles.length > 0 && (
          <section className="space-y-4 pt-8 border-t border-black/10">
            <h3 className="font-display text-xl font-black uppercase text-[#1A1A1A]">
              Artikel <span className="text-[#DC2626]">Terkait Lainnya</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArticles.slice(0, 2).map((rel) => (
                <Link
                  key={rel.id}
                  href={`/posts/${rel.slug}`}
                  onClick={() => soundFx.playClick()}
                  className="p-4 rounded-xl border border-black/10 bg-white hover:border-[#DC2626]/50 transition-all flex gap-3 items-center group shadow-sm"
                >
                  <div className="w-20 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    {rel.thumbnail ? (
                      <img src={rel.thumbnail} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <BookOpen className="w-6 h-6 text-black/30" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-[#1A1A1A] group-hover:text-[#DC2626] transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="text-[11px] text-black/40 font-mono">{rel.readTime || "5 min read"}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Toast Popup Notification */}
      {toastMsg && (
        <div className="fixed bottom-10 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#DC2626] text-white font-bold text-xs font-mono shadow-xl">
          {toastMsg}
        </div>
      )}
    </div>
  );
}

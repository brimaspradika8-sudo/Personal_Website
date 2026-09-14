"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  CheckCircle2,
  AlertCircle,
  Save,
  Trash2,
  Sparkles,
} from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";
import { createArticle, uploadArticleImage } from "@/lib/actions/article";
import { soundFx } from "@/lib/audio/sound";

const DRAFT_KEY = "article_draft_new";

export default function TambahArtikelPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Feature 1.1: Auto-save draft indicator state
  const [hasDraft, setHasDraft] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedDraft = localStorage.getItem(DRAFT_KEY);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          return Boolean(parsed.title || parsed.content);
        }
      } catch {}
    }
    return false;
  });
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Save to localStorage automatically on state change (Feature 1.1)
  useEffect(() => {
    if (title || content || slug || thumbnail) {
      const timer = setTimeout(() => {
        try {
          localStorage.setItem(
            DRAFT_KEY,
            JSON.stringify({ title, slug, content, thumbnail, updatedAt: new Date().toISOString() })
          );
          setLastSavedTime(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
        } catch {}
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [title, slug, content, thumbnail]);

  const handleRestoreDraft = () => {
    soundFx.playClick();
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.slug) setSlug(parsed.slug);
        if (parsed.content) setContent(parsed.content);
        if (parsed.thumbnail) setThumbnail(parsed.thumbnail);
        setStatusMsg({ type: "success", text: "Draf berhasil dipulihkan!" });
      }
    } catch {}
    setHasDraft(false);
  };

  const handleClearDraft = () => {
    soundFx.playClick();
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
    setLastSavedTime(null);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-");
    setSlug(generatedSlug);
  };

  // Upload thumbnail gambar ke Supabase Storage (Subtask 6)
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumbnail(true);
    setStatusMsg(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadArticleImage(formData);

    if ("error" in res && res.error) {
      setStatusMsg({ type: "error", text: res.error });
    } else if ("url" in res && res.url) {
      setThumbnail(res.url);
      setStatusMsg({ type: "success", text: "Gambar thumbnail berhasil diunggah ke Supabase Storage!" });
    }

    setUploadingThumbnail(false);
  };

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStatusMsg(null);

    if (!title.trim() || !slug.trim() || !content.trim()) {
      setStatusMsg({ type: "error", text: "Judul, slug, dan konten artikel wajib diisi." });
      return;
    }

    setLoading(true);

    const res = await createArticle({
      title,
      slug,
      content,
      thumbnail: thumbnail.trim() || undefined,
    });

    setLoading(false);

    if (res.error) {
      setStatusMsg({ type: "error", text: res.error });
    } else {
      localStorage.removeItem(DRAFT_KEY);
      setStatusMsg({ type: "success", text: "Artikel baru berhasil diterbitkan!" });
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1000);
    }
  }, [title, slug, content, thumbnail, router]);

  // Feature 1.3: Keyboard Shortcut (Ctrl+S / Cmd+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSubmit]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 pb-20 sm:pb-8">
      
      {/* Top Header */}
      <header className="h-16 sticky top-0 z-30 backdrop-blur-md bg-white/80 dark:bg-[#0B0F17]/80 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-slate-600 dark:text-slate-400"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-tight">
              Tambah Artikel Baru
            </h1>
            <span className="hidden md:inline-block text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
              Tekan Ctrl+S untuk simpan
            </span>
          </div>
        </div>

        {/* Feature 1.1: Live Auto-save Status Indicator */}
        {lastSavedTime && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <Save className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Tersimpan {lastSavedTime}</span>
          </div>
        )}
      </header>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Feature 1.1: Restore Draft Banner */}
        {hasDraft && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-medium flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
              <span>Draf tulisan sebelumnya terdeteksi di perangkat ini.</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleRestoreDraft}
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors shadow-xs"
              >
                Pulihkan Draf
              </button>
              <button
                onClick={handleClearDraft}
                className="p-1.5 rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
                title="Hapus Draf"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {statusMsg && (
          <div
            className={`p-4 rounded-2xl border text-xs font-medium flex items-center gap-2.5 ${
              statusMsg.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-500"
            }`}
          >
            {statusMsg.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Card Container */}
          <div className="bg-white dark:bg-[#0E1015] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            
            {/* Field: Judul */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Judul Artikel <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Contoh: Membangun Aplikasi Web Modern dengan Next.js & Supabase"
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-[#D32F2F] transition-all"
              />
            </div>

            {/* Field: Slug */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="membangun-aplikasi-web-modern-dengan-nextjs-supabase"
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-[#D32F2F] transition-all"
              />
            </div>

            {/* Field: Thumbnail (Subtask 6) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Thumbnail Artikel
                </label>
                <label className="cursor-pointer bg-[#D32F2F] hover:bg-[#B91C1C] text-white px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingThumbnail ? "Mengunggah..." : "Upload ke Supabase"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    disabled={uploadingThumbnail}
                    className="hidden"
                  />
                </label>
              </div>

              <input
                type="text"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://... atau gunakan tombol upload di atas"
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-[#D32F2F] transition-all"
              />

              {thumbnail && (
                <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 mt-2 bg-slate-100 dark:bg-slate-900">
                  <Image src={thumbnail} alt="Preview thumbnail" fill className="object-cover" />
                </div>
              )}
            </div>

            {/* Field: Konten Artikel dengan Rich Text Editor TipTap (Subtask 4 & 7) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Konten Artikel (Rich Text Editor) <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Tulis artikel dan sisipkan gambar di sini..."
              />
            </div>

          </div>

          {/* Feature 1.4: Mobile Sticky Action Bar */}
          <div className="fixed bottom-0 inset-x-0 sm:static bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-md p-4 sm:p-0 border-t border-slate-200 dark:border-slate-800 sm:border-0 z-40 sm:z-auto flex items-center justify-end gap-3 shadow-lg sm:shadow-none">
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-2xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-2xl bg-[#D32F2F] hover:bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "Menerbitkan..." : "Terbitkan Artikel"}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}

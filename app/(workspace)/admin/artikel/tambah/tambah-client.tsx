"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Save,
  Trash2,
  Sparkles,
  Plus,
  X,
  FileText,
  Clock,
  Zap,
} from "lucide-react";
import dynamic from "next/dynamic";
import { createArticle, uploadArticleImage } from "@/lib/actions/article";
import { soundFx } from "@/lib/audio/sound";
import { useDebouncedAction } from "@/lib/hooks/useDebouncedAction";
import { useDebounce } from "@/lib/hooks/useDebounce";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-72 border-4 border-black dark:border-white bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center text-xs text-slate-500 gap-2">
      <div className="w-6 h-6 border-3 border-[#166534] border-t-transparent animate-spin" />
      <span>MEMUAT EDITOR ARTIKEL NEO-BRUTALIST...</span>
    </div>
  ),
});

const DRAFT_KEY = "article_draft_new";
const MAX_DRAFT_BYTES = 750_000;

export default function TambahArtikelClient() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const debouncedTitle = useDebounce(title, 400);
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  // Auto-generate slug when debouncedTitle changes
  useEffect(() => {
    if (debouncedTitle.trim()) {
      const generatedSlug = debouncedTitle
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-");
      setSlug(generatedSlug);
    }
  }, [debouncedTitle]);

  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Auto-save draft indicator state
  const [hasDraft, setHasDraft] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Calculate word count & estimated read time
  const cleanContentText = content.replace(/<[^>]*>/g, " ").trim();
  const wordCount = cleanContentText ? cleanContentText.split(/\s+/).filter(Boolean).length : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.title || parsed.content) {
          setHasDraft(true);
        }
      }
    } catch {}
  }, []);

  // Keep the draft durable without allowing large editor content to grow storage indefinitely.
  useEffect(() => {
    if (title || content || slug || thumbnail) {
      const timer = setTimeout(() => {
        try {
          const draft = JSON.stringify({ title, slug, content, thumbnail });
          if (new Blob([draft]).size > MAX_DRAFT_BYTES) return;
          localStorage.setItem(DRAFT_KEY, draft);
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
        setStatusMsg({ type: "success", text: "Draf tulisan berhasil dipulihkan!" });
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
  };

  // Upload thumbnail gambar ke Supabase Storage
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
      setStatusMsg({ type: "success", text: "Gambar cover berhasil diunggah ke Supabase Storage!" });
    }

    setUploadingThumbnail(false);
  };

  const debouncedSubmit = useDebouncedAction(async () => {
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
        router.push("/dashboard/artikel");
        router.refresh();
      }, 1000);
    }
  }, 700);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loading) return;
    await debouncedSubmit();
  }, [loading, debouncedSubmit]);

  // Keyboard Shortcut (Ctrl+S / Cmd+S)
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
    <div className="min-h-screen bg-[#F4F4F0] dark:bg-[#05080E] text-black dark:text-white antialiased pb-24">
      
      {/* Sticky Header Navigation */}
      <header className="h-16 border-b-4 border-black dark:border-white px-4 sm:px-8 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-[#0E131F]/95 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/artikel"
            onClick={() => soundFx.playClick()}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border-2 border-black dark:border-white text-black dark:text-white hover:bg-[#EAB308] hover:text-black transition-all flex items-center gap-1.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            title="Kembali ke Studio Artikel"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Studio Artikel</span>
          </Link>

          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#166534] text-white border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse" />
            EDITOR ARTIKEL
          </span>
        </div>

        <div className="flex items-center gap-3">
          {lastSavedTime && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 ">
              <Save className="w-3.5 h-3.5 text-[#166534] dark:text-[#00FF66] animate-pulse" />
              <span>Otomatis Tersimpan {lastSavedTime}</span>
            </div>
          )}

          <button
            onClick={() => handleSubmit()}
            disabled={loading}
            className="px-4 py-2 bg-[#00FF66] text-black border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#EAB308] transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>{loading ? "Menerbitkan..." : "Terbitkan (Ctrl+S)"}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-10 space-y-6">
        
        {/* Restore Draft Banner */}
        {hasDraft && (
          <div className="p-4 bg-[#FEF08A] text-slate-950 border-4 border-black text-xs font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-[#166534]" />
              <span>Draf tulisan sebelumnya terdeteksi di browser ini.</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleRestoreDraft}
                className="px-3 py-1.5 bg-[#166534] text-white border-2 border-black font-black hover:bg-black transition-colors cursor-pointer"
              >
                Pulihkan Draf
              </button>
              <button
                onClick={handleClearDraft}
                className="p-1.5 bg-red-500 text-white border-2 border-black hover:bg-red-700 cursor-pointer"
                title="Hapus Draf"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Status Message Notification */}
        {statusMsg && (
          <div
            className={`p-4 border-4 border-black font-black text-xs flex items-center gap-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
              statusMsg.type === "success"
                ? "bg-[#00FF66] text-slate-950"
                : "bg-red-500 text-white"
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

        <form onSubmit={handleSubmit}>
          
          {/* Layout Editor 2 Kolom */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* KOLOM KIRI: Editor Area (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Field Judul Artikel */}
              <div className="p-6 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-600 dark:text-slate-400 mb-1">
                    JUDUL ARTIKEL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Tulis Judul Artikel Yang Menarik..."
                    className="w-full bg-transparent text-2xl sm:text-3xl font-black text-black dark:text-white placeholder:text-slate-400 focus:outline-none py-2 border-b-3 border-black dark:border-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-600 dark:text-slate-400 mb-1">
                    URL SLUG <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="slug-url-artikel"
                    className="w-full px-4 py-2 border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-900 text-black dark:text-white text-xs focus:outline-none focus:bg-amber-50 dark:focus:bg-slate-800"
                  />
                </div>
              </div>

              {/* Field Editor Konten Artikel */}
              <div className="p-4 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-3">
                <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-2">
                  <span className="text-xs font-black uppercase text-slate-900 dark:text-white">
                    KONTEN ARTIKEL & DOKUMENTASI
                  </span>

                  <div className="flex items-center gap-4 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-[#166534] dark:text-[#00FF66]" /> {wordCount} Kata
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#EAB308]" /> ~{readTimeMinutes} Min Baca
                    </span>
                  </div>
                </div>

                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Mulai ketik konten artikel Anda di sini..."
                />
              </div>

            </div>

            {/* KOLOM KANAN: Sidebar Cover & Meta (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Section 01: COVER IMAGE DROPZONE */}
              <div className="p-5 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4">
                <div className="text-xs font-black uppercase text-slate-900 dark:text-white border-b-2 border-black dark:border-white pb-2">
                  01 FOTO COVER ARTIKEL
                </div>

                <div className="space-y-3">
                  <label className="relative border-3 border-dashed border-black dark:border-white bg-slate-50 dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-slate-800 p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[160px]">
                    {thumbnail ? (
                      <div className="relative w-full h-40 border-2 border-black overflow-hidden">
                        <Image src={thumbnail} alt="Cover preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-xs font-black text-black bg-[#EAB308] px-3 py-1.5 border-2 border-black">
                            Ganti Gambar
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-[#166534] border-2 border-black flex items-center justify-center text-white mb-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-black text-black dark:text-white">
                          {uploadingThumbnail ? "MENGUNGGAH GAMBAR..." : "UNGGAH FOTO COVER"}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-1">
                          JPG, PNG atau WebP (Maks 5MB)
                        </span>
                      </>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      disabled={uploadingThumbnail}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="text"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="Atau tempel URL gambar di sini..."
                    className="w-full px-3 py-2 border-2 border-black dark:border-white bg-white dark:bg-slate-900 text-xs focus:outline-none"
                  />

                  {thumbnail && (
                    <button
                      type="button"
                      onClick={() => setThumbnail("")}
                      className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Hapus Cover Image
                    </button>
                  )}
                </div>
              </div>

              {/* Section 02: PUBLISH CARD */}
              <div className="p-5 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4">
                <div className="text-xs font-black uppercase text-slate-900 dark:text-white border-b-2 border-black dark:border-white pb-2">
                  02 TERBITKAN ARTIKEL
                </div>

                <div className="space-y-2 text-xs ">
                  <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500">Status</span>
                    <span className="font-bold text-[#166534] dark:text-[#00FF66] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#00FF66]" /> Live Saat Diterbitkan
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500">Kategori</span>
                    <span className="font-bold text-black dark:text-white">Tutorial / AI</span>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#00FF66] text-black border-3 border-black font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#EAB308] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? "MENERBITKAN..." : "TERBITKAN ARTIKEL"}</span>
                  </button>

                  <Link
                    href="/dashboard/artikel"
                    className="block w-full py-2.5 text-center border-2 border-black dark:border-white bg-slate-100 dark:bg-slate-900 text-xs font-bold text-black dark:text-white hover:bg-slate-200 transition-colors"
                  >
                    Batal & Kembali
                  </Link>
                </div>
              </div>

            </div>

          </div>

        </form>

      </div>

    </div>
  );
}

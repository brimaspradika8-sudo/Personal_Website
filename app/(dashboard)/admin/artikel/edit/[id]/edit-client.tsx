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
  Plus,
  X,
  FileText,
  Clock,
  Zap,
} from "lucide-react";
import dynamic from "next/dynamic";
import { ArticleItem, updateArticle, uploadArticleImage } from "@/lib/actions/article";
import { soundFx } from "@/lib/audio/sound";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-72 border-4 border-black dark:border-white bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center text-xs font-mono text-slate-500 gap-2">
      <div className="w-6 h-6 border-3 border-[#166534] border-t-transparent animate-spin" />
      <span>MEMUAT EDITOR ARTIKEL...</span>
    </div>
  ),
});

interface EditArtikelClientProps {
  article: ArticleItem;
}

export default function EditArtikelClient({ article }: EditArtikelClientProps) {
  const router = useRouter();
  const [title, setTitle] = useState(article.title);
  const [slug, setSlug] = useState(article.slug);
  const [content, setContent] = useState(article.content);
  const [thumbnail, setThumbnail] = useState(article.thumbnail || "");

  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Calculate word count & estimated read time
  const cleanContentText = content.replace(/<[^>]*>/g, " ").trim();
  const wordCount = cleanContentText ? cleanContentText.split(/\s+/).filter(Boolean).length : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

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
      setStatusMsg({ type: "success", text: "Gambar cover berhasil diperbarui di Supabase Storage!" });
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

    const res = await updateArticle(article.id, {
      title,
      slug,
      content,
      thumbnail: thumbnail.trim() || undefined,
    });

    setLoading(false);

    if (res.error) {
      setStatusMsg({ type: "error", text: res.error });
    } else {
      setStatusMsg({ type: "success", text: "Perubahan artikel berhasil disimpan!" });
      setTimeout(() => {
        router.push("/dashboard/artikel");
        router.refresh();
      }, 1000);
    }
  }, [article.id, title, slug, content, thumbnail, router]);

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
    <div className="min-h-screen bg-[#F4F4F0] dark:bg-[#05080E] text-black dark:text-white font-mono antialiased pb-24">
      
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

          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#EAB308] text-slate-950 border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
            EDIT ARTIKEL
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit()}
            disabled={loading}
            className="px-4 py-2 bg-[#00FF66] text-black border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#EAB308] transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>{loading ? "Menyimpan..." : "Simpan (Ctrl+S)"}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-10 space-y-6">
        
        {/* Status Message Notification */}
        {statusMsg && (
          <div
            className={`p-4 border-4 border-black font-mono font-black text-xs flex items-center gap-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
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
                  <label className="block text-xs font-mono font-black uppercase text-slate-600 dark:text-slate-400 mb-1">
                    JUDUL ARTIKEL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Tulis Judul Artikel..."
                    className="w-full bg-transparent text-2xl sm:text-3xl font-serif font-black text-black dark:text-white placeholder:text-slate-400 focus:outline-none py-2 border-b-3 border-black dark:border-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-black uppercase text-slate-600 dark:text-slate-400 mb-1">
                    URL SLUG <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="slug-url-artikel"
                    className="w-full px-4 py-2 border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-900 text-black dark:text-white text-xs font-mono focus:outline-none focus:bg-amber-50 dark:focus:bg-slate-800"
                  />
                </div>
              </div>

              {/* Field Editor Konten Artikel */}
              <div className="p-4 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-3">
                <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-2">
                  <span className="text-xs font-mono font-black uppercase text-slate-900 dark:text-white">
                    KONTEN ARTIKEL &amp; DOKUMENTASI
                  </span>

                  <div className="flex items-center gap-4 text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400">
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
                <div className="text-xs font-mono font-black uppercase text-slate-900 dark:text-white border-b-2 border-black dark:border-white pb-2">
                  01 FOTO COVER ARTIKEL
                </div>

                <div className="space-y-3">
                  <label className="relative border-3 border-dashed border-black dark:border-white bg-slate-50 dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-slate-800 p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[160px]">
                    {thumbnail ? (
                      <div className="relative w-full h-40 border-2 border-black overflow-hidden">
                        <Image src={thumbnail} alt="Cover preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-xs font-mono font-black text-black bg-[#EAB308] px-3 py-1.5 border-2 border-black">
                            Ganti Gambar
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-[#166534] border-2 border-black flex items-center justify-center text-white mb-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-mono font-black text-black dark:text-white">
                          {uploadingThumbnail ? "MENGUNGGAH GAMBAR..." : "UNGGAH FOTO COVER"}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 mt-1">
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
                    className="w-full px-3 py-2 border-2 border-black dark:border-white bg-white dark:bg-slate-900 text-xs font-mono focus:outline-none"
                  />

                  {thumbnail && (
                    <button
                      type="button"
                      onClick={() => setThumbnail("")}
                      className="text-[11px] font-mono font-bold text-red-600 dark:text-red-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Hapus Cover Image
                    </button>
                  )}
                </div>
              </div>

              {/* Section 02: UPDATE CARD */}
              <div className="p-5 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4">
                <div className="text-xs font-mono font-black uppercase text-slate-900 dark:text-white border-b-2 border-black dark:border-white pb-2">
                  02 SIMPAN PERUBAHAN
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500">Status</span>
                    <span className="font-bold text-[#166534] dark:text-[#00FF66] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#00FF66]" /> Mode Edit Live
                    </span>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#00FF66] text-black border-3 border-black font-mono font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#EAB308] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}</span>
                  </button>

                  <Link
                    href="/dashboard/artikel"
                    className="block w-full py-2.5 text-center border-2 border-black dark:border-white bg-slate-100 dark:bg-slate-900 text-xs font-mono font-bold text-black dark:text-white hover:bg-slate-200 transition-colors"
                  >
                    Batal &amp; Kembali
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

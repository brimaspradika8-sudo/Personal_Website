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
  Plus,
  X,
} from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";
import { ArticleItem, updateArticle, uploadArticleImage } from "@/lib/actions/article";
import { soundFx } from "@/lib/audio/sound";

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
      setStatusMsg({ type: "success", text: "Gambar thumbnail berhasil diperbarui ke Supabase Storage!" });
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
        router.push("/dashboard");
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
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-[#D32F2F] selection:text-white pb-20">
      
      {/* Top Bar Header */}
      <header className="h-16 border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all text-slate-600 hover:text-slate-900"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              EDITOR / EDIT ENTRY
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-sans text-emerald-800 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Mengedit artikel</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 space-y-8">
        
        {/* Page Title & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Edit Artikel
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-2xl leading-relaxed">
            Perbarui konten, ubah cover image, atau tingkatkan kualitas artikel tulisanmu.
          </p>
        </div>

        {/* Status Message Notification */}
        {statusMsg && (
          <div
            className={`p-4 rounded-2xl border text-xs font-medium flex items-center gap-2.5 ${
              statusMsg.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"
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
          
          {/* Layout Editor 2 Kolom (Image 1 Structure - Light Theme) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* KOLOM KIRI: Main Editor (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Field Judul Artikel (Heading Input Besar + Ghost Placeholder) */}
              <div className="space-y-2">
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Ketik judul artikel..."
                  className="w-full bg-transparent text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all py-1 border-b border-transparent focus:border-slate-300"
                />
                <p className="text-xs text-slate-500 font-sans leading-relaxed">
                  Tulis dengan gaya bahasa dan perspektif personalmu. Ide sederhana seringkali jadi tulisan terbaik.
                </p>
              </div>

              {/* Field URL Slug */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="membangun-aplikasi-web-modern-dengan-nextjs-supabase"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-mono focus:outline-none focus:border-[#D32F2F] shadow-xs transition-all"
                />
              </div>

              {/* Field Konten Artikel dengan Rich Text Editor */}
              <div className="space-y-2 pt-2">
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden p-1 shadow-sm">
                  <RichTextEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Tulis konten artikel dan sisipkan gambar di sini..."
                  />
                </div>
              </div>

            </div>

            {/* KOLOM KANAN: Sidebar Options (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Section 01: COVER IMAGE */}
              <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
                <div className="text-[11px] font-bold text-slate-500 font-mono tracking-wider">
                  01 COVER IMAGE
                </div>

                {/* Box Upload Gambar Cover (Dashed Style) */}
                <div className="space-y-3">
                  <label className="relative border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50 hover:bg-slate-100/80 group min-h-[160px]">
                    {thumbnail ? (
                      <div className="relative w-full h-36 rounded-lg overflow-hidden border border-slate-200">
                        <Image src={thumbnail} alt="Cover preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <span className="text-xs font-medium text-white bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700">
                            Ganti Gambar
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-slate-900 shadow-xs transition-colors mb-2">
                          <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                          {uploadingThumbnail ? "Mengunggah..." : "Unggah gambar cover"}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono mt-1">
                          JPG, PNG atau WebP sampai 5MB
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

                  {/* Fallback Input URL Manual */}
                  <input
                    type="text"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="Atau tempel URL gambar di sini..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-[#D32F2F] transition-all"
                  />

                  {thumbnail && (
                    <button
                      type="button"
                      onClick={() => setThumbnail("")}
                      className="text-[11px] text-red-600 hover:text-red-700 font-medium inline-flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Hapus Gambar Cover
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 font-sans leading-relaxed pt-1">
                  Gambar cover akan ditampilkan di header artikel, kartu daftar jurnal, dan OpenGraph preview.
                </p>
              </div>

              {/* Section 02: PUBLIKASI */}
              <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
                <div className="text-[11px] font-bold text-slate-500 font-mono tracking-wider">
                  02 PUBLIKASI
                </div>

                <div className="space-y-3 font-sans text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Status</span>
                    <span className="font-medium text-emerald-600 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Live saat disimpan
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500">Format</span>
                    <span className="font-medium text-slate-900">Artikel / Jurnal</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-[#D32F2F] hover:bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? "Menyimpan..." : "Simpan Perubahan"}</span>
                  </button>

                  <Link
                    href="/dashboard"
                    className="block w-full py-2.5 text-center rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Batal
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


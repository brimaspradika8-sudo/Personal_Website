"use client";

import { useState } from "react";
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
  FolderGit2,
  Code2,
  ExternalLink,
  UploadCloud,
  FileText,
  Sparkles,
} from "lucide-react";
import { createProject, uploadProjectImage } from "@/lib/actions/project";
import { soundFx } from "@/lib/audio/sound";

export default function TambahProyekClient() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-");
    setSlug(generatedSlug);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setStatusMsg(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadProjectImage(formData);

    if ("error" in res && res.error) {
      setStatusMsg({ type: "error", text: res.error });
    } else if ("url" in res && res.url) {
      setThumbnail(res.url);
      setStatusMsg({ type: "success", text: "Gambar proyek berhasil diunggah ke Supabase Storage!" });
    }

    setUploadingImage(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!title.trim() || !description.trim()) {
      setStatusMsg({ type: "error", text: "Judul dan deskripsi proyek wajib diisi." });
      return;
    }

    setLoading(true);

    const res = await createProject({
      title: title.trim(),
      slug: slug.trim() || undefined,
      description: description.trim(),
      thumbnail: thumbnail.trim() || undefined,
      repository_url: repositoryUrl.trim() || undefined,
      demo_url: demoUrl.trim() || undefined,
    });

    setLoading(false);

    if (res.error) {
      setStatusMsg({ type: "error", text: res.error });
    } else {
      setStatusMsg({ type: "success", text: "Proyek baru berhasil ditambahkan!" });
      setTimeout(() => {
        router.push("/admin/proyek");
        router.refresh();
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F0] dark:bg-[#05080E] text-black dark:text-white font-mono antialiased pb-24">
      
      {/* Sticky Header Navigation */}
      <header className="h-16 border-b-4 border-black dark:border-white px-4 sm:px-8 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-[#0E131F]/95 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/proyek"
            onClick={() => soundFx.playClick()}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border-2 border-black dark:border-white text-black dark:text-white hover:bg-[#EAB308] hover:text-black transition-all flex items-center gap-1.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            title="Kembali ke Kelola Proyek"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kelola Proyek</span>
          </Link>

          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#166534] text-white border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <FolderGit2 className="w-4 h-4 text-[#FFFF00]" />
            TAMBAH PROYEK BARU
          </span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-[#00FF66] text-black border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#EAB308] transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? "Menyimpan..." : "Simpan Proyek"}</span>
        </button>
      </header>

      {/* Main Form Container */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-10 space-y-6">
        
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

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Card 1: Gambar Proyek (Thumbnail Uploader & Preview) */}
          <div className="p-6 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4">
            <div className="flex items-center justify-between border-b-3 border-black dark:border-white pb-3">
              <span className="text-xs font-mono font-black uppercase text-black dark:text-white flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-[#166534] dark:text-[#EAB308]" />
                01. GAMBAR PROYEK (THUMBNAIL)
              </span>
              <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">OPSIONAL / OPSIONAL</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Upload Dropzone */}
              <div className="md:col-span-7 space-y-3">
                <label className="relative border-3 border-dashed border-black dark:border-white bg-slate-50 dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-slate-800 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[160px]">
                  <UploadCloud className="w-8 h-8 text-[#166534] dark:text-[#EAB308] mb-2" />
                  <span className="text-xs font-mono font-black text-black dark:text-white uppercase">
                    {uploadingImage ? "MENGUNGGAH GAMBAR..." : "KLIK UNTUK UNGGAH GAMBAR"}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500 mt-1">
                    Format: JPG, PNG, WEBP, SVG (Maks. 8MB)
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>

                <div>
                  <label className="block text-[11px] font-mono font-black uppercase text-neutral-600 dark:text-neutral-400 mb-1">
                    ATAU TEMPEL URL GAMBAR LANGSUNG
                  </label>
                  <input
                    type="text"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="https://domain.com/path-to-image.png"
                    className="w-full px-3 py-2 border-2 border-black dark:border-white bg-white dark:bg-slate-900 text-black dark:text-white text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="md:col-span-5 flex flex-col items-center justify-center">
                <div className="w-full h-44 relative bg-slate-200 dark:bg-slate-900 border-3 border-black dark:border-white overflow-hidden flex flex-col items-center justify-center">
                  {thumbnail ? (
                    <>
                      <Image
                        src={thumbnail}
                        alt="Preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setThumbnail("")}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white border border-black cursor-pointer hover:bg-red-800"
                        title="Hapus gambar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-4 space-y-1">
                      <FolderGit2 className="w-8 h-8 text-neutral-400 mx-auto" />
                      <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase block">
                        PREVIEW GAMBAR PROYEK
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Informasi Utama (Judul, Slug, Deskripsi) */}
          <div className="p-6 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4">
            <div className="flex items-center justify-between border-b-3 border-black dark:border-white pb-3">
              <span className="text-xs font-mono font-black uppercase text-black dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#166534] dark:text-[#EAB308]" />
                02. DETAIL PROYEK
              </span>
              <span className="text-[10px] font-mono font-bold text-red-500 uppercase">* WAJIB DIISI</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-black uppercase text-black dark:text-white mb-1">
                  JUDUL PROYEK <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Contoh: Portfolio & Article Studio Platform"
                  className="w-full px-4 py-2.5 border-3 border-black dark:border-white bg-slate-50 dark:bg-slate-900 text-black dark:text-white text-sm font-mono font-bold focus:outline-none focus:bg-amber-50 dark:focus:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-black uppercase text-neutral-600 dark:text-neutral-400 mb-1">
                  URL SLUG (OTOMATIS)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="portfolio-article-studio-platform"
                  className="w-full px-4 py-2 border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-900 text-black dark:text-white text-xs font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-black uppercase text-black dark:text-white mb-1">
                  DESKRIPSI PROYEK <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tuliskan gambaran umum proyek, fitur utama, teknologi yang digunakan, serta tantangan yang diselesaikan..."
                  className="w-full p-4 border-3 border-black dark:border-white bg-slate-50 dark:bg-slate-900 text-black dark:text-white text-xs font-mono font-medium focus:outline-none focus:bg-amber-50 dark:focus:bg-slate-800 leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Tautan External (GitHub Repo & Deploy URL) */}
          <div className="p-6 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4">
            <div className="flex items-center justify-between border-b-3 border-black dark:border-white pb-3">
              <span className="text-xs font-mono font-black uppercase text-black dark:text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#166534] dark:text-[#EAB308]" />
                03. TAUTAN REPOSITORI & DEPLOY
              </span>
              <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">OPSIONAL (KALAU ADA)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-black uppercase text-black dark:text-white mb-1 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-[#166534]" />
                  LINK REPO GITHUB
                </label>
                <input
                  type="url"
                  value={repositoryUrl}
                  onChange={(e) => setRepositoryUrl(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  className="w-full px-4 py-2.5 border-3 border-black dark:border-white bg-slate-50 dark:bg-slate-900 text-black dark:text-white text-xs font-mono focus:outline-none"
                />
                <span className="text-[10px] font-mono text-neutral-500 mt-1 block">
                  Kosongkan jika proyek bersifat private.
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono font-black uppercase text-black dark:text-white mb-1 flex items-center gap-1.5">
                  <ExternalLink className="w-4 h-4 text-[#EAB308]" />
                  LINK DEPLOY / LIVE DEMO
                </label>
                <input
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://proyek-saya.vercel.app"
                  className="w-full px-4 py-2.5 border-3 border-black dark:border-white bg-slate-50 dark:bg-slate-900 text-black dark:text-white text-xs font-mono focus:outline-none"
                />
                <span className="text-[10px] font-mono text-neutral-500 mt-1 block">
                  Kosongkan jika belum dipublikasikan/offline.
                </span>
              </div>
            </div>
          </div>

          {/* Action Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/admin/proyek"
              className="px-6 py-3 border-3 border-black dark:border-white bg-slate-200 dark:bg-slate-900 text-black dark:text-white text-xs font-mono font-black uppercase hover:bg-slate-300 transition-colors"
            >
              BATAL
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#00FF66] text-black border-3 border-black font-mono font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#EAB308] transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "MENYIMPAN PROYEK..." : "SIMPAN PROYEK"}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}

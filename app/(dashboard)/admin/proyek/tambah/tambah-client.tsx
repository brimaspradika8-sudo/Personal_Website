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
  Trash2,
  Images,
} from "lucide-react";
import { createProject, uploadProjectImage } from "@/lib/actions/project";
import { soundFx } from "@/lib/audio/sound";

export default function TambahProyekClient() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Upload single file and add to images list (max 5)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length >= 5) {
      setStatusMsg({ type: "error", text: "Maksimal 5 gambar per proyek." });
      return;
    }

    setUploadingImage(true);
    setStatusMsg(null);

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      if (images.length + uploadedUrls.length >= 5) break;
      const formData = new FormData();
      formData.append("file", files[i]);

      const res = await uploadProjectImage(formData);
      if ("url" in res && res.url) {
        uploadedUrls.push(res.url);
      }
    }

    if (uploadedUrls.length > 0) {
      setImages((prev) => [...prev, ...uploadedUrls].slice(0, 5));
      setStatusMsg({ type: "success", text: `${uploadedUrls.length} gambar berhasil diunggah ke Supabase Storage!` });
    } else {
      setStatusMsg({ type: "error", text: "Gagal mengunggah gambar." });
    }

    setUploadingImage(false);
    e.target.value = "";
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    if (images.length >= 5) {
      setStatusMsg({ type: "error", text: "Maksimal 5 gambar per proyek." });
      return;
    }
    setImages((prev) => [...prev, urlInput.trim()].slice(0, 5));
    setUrlInput("");
    setStatusMsg({ type: "success", text: "URL Gambar berhasil ditambahkan!" });
  };

  const handleRemoveImage = (index: number) => {
    soundFx.playClick();
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!title.trim() || !description.trim()) {
      setStatusMsg({ type: "error", text: "Judul dan deskripsi proyek wajib diisi." });
      return;
    }

    setLoading(true);

    // Auto-generate slug behind the scenes
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-");

    // Serialize images list into JSON array string (or empty if none)
    const thumbnailData = images.length > 0 ? (images.length === 1 ? images[0] : JSON.stringify(images)) : undefined;

    const res = await createProject({
      title: title.trim(),
      slug: generatedSlug,
      description: description.trim(),
      thumbnail: thumbnailData,
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
          
          {/* Card 1: GAMBAR PROYEK (Hingga 5 Gambar Carousel) */}
          <div className="p-6 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4">
            <div className="flex items-center justify-between border-b-3 border-black dark:border-white pb-3">
              <span className="text-xs font-mono font-black uppercase text-black dark:text-white flex items-center gap-2">
                <Images className="w-4 h-4 text-[#166534] dark:text-[#EAB308]" />
                01. GAMBAR PROYEK ({images.length}/5 GAMBAR CAROUSEL)
              </span>
              <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
                OPSIONAL (MAKSIMAL 5 GAMBAR)
              </span>
            </div>

            {/* Grid Preview 5 Gambar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[0, 1, 2, 3, 4].map((index) => {
                const imgUrl = images[index];
                return (
                  <div
                    key={index}
                    className="relative w-full h-28 bg-slate-100 dark:bg-slate-900 border-2 border-black dark:border-white overflow-hidden flex flex-col items-center justify-center group"
                  >
                    {imgUrl ? (
                      <>
                        <Image src={imgUrl} alt={`Gambar ${index + 1}`} fill unoptimized className="object-cover" />
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/80 text-[#FFFF00] text-[9px] font-mono font-black border border-black">
                          #{index + 1}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white border border-black cursor-pointer hover:bg-red-800 transition-transform hover:scale-110"
                          title="Hapus gambar ini"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-2 space-y-1">
                        <UploadCloud className="w-5 h-5 text-neutral-400 mx-auto" />
                        <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase block">
                          SLOT #{index + 1}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Inputs Uploader & URL Adder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* File Upload Box */}
              <label className="border-3 border-dashed border-black dark:border-white bg-slate-50 dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-slate-800 p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[100px]">
                <UploadCloud className="w-6 h-6 text-[#166534] dark:text-[#EAB308] mb-1" />
                <span className="text-xs font-mono font-black text-black dark:text-white uppercase">
                  {uploadingImage ? "MENGUNGGAH GAMBAR..." : "UNGGAH FOTO PROYEK"}
                </span>
                <span className="text-[10px] font-mono text-neutral-500">
                  Bisa pilih hingga {5 - images.length} gambar lagi
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploadingImage || images.length >= 5}
                  className="hidden"
                />
              </label>

              {/* Paste URL Box */}
              <div className="space-y-2 flex flex-col justify-center">
                <label className="block text-[11px] font-mono font-black uppercase text-neutral-600 dark:text-neutral-400">
                  ATAU TAMBAH VIA URL GAMBAR
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://domain.com/gambar.png"
                    className="flex-1 px-3 py-2 border-2 border-black dark:border-white bg-white dark:bg-slate-900 text-black dark:text-white text-xs font-mono focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrl}
                    disabled={images.length >= 5 || !urlInput.trim()}
                    className="px-3 py-2 bg-[#166534] text-white border-2 border-black font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#14532D] disabled:opacity-50 cursor-pointer"
                  >
                    Tambah
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Informasi Utama (Judul & Deskripsi, URL Slug hidden) */}
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
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Portfolio & Article Studio Platform"
                  className="w-full px-4 py-2.5 border-3 border-black dark:border-white bg-slate-50 dark:bg-slate-900 text-black dark:text-white text-sm font-mono font-bold focus:outline-none focus:bg-amber-50 dark:focus:bg-slate-800"
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

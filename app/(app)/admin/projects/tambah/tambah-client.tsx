"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Save,
  FolderGit2,
  Code2,
  ExternalLink,
  FileText,
} from "lucide-react";
import { createProject } from "@/lib/actions/project";
import { soundFx } from "@/lib/audio/sound";
import ProjectImageUploader from "@/components/admin/ProjectImageUploader";
import { useDebouncedAction } from "@/lib/hooks/useDebouncedAction";

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

  const debouncedSubmit = useDebouncedAction(async () => {
    setStatusMsg(null);

    if (!title.trim() || !description.trim()) {
      setStatusMsg({ type: "error", text: "Judul dan deskripsi proyek wajib diisi." });
      return;
    }

    setLoading(true);

    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-");

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
  }, 700);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    await debouncedSubmit();
  };

  return (
    <div className="min-h-screen bg-[#F4F4F0] dark:bg-[#05080E] text-black dark:text-white antialiased pb-24">
      
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

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Card 1: GAMBAR PROYEK (Hingga 5 Gambar Drag & Drop) */}
          <ProjectImageUploader
            images={images}
            onChange={setImages}
            uploadingImage={uploadingImage}
            setUploadingImage={setUploadingImage}
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            setStatusMsg={setStatusMsg}
          />

          {/* Card 2: Informasi Utama */}
          <div className="p-6 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4">
            <div className="flex items-center justify-between border-b-3 border-black dark:border-white pb-3">
              <span className="text-xs font-black uppercase text-black dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#166534] dark:text-[#EAB308]" />
                02. DETAIL PROYEK
              </span>
              <span className="text-[10px] font-bold text-red-500 uppercase">* WAJIB DIISI</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-black dark:text-white mb-1">
                  JUDUL PROYEK <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Portfolio & Article Studio Platform"
                  className="w-full px-4 py-2.5 border-3 border-black dark:border-white bg-slate-50 dark:bg-slate-900 text-black dark:text-white text-sm font-bold focus:outline-none focus:bg-amber-50 dark:focus:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-black dark:text-white mb-1">
                  DESKRIPSI PROYEK <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tuliskan gambaran umum proyek, fitur utama, teknologi yang digunakan, serta tantangan yang diselesaikan..."
                  className="w-full p-4 border-3 border-black dark:border-white bg-slate-50 dark:bg-slate-900 text-black dark:text-white text-xs font-medium focus:outline-none focus:bg-amber-50 dark:focus:bg-slate-800 leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Tautan External (GitHub Repo & Deploy URL) */}
          <div className="p-6 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4">
            <div className="flex items-center justify-between border-b-3 border-black dark:border-white pb-3">
              <span className="text-xs font-black uppercase text-black dark:text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#166534] dark:text-[#EAB308]" />
                03. TAUTAN REPOSITORI & DEPLOY
              </span>
              <span className="text-[10px] font-bold text-neutral-500 uppercase">OPSIONAL (KALAU ADA)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-black dark:text-white mb-1 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-[#166534]" />
                  LINK REPO GITHUB
                </label>
                <input
                  type="url"
                  value={repositoryUrl}
                  onChange={(e) => setRepositoryUrl(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  className="w-full px-4 py-2.5 border-3 border-black dark:border-white bg-slate-50 dark:bg-slate-900 text-black dark:text-white text-xs focus:outline-none"
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  Kosongkan jika proyek bersifat private.
                </span>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-black dark:text-white mb-1 flex items-center gap-1.5">
                  <ExternalLink className="w-4 h-4 text-[#EAB308]" />
                  LINK DEPLOY / LIVE DEMO
                </label>
                <input
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://proyek-saya.vercel.app"
                  className="w-full px-4 py-2.5 border-3 border-black dark:border-white bg-slate-50 dark:bg-slate-900 text-black dark:text-white text-xs focus:outline-none"
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  Kosongkan jika belum dipublikasikan/offline.
                </span>
              </div>
            </div>
          </div>

          {/* Action Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/admin/proyek"
              className="px-6 py-3 border-3 border-black dark:border-white bg-slate-200 dark:bg-slate-900 text-black dark:text-white text-xs font-black uppercase hover:bg-slate-300 transition-colors"
            >
              BATAL
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#00FF66] text-black border-3 border-black font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#EAB308] transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
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

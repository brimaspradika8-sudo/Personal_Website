"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FolderKanban,
  FolderGit2,
  Plus,
  ArrowLeft,
  ExternalLink,
  Code2,
  Trash2,
  Edit,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Save,
  Globe,
  Video,
} from "lucide-react";
import { ProjectItem, deleteProject, createProject, updateProject } from "@/lib/actions/project";
import { soundFx } from "@/lib/audio/sound";
import ProjectImageUploader, { isVideoUrl } from "./ProjectImageUploader";
import { parseThumbnailUrls, ensurePublicSupabaseUrl } from "@/lib/supabase/url";

interface AdminProjectsPanelProps {
  initialProjects?: ProjectItem[];
}

export default function AdminProjectsPanel({ initialProjects = [] }: AdminProjectsPanelProps) {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [subView, setSubView] = useState<"list" | "tambah" | "edit">("list");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartTambah = () => {
    soundFx.playClick();
    setEditingProjectId(null);
    setTitle("");
    setDescription("");
    setImages([]);
    setUrlInput("");
    setRepositoryUrl("");
    setDemoUrl("");
    setStatusMsg(null);
    setSubView("tambah");
  };

  const handleStartEdit = (project: ProjectItem) => {
    soundFx.playClick();
    setEditingProjectId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setImages(parseThumbnailUrls(project.thumbnail));
    setUrlInput("");
    setRepositoryUrl(project.repository_url || "");
    setDemoUrl(project.demo_url || "");
    setStatusMsg(null);
    setSubView("edit");
  };

  const handleDelete = async (id: string, projectTitle: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus proyek "${projectTitle}"?`)) return;

    soundFx.playClick();
    setDeletingId(id);
    setStatusMsg(null);

    const res = await deleteProject(id);
    setDeletingId(null);

    if (res.error) {
      setStatusMsg({ type: "error", text: res.error });
    } else {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setStatusMsg({ type: "success", text: `Proyek "${projectTitle}" berhasil dihapus.` });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!title.trim() || !description.trim()) {
      setStatusMsg({ type: "error", text: "Judul dan deskripsi proyek wajib diisi." });
      return;
    }

    setSaving(true);

    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-");

    const thumbnailData = images.length > 0 ? (images.length === 1 ? images[0] : JSON.stringify(images)) : undefined;

    let res;
    if (subView === "edit" && editingProjectId) {
      res = await updateProject(editingProjectId, {
        title: title.trim(),
        slug: generatedSlug,
        description: description.trim(),
        thumbnail: thumbnailData,
        repository_url: repositoryUrl.trim() || undefined,
        demo_url: demoUrl.trim() || undefined,
      });
    } else {
      res = await createProject({
        title: title.trim(),
        slug: generatedSlug,
        description: description.trim(),
        thumbnail: thumbnailData,
        repository_url: repositoryUrl.trim() || undefined,
        demo_url: demoUrl.trim() || undefined,
      });
    }

    setSaving(false);

    if (res.error) {
      setStatusMsg({ type: "error", text: res.error });
    } else {
      const isEdit = subView === "edit";
      setStatusMsg({
        type: "success",
        text: isEdit ? "Proyek berhasil diperbarui!" : "Proyek baru berhasil ditambahkan!",
      });

      if (res.project) {
        const formattedProject: ProjectItem = {
          ...res.project,
          created_at:
            typeof res.project.created_at === "string"
              ? res.project.created_at
              : (res.project.created_at as Date).toISOString(),
          updated_at:
            typeof res.project.updated_at === "string"
              ? res.project.updated_at
              : (res.project.updated_at as Date).toISOString(),
        };

        if (isEdit) {
          setProjects((prev) => prev.map((p) => (p.id === formattedProject.id ? formattedProject : p)));
        } else {
          setProjects((prev) => [formattedProject, ...prev]);
        }
      }

      setTimeout(() => {
        setSubView("list");
        setTitle("");
        setDescription("");
        setImages([]);
        setRepositoryUrl("");
        setDemoUrl("");
        setEditingProjectId(null);
      }, 800);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-4 border-black dark:border-white">
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 bg-[#166534] text-white border-3 border-black text-xs font-mono font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-[#FFFF00]" />
            {subView === "list"
              ? `KELOLA PROYEK (${projects.length})`
              : subView === "edit"
              ? "EDIT PROYEK"
              : "TAMBAH PROYEK BARU"}
          </span>
        </div>

        {subView === "list" ? (
          <button
            type="button"
            onClick={handleStartTambah}
            className="px-5 py-2.5 bg-[#00FF66] text-black border-3 border-black font-mono font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#EAB308] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>TAMBAH PROYEK</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setSubView("list");
            }}
            className="px-5 py-2.5 bg-slate-200 dark:bg-slate-900 text-black dark:text-white border-3 border-black dark:border-white font-mono font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#EAB308] hover:text-black transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>KEMBALI KE DAFTAR</span>
          </button>
        )}
      </div>

      {/* Status Notification */}
      {statusMsg && (
        <div
          className={`p-4 border-4 border-black font-mono font-black text-xs flex items-center gap-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
            statusMsg.type === "success" ? "bg-[#00FF66] text-slate-950" : "bg-red-500 text-white"
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

      {/* SUBVIEW 1: PROYEK LIST */}
      {subView === "list" && (
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="p-4 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul atau deskripsi proyek..."
                className="w-full pl-9 pr-4 py-2 border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-900 text-xs font-mono text-black dark:text-white focus:outline-none"
              />
            </div>

            <Link
              href="/proyek"
              target="_blank"
              onClick={() => soundFx.playClick()}
              className="px-3.5 py-2 border-2 border-black dark:border-white bg-[#EAB308] text-black text-xs font-mono font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#d9a207]"
            >
              <Globe className="w-3.5 h-3.5 text-black" />
              <span>Lihat Halaman Publik</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {/* List Cards */}
          {filteredProjects.length === 0 ? (
            <div className="p-12 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white text-center space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <FolderGit2 className="w-10 h-10 text-[#166534] mx-auto opacity-70" />
              <p className="text-xs font-mono font-black uppercase text-black dark:text-white">
                BELUM ADA PROYEK DALAM DATABASE
              </p>
              <button
                type="button"
                onClick={handleStartTambah}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00FF66] text-black border-3 border-black text-xs font-mono font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>TAMBAH PROYEK PERTAMA</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredProjects.map((p) => {
                const mediaList = parseThumbnailUrls(p.thumbnail);
                const firstMedia = mediaList.length > 0 ? mediaList[0] : null;
                const isVid = firstMedia ? isVideoUrl(firstMedia) : false;

                return (
                  <div
                    key={p.id}
                    className="p-5 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      {/* Media Preview Thumbnail */}
                      <div className="relative w-20 h-20 bg-slate-200 dark:bg-slate-900 border-2 border-black dark:border-white shrink-0 overflow-hidden flex items-center justify-center">
                        {firstMedia ? (
                          isVid ? (
                            <video
                              src={firstMedia}
                              muted
                              loop
                              playsInline
                              preload="metadata"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Image
                              src={firstMedia}
                              alt={p.title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          )
                        ) : (
                          <FolderGit2 className="w-6 h-6 text-neutral-400" />
                        )}
                        {mediaList.length > 1 && (
                          <div className="absolute bottom-0 right-0 bg-black/80 text-[#FFFF00] text-[9px] font-mono px-1 border-t border-l border-black">
                            +{mediaList.length - 1}
                          </div>
                        )}
                      </div>

                      {/* Info & Links */}
                      <div className="space-y-1.5">
                        <h3 className="text-base font-mono font-black uppercase text-black dark:text-white">
                          {p.title}
                        </h3>
                        <p className="text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400 line-clamp-2 max-w-xl">
                          {p.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-mono font-black">
                          {p.repository_url && (
                            <a
                              href={p.repository_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-0.5 bg-[#FEF9C3] dark:bg-slate-800 text-black dark:text-white border border-black flex items-center gap-1"
                            >
                              <Code2 className="w-3 h-3 text-[#166534]" />
                              <span>Repo GitHub</span>
                            </a>
                          )}

                          {p.demo_url && (
                            <a
                              href={p.demo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-0.5 bg-[#DCFCE7] dark:bg-slate-800 text-black dark:text-white border border-black flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3 text-[#EAB308]" />
                              <span>Live Deploy</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions: EDIT & HAPUS */}
                    <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 border-slate-200 dark:border-slate-800 pt-3 md:pt-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(p)}
                        className="px-3.5 py-2 bg-[#EAB308] text-black border-2 border-black font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#d9a207] cursor-pointer flex items-center gap-1.5"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>EDIT</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(p.id, p.title)}
                        disabled={deletingId === p.id}
                        className="px-3.5 py-2 bg-red-600 text-white border-2 border-black font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-800 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>HAPUS</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUBVIEW 2 / 3: FORM TAMBAH / EDIT PROYEK */}
      {(subView === "tambah" || subView === "edit") && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Gambar & Video Proyek (Multi-Media Drag & Drop) */}
          <ProjectImageUploader
            images={images}
            onChange={setImages}
            uploadingImage={uploadingImage}
            setUploadingImage={setUploadingImage}
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            setStatusMsg={setStatusMsg}
          />

          {/* Card 2: Detail Proyek */}
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
                  className="w-full px-4 py-2.5 border-3 border-black dark:border-white bg-slate-50 dark:bg-slate-900 text-black dark:text-white text-sm font-mono font-bold focus:outline-none"
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
                  placeholder="Tuliskan gambaran umum proyek, fitur utama, teknologi yang digunakan..."
                  className="w-full p-4 border-3 border-black dark:border-white bg-slate-50 dark:bg-slate-900 text-black dark:text-white text-xs font-mono font-medium focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Tautan Repositori & Deploy */}
          <div className="p-6 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4">
            <div className="flex items-center justify-between border-b-3 border-black dark:border-white pb-3">
              <span className="text-xs font-mono font-black uppercase text-black dark:text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#166534] dark:text-[#EAB308]" />
                03. TAUTAN REPOSITORI & DEPLOY
              </span>
              <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">OPSIONAL</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-black uppercase text-black dark:text-white mb-1">
                  LINK REPO GITHUB
                </label>
                <input
                  type="url"
                  value={repositoryUrl}
                  onChange={(e) => setRepositoryUrl(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  className="w-full px-4 py-2.5 border-3 border-black dark:border-white bg-slate-50 dark:bg-slate-900 text-black dark:text-white text-xs font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-black uppercase text-black dark:text-white mb-1">
                  LINK DEPLOY / LIVE DEMO
                </label>
                <input
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://proyek-saya.vercel.app"
                  className="w-full px-4 py-2.5 border-3 border-black dark:border-white bg-slate-50 dark:bg-slate-900 text-black dark:text-white text-xs font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setSubView("list");
              }}
              className="px-6 py-3 border-3 border-black dark:border-white bg-slate-200 dark:bg-slate-900 text-black dark:text-white text-xs font-mono font-black uppercase hover:bg-slate-300 transition-colors cursor-pointer"
            >
              BATAL
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-[#00FF66] text-black border-3 border-black font-mono font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#EAB308] transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>
                {saving
                  ? "MENYIMPAN PROYEK..."
                  : subView === "edit"
                  ? "PERBARUI PROYEK"
                  : "SIMPAN PROYEK"}
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

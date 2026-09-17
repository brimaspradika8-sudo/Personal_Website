"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
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
  FolderKanban,
  Globe,
} from "lucide-react";
import { ProjectItem, deleteProject } from "@/lib/actions/project";
import { soundFx } from "@/lib/audio/sound";

interface AdminProjectsClientProps {
  initialProjects: ProjectItem[];
}

export default function AdminProjectsClient({ initialProjects }: AdminProjectsClientProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus proyek "${title}"?`)) return;

    soundFx.playClick();
    setDeletingId(id);
    setStatusMsg(null);

    const res = await deleteProject(id);
    setDeletingId(null);

    if (res.error) {
      setStatusMsg({ type: "error", text: res.error });
    } else {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setStatusMsg({ type: "success", text: `Proyek "${title}" berhasil dihapus.` });
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F0] dark:bg-[#05080E] text-black dark:text-white font-mono antialiased pb-24">
      
      {/* Header Bar */}
      <header className="h-16 border-b-4 border-black dark:border-white px-4 sm:px-8 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-[#0E131F]/95 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            onClick={() => soundFx.playClick()}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border-2 border-black dark:border-white text-black dark:text-white hover:bg-[#EAB308] hover:text-black transition-all flex items-center gap-1.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            title="Kembali ke Admin Overview"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Admin Overview</span>
          </Link>

          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#166534] text-white border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <FolderKanban className="w-4 h-4 text-[#FFFF00]" />
            KELOLA PROYEK ({projects.length})
          </span>
        </div>

        <Link
          href="/admin/proyek/tambah"
          onClick={() => soundFx.playClick()}
          className="px-4 py-2 bg-[#00FF66] text-black border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#EAB308] transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Proyek</span>
        </Link>
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

        {/* Action & Filter Bar */}
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

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Link
              href="/proyek"
              target="_blank"
              className="px-3.5 py-2 border-2 border-black dark:border-white bg-[#EAB308] text-black text-xs font-mono font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#d9a207]"
            >
              <Globe className="w-3.5 h-3.5 text-black" />
              <span>Lihat Halaman Publik</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Projects Grid Table */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white text-center space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <FolderGit2 className="w-10 h-10 text-[#166534] mx-auto opacity-70" />
            <p className="text-xs font-mono font-black uppercase text-black dark:text-white">
              BELUM ADA PROYEK DALAM DATABASE
            </p>
            <Link
              href="/admin/proyek/tambah"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00FF66] text-black border-3 border-black text-xs font-mono font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              <Plus className="w-4 h-4" />
              <span>TAMBAH PROYEK PERTAMA</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                className="p-5 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  {/* Thumbnail Image */}
                  <div className="relative w-20 h-20 bg-slate-200 dark:bg-slate-900 border-2 border-black dark:border-white shrink-0 overflow-hidden">
                    {p.thumbnail ? (
                      <Image src={p.thumbnail} alt={p.title} fill unoptimized className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        <FolderGit2 className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Title & Desc */}
                  <div className="space-y-1.5">
                    <h3 className="text-base font-mono font-black uppercase text-black dark:text-white">
                      {p.title}
                    </h3>
                    <p className="text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400 line-clamp-2 max-w-xl">
                      {p.description}
                    </p>

                    {/* External Badges */}
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

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 border-slate-200 dark:border-slate-800 pt-3 md:pt-0">
                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    disabled={deletingId === p.id}
                    className="px-3 py-2 bg-red-600 text-white border-2 border-black font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-800 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}

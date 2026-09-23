"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FolderKanban,
  FileText,
  Users,
  MessageSquare,
  Plus,
  ArrowRight,
  Menu,
  Globe,
  ExternalLink,
  FolderGit2,
} from "lucide-react";
import { soundFx } from "@/lib/audio/sound";
import AdminSidebar, { AdminTab } from "@/components/admin/AdminSidebar";
import AdminProjectsPanel from "@/components/admin/AdminProjectsPanel";
import AdminArticlesPanel from "@/components/admin/AdminArticlesPanel";
import { ProjectItem } from "@/lib/actions/project";
import { ArticleItem } from "@/lib/actions/article";

interface DashboardStats {
  projectsCount: number;
  articlesCount: number;
  usersCount: number;
  commentsCount: number;
}

interface ProjectRecord {
  id: string;
  title: string;
  thumbnail?: string | null;
  created_at: string | Date;
}

interface ArticleRecord {
  id: string;
  title: string;
  slug: string;
  created_at: string | Date;
}

interface AdminDashboardProps {
  user: { email?: string; user_metadata?: { full_name?: string; avatar_url?: string } } | null;
  dbUser: { name?: string; avatar?: string | null } | null;
  stats: DashboardStats;
  recentProjects: ProjectRecord[];
  recentArticles: ArticleRecord[];
  allProjects?: ProjectItem[];
  allArticles?: ArticleItem[];
  initialTab?: AdminTab;
}

export default function AdminDashboard({
  user,
  dbUser,
  stats,
  recentProjects,
  recentArticles,
  allProjects = [],
  allArticles = [],
  initialTab = "overview",
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("dashboard_theme", "day");

    const savedCollapsed = localStorage.getItem("admin_sidebar_collapsed");
    if (savedCollapsed === "true") {
      setIsSidebarCollapsed(true);
    }
  }, []);

  const handleSetCollapsed = (value: boolean | ((prev: boolean) => boolean)) => {
    setIsSidebarCollapsed((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      localStorage.setItem("admin_sidebar_collapsed", String(next));
      return next;
    });
  };

  const displayName = dbUser?.name || user?.user_metadata?.full_name || "Admin";
  const avatarSrc = dbUser?.avatar || user?.user_metadata?.avatar_url || "";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen flex bg-[#f5f4f1] text-slate-900 selection:bg-[#d8f2e2] selection:text-slate-900">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={handleSetCollapsed}
        displayName={displayName}
        avatarSrc={avatarSrc}
        initial={initial}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="sticky top-0 z-30 h-20 shrink-0 flex items-center justify-between border-b border-[#e7e2d9] bg-white/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-[#d9d1c5] bg-[#f8f5ef] text-slate-700 shadow-sm transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1F6F52]/30 focus-visible:ring-offset-2"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Overview</p>
              <h1 className="text-base font-semibold uppercase tracking-[0.14em] text-slate-900 sm:text-xl">
                {activeTab === "overview" && "Dashboard Overview"}
                {activeTab === "artikel" && "Kelola Artikel"}
                {activeTab === "proyek" && "Kelola Proyek"}
              </h1>
            </div>
          </div>

          <Link
            href="/dashboard"
            target="_blank"
            onClick={() => soundFx.playClick()}
            className="inline-flex items-center gap-2 rounded-xl border border-[#d9d1c5] bg-[#f1f9f3] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1F6F52] shadow-[0_8px_18px_rgba(31,111,82,0.08)] transition hover:bg-[#e7f7ed] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1F6F52]/30 focus-visible:ring-offset-2"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Lihat Website</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl space-y-8">
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div className="flex flex-col justify-between gap-6 rounded-2xl border border-[#e7e2d9] bg-white p-5 shadow-[0_18px_38px_rgba(15,23,42,0.04)] md:flex-row md:items-end">
                  <div className="space-y-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Selamat datang kembali</p>
                    <div className="inline-flex items-center rounded-xl bg-[#edf7ef] px-3 py-2 text-2xl font-semibold uppercase tracking-[0.06em] text-[#153c2d] ring-1 ring-[#cfe6d8] sm:text-3xl">
                      {displayName}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setActiveTab("proyek");
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#1F6F52] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_24px_rgba(31,111,82,0.2)] transition hover:bg-[#195c45] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1F6F52]/30"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Tambah Proyek</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setActiveTab("artikel");
                      }}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#d9d1c5] bg-[#f8f5ef] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-800 shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition hover:border-[#cfe6d8] hover:bg-[#edf7ef] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1F6F52]/30"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Kelola Artikel</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[{
                    label: "Total Proyek",
                    value: stats.projectsCount,
                    tone: "bg-[#edf7ef] text-[#153c2d]",
                    icon: FolderKanban,
                    action: () => setActiveTab("proyek"),
                  }, {
                    label: "Total Artikel",
                    value: stats.articlesCount,
                    tone: "bg-[#f5f1df] text-[#5d4e1d]",
                    icon: FileText,
                    action: () => setActiveTab("artikel"),
                  }, {
                    label: "Pengguna Terdaftar",
                    value: stats.usersCount,
                    tone: "bg-[#f0f6ff] text-[#1d3d67]",
                    icon: Users,
                    action: undefined,
                  }, {
                    label: "Komentar Masuk",
                    value: stats.commentsCount,
                    tone: "bg-[#fdf5ed] text-[#7a4a1c]",
                    icon: MessageSquare,
                    action: () => setActiveTab("artikel"),
                  }].map((tile) => {
                    const Icon = tile.icon;
                    return (
                      <button
                        key={tile.label}
                        type="button"
                        onClick={tile.action}
                        className={`group relative flex h-full flex-col rounded-2xl border border-[#e7e2d9] bg-white p-5 text-left shadow-[0_18px_38px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(15,23,42,0.06)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1F6F52]/30 ${tile.action ? "cursor-pointer" : "cursor-default"}`}
                      >
                        <div className="mb-8 flex items-center justify-between gap-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{tile.label}</p>
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tile.tone}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="text-3xl font-semibold tracking-tight text-slate-900">{tile.value}</div>
                        <div className="mt-4 inline-flex w-fit rounded-full border border-[#d9d1c5] bg-[#f8f5ef] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-700">
                          {tile.label === "Total Proyek" ? "Published" : tile.label === "Total Artikel" ? "Live" : tile.label === "Pengguna Terdaftar" ? "Akun" : "Interactions"}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <section className="rounded-2xl border border-[#e7e2d9] bg-white p-5 shadow-[0_18px_38px_rgba(15,23,42,0.04)]">
                    <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#eee7dd] pb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf7ef] text-[#1F6F52]">
                          <FolderKanban className="h-4 w-4" />
                        </div>
                        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">Proyek Terbaru</h2>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveTab("proyek")}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#d9d1c5] bg-[#f8f5ef] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-700 transition hover:border-[#cfe6d8] hover:bg-[#edf7ef] hover:text-[#1F6F52] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1F6F52]/30"
                      >
                        <span>Kelola</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {recentProjects.length > 0 ? (
                        recentProjects.map((p) => (
                          <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#e7e2d9] bg-[#faf8f4] p-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-[#d9d1c5] bg-[#eef0f2]">
                                {p.thumbnail ? (
                                  <Image src={p.thumbnail} alt={p.title} fill unoptimized className="object-cover" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-slate-500">
                                    <FolderGit2 className="h-5 w-5" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900">{p.title}</p>
                                <p className="text-[11px] text-slate-500">
                                  {new Date(p.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => setActiveTab("proyek")}
                              className="rounded-lg bg-[#1F6F52] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#195c45] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1F6F52]/30"
                            >
                              Detail
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-xl border border-dashed border-[#d9d1c5] bg-[#faf8f4] p-6 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                          Belum ada proyek
                        </div>
                      )}
                    </div>
                  </section>

                  <section className="rounded-2xl border border-[#e7e2d9] bg-white p-5 shadow-[0_18px_38px_rgba(15,23,42,0.04)]">
                    <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#eee7dd] pb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf7ef] text-[#1F6F52]">
                          <FileText className="h-4 w-4" />
                        </div>
                        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">Artikel Terbaru</h2>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveTab("artikel")}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#d9d1c5] bg-[#f8f5ef] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-700 transition hover:border-[#cfe6d8] hover:bg-[#edf7ef] hover:text-[#1F6F52] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1F6F52]/30"
                      >
                        <span>Kelola</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {recentArticles.length > 0 ? (
                        recentArticles.map((a) => (
                          <div key={a.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#e7e2d9] bg-[#faf8f4] p-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d9d1c5] bg-[#f5f1df] text-[#5d4e1d]">
                                <FileText className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900">{a.title}</p>
                                <p className="text-[11px] text-slate-500">
                                  {new Date(a.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                </p>
                              </div>
                            </div>

                            <Link
                              href={`/artikel/${a.slug}`}
                              target="_blank"
                              onClick={() => soundFx.playClick()}
                              className="rounded-lg bg-[#f1f9f3] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#1F6F52] transition hover:bg-[#e7f7ed] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1F6F52]/30"
                            >
                              Baca
                            </Link>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-xl border border-dashed border-[#d9d1c5] bg-[#faf8f4] p-6 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                          Belum ada artikel
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              </div>
            )}

            {activeTab === "artikel" && <AdminArticlesPanel initialArticles={allArticles} />}
            {activeTab === "proyek" && <AdminProjectsPanel initialProjects={allProjects} />}
          </div>
        </div>
      </main>
    </div>
  );
}

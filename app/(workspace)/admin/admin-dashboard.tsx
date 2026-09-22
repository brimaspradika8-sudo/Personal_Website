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
    <div className="min-h-screen flex bg-white dark:bg-[#05080E] text-black dark:text-white selection:bg-[#FFFF00] selection:text-black">
      {/* 1. SIDEBAR COMPONENT */}
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

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sticky Header Topbar */}
        <header className="h-16 shrink-0 flex items-center justify-between px-4 sm:px-8 bg-white dark:bg-[#0A0D14] border-b-4 border-black dark:border-white sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-none border-2 border-black bg-[#FFFF00] text-black"
            >
              <Menu className="w-5 h-5 stroke-[3]" />
            </button>
            <h1 className="text-base sm:text-xl font-black uppercase tracking-tight text-black dark:text-white">
              {activeTab === "overview" && "DASHBOARD OVERVIEW"}
              {activeTab === "artikel" && "KELOLA ARTIKEL (CRUD)"}
              {activeTab === "proyek" && "KELOLA PROYEK (CRUD)"}
            </h1>
          </div>

          <Link
            href="/dashboard"
            target="_blank"
            onClick={() => soundFx.playClick()}
            className="px-3.5 py-1.5 rounded-none border-3 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:bg-[#FFFF00] hover:text-black transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Globe className="w-4 h-4 text-[#166534]" />
            <span className="hidden sm:inline">LIHAT WEBSITE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </header>

        {/* Dynamic Main Workspace Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Welcome Banner */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b-4 border-black dark:border-white">
                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase text-neutral-500">
                      SELAMAT DATANG KEMBALI,
                    </span>
                    <div>
                      <span className="bg-[#FFFF00] text-black px-3.5 py-1 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase text-2xl sm:text-4xl inline-block">
                        {displayName}
                      </span>
                    </div>
                  </div>

                  {/* Top Action Buttons (Switch Tabs Inline) */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setActiveTab("proyek");
                      }}
                      className="px-5 py-2.5 rounded-none bg-[#166534] hover:bg-[#14532D] text-white border-3 border-black dark:border-white font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>TAMBAH PROYEK</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setActiveTab("artikel");
                      }}
                      className="px-5 py-2.5 rounded-none bg-[#FFFF00] hover:bg-[#E5E500] text-black border-3 border-black dark:border-white font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>KELOLA ARTIKEL</span>
                    </button>
                  </div>
                </div>

                {/* 4 Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {/* Stat 1: Total Proyek */}
                  <div
                    onClick={() => setActiveTab("proyek")}
                    className="relative p-5 bg-white dark:bg-[#0A0D14] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-2 cursor-pointer hover:bg-amber-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-neutral-600 dark:text-neutral-400">
                        TOTAL PROYEK
                      </span>
                      <div className="w-8 h-8 bg-[#00FF66] text-black border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <FolderKanban className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-black dark:text-white">
                      {stats.projectsCount}
                    </div>
                    <div className="inline-block px-2 py-0.5 bg-[#FEF9C3] text-black border border-black text-[10px] font-black uppercase">
                      PUBLISHED
                    </div>
                  </div>

                  {/* Stat 2: Total Artikel */}
                  <div
                    onClick={() => setActiveTab("artikel")}
                    className="relative p-5 bg-white dark:bg-[#0A0D14] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-2 cursor-pointer hover:bg-amber-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-neutral-600 dark:text-neutral-400">
                        TOTAL ARTIKEL
                      </span>
                      <div className="w-8 h-8 bg-[#00FF66] text-black border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <FileText className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-black dark:text-white">
                      {stats.articlesCount}
                    </div>
                    <div className="inline-block px-2 py-0.5 bg-[#DCFCE7] text-black border border-black text-[10px] font-black uppercase">
                      LIVE ARTICLES
                    </div>
                  </div>

                  {/* Stat 3: Pengguna Terdaftar */}
                  <div className="relative p-5 bg-white dark:bg-[#0A0D14] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-neutral-600 dark:text-neutral-400">
                        PENGGUNA TERDAFTAR
                      </span>
                      <div className="w-8 h-8 bg-[#00FF66] text-black border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Users className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-black dark:text-white">
                      {stats.usersCount}
                    </div>
                    <div className="inline-block px-2 py-0.5 bg-[#FEF9C3] text-black border border-black text-[10px] font-black uppercase">
                      AKUN
                    </div>
                  </div>

                  {/* Stat 4: Komentar Masuk */}
                  <div
                    onClick={() => setActiveTab("artikel")}
                    className="relative p-5 bg-white dark:bg-[#0A0D14] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-2 cursor-pointer hover:bg-amber-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-neutral-600 dark:text-neutral-400">
                        KOMENTAR MASUK
                      </span>
                      <div className="w-8 h-8 bg-[#00FF66] text-black border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <MessageSquare className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-black dark:text-white">
                      {stats.commentsCount}
                    </div>
                    <div className="inline-block px-2 py-0.5 bg-[#DCFCE7] text-black border border-black text-[10px] font-black uppercase">
                      INTERACTIONS
                    </div>
                  </div>
                </div>

                {/* Bottom 2 Panels Side by Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Panel 1: PROYEK TERBARU */}
                  <div className="p-6 bg-white dark:bg-[#0A0D14] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] flex flex-col justify-between space-y-5">
                    <div className="flex items-center justify-between border-b-3 border-black dark:border-white pb-3">
                      <h3 className="font-black text-lg uppercase text-black dark:text-white flex items-center gap-2">
                        <FolderKanban className="w-5 h-5 text-[#166534] dark:text-[#EAB308]" />
                        <span>PROYEK TERBARU</span>
                      </h3>

                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playClick();
                          setActiveTab("proyek");
                        }}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-900 border-2 border-black dark:border-white text-xs font-black uppercase text-black dark:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFFF00] hover:text-black transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>KELOLA</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3 flex-1">
                      {recentProjects.length > 0 ? (
                        recentProjects.map((p) => (
                          <div
                            key={p.id}
                            className="p-3.5 bg-slate-50 dark:bg-[#121824] border-3 border-black dark:border-white flex items-center justify-between gap-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="w-10 h-10 border-2 border-black bg-slate-200 dark:bg-slate-900 relative shrink-0 overflow-hidden">
                                {p.thumbnail ? (
                                  <Image src={p.thumbnail} alt={p.title} fill unoptimized className="object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <FolderGit2 className="w-5 h-5 text-neutral-500" />
                                  </div>
                                )}
                              </div>
                              <div className="truncate">
                                <h4 className="text-xs font-black uppercase truncate text-black dark:text-white">
                                  {p.title}
                                </h4>
                                <p className="text-[10px] text-neutral-500">
                                  {new Date(p.created_at).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                soundFx.playClick();
                                setActiveTab("proyek");
                              }}
                              className="px-3 py-1 bg-[#FFFF00] text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-colors shrink-0 cursor-pointer"
                            >
                              DETAIL
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 border-2 border-dashed border-black dark:border-white text-center text-xs font-black uppercase text-neutral-500">
                          BELUM ADA PROYEK
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Panel 2: ARTIKEL TERBARU */}
                  <div className="p-6 bg-white dark:bg-[#0A0D14] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] flex flex-col justify-between space-y-5">
                    <div className="flex items-center justify-between border-b-3 border-black dark:border-white pb-3">
                      <h3 className="font-black text-lg uppercase text-black dark:text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#166534] dark:text-[#EAB308]" />
                        <span>ARTIKEL TERBARU</span>
                      </h3>

                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playClick();
                          setActiveTab("artikel");
                        }}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-900 border-2 border-black dark:border-white text-xs font-black uppercase text-black dark:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFFF00] hover:text-black transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>KELOLA</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3 flex-1">
                      {recentArticles.length > 0 ? (
                        recentArticles.map((a) => (
                          <div
                            key={a.id}
                            className="p-3.5 bg-slate-50 dark:bg-[#121824] border-3 border-black dark:border-white flex items-center justify-between gap-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="w-10 h-10 border-2 border-black bg-[#FEF9C3] text-black flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 stroke-[2.5]" />
                              </div>
                              <div className="truncate">
                                <h4 className="text-xs font-black uppercase truncate text-black dark:text-white">
                                  {a.title}
                                </h4>
                                <p className="text-[10px] text-neutral-500">
                                  {new Date(a.created_at).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>

                            <Link
                              href={`/artikel/${a.slug}`}
                              target="_blank"
                              onClick={() => soundFx.playClick()}
                              className="px-3 py-1 bg-[#FFFF00] text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-colors shrink-0 cursor-pointer"
                            >
                              BACA
                            </Link>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 border-2 border-dashed border-black dark:border-white text-center text-xs font-black uppercase text-neutral-500">
                          BELUM ADA ARTIKEL
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: KELOLA ARTIKEL (CRUD) */}
            {activeTab === "artikel" && <AdminArticlesPanel initialArticles={allArticles} />}

            {/* TAB 3: KELOLA PROYEK (CRUD) */}
            {activeTab === "proyek" && <AdminProjectsPanel initialProjects={allProjects} />}
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Globe,
  ExternalLink,
  LogOut,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { soundFx } from "@/lib/audio/sound";
import { signOut } from "@/lib/actions/auth";

export type AdminTab = "overview" | "artikel" | "proyek";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  displayName: string;
  avatarSrc: string;
  initial: string;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setSidebarOpen,
  isCollapsed,
  setIsCollapsed,
  displayName,
  avatarSrc,
  initial,
}: AdminSidebarProps) {
  const NAV_ITEMS: { label: string; icon: React.ElementType; tab?: AdminTab; href?: string; external?: boolean }[] = [
    { label: "OVERVIEW", icon: LayoutDashboard, tab: "overview" },
    { label: "ARTIKEL (CRUD)", icon: FileText, tab: "artikel" },
    { label: "PROYEK (CRUD)", icon: FolderKanban, tab: "proyek" },
    { label: "LIHAT WEBSITE", icon: Globe, href: "/dashboard", external: true },
  ];

  const toggleCollapse = () => {
    soundFx.playClick();
    setIsCollapsed((prev) => !prev);
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/35 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 transform transition-all duration-300 lg:translate-x-0 lg:static lg:flex lg:flex-col lg:shrink-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "lg:w-24" : "lg:w-72"} w-72 bg-[#f7f5f1] border-r border-[#e7e2d9] shadow-[0_20px_40px_rgba(15,23,42,0.06)]`}
      >
        <div className="h-20 flex items-center justify-between px-4 border-b border-[#e7e2d9] bg-[#fbfaf7] text-slate-900">
          {!isCollapsed ? (
            <Link
              href="/dashboard"
              onClick={() => soundFx.playClick()}
              className="flex items-center gap-3 group overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1F6F52]/30 focus-visible:ring-offset-2"
            >
              <div className="w-9 h-9 rounded-xl bg-[#1F6F52] text-white flex items-center justify-center font-black text-sm tracking-tight shadow-[0_8px_18px_rgba(31,111,82,0.2)] shrink-0">
                B
              </div>
              <span className="font-bold text-sm uppercase tracking-[0.18em] truncate text-slate-900">
                Brimas <span className="text-[#1F6F52]">Admin</span>
              </span>
            </Link>
          ) : (
            <div className="w-full flex items-center justify-center">
              <div className="w-9 h-9 rounded-xl bg-[#1F6F52] text-white flex items-center justify-center font-black text-sm tracking-tight shadow-[0_8px_18px_rgba(31,111,82,0.2)]">
                B
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={toggleCollapse}
            className="hidden lg:flex h-9 w-9 items-center justify-center rounded-xl border border-[#d9d1c5] bg-white text-slate-700 shadow-sm hover:border-[#1F6F52] hover:text-[#1F6F52] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1F6F52]/30 focus-visible:ring-offset-2"
            title={isCollapsed ? "Perluas Sidebar" : "Minimalkan Sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-[#d9d1c5] bg-white text-slate-700 hover:text-slate-900 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1F6F52]/30 focus-visible:ring-offset-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-2 overflow-y-auto">
          {!isCollapsed && (
            <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Menu utama
            </div>
          )}

          {NAV_ITEMS.map((item) => {
            const isActive = item.tab ? activeTab === item.tab : false;

            if (item.external) {
              return (
                <Link
                  key={item.label}
                  href={item.href!}
                  target="_blank"
                  onClick={() => soundFx.playClick()}
                  className={`flex items-center ${
                    isCollapsed ? "justify-center px-2" : "justify-between px-3"
                  } h-11 rounded-xl border border-[#e8e1d7] bg-white text-sm font-semibold text-slate-700 shadow-[0_1px_0_rgba(15,23,42,0.02)] hover:border-[#cfe6d8] hover:bg-[#f2faf5] hover:text-[#1F6F52] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1F6F52]/30 focus-visible:ring-offset-2`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isCollapsed && <ExternalLink className="w-3.5 h-3.5" />}
                </Link>
              );
            }

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  if (item.tab) setActiveTab(item.tab);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center ${
                  isCollapsed ? "justify-center px-2" : "justify-between px-3"
                } h-11 rounded-xl border text-sm font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1F6F52]/30 focus-visible:ring-offset-2 ${
                  isActive
                    ? "border-[#cfe6d8] bg-[#edf9f1] text-[#1F6F52] shadow-[0_8px_18px_rgba(31,111,82,0.08)]"
                    : "border-[#e8e1d7] bg-white text-slate-700 hover:border-[#cfe6d8] hover:bg-[#f2faf5] hover:text-[#1F6F52]"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
                {!isCollapsed && isActive && (
                  <div className="h-2.5 w-2.5 rounded-full bg-[#1F6F52]" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-[#e7e2d9] bg-[#fbfaf7] p-3 space-y-3">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 rounded-xl border border-[#e8e1d7] bg-white p-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-[#efe2b8] text-slate-900 font-bold border border-[#d9d1c5] flex items-center justify-center shrink-0">
                {avatarSrc ? <Image src={avatarSrc} alt={displayName} fill unoptimized className="object-cover" /> : initial}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Administrator</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-[#efe2b8] text-slate-900 font-bold border border-[#d9d1c5] flex items-center justify-center shadow-[0_8px_18px_rgba(15,23,42,0.08)]">
                {avatarSrc ? <Image src={avatarSrc} alt={displayName} fill unoptimized className="object-cover" /> : initial}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={async () => {
              soundFx.playClick();
              await signOut();
            }}
            className={`w-full flex items-center justify-center gap-2 ${
              isCollapsed ? "p-2.5" : "px-3 py-2.5"
            } rounded-xl bg-[#e85d5d] text-white text-xs font-semibold uppercase tracking-[0.12em] shadow-[0_10px_20px_rgba(232,93,93,0.18)] hover:bg-[#d84c4c] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#e85d5d]/30 focus-visible:ring-offset-2`}
            title="Keluar (Logout)"
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

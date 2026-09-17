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
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transform transition-all duration-300 lg:translate-x-0 lg:static lg:flex lg:flex-col lg:shrink-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "lg:w-20" : "lg:w-64"} w-64 bg-white dark:bg-[#0A0D14] border-r-4 border-black dark:border-white shadow-[6px_0px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_0px_0px_0px_rgba(255,255,255,1)]`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b-4 border-black dark:border-white bg-[#FFFF00] text-black">
          {!isCollapsed ? (
            <Link
              href="/dashboard"
              onClick={() => soundFx.playClick()}
              className="flex items-center gap-2.5 group overflow-hidden"
            >
              <div className="w-8 h-8 rounded-none bg-black text-white flex items-center justify-center font-mono font-black text-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
                B
              </div>
              <span className="font-serif font-black text-base tracking-tight uppercase truncate">
                BRIMAS <span className="underline">ADMIN</span>
              </span>
            </Link>
          ) : (
            <div className="w-full flex items-center justify-center">
              <div className="w-8 h-8 rounded-none bg-black text-white flex items-center justify-center font-mono font-black text-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                B
              </div>
            </div>
          )}

          {/* Collapse Toggle Button (Desktop) */}
          <button
            type="button"
            onClick={toggleCollapse}
            className="hidden lg:flex p-1.5 text-black hover:bg-black hover:text-white border-2 border-black transition-colors cursor-pointer"
            title={isCollapsed ? "Perluas Sidebar" : "Minimalkan Sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>

          {/* Close Button (Mobile) */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-black hover:scale-110 cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-3 overflow-y-auto">
          {!isCollapsed && (
            <div className="text-[10px] font-mono font-black text-neutral-500 uppercase tracking-widest px-1">
              MENU UTAMA
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
                    isCollapsed ? "justify-center px-2" : "justify-between px-4"
                  } py-3 rounded-none border-3 border-black dark:border-white text-xs font-mono font-black uppercase transition-all cursor-pointer bg-white dark:bg-[#0E131F] text-black dark:text-white hover:bg-[#FEF9C3] dark:hover:bg-slate-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4 stroke-[2.5]" />
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
                  isCollapsed ? "justify-center px-2" : "justify-between px-4"
                } py-3 rounded-none border-3 border-black dark:border-white text-xs font-mono font-black uppercase transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#FFFF00] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white dark:bg-[#0E131F] text-black dark:text-white hover:bg-[#FEF9C3] dark:hover:bg-slate-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4 stroke-[2.5]" />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
                {!isCollapsed && isActive && (
                  <div className="w-2.5 h-2.5 bg-black rounded-none border border-black" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Card & Logout Button */}
        <div className="p-3 border-t-4 border-black dark:border-white space-y-3 bg-slate-50 dark:bg-[#0E131F]">
          {!isCollapsed ? (
            <div className="p-3 rounded-none border-3 border-black dark:border-white bg-white dark:bg-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] flex items-center gap-3">
              <div className="w-8 h-8 rounded-none bg-[#EAB308] border-2 border-black flex shrink-0 items-center justify-center text-black font-black text-xs overflow-hidden relative">
                {avatarSrc ? <Image src={avatarSrc} alt={displayName} fill unoptimized className="object-cover" /> : initial}
              </div>
              <div className="truncate">
                <p className="text-xs font-mono font-black truncate text-black dark:text-white uppercase">{displayName}</p>
                <p className="text-[10px] text-neutral-500 font-mono font-bold truncate uppercase">ADMINISTRATOR</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-9 h-9 rounded-none bg-[#EAB308] border-2 border-black flex items-center justify-center text-black font-black text-xs overflow-hidden relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
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
              isCollapsed ? "p-2.5" : "px-3 py-2"
            } rounded-none bg-red-600 text-white border-3 border-black font-mono font-black text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-red-800 transition-all cursor-pointer`}
            title="Keluar (Logout)"
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span>KELUAR (LOGOUT)</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

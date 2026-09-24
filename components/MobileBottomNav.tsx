"use client";

import React, { useState } from "react";
import { FolderGit2, BookOpen, Home, User, UserCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useRouter, usePathname } from "next/navigation";
import { soundFx } from "@/lib/audio/sound";

export default function MobileBottomNav() {
  const { lang } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [clickedTab, setClickedTab] = useState<string | null>(null);

  const activeTab = clickedTab ?? (
    pathname === "/profile" || pathname?.startsWith("/profile/")
      ? "profile"
      : pathname === "/articles" || pathname?.startsWith("/articles")
      ? "articles"
      : pathname === "/about" || pathname?.startsWith("/about")
      ? "about"
      : pathname === "/projects" || pathname?.startsWith("/projects")
      ? "projects"
      : pathname === "/dashboard" || pathname === "/"
      ? "home"
      : ""
  );

  const navItems = [
    { id: "projects", label: "PROJECTS", href: "/projects", Icon: FolderGit2, isCenter: false },
    { id: "articles", label: "ARTICLES", href: "/articles", Icon: BookOpen, isCenter: false },
    { id: "home", label: "HOME", href: "/dashboard", Icon: Home, isCenter: true },
    { id: "about", label: "ABOUT", href: "/about", Icon: User, isCenter: false },
    { id: "profile", label: "PROFILE", href: "/profile", Icon: UserCheck, isCenter: false },
  ];

  const handleNav = (tabId: string, href: string) => {
    soundFx.playClick();
    setClickedTab(tabId);

    if (href.startsWith("#")) {
      if (pathname !== "/dashboard" && pathname !== "/") {
        router.push(`/dashboard${href}`);
      } else {
        const elem = document.querySelector(href);
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth" });
        } else {
          window.location.assign(href);
        }
      }
    } else {
      router.push(href);
    }
  };

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard/articles")) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50 pb-[env(safe-area-inset-bottom)] p-2.5 pointer-events-none">
      {/* Curved Floating Capsule Bar Container */}
      <div className="pointer-events-auto max-w-md mx-auto bg-slate-950/95 dark:bg-black/95 backdrop-blur-xl border-3 border-slate-900 dark:border-white rounded-full shadow-[0px_10px_30px_rgba(0,0,0,0.5),4px_4px_0px_0px_rgba(234,179,8,1)] dark:shadow-[0px_10px_30px_rgba(0,0,0,0.8),4px_4px_0px_0px_rgba(255,255,255,1)] px-3 py-1.5 flex items-center justify-between relative overflow-visible">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.Icon;

          // Elevated Center Action Button (HOME)
          if (item.isCenter) {
            return (
              <div key={item.id} className="relative -top-5 flex-1 flex justify-center z-30">
                <button
                  type="button"
                  onClick={() => handleNav(item.id, item.href)}
                  onPointerEnter={() => router.prefetch(item.href)}
                  onFocus={() => router.prefetch(item.href)}
                  aria-label={item.label}
                  className={`w-13 h-13 rounded-full border-3 border-slate-900 dark:border-white flex flex-col items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#EAB308] text-slate-950 scale-110 ring-4 ring-[#166534]"
                      : "bg-[#EAB308] text-slate-950 hover:bg-white hover:scale-105"
                  }`}
                  title={item.label}
                >
                  <IconComponent className="w-5 h-5 stroke-[2.5]" />
                  <span className="text-[8px] font-black uppercase tracking-tighter leading-none mt-0.5">
                    {item.label}
                  </span>
                </button>
              </div>
            );
          }

          // Side Items (Project, Artikel, About, Profile)
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id, item.href)}
              onPointerEnter={() => router.prefetch(item.href)}
              onFocus={() => router.prefetch(item.href)}
              aria-label={item.label}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all duration-200 relative ${
                isActive ? "text-white font-black" : "text-slate-400 hover:text-white"
              }`}
            >
              {/* Smooth Pill Active Tab Highlight Badge */}
              {isActive && (
                <div className="absolute inset-0 bg-[#166534] border-2 border-slate-900 dark:border-white rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-0" />
              )}
              
              <IconComponent className={`w-4 h-4 relative z-10 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span className={`text-[9px] font-black uppercase tracking-tighter truncate max-w-[54px] relative z-10 ${isActive ? "text-white" : "text-slate-400"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

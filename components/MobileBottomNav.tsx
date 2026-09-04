"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, FolderGit2, Compass, User, UserCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useRouter, usePathname } from "next/navigation";
import { soundFx } from "@/lib/audio/sound";

export default function MobileBottomNav() {
  const { dict } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    { id: "articles", label: dict.nav.articles || "Artikel", href: "#about", Icon: BookOpen },
    { id: "projects", label: dict.nav.projects, href: "#projects", Icon: FolderGit2 },
    { id: "home", label: dict.nav.home, href: "#hero", Icon: Compass },
    { id: "about", label: dict.nav.about, href: "#about", Icon: User },
    { id: "profile", label: dict.nav.profile || "Profile", href: "/profile", Icon: UserCheck },
  ];

  const getTabIndex = (tab: string) => {
    const idx = navItems.findIndex((item) => item.id === tab);
    return idx !== -1 ? idx : 2;
  };

  useEffect(() => {
    if (pathname?.includes("/profile")) {
      setActiveTab("profile");
      return;
    }

    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "about") setActiveTab("about");
      else if (hash === "projects") setActiveTab("projects");
      else if (hash === "articles") setActiveTab("articles");
      else if (hash === "profile") setActiveTab("profile");
      else setActiveTab("home");
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [pathname]);

  const handleNav = (tabId: string, href: string) => {
    soundFx.playClick();
    setActiveTab(tabId);

    if (href.startsWith("#")) {
      if (pathname !== "/dashboard" && pathname !== "/") {
        router.push(`/dashboard${href}`);
      } else {
        window.location.href = href;
      }
    } else {
      router.push(href);
    }
  };

  const activeIndex = getTabIndex(activeTab);
  // Calculate center X coordinate for active tab slot in 400px viewBox
  const cx = 40 + activeIndex * 80;
  const leftEnd = Math.max(0, cx - 35);
  const rightStart = Math.min(400, cx + 35);

  // Full-width path from 0 to 400 with notch curve centered exactly at active tab's cx
  const svgPathD = `M 0,0 L ${leftEnd},0 C ${cx - 18},0 ${cx - 15},32 ${cx},32 C ${cx + 15},32 ${cx + 18},0 ${rightStart},0 L 400,0 L 400,68 L 0,68 Z`;

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none transition-all duration-300"
      style={{
        paddingBottom: "max(6px, env(safe-area-inset-bottom))",
      }}
    >
      <div className="relative w-full max-w-lg mx-auto pointer-events-auto">
        
        {/* SVG Curved Notch Background Bar (Dynamic Full-Width Cutout Path) */}
        <div className="absolute inset-0 w-full h-[68px] -z-10 drop-shadow-2xl overflow-visible">
          <svg
            className="w-full h-[68px] filter drop-shadow-[0_-8px_20px_rgba(0,0,0,0.6)]"
            viewBox="0 0 400 68"
            preserveAspectRatio="none"
          >
            <path
              d={svgPathD}
              className="fill-stone-950/95 stroke-amber-400/40 transition-all duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Tab Items Layout Row */}
        <div className="relative flex items-center justify-between px-2 h-[64px]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const IconComponent = item.Icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id, item.href)}
                className="relative flex flex-col items-center justify-center flex-1 h-full cursor-pointer focus:outline-none"
              >
                {isActive ? (
                  /* ACTIVE TAB: Floating Circle Icon Lifted UP out of the Bar */
                  <div className="relative flex flex-col items-center -top-4 transition-all duration-500">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-stone-950 flex items-center justify-center shadow-2xl shadow-amber-500/60 ring-4 ring-stone-950 border border-white/60 transform hover:scale-105 active:scale-95 transition-all">
                      <IconComponent className="w-6 h-6 text-stone-950 drop-shadow-sm" />
                    </div>
                    <span className="text-[10px] font-extrabold text-amber-300 mt-1 drop-shadow-md tracking-tight">
                      {item.label}
                    </span>
                  </div>
                ) : (
                  /* INACTIVE TAB: Flat inside the bar */
                  <div className="flex flex-col items-center justify-center gap-0.5 opacity-70 hover:opacity-100 transition-opacity duration-300">
                    <IconComponent className="w-5 h-5 text-slate-400" />
                    <span className="text-[10px] text-slate-400 tracking-tight truncate max-w-[56px]">
                      {item.label}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}



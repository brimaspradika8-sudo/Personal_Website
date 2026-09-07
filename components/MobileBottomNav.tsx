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
    router.prefetch("/profile");

    if (pathname === "/profile" || pathname?.startsWith("/profile/")) {
      setActiveTab("profile");
    } else if (pathname === "/dashboard" || pathname === "/") {
      setActiveTab("home");
    } else {
      setActiveTab("");
    }
  }, [pathname, router]);

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
  const cx = 40 + activeIndex * 80;
  const leftEnd = Math.max(0, cx - 35);
  const rightStart = Math.min(400, cx + 35);

  const svgPathD = `M 0,0 L ${leftEnd},0 C ${cx - 18},0 ${cx - 15},32 ${cx},32 C ${cx + 15},32 ${cx + 18},0 ${rightStart},0 L 400,0 L 400,68 L 0,68 Z`;

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none transition-all duration-300"
      style={{
        paddingBottom: "max(12px, env(safe-area-inset-bottom))",
      }}
    >
      <div className="relative w-full max-w-lg mx-auto pointer-events-auto px-2">
        
        {/* SVG Curved Notch Background Bar */}
        <div className="absolute inset-0 w-full h-[68px] -z-10 overflow-visible">
          <svg
            className="w-full h-[68px]"
            viewBox="0 0 400 68"
            preserveAspectRatio="none"
          >
            <path
              d={svgPathD}
              className="fill-[#1A211A] stroke-[#2A2F26] transition-all duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
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
                className="relative flex flex-col items-center justify-center flex-1 h-full min-h-[48px] min-w-[48px] cursor-pointer focus:outline-none"
              >
                {isActive ? (
                  /* ACTIVE TAB: Solid Pine/Ember Lifted Icon */
                  <div className="relative flex flex-col items-center -top-3 transition-all duration-300">
                    <div className="w-11 h-11 rounded-full bg-[#A6532D] text-[#F1EFE9] flex items-center justify-center ring-4 ring-[#12160F] border border-[#2A2F26]">
                      <IconComponent className="w-5 h-5 text-[#F1EFE9]" />
                    </div>
                    <span className="text-[10px] font-medium text-[#F1EFE9] mt-0.5 tracking-tight">
                      {item.label}
                    </span>
                  </div>
                ) : (
                  /* INACTIVE TAB */
                  <div className="flex flex-col items-center justify-center gap-0.5 text-[#A8A79C] hover:text-[#F1EFE9] transition-colors duration-200">
                    <IconComponent className="w-4 h-4 text-[#A8A79C]" />
                    <span className="text-[10px] text-[#A8A79C] tracking-tight truncate max-w-[56px]">
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

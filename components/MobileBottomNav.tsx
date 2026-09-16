"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
      : pathname === "/artikel" || pathname?.startsWith("/artikel")
      ? "artikel"
      : pathname === "/dashboard" || pathname === "/"
      ? "home"
      : ""
  );

  // Exact order requested: Project -> Artikel -> Home (Center Floating) -> About -> Profile
  const navItems = [
    { id: "projects", label: lang === "id" ? "PROYEK" : "PROJECT", href: "#projects", Icon: FolderGit2, isCenter: false },
    { id: "artikel", label: lang === "id" ? "ARTIKEL" : "ARTIKEL", href: "/artikel", Icon: BookOpen, isCenter: false },
    { id: "home", label: lang === "id" ? "BERANDA" : "HOME", href: "/dashboard", Icon: Home, isCenter: true },
    { id: "about", label: lang === "id" ? "TENTANG" : "ABOUT", href: "#about", Icon: User, isCenter: false },
    { id: "profile", label: lang === "id" ? "PROFIL" : "PROFILE", href: "/profile", Icon: UserCheck, isCenter: false },
  ];

  useEffect(() => {
    router.prefetch("/profile");
    router.prefetch("/artikel");
    router.prefetch("/dashboard");
  }, [router]);

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

  return (
    <div className="md:hidden fixed bottom-4 inset-x-3 z-50 pointer-events-auto">
      <div className="max-w-md mx-auto bg-black dark:bg-black border-4 border-black dark:border-white rounded-none shadow-[6px_6px_0px_0px_rgba(255,255,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] px-2 py-1.5 flex items-center justify-between relative overflow-visible">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.Icon;

          // Prominent Floating Center Action Button (HOME)
          if (item.isCenter) {
            return (
              <div key={item.id} className="relative -top-5 flex-1 flex justify-center z-20">
                <button
                  type="button"
                  onClick={() => handleNav(item.id, item.href)}
                  className={`w-14 h-14 rounded-full border-4 border-black dark:border-white flex flex-col items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#FFFF00] text-black scale-110 ring-4 ring-red-600"
                      : "bg-[#FFFF00] text-black hover:bg-white"
                  }`}
                  title={item.label}
                >
                  <IconComponent className="w-6 h-6 stroke-[2.5]" />
                  <span className="text-[8px] font-mono font-black uppercase tracking-tighter leading-none mt-0.5">
                    {item.label}
                  </span>
                </button>
              </div>
            );
          }

          // Side Navigation Items (Project, Artikel, About, Profile)
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id, item.href)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-none transition-all duration-150 relative ${
                isActive ? "text-white font-black" : "text-neutral-400 hover:text-white"
              }`}
            >
              {/* Pure Brutalism Active Tab Highlight Badge */}
              {isActive && (
                <motion.div
                  layoutId="activeMobileBottomTab"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  className="absolute inset-0 bg-[#FF0000] border-2 border-black dark:border-white rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-0"
                />
              )}
              
              <IconComponent className={`w-4 h-4 relative z-10 ${isActive ? "text-white" : "text-neutral-400"}`} />
              <span className={`text-[9px] font-mono font-black uppercase tracking-tighter truncate max-w-[54px] relative z-10 ${isActive ? "text-white" : "text-neutral-400"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

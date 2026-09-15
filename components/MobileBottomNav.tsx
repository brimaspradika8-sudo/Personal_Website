"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, FolderGit2, Compass, User, UserCheck } from "lucide-react";
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
      ? "blog"
      : pathname === "/dashboard" || pathname === "/"
      ? "home"
      : ""
  );

  const navItems = [
    { id: "home", label: lang === "id" ? "BERANDA" : "HOME", href: "#hero", Icon: Compass },
    { id: "about", label: lang === "id" ? "TENTANG" : "ABOUT", href: "#about", Icon: User },
    { id: "projects", label: lang === "id" ? "PROYEK" : "PROJECTS", href: "#projects", Icon: FolderGit2 },
    { id: "blog", label: lang === "id" ? "ARTIKEL" : "BLOG", href: "/artikel", Icon: BookOpen },
    { id: "profile", label: lang === "id" ? "PROFIL" : "PROFILE", href: "/profile", Icon: UserCheck },
  ];

  useEffect(() => {
    router.prefetch("/profile");
  }, [router]);

  const handleNav = (tabId: string, href: string) => {
    soundFx.playClick();
    setClickedTab(tabId);

    if (href.startsWith("#")) {
      if (pathname !== "/dashboard" && pathname !== "/") {
        router.push(`/dashboard${href}`);
      } else {
        window.location.assign(href);
      }
    } else {
      router.push(href);
    }
  };

  return (
    <div className="md:hidden fixed bottom-3 inset-x-3 z-50 pointer-events-auto">
      <div className="max-w-md mx-auto bg-black border-3 border-black dark:border-white rounded-none shadow-[5px_5px_0px_0px_rgba(255,255,0,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,1)] px-1.5 py-1.5 flex items-center justify-between relative overflow-hidden">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.Icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id, item.href)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-none transition-all duration-150 relative ${
                isActive ? "text-white font-black" : "text-neutral-400 hover:text-white"
              }`}
            >
              {/* Pure Brutalism Sharp Tab Indicator */}
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

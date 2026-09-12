"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, FolderGit2, Compass, User, UserCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useRouter, usePathname } from "next/navigation";
import { soundFx } from "@/lib/audio/sound";

export default function MobileBottomNav() {
  const { lang, dict } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    { id: "home", label: lang === "id" ? "Beranda" : "Home", href: "#hero", Icon: Compass },
    { id: "about", label: lang === "id" ? "Tentang" : "About", href: "#about", Icon: User },
    { id: "projects", label: lang === "id" ? "Proyek" : "Projects", href: "#projects", Icon: FolderGit2 },
    { id: "blog", label: lang === "id" ? "Artikel" : "Blog", href: "/posts", Icon: BookOpen },
    { id: "profile", label: lang === "id" ? "Profil" : "Profile", href: "/profile", Icon: UserCheck },
  ];

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

  return (
    <div className="md:hidden fixed bottom-3 inset-x-2 z-50 pointer-events-auto">
      <div className="max-w-md mx-auto bg-[#1A1A1A]/95 dark:bg-[#0A0A0B]/95 backdrop-blur-xl border border-white/20 dark:border-[#26262A] rounded-full shadow-2xl px-1.5 py-1.5 flex items-center justify-between relative overflow-hidden">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.Icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id, item.href)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-full transition-colors duration-200 relative ${
                isActive ? "text-white font-bold" : "text-white/60 hover:text-white"
              }`}
            >
              {/* Smooth Spring Sliding Pill Active Background Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeMobileBottomTab"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  className="absolute inset-0 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] rounded-full shadow-lg shadow-[#DC2626]/40 z-0"
                />
              )}

              {/* Glowing White Dot Indicator */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)] animate-pulse mb-0.5 relative z-10" />
              )}
              
              <IconComponent className={`w-4 h-4 relative z-10 ${isActive ? "text-white" : "text-white/70"}`} />
              <span className={`text-[10px] tracking-tight truncate max-w-[54px] relative z-10 ${isActive ? "text-white font-bold" : "text-white/70"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

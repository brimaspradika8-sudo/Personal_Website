"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Compass, FolderGit2, BookOpen, User, Moon, Sun, Languages, X } from "lucide-react";
import { soundFx } from "@/lib/audio/sound";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleTheme: () => void;
  isNight: boolean;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onToggleTheme,
  isNight,
}: CommandPaletteProps) {
  const { lang, toggleLang } = useLanguage();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          soundFx.playClick();
          const event = new CustomEvent("open-command-palette");
          window.dispatchEvent(event);
        }
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: "hero",
      title: lang === "id" ? "Beranda (Hero)" : "Home (Hero)",
      category: lang === "id" ? "Navigasi" : "Navigation",
      icon: Compass,
      href: "#hero",
    },
    {
      id: "projects",
      title: lang === "id" ? "Koleksi Project" : "Project Showcase",
      category: lang === "id" ? "Navigasi" : "Navigation",
      icon: FolderGit2,
      href: "#projects",
    },
    {
      id: "contact",
      title: lang === "id" ? "Hubungi Saya (Kontak)" : "Contact Me (Email)",
      category: lang === "id" ? "Navigasi" : "Navigation",
      icon: BookOpen,
      href: "#contact",
    },
    {
      id: "profile",
      title: lang === "id" ? "Halaman Profil User (/profile)" : "User Profile Page (/profile)",
      category: lang === "id" ? "Halaman" : "Pages",
      icon: User,
      href: "/profile",
    },
    {
      id: "theme",
      title: lang === "id" 
        ? `Ganti Tema Mode (${isNight ? "Siang Hari" : "Malam Hari"})` 
        : `Switch Theme Mode (${isNight ? "Day Mode" : "Night Mode"})`,
      category: lang === "id" ? "Tampilan" : "Appearance",
      icon: isNight ? Sun : Moon,
      action: () => {
        onToggleTheme();
        onClose();
      },
    },
    {
      id: "lang",
      title: lang === "id"
        ? `Ganti Bahasa (Sekarang: Bahasa Indonesia)`
        : `Switch Language (Current: English)`,
      category: lang === "id" ? "Pengaturan" : "Settings",
      icon: Languages,
      action: () => {
        toggleLang();
        onClose();
      },
    },
  ];

  const filtered = actions.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item: (typeof actions)[0]) => {
    soundFx.playClick();
    if (item.action) {
      item.action();
    } else if (item.href) {
      window.location.href = item.href;
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#12160F]/80 backdrop-blur-sm animate-fadeIn">
      <div className="fixed inset-0 -z-10" onClick={onClose} />
      
      <div className="w-full max-w-xl bg-[#1A211A] border border-[#2A2F26] rounded-xl overflow-hidden text-[#F1EFE9]">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3 border-b border-[#2A2F26]">
          <Search className="w-4 h-4 text-[#A8A79C] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              lang === "id"
                ? "Ketik perintah atau navigasi (contoh: Project, Profil, Tema)..."
                : "Type a command or navigate (e.g. Projects, Profile, Theme)..."
            }
            className="w-full bg-transparent text-sm text-[#F1EFE9] placeholder-[#A8A79C] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-[#12160F] hover:bg-[#212A20] text-[#A8A79C] border border-[#2A2F26] transition-colors ml-2 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action List */}
        <div className="max-h-[340px] overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => soundFx.playHover()}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg hover:bg-[#212A20] transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#12160F] text-[#3B5D42] border border-[#2A2F26]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-[#F1EFE9]">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-[#A8A79C]">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#12160F] text-[#A8A79C] border border-[#2A2F26]">
                    ↵ {lang === "id" ? "Pilih" : "Select"}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center text-[#A8A79C] text-xs sm:text-sm">
              {lang === "id"
                ? `Tidak ada hasil yang cocok dengan "${query}"`
                : `No results matching "${query}"`}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-[#12160F] border-t border-[#2A2F26] flex items-center justify-between text-[11px] text-[#A8A79C]">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-[#1A211A] border border-[#2A2F26] font-mono">↑↓</span>
            <span>{lang === "id" ? "Navigasi" : "Navigate"}</span>
            <span className="px-1.5 py-0.5 rounded bg-[#1A211A] border border-[#2A2F26] font-mono ml-2">ESC</span>
            <span>{lang === "id" ? "Tutup" : "Close"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

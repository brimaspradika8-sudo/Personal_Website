"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Compass, FolderGit2, BookOpen, User, Sparkles, Moon, Sun, Languages, X } from "lucide-react";
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
  const { lang, toggleLang, dict } = useLanguage();
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
          // open command palette
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
      title: dict.nav.home || "Beranda (Hero)",
      category: "Navigasi",
      icon: Compass,
      href: "#hero",
    },
    {
      id: "about",
      title: dict.nav.about || "Tentang & Metrik",
      category: "Navigasi",
      icon: User,
      href: "#about",
    },
    {
      id: "projects",
      title: dict.nav.projects || "Koleksi Project",
      category: "Navigasi",
      icon: FolderGit2,
      href: "#projects",
    },
    {
      id: "articles",
      title: dict.nav.articles || "Artikel & Catatan",
      category: "Navigasi",
      icon: BookOpen,
      href: "#about",
    },
    {
      id: "profile",
      title: "Halaman Profil User (/profile)",
      category: "Halaman",
      icon: User,
      href: "/profile",
    },
    {
      id: "theme",
      title: `Ganti Tema Mode (${isNight ? "Siang Hari" : "Malam Hari"})`,
      category: "Tampilan",
      icon: isNight ? Sun : Moon,
      action: () => {
        onToggleTheme();
        onClose();
      },
    },
    {
      id: "lang",
      title: `Ganti Bahasa (Sekarang: ${lang.toUpperCase()})`,
      category: "Pengaturan",
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-stone-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
      />
      
      <div className="w-full max-w-xl bg-stone-900/95 border border-amber-400/40 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-2xl text-white">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3 border-b border-white/10">
          <Search className="w-5 h-5 text-amber-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik perintah atau navigasi (misal: Project, Profile, Tema)..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors ml-2"
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
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl hover:bg-white/10 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/10 text-amber-300 group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                        {item.title}
                      </p>
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-white/10 text-slate-300 border border-white/10">
                    ↵ Pilih
                  </span>
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs sm:text-sm">
              Tidak ada hasil yang cocok dengan &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-white/5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-slate-300">↑↓</span>
            <span>Navigasi</span>
            <span className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-slate-300 ml-2">ESC</span>
            <span>Tutup</span>
          </div>
          <div className="flex items-center gap-1 text-amber-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BRIMAS Quick Command</span>
          </div>
        </div>
      </div>
    </div>
  );
}

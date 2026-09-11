"use client";

import React from "react";
import Link from "next/link";
import { Heart, ArrowUp, Mail } from "lucide-react";
import { soundFx } from "@/lib/audio/sound";

// Social SVG Icons
function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 2.379 6.338 6.338 0 0 0 .542 8.35 6.335 6.335 0 0 0 8.329-.514A6.297 6.297 0 0 0 15.82 15V8.163a8.175 8.175 0 0 0 4.77 1.523V6.241a4.83 4.83 0 0 1-1.001.445z" />
    </svg>
  );
}

interface FooterProps {
  isNight?: boolean;
}

export default function Footer({ isNight = true }: FooterProps) {
  const scrollToTop = () => {
    soundFx.playClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const SOCIAL_LINKS = [
    {
      name: "Instagram",
      href: "https://instagram.com/brimaspradika",
      icon: InstagramIcon,
      color: "hover:text-pink-500 hover:border-pink-500/40 hover:bg-pink-500/10",
    },
    {
      name: "TikTok",
      href: "https://tiktok.com/@brimaspradika",
      icon: TikTokIcon,
      color: "hover:text-cyan-400 hover:border-cyan-400/40 hover:bg-cyan-400/10",
    },
    {
      name: "GitHub",
      href: "https://github.com/brimaspradika8-sudo",
      icon: GithubIcon,
      color: "hover:text-[#DC2626] hover:border-[#DC2626]/40 hover:bg-[#DC2626]/10",
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/brimaspradika",
      icon: LinkedInIcon,
      color: "hover:text-blue-500 hover:border-blue-500/40 hover:bg-blue-500/10",
    },
  ];

  return (
    <footer
      className={`relative pt-16 pb-12 border-t transition-colors duration-500 ${
        isNight
          ? "bg-[#0a0b0d] border-white/10 text-slate-300"
          : "bg-white border-slate-200 text-slate-700"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Footer Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              onClick={() => soundFx.playClick()}
              className="inline-flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#B91C1C] to-[#DC2626] flex items-center justify-center text-white font-black text-lg shadow-lg shadow-[#DC2626]/30 group-hover:scale-105 transition-transform border border-white/20">
                B
              </div>
              <div>
                <h3 className={`font-display text-lg font-black uppercase tracking-tight ${isNight ? "text-white" : "text-slate-900"}`}>
                  Brimas Pradika <span className="text-[#DC2626]">Utama</span>
                </h3>
                <p className="text-[11px] font-mono opacity-60">AI Systems & Fullstack Developer</p>
              </div>
            </Link>

            <p className="text-xs leading-relaxed opacity-80 max-w-sm font-sans">
              Membangun aplikasi web generasi terbaru, sistem cerdas berbasis Agentic AI, serta antarmuka digital yang interaktif dan berperforma tinggi.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <a
                href="mailto:brimaspradika8@gmail.com"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold transition-all border-[#DC2626]/30 bg-[#DC2626]/10 text-[#DC2626] hover:bg-[#DC2626] hover:text-white shadow-sm"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>brimaspradika8@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation Links Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#DC2626]">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a href="#hero" className="hover:text-[#DC2626] transition-colors">
                  Beranda Overview
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-[#DC2626] transition-colors">
                  Skills & Tech Stack
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-[#DC2626] transition-colors">
                  Etalase Proyek
                </a>
              </li>
              <li>
                <Link href="/posts" className="hover:text-[#DC2626] transition-colors">
                  Artikel & Tutorial
                </Link>
              </li>
              <li>
                <a href="#guestbook" className="hover:text-[#DC2626] transition-colors">
                  Public Guestbook
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#DC2626]">
              Media Sosial & Komunitas
            </h4>
            <p className="text-xs opacity-75 leading-relaxed">
              Ikuti perkembangan proyek, tutorial coding, dan aktivitas terbaru saya di media sosial berikut:
            </p>

            {/* Social Icons Grid */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFx.playClick()}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono font-bold transition-all shadow-sm ${
                    isNight ? "bg-white/5 border-white/10 text-white" : "bg-slate-100 border-slate-200 text-slate-800"
                  } ${s.color}`}
                  title={`Kunjungi ${s.name}`}
                >
                  <s.icon className="w-4 h-4 shrink-0" />
                  <span>{s.name}</span>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Footer Border & Copyright */}
        <div className="pt-8 border-t border-current/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono opacity-70">
          <p className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} Brimas Pradika Utama. Made with</span>
            <Heart className="w-3.5 h-3.5 text-[#DC2626] fill-[#DC2626]" />
            <span>in Indonesia.</span>
          </p>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Built with Next.js 16 & Supabase</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-current/20 hover:border-[#DC2626] hover:text-[#DC2626] transition-all cursor-pointer"
            >
              <span>Kembali ke Atas</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}

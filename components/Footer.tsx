"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, ArrowUp, Mail } from "lucide-react";
import { soundFx } from "@/lib/audio/sound";

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

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c0-5.445 4.43-9.874 9.877-9.874 2.637 0 5.116 1.028 6.98 2.894A9.814 9.814 0 0122 11.96c0 5.447-4.43 9.876-9.949 9.876M12.05 0C5.395 0 0 5.395 0 12.05c0 2.12.553 4.187 1.605 6.002L0 24l6.103-1.6c1.751.956 3.737 1.46 5.945 1.46 6.653 0 12.048-5.393 12.048-12.05C24.096 5.395 18.703 0 12.05 0z" />
    </svg>
  );
}

interface FooterProps {
  isNight?: boolean;
}

export default function Footer({ isNight = false }: FooterProps) {
  const pathname = usePathname();
  const isAllowedPage =
    pathname === "/" ||
    pathname === "/dashboard" ||
    pathname.startsWith("/articles");

  const scrollToTop = () => {
    soundFx.playClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const SOCIAL_LINKS = [
    {
      name: "GitHub",
      href: "https://github.com/brimaspradika8-sudo",
      icon: GithubIcon,
    },
    {
      name: "LinkedIn",
      href: "www.linkedin.com/in/brimas-pradika-utama",
      icon: LinkedInIcon,
    },
    {
      name: "Instagram",
      href: "https://instagram.com/kluweks_02",
      icon: InstagramIcon,
    },
    {
      name: "WhatsApp",
      href: "https://wa.me/6283830718168",
      icon: WhatsAppIcon,
    },
    {
      name: "TikTok",
      href: "https://tiktok.com/@kluweks_02",
      icon: TikTokIcon,
    },
  ];

  // Dynamic Theme Helpers
  const textColor = isNight ? "text-white" : "text-black dark:text-white";
  const textMuted = isNight ? "text-neutral-200" : "text-black dark:text-white";
  const borderColor = isNight ? "border-white" : "border-black dark:border-white";
  const bgStyle = isNight ? "bg-black text-white" : "bg-white dark:bg-black text-black dark:text-white";

  return (
    <footer className={`relative pt-10 sm:pt-16 pb-20 md:pb-12 border-t-4 ${borderColor} transition-colors duration-300 ${bgStyle}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        {/* Top Footer Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              onClick={() => soundFx.playClick()}
              className="inline-flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-none bg-[#166534] border-2 border-black dark:border-white flex items-center justify-center text-white font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                B
              </div>
              <div>
                <h3 className={`text-base font-black uppercase ${textColor}`}>
                  Brimas Pradika Utama
                </h3>
                <p className="text-xs font-black text-[#166534] dark:text-[#EAB308] uppercase">[ AI Systems &amp; Fullstack Developer ]</p>
              </div>
            </Link>

            <p className={`text-xs leading-relaxed max-w-sm font-bold ${textMuted}`}>
              Building modern web applications, AI-powered systems, and high-performance digital interfaces.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <a
                href="mailto:brimaspradika8@gmail.com"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none border-2 border-black dark:border-white text-xs font-black bg-[#FFFF00] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                <Mail className="w-3.5 h-3.5 text-black" />
                <span>brimaspradika8@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation Links Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className={`text-xs font-black uppercase tracking-wider ${textColor} border-b-3 ${borderColor} pb-1 inline-block`}>
              QUICK NAVIGATION
            </h4>
            <ul className="space-y-2 text-xs font-black">
              <li>
                <Link href="/dashboard" onClick={() => soundFx.playClick()} className={`hover:text-[#166534] dark:hover:text-[#00E676] transition-colors block ${textMuted}`}>
                  [ HOME ]
                </Link>
              </li>
              <li>
                <Link href="/about" onClick={() => soundFx.playClick()} className={`hover:text-[#166534] dark:hover:text-[#00E676] transition-colors block ${textMuted}`}>
                  [ ABOUT ME ]
                </Link>
              </li>
              <li>
                <Link href="/dashboard#projects" onClick={() => soundFx.playClick()} className={`hover:text-[#166534] dark:hover:text-[#00E676] transition-colors block ${textMuted}`}>
                  [ FEATURED PROJECTS ]
                </Link>
              </li>
              <li>
                <Link href="/articles" onClick={() => soundFx.playClick()} className={`hover:text-[#166534] dark:hover:text-[#00E676] transition-colors block ${textMuted}`}>
                  [ ARTICLES ]
                </Link>
              </li>
              <li>
                <Link href="/profile" onClick={() => soundFx.playClick()} className={`hover:text-[#166534] dark:hover:text-[#00E676] transition-colors block ${textMuted}`}>
                  [ MY PROFILE ]
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Column */}
          <div className="md:col-span-4 space-y-3">
            <h4 className={`text-xs font-black uppercase tracking-wider ${textColor} border-b-3 ${borderColor} pb-1 inline-block`}>
              SOCIAL MEDIA
            </h4>
            <p className={`text-xs leading-relaxed font-bold ${textMuted}`}>
              Contact me or follow the latest project updates through these social channels.
            </p>

            {/* Social Icons Grid */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFx.playClick()}
                  className="p-2.5 rounded-none border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center justify-center"
                  title={s.name}
                  aria-label={s.name}
                >
                  <s.icon className="w-4 h-4 shrink-0 text-black dark:text-white" />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Footer Border & Copyright */}
        <div className={`pt-8 border-t-3 ${borderColor} flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-black ${textColor} uppercase`}>
          <p className="flex items-center gap-1.5 ">
            <span>© {new Date().getFullYear()} BRIMAS PRADIKA UTAMA. MADE WITH</span>
            <span>PASSION.</span>
          </p>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">BUILT WITH NEXT.JS</span>
            {isAllowedPage && (
              <button
                onClick={scrollToTop}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-none border-2 border-black dark:border-white bg-[#166534] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                <span>BACK TO TOP</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}

"use client";

import React, { useState } from "react";
import { Share2, Check, Copy, MessageSquare } from "lucide-react";
import { soundFx } from "@/lib/audio/sound";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface SocialShareBarProps {
  title: string;
  slug: string;
}

export default function SocialShareBar({ title, slug }: SocialShareBarProps) {
  const { lang } = useLanguage();
  const [copied, setCopied] = useState(false);

  const getArticleUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/artikel/${slug}`;
    }
    return `https://brimaspradika.com/artikel/${slug}`;
  };

  const handleCopyLink = async () => {
    soundFx.playSuccess();
    const url = getArticleUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const shareWhatsApp = () => {
    soundFx.playClick();
    const text = encodeURIComponent(`📌 Baca artikel menarik dari Brimas Pradika Utama: "${title}"\n\n${getArticleUrl()}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const shareTwitter = () => {
    soundFx.playClick();
    const text = encodeURIComponent(`" ${title} " oleh @brimaspradika\n\n${getArticleUrl()}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const shareLinkedIn = () => {
    soundFx.playClick();
    const url = encodeURIComponent(getArticleUrl());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  return (
    <div className="p-4 sm:p-5 rounded-none border-3 border-black dark:border-white bg-white dark:bg-[#0A0D14] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,1)] space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#FF0000]">
          <Share2 className="w-4 h-4" />
          <span className="text-xs font-mono font-black uppercase tracking-wider text-black dark:text-white">
            {lang === "id" ? "BAGIKAN ARTIKEL INI" : "SHARE THIS ARTICLE"}
          </span>
        </div>
        {copied && (
          <span className="text-[11px] font-mono font-black bg-[#166534] text-white px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {lang === "id" ? "LINK TERSALIN!" : "LINK COPIED!"}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={shareWhatsApp}
          className="px-3 py-1.5 rounded-none bg-[#25D366] text-black border-2 border-black dark:border-white font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
        >
          <MessageSquare className="w-3.5 h-3.5 fill-black" />
          <span>WHATSAPP</span>
        </button>

        <button
          type="button"
          onClick={shareTwitter}
          className="px-3 py-1.5 rounded-none bg-[#1DA1F2] text-white border-2 border-black dark:border-white font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>X / TWITTER</span>
        </button>

        <button
          type="button"
          onClick={shareLinkedIn}
          className="px-3 py-1.5 rounded-none bg-[#0A66C2] text-white border-2 border-black dark:border-white font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>LINKEDIN</span>
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="px-3 py-1.5 rounded-none bg-[#FFFF00] text-black border-2 border-black dark:border-white font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5 text-black" />}
          <span>{copied ? (lang === "id" ? "TERSALIN" : "COPIED") : (lang === "id" ? "SALIN LINK" : "COPY LINK")}</span>
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Mail, Send, Copy, Check, Sparkles, Globe, ExternalLink } from "lucide-react";
import { soundFx } from "@/lib/audio/sound";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function QuickContactFAB() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleCopyEmail = () => {
    soundFx.playClick();
    navigator.clipboard.writeText("brimaspradika08@gmail.com");
    setCopiedEmail(true);
    setToastMsg(lang === "id" ? "Email berhasil disalin!" : "Email copied successfully!");
    setTimeout(() => {
      setCopiedEmail(false);
      setToastMsg(null);
    }, 2500);
  };

  const toggleOpen = () => {
    soundFx.playClick();
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-20 md:bottom-6 right-5 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleOpen}
          className="px-4 py-3 rounded-2xl bg-[#DC2626] border-2 sm:border-3 border-slate-900 dark:border-white text-white font-mono font-bold text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-center gap-2 cursor-pointer transition-all hover:bg-amber-400 hover:text-slate-950"
        >
          {isOpen ? (
            <>
              <X className="w-4 h-4" />
              <span>{lang === "id" ? "TUTUP" : "CLOSE"}</span>
            </>
          ) : (
            <>
              <MessageSquare className="w-4 h-4" />
              <span>{lang === "id" ? "HUBUNGI SAYA" : "CONTACT ME"}</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Quick Contact Modal / Popup Card */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md bg-white dark:bg-[#0E121D] border-3 border-slate-900 dark:border-white rounded-2xl p-5 sm:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] space-y-5 text-left relative"
            >
              {/* Close Button */}
              <button
                onClick={toggleOpen}
                className="absolute top-4 right-4 p-1 rounded-xl border-2 border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white hover:bg-[#DC2626] hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-lg bg-amber-400 text-slate-950 border-2 border-slate-900 text-[10px] font-mono font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Sparkles className="w-3 h-3 text-slate-950" />
                  <span>{lang === "id" ? "RESPON CEPAT" : "FAST RESPONSE"}</span>
                </div>
                <h3 className="font-serif font-black text-2xl uppercase tracking-tight text-slate-950 dark:text-white leading-none">
                  {lang === "id" ? "KIRIM PESAN & DISKUSI" : "SEND MESSAGE & DISCUSS"}
                </h3>
                <p className="text-xs font-sans font-medium text-slate-700 dark:text-slate-300">
                  {lang === "id"
                    ? "Terbuka untuk kesempatan freelance, proyek AI/Web, atau konsultasi arsitektur perangkat lunak."
                    : "Open for freelance projects, AI/Web development, or software architecture consulting."}
                </p>
              </div>

              {/* Contact Actions Grid */}
              <div className="space-y-3 pt-1">
                {/* WhatsApp Action */}
                <a
                  href="https://wa.me/628123456789?text=Halo%20Brimas,%20saya%20tertarik%20untuk%20berdiskusi%20proyek."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFx.playClick()}
                  className="w-full p-3.5 rounded-xl border-2 border-slate-900 dark:border-white bg-emerald-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Send className="w-4 h-4" />
                    <span>CHAT WHATSAPP</span>
                  </div>
                  <span className="text-[10px] bg-slate-950 text-white px-2 py-0.5 rounded border border-slate-900 font-sans font-semibold">
                    {lang === "id" ? "AKTIF" : "ACTIVE"}
                  </span>
                </a>

                {/* Direct Email Action */}
                <a
                  href="mailto:brimaspradika08@gmail.com"
                  onClick={() => soundFx.playClick()}
                  className="w-full p-3.5 rounded-xl border-2 border-slate-900 dark:border-white bg-sky-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4" />
                    <span>DIRECT EMAIL</span>
                  </div>
                  <span className="text-[11px] font-sans font-semibold">gmail.com</span>
                </a>

                {/* Copy Email Button */}
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="w-full p-3 rounded-xl border-2 border-slate-900 dark:border-white bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    <span>{lang === "id" ? "SALIN EMAIL" : "COPY EMAIL"}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 lowercase">brimaspradika08@gmail.com</span>
                </button>
              </div>

              {/* Social Links Footer */}
              <div className="pt-3 border-t-2 border-slate-900 dark:border-white flex items-center justify-between text-xs font-mono">
                <span className="text-slate-600 dark:text-slate-400">{lang === "id" ? "MEDIA SOSIAL:" : "SOCIAL MEDIA:"}</span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://github.com/brimaspradika8-sudo"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundFx.playClick()}
                    className="px-3 py-1.5 rounded-lg border-2 border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white hover:bg-[#DC2626] hover:text-white transition-all cursor-pointer flex items-center gap-1.5 font-bold"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>GITHUB</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </div>
              </div>

              {/* Toast Feedback */}
              {toastMsg && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-mono font-bold text-xs border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {toastMsg}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

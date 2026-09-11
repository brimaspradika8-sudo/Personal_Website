"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Send, Trash2, ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import { GuestbookEntry, getGuestbookEntries, createGuestbookEntry, deleteGuestbookEntry } from "@/lib/actions/guestbook";
import { soundFx } from "@/lib/audio/sound";

interface GuestbookSectionProps {
  user: any;
  isNight?: boolean;
}

export default function GuestbookSection({ user, isNight = true }: GuestbookSectionProps) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await getGuestbookEntries();
      setEntries(data);
    }
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    setStatusMsg(null);

    if (!user) {
      setStatusMsg({ type: "error", text: "Silakan masuk (login) terlebih dahulu untuk menulis di Buku Tamu." });
      return;
    }

    if (!message.trim()) {
      setStatusMsg({ type: "error", text: "Pesan tidak boleh kosong." });
      return;
    }

    setLoading(true);
    const res = await createGuestbookEntry(message);

    if (res.error) {
      setStatusMsg({ type: "error", text: res.error });
    } else {
      setStatusMsg({ type: "success", text: "Pesan Anda berhasil ditambahkan ke Buku Tamu! 🎉" });
      setMessage("");
      if (res.entry) {
        setEntries((prev) => [res.entry as GuestbookEntry, ...prev]);
      }
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    soundFx.playClick();
    if (!confirm("Apakah Anda yakin ingin menghapus pesan ini?")) return;

    const res = await deleteGuestbookEntry(id);
    if (res.error) {
      alert(res.error);
    } else {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const isAdmin = user?.email?.toLowerCase().trim() === "brimaspradika8@gmail.com";

  return (
    <section id="guestbook" className="w-full py-12 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-6 border-slate-200 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#DC2626] uppercase tracking-widest mb-1.5">
              <MessageSquare className="w-4 h-4" />
              <span>Public Guestbook</span>
            </div>
            <h2 className={`font-display text-2xl sm:text-3xl font-black uppercase tracking-tight ${isNight ? "text-white" : "text-slate-900"}`}>
              Buku Tamu <span className="text-[#DC2626]">Komunitas</span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-white/60 max-w-sm">
            Tinggalkan pesan, saran, atau ucapan apresiasi Anda untuk Brimas Pradika Utama.
          </p>
        </div>

        {/* Input Form Card */}
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
          isNight ? "bg-[#141415] border-white/10 text-white" : "bg-white border-slate-200 text-slate-900 shadow-slate-200/50"
        }`}>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#DC2626]" />
              <span className="text-xs font-bold font-mono uppercase tracking-wider">
                Tulis Pesan Baru
              </span>
            </div>

            {user ? (
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <UserCheck className="w-3.5 h-3.5" />
                <span>{user.user_metadata?.full_name || user.email?.split("@")[0]}</span>
              </div>
            ) : (
              <Link
                href="/login?redirectedFrom=/dashboard#guestbook"
                className="text-xs font-bold text-[#DC2626] hover:underline flex items-center gap-1"
              >
                <span>Masuk untuk menulis</span> &rarr;
              </Link>
            )}
          </div>

          {statusMsg && (
            <div className={`mb-4 p-3 rounded-xl border text-xs font-bold ${
              statusMsg.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                : "bg-red-500/10 border-red-500/30 text-red-500"
            }`}>
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                rows={3}
                maxLength={300}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={user ? "Tuliskan kesan atau pesan Anda di sini..." : "Silakan masuk akun Google/GitHub untuk menulis pesan..."}
                disabled={!user || loading}
                className={`w-full p-4 rounded-2xl border text-xs sm:text-sm font-sans leading-relaxed focus:outline-none focus:border-[#DC2626] transition-all disabled:opacity-60 ${
                  isNight
                    ? "bg-[#1A1A1C] border-white/10 text-white placeholder-white/40"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                }`}
              />
              <span className="absolute bottom-3 right-3 text-[10px] font-mono opacity-50">
                {message.length}/300
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono opacity-50">
                {user ? "Pesan akan tampil secara publik" : "Dukungan Google & GitHub OAuth"}
              </span>

              {user ? (
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="px-6 py-2.5 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-[#DC2626]/30 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Kirim Pesan</span>
                </button>
              ) : (
                <Link
                  href="/login?redirectedFrom=/dashboard#guestbook"
                  className="px-5 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold uppercase tracking-wider transition-all hover:scale-105"
                >
                  Login Dulu
                </Link>
              )}
            </div>
          </form>
        </div>

        {/* Message Feed Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
            Pesan Terbaru ({entries.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entries.map((entry) => {
              const isOwner = user && (user.id === entry.user.id || user.email === entry.user.email);
              const canDelete = isOwner || isAdmin;

              return (
                <div
                  key={entry.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between gap-3 transition-all hover:border-[#DC2626]/40 ${
                    isNight ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-[#DC2626]/30 relative bg-[#DC2626]/10 shrink-0">
                          {entry.user.avatar ? (
                            <Image src={entry.user.avatar} alt={entry.user.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-[#DC2626]">
                              {entry.user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold leading-none">{entry.user.name}</h4>
                          <span className="text-[10px] font-mono opacity-50 block mt-1">
                            {new Date(entry.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>

                      {canDelete && (
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10 cursor-pointer"
                          title="Hapus Pesan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <p className="text-xs leading-relaxed opacity-90 pt-1 font-sans">
                      &quot;{entry.message}&quot;
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

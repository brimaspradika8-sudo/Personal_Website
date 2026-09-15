"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Send, Trash2, UserCheck } from "lucide-react";
import { GuestbookEntry, getGuestbookEntries, createGuestbookEntry, deleteGuestbookEntry } from "@/lib/actions/guestbook";
import { soundFx } from "@/lib/audio/sound";
import ConfirmModal from "@/components/ConfirmModal";

interface GuestbookSectionProps {
  user: {
    id: string;
    email?: string;
    user_metadata?: { full_name?: string; avatar_url?: string };
  } | null;
  isNight?: boolean;
}

export default function GuestbookSection({ user, isNight = true }: GuestbookSectionProps) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    entryId: string | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    entryId: null,
    isLoading: false,
  });

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
      setStatusMsg({ type: "success", text: "Pesan Anda berhasil ditambahkan ke Buku Tamu!" });
      setMessage("");
      if (res.entry) {
        setEntries((prev) => [res.entry as GuestbookEntry, ...prev]);
      }
    }
    setLoading(false);
  };

  const handleDelete = (id: string) => {
    soundFx.playClick();
    setConfirmModalState({ isOpen: true, entryId: id, isLoading: false });
  };

  const confirmDeleteEntry = async () => {
    if (!confirmModalState.entryId) return;
    setConfirmModalState((prev) => ({ ...prev, isLoading: true }));

    const res = await deleteGuestbookEntry(confirmModalState.entryId);
    if (res.error) {
      alert(res.error);
      setConfirmModalState((prev) => ({ ...prev, isLoading: false }));
    } else {
      setEntries((prev) => prev.filter((e) => e.id !== confirmModalState.entryId));
      setConfirmModalState({ isOpen: false, entryId: null, isLoading: false });
    }
  };

  const isAdmin = user?.email?.toLowerCase().trim() === "brimaspradika8@gmail.com";

  return (
    <section id="guestbook" className="scroll-mt-20 max-w-6xl mx-auto px-4 sm:px-6 py-20 border-b border-slate-200 dark:border-slate-800/80">
      <div className="space-y-8">
        
        {/* Section Header */}
        <div className="space-y-2 text-left">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Buku Tamu Komunitas
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans max-w-xl">
            Tinggalkan pesan, diskusi, atau tanggapan Anda mengenai proyek dan wawasan AI di situs ini.
          </p>
        </div>

        {/* Input Form Card */}
        <div className={`p-6 sm:p-8 rounded-2xl border space-y-4 transition-all ${
          isNight
            ? "bg-[#0E1015] border-slate-800/80 text-slate-100"
            : "bg-white border-slate-200 text-slate-900 shadow-xs"
        }`}>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#D32F2F]" />
              <span className="text-xs font-semibold">Tulis Pesan</span>
            </div>

            {user ? (
              <div className="flex items-center gap-1.5 text-xs font-sans text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                <UserCheck className="w-3.5 h-3.5" />
                <span>{user.user_metadata?.full_name || user.email?.split("@")[0]}</span>
              </div>
            ) : (
              <Link
                href="/login?redirectedFrom=/dashboard#guestbook"
                className="text-xs font-medium text-[#D32F2F] hover:underline"
              >
                Masuk akun untuk menulis
              </Link>
            )}
          </div>

          {statusMsg && (
            <div className={`p-3 rounded-xl border text-xs font-medium ${
              statusMsg.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-500"
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
                placeholder={user ? "Tuliskan pesan Anda..." : "Silakan masuk dengan akun Google atau GitHub untuk menulis pesan..."}
                disabled={!user || loading}
                className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs sm:text-sm font-sans focus:outline-none focus:border-[#D32F2F] transition-all disabled:opacity-50"
              />
              <span className="absolute bottom-3 right-3 text-[10px] font-sans text-slate-400">
                {message.length}/300
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] font-sans text-slate-500">
                {user ? "Pesan akan tampil secara publik" : "Dukungan Google & GitHub OAuth"}
              </span>

              {user ? (
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="px-5 py-2 rounded-xl bg-[#D32F2F] hover:bg-[#B91C1C] text-white text-xs font-medium transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-xs"
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
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium transition-colors"
                >
                  Masuk Akun
                </Link>
              )}
            </div>
          </form>
        </div>

        {/* Message Feed Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-500 font-sans">
            Pesan Masuk ({entries.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entries.map((entry) => {
              const isOwner = user && (user.id === entry.user.id || user.email === entry.user.email);
              const canDelete = isOwner || isAdmin;

              return (
                <div
                  key={entry.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between gap-3 transition-colors ${
                    isNight ? "bg-[#0E1015] border-slate-800/80 text-slate-100" : "bg-white border-slate-200 text-slate-900 shadow-xs"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-300 dark:border-slate-800 relative bg-[#D32F2F] shrink-0 text-white font-bold text-xs flex items-center justify-center">
                          {entry.user.avatar ? (
                            <Image src={entry.user.avatar} alt={entry.user.name} fill className="object-cover" />
                          ) : (
                            entry.user.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">{entry.user.name}</h4>
                          <span className="text-[11px] font-sans text-slate-500 block">
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
                          className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-md cursor-pointer"
                          title="Hapus Pesan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-sans">
                      &quot;{entry.message}&quot;
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Modern Custom Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModalState.isOpen}
        title="Hapus Pesan Buku Tamu?"
        description="Apakah Anda yakin ingin menghapus pesan ini secara permanen dari buku tamu?"
        isLoading={confirmModalState.isLoading}
        onConfirm={confirmDeleteEntry}
        onCancel={() => setConfirmModalState({ isOpen: false, entryId: null, isLoading: false })}
        isNight={isNight}
      />
    </section>
  );
}

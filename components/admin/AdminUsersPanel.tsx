"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Crown, Search, ShieldCheck, Trash2, UserRound, Users } from "lucide-react";
import { soundFx } from "@/lib/audio/sound";
import { deleteUser, updateUserRole } from "@/lib/actions/auth";

export type AdminUserItem = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role: "ADMIN" | "USER";
  created_at: string | Date;
};

interface AdminUsersPanelProps {
  initialUsers?: AdminUserItem[];
}

export default function AdminUsersPanel({ initialUsers = [] }: AdminUsersPanelProps) {
  const [users, setUsers] = useState<AdminUserItem[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    const normalized = searchQuery.toLowerCase();

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(normalized) ||
        user.email.toLowerCase().includes(normalized) ||
        user.role.toLowerCase().includes(normalized)
      );
    });
  }, [searchQuery, users]);

  const handleToggleRole = async (userId: string, currentRole: "ADMIN" | "USER") => {
    const nextRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    soundFx.playClick();
    setBusyId(userId);
    setStatusMsg(null);

    const result = await updateUserRole(userId, nextRole);
    setBusyId(null);

    if (result.error) {
      setStatusMsg({ type: "error", text: result.error });
      return;
    }

    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, role: nextRole } : user))
    );
    setStatusMsg({ type: "success", text: `Role pengguna berhasil diubah menjadi ${nextRole}.` });
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus user "${userName}"? Aksi ini tidak bisa dibatalkan.`);
    if (!confirmed) return;

    soundFx.playClick();
    setDeletingId(userId);
    setStatusMsg(null);

    const result = await deleteUser(userId);
    setDeletingId(null);

    if (result.error) {
      setStatusMsg({ type: "error", text: result.error });
      return;
    }

    setUsers((prev) => prev.filter((user) => user.id !== userId));
    setStatusMsg({ type: "success", text: `User "${userName}" berhasil dihapus.` });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b-4 border-black pb-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 border-3 border-black bg-[#FDE68A] px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Users className="h-4 w-4" />
            KELOLA USER ({users.length})
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-[#e7e2d9] bg-white p-4 shadow-[0_18px_38px_rgba(15,23,42,0.04)]">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau email..."
              className="w-full rounded-xl border border-[#d9d1c5] bg-[#faf8f4] py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-[#1F6F52] focus:ring-4 focus:ring-[#1F6F52]/20"
            />
          </label>

          <div className="rounded-full border border-[#d9d1c5] bg-[#f3f7f4] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-700">
            {filteredUsers.length} hasil
          </div>
        </div>

        {statusMsg && (
          <div
            className={`mb-4 rounded-xl border px-3 py-2 text-sm ${
              statusMsg.type === "success"
                ? "border-[#cfe6d8] bg-[#edf9f1] text-[#1F6F52]"
                : "border-[#f7d2d2] bg-[#fff1f1] text-[#b42318]"
            }`}
          >
            {statusMsg.text}
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-[#e7e2d9]">
          <div className="hidden grid-cols-[2.2fr_1.4fr_1fr] gap-3 bg-[#f7f5f1] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 md:grid">
            <span>Pengguna</span>
            <span>Role</span>
            <span>Action</span>
          </div>

          <div className="divide-y divide-[#efe8df]">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const isAdmin = user.role === "ADMIN";
                const initials = (user.name || user.email || "U")
                  .split(" ")
                  .map((part) => part[0]?.toUpperCase() || "")
                  .join("")
                  .slice(0, 2) || "U";

                return (
                  <div
                    key={user.id}
                    className="grid gap-3 px-4 py-4 md:grid-cols-[2.2fr_1.4fr_1fr] md:items-center"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-[#d9d1c5] bg-[#efe2b8] text-sm font-bold text-slate-900">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name || user.email}
                            width={44}
                            height={44}
                            unoptimized
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          initials
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{user.name || "Nama belum diisi"}</p>
                        <p className="truncate text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>

                    <div>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                          isAdmin
                            ? "border-[#dfeecf] bg-[#edf9f1] text-[#1F6F52]"
                            : "border-[#e7e2d9] bg-[#faf8f4] text-slate-700"
                        }`}
                      >
                        {isAdmin ? <Crown className="h-3 w-3" /> : <UserRound className="h-3 w-3" />}
                        {isAdmin ? "Admin" : "User"}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
                      <button
                        type="button"
                        disabled={busyId === user.id}
                        onClick={() => handleToggleRole(user.id, user.role)}
                        className={`w-full rounded-xl border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] transition md:w-auto ${
                          isAdmin
                            ? "border-[#f4d7d7] bg-[#fff1f1] text-[#b42318] hover:bg-[#ffe4e4]"
                            : "border-[#cfe6d8] bg-[#edf9f1] text-[#1F6F52] hover:bg-[#e4f6eb]"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        {busyId === user.id ? "Proses..." : isAdmin ? "Jadikan User" : "Jadikan Admin"}
                      </button>

                      <button
                        type="button"
                        disabled={deletingId === user.id}
                        onClick={() => handleDeleteUser(user.id, user.name || user.email)}
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#f4d7d7] bg-[#fff1f1] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#b42318] transition hover:bg-[#ffe4e4] disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {deletingId === user.id ? "Menghapus..." : "Hapus"}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-10 text-center text-sm text-slate-500">
                Tidak ada user yang cocok dengan pencarian ini.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

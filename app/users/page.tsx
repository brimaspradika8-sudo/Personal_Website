import Link from "next/link";
import { ArrowLeft, User, Mail, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const supabase = await createClient();

  // Fetch data dari tabel "User" di Supabase
  const { data: users, error } = await supabase
    .from("User")
    .select("id, name, email, avatar, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#0A0D14] text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-mono text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">
            Daftar <span className="text-[#DC2626]">User</span>
          </h1>
          <p className="text-xs text-white/50 mt-1 font-mono">
            Data diambil dari tabel <code className="text-[#DC2626]">User</code> di Supabase
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 rounded-xl border border-red-500/50 bg-red-950/30 text-red-300 text-sm font-mono">
            <p className="font-bold">Error: {error.message}</p>
            <p className="text-xs mt-1 text-red-400">
              Pastikan RLS policy SELECT untuk anon sudah aktif di Supabase.
            </p>
          </div>
        )}

        {/* Kosong */}
        {!error && users?.length === 0 && (
          <p className="text-white/40 text-sm font-mono">Belum ada user terdaftar.</p>
        )}

        {/* Daftar User */}
        {!error && users && users.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="p-4 rounded-xl border border-white/10 bg-[#0F172A] hover:border-[#DC2626]/40 transition-all space-y-3"
              >
                {/* Avatar + Nama */}
                <div className="flex items-center gap-3">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#DC2626]/20 text-[#DC2626] flex items-center justify-center font-bold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <p className="font-bold text-sm truncate">{user.name}</p>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Mail className="w-3.5 h-3.5 text-[#DC2626]" />
                  <span className="truncate">{user.email}</span>
                </div>

                {/* Tanggal */}
                <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(user.created_at).toLocaleDateString("id-ID")}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}

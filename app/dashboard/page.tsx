import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let dbUser = null;
  if (user.email) {
    try {
      dbUser = await prisma.user.findUnique({
        where: { email: user.email },
      });
    } catch (e) {
      console.error("Failed to query user from database:", e);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-center pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-bold">Halo, {dbUser?.name || user.user_metadata?.full_name || user.email?.split("@")[0]}! 👋</h1>
            <p className="text-slate-400 text-sm mt-1">
              Selamat datang kembali di Dashboard.
            </p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg bg-rose-600/10 border border-rose-500/20 px-4 py-2 text-sm font-medium text-rose-400 hover:bg-rose-600/20 transition"
            >
              Sign Out
            </button>
          </form>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <h2 className="text-xl font-semibold text-slate-200">Supabase Auth Session</h2>
            <div className="space-y-2 text-sm text-slate-400">
              <p><strong className="text-slate-300">Email:</strong> {user.email}</p>
              <p><strong className="text-slate-300">User ID:</strong> {user.id}</p>
              <p><strong className="text-slate-300">Last Sign In:</strong> {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "-"}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <h2 className="text-xl font-semibold text-slate-200">Prisma Database Sync</h2>
            {dbUser ? (
              <div className="space-y-2 text-sm text-slate-400">
                <p><strong className="text-slate-300">DB ID:</strong> {dbUser.id}</p>
                <p><strong className="text-slate-300">Nama:</strong> {dbUser.name}</p>
                <p><strong className="text-slate-300">Terdaftar pada:</strong> {new Date(dbUser.created_at).toLocaleString()}</p>
              </div>
            ) : (
              <p className="text-sm text-amber-400">User belum tersinkronisasi ke database Prisma.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

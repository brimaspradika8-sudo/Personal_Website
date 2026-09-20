import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { checkIsAdmin } from "@/lib/actions/auth";
import { getAuthenticatedUser } from "@/lib/auth/get-user";
import TambahArtikelClient from "./tambah-client";
import Link from "next/link";
import { Lock, ShieldAlert } from "lucide-react";

export default async function TambahArtikelPage() {
  const user = await getAuthenticatedUser();

  if (!user || !user.email) {
    redirect("/login?redirectedFrom=/admin/artikel/tambah");
  }

  const userEmail = user.email.toLowerCase().trim();

  let dbUser = await prisma.user.findUnique({ where: { email: userEmail } }).catch(() => null);
  const isAdmin = await checkIsAdmin(userEmail, dbUser?.role);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F2F3F4] text-slate-900 font-sans selection:bg-[#EAB308] selection:text-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="max-w-xl w-full bg-white border-3 sm:border-4 border-slate-900 rounded-3xl p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6 text-center relative overflow-hidden font-mono">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAB308] text-slate-950 border-2 border-slate-900 text-xs uppercase tracking-wider font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Lock className="w-4 h-4 text-slate-950" />
            <span>AKSES ADMIN DIBATASI</span>
          </div>

          <div className="space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-red-100 border-3 border-slate-900 mx-auto flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <ShieldAlert className="w-9 h-9 text-[#D32F2F]" />
            </div>
            
            <h1 className="font-serif font-black text-2xl sm:text-3xl uppercase text-slate-950 tracking-tight leading-tight">
              HANYA ADMIN YANG DAPAT MEMBUAT ARTIKEL
            </h1>

            <p className="text-xs sm:text-sm font-sans font-medium text-slate-700 max-w-md mx-auto leading-relaxed">
              Pembuatan dan penulisan artikel di studio ini khusus diperuntukkan bagi Administrator platform.
            </p>
          </div>

          <div className="pt-4 border-t-2 border-slate-900 flex justify-center">
            <Link
              href="/artikel"
              className="px-6 py-3.5 rounded-xl bg-[#166534] hover:bg-emerald-800 border-3 border-slate-900 text-white font-mono font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all inline-flex items-center justify-center"
            >
              Kembali ke Daftar Artikel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <TambahArtikelClient />;
}

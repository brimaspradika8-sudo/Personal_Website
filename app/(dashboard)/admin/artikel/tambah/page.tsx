import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { checkIsAdmin } from "@/lib/actions/auth";
import { canUserCreateArticle, getEffectiveUserTier, MEMBERSHIP_PLANS } from "@/lib/membership";
import { getAuthenticatedUser } from "@/lib/auth/get-user";
import TambahArtikelClient from "./tambah-client";
import Link from "next/link";
import { Lock, Crown, ArrowRight, ShieldAlert, Sparkles, Check } from "lucide-react";

export default async function TambahArtikelPage() {
  const user = await getAuthenticatedUser();

  if (!user || !user.email) {
    redirect("/login?redirectedFrom=/admin/artikel/tambah");
  }

  const userEmail = user.email.toLowerCase().trim();

  let dbUser = await prisma.user.findUnique({ where: { email: userEmail } }).catch(() => null);
  const isAdmin = await checkIsAdmin(userEmail, dbUser?.role);

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        email: userEmail,
        name: user.user_metadata?.full_name || userEmail.split("@")[0],
        avatar: user.user_metadata?.avatar_url || null,
        role: isAdmin ? "ADMIN" : "USER",
      },
    });
  }

  const [effectiveTier, permission] = await Promise.all([
    getEffectiveUserTier(dbUser.id),
    canUserCreateArticle(dbUser.id, isAdmin),
  ]);

  // Jika tidak diizinkan membuat artikel (FREE tier atau kuota habis)
  if (!permission.allowed) {
    const isFreeTier = effectiveTier === "FREE";

    return (
      <div className="min-h-screen bg-[#F2F3F4] text-slate-900 font-sans selection:bg-[#EAB308] selection:text-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="max-w-3xl w-full bg-white border-3 sm:border-4 border-slate-900 rounded-3xl p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8 text-center relative overflow-hidden">
          
          {/* Header Tag / Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAB308] text-slate-950 border-2 border-slate-900 font-mono font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Lock className="w-4 h-4 text-slate-950" />
            <span>FITUR MEMBERSHIP EKSKLUSIF</span>
          </div>

          {/* Paywall Title & Lock Icon */}
          <div className="space-y-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-red-100 border-3 border-slate-900 mx-auto flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <ShieldAlert className="w-9 h-9 text-[#D32F2F]" />
            </div>
            
            <h1 className="font-serif font-black text-2xl sm:text-4xl uppercase text-slate-950 tracking-tight leading-tight">
              {isFreeTier ? (
                <>AKSES DITUTUP: <span className="text-[#D32F2F] underline decoration-4 underline-offset-4">WAJIB BERLANGGANAN</span></>
              ) : (
                <>KUOTA MEMBERSHIP <span className="text-[#D32F2F]">TERCAPAI</span></>
              )}
            </h1>

            <p className="text-xs sm:text-base font-sans font-medium text-slate-700 max-w-xl mx-auto leading-relaxed">
              {permission.reason || "Untuk membuat dan menerbitkan artikel baru di platform ini, Anda harus memiliki status membership aktif."}
            </p>
          </div>

          {/* Membership Tier Offer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left font-sans">
            
            {/* Plan 1: Kawan Brimas */}
            <div className="p-5 rounded-2xl border-2 sm:border-3 border-slate-900 bg-amber-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-xs uppercase tracking-wider text-amber-800 bg-amber-200 px-2.5 py-0.5 rounded-md border border-slate-900">
                    {MEMBERSHIP_PLANS.KAWAN_BRIMAS.badge}
                  </span>
                  <span className="font-mono font-bold text-xs text-slate-900">
                    Rp 5.000 / bln
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900">{MEMBERSHIP_PLANS.KAWAN_BRIMAS.title}</h3>
                <ul className="text-xs text-slate-700 space-y-1.5 font-medium pt-1">
                  {MEMBERSHIP_PLANS.KAWAN_BRIMAS.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/upgrade"
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 border-2 border-slate-900 text-slate-950 font-mono font-bold text-xs uppercase text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all block mt-2"
              >
                Pilih Kawan Brimas
              </Link>
            </div>

            {/* Plan 2: Sahabat Brimas VIP */}
            <div className="p-5 rounded-2xl border-2 sm:border-3 border-slate-900 bg-emerald-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <Crown className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-xs uppercase tracking-wider text-emerald-900 bg-emerald-200 px-2.5 py-0.5 rounded-md border border-slate-900">
                    {MEMBERSHIP_PLANS.SAHABAT_BRIMAS.badge}
                  </span>
                  <span className="font-mono font-bold text-xs text-slate-900">
                    Rp 20.000 / bln
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900">{MEMBERSHIP_PLANS.SAHABAT_BRIMAS.title}</h3>
                <ul className="text-xs text-slate-700 space-y-1.5 font-medium pt-1">
                  {MEMBERSHIP_PLANS.SAHABAT_BRIMAS.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/upgrade"
                className="w-full py-2.5 rounded-xl bg-[#166534] hover:bg-emerald-800 border-2 border-slate-900 text-white font-mono font-bold text-xs uppercase text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all block mt-2"
              >
                Pilih Sahabat VIP (Unlimited)
              </Link>
            </div>

          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/upgrade"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#EAB308] hover:bg-amber-400 border-3 border-slate-900 text-slate-950 font-mono font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all inline-flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>UPGRADE MEMBERSHIP SEKARANG</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/artikel"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 border-3 border-slate-900 text-slate-900 font-mono font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all inline-flex items-center justify-center"
            >
              Kembali ke Artikel
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return <TambahArtikelClient />;
}

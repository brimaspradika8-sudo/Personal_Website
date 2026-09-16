"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Crown,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Loader2,
  AlertTriangle,
  ArrowLeft,
  PenTool,
  Clock,
} from "lucide-react";
import { MEMBERSHIP_PLANS } from "@/lib/membership";
import {
  createMembershipInvoice,
  UserMembershipStatus,
} from "@/lib/actions/membership";
import { soundFx } from "@/lib/audio/sound";

interface UpgradeClientProps {
  initialUser: any;
  initialMembershipStatus: UserMembershipStatus | null;
}

export default function UpgradeClient({
  initialUser,
  initialMembershipStatus,
}: UpgradeClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");
  const planParam = searchParams.get("plan");

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (statusParam === "success") {
      soundFx.playClick();
      setNotification({
        type: "success",
        title: "Pembayaran Invoice Berhasil Dibuat / Diproses!",
        message:
          "Terima kasih telah melakukan transaksi via Xendit. Status keanggotaan Anda akan otomatis aktif secara instan setelah konfirmasi sistem webhook.",
      });
    } else if (statusParam === "failed") {
      soundFx.playClick();
      setNotification({
        type: "error",
        title: "Pembayaran Dibatalkan / Gagal",
        message:
          "Transaksi invoice Xendit tidak dapat diselesaikan atau telah kadaluarsa. Silakan coba kembali saat Anda siap.",
      });
    }
  }, [statusParam]);

  const handleUpgrade = async (planKey: "KAWAN_BRIMAS" | "SAHABAT_BRIMAS") => {
    soundFx.playClick();
    setErrorMsg(null);

    if (!initialUser) {
      router.push("/login?redirectedFrom=/upgrade");
      return;
    }

    setLoadingPlan(planKey);

    try {
      const res = await createMembershipInvoice(planKey);
      if (res.error) {
        setErrorMsg(res.error);
        soundFx.playClick();
        setLoadingPlan(null);
      } else if (res.invoiceUrl) {
        window.location.href = res.invoiceUrl;
      }
    } catch (err: unknown) {
      console.error("Upgrade error:", err);
      setErrorMsg("Gagal menghubungkan ke layanan Xendit Payment Gateway.");
      soundFx.playClick();
      setLoadingPlan(null);
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const currentTier = initialMembershipStatus?.tier || "FREE";

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0A0F0D] text-slate-900 dark:text-slate-100 font-sans selection:bg-[#166534] selection:text-white pb-24">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b-2 border-slate-950 dark:border-white px-4 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="p-2 rounded-xl border-2 border-slate-950 dark:border-white bg-slate-100 dark:bg-slate-800 hover:bg-[#EAB308] hover:text-slate-950 transition-all font-mono text-xs font-black"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#166534] text-white border-2 border-slate-950 dark:border-white text-[11px] font-mono font-black tracking-wider uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Crown className="w-3.5 h-3.5 text-[#EAB308]" />
              MEMBERSHIP BRIMAS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {initialUser ? (
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 hidden sm:inline-block">
              {initialUser.email}
            </span>
          ) : (
            <Link
              href="/login?redirectedFrom=/upgrade"
              className="px-3 py-1.5 rounded-xl bg-[#EAB308] text-slate-950 font-mono font-black text-xs border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
            >
              [ LOGIN UNTUK UPGRADE ]
            </Link>
          )}
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* Banner Status Notifikasi Pembayaran Xendit */}
        {notification && (
          <div
            className={`p-5 rounded-2xl border-4 border-slate-950 dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] ${
              notification.type === "success"
                ? "bg-[#00E676] text-slate-950"
                : "bg-red-400 text-slate-950"
            }`}
          >
            <div className="flex items-start gap-3">
              {notification.type === "success" ? (
                <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h4 className="font-extrabold text-base tracking-tight font-mono uppercase">
                  {notification.title}
                </h4>
                <p className="text-xs sm:text-sm font-sans leading-relaxed">
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Global Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-xl border-2 border-slate-950 bg-red-100 text-red-900 font-mono text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* User Current Membership Status Widget */}
        {initialMembershipStatus && (
          <div className="p-6 sm:p-8 rounded-3xl border-4 border-slate-950 dark:border-white bg-white dark:bg-slate-900 shadow-[8px_8px_0px_0px_rgba(22,101,52,1)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-mono font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">
                  STATUS KEANGGOTAAN ANDA
                </span>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-950 dark:text-white uppercase flex items-center gap-2">
                    {currentTier === "SAHABAT_BRIMAS" ? (
                      <>
                        <Crown className="w-7 h-7 text-[#EAB308] fill-[#EAB308] animate-bounce" />
                        SAHABAT BRIMAS (VIP)
                      </>
                    ) : currentTier === "KAWAN_BRIMAS" ? (
                      <>
                        <Sparkles className="w-7 h-7 text-[#166534] dark:text-[#00E676]" />
                        KAWAN BRIMAS
                      </>
                    ) : (
                      "FREE USER"
                    )}
                  </h3>
                </div>
              </div>

              {initialMembershipStatus.tierExpiresAt && (
                <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-950 dark:border-white font-mono text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#166534] dark:text-[#00E676]" />
                  <span>
                    Berlaku s/d:{" "}
                    {new Date(
                      initialMembershipStatus.tierExpiresAt
                    ).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Quota & Privileges Detail */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700">
                <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-[#166534] dark:text-[#00E676]" />
                  KUOTA ARTIKEL (7 HARI TERAKHIR)
                </div>
                <div className="text-lg font-black font-mono text-slate-950 dark:text-white">
                  {currentTier === "SAHABAT_BRIMAS" || initialMembershipStatus.hasAdminAccess
                    ? "TANPA BATAS (UNLIMITED)"
                    : currentTier === "KAWAN_BRIMAS"
                    ? `${initialMembershipStatus.weeklyArticleCount} / 3 Artikel Terpakai`
                    : "0 / 0 Artikel (Upgrade untuk menulis)"}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700">
                <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#EAB308]" />
                  HAK AKSES DASHBOARD ADMIN
                </div>
                <div className="text-lg font-black font-mono text-slate-950 dark:text-white">
                  {initialMembershipStatus.hasAdminAccess
                    ? "AKTIF (AKSES PENUH)"
                    : "TIDAK AKTIF"}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700">
                <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#00E676]" />
                  PAYMENT GATEWAY VERIFIED
                </div>
                <div className="text-lg font-black font-mono text-slate-950 dark:text-white">
                  XENDIT INVOICE (IDR)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Title & Subtitle */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAB308] text-slate-950 font-mono font-black text-xs uppercase border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Zap className="w-3.5 h-3.5" /> GABUNG KOMUNITAS KREATIF & DEVELOER
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-white uppercase font-mono">
            PILIH PAKET MEMBERSHIP
          </h1>
          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
            Dapatkan hak akses eksklusif publikasi artikel jurnal, badge keanggotaan VIP, dan akses penuh ke sistem dashboard admin Brimas Pradika Utama.
          </p>
        </div>

        {/* Membership Cards Grid (2 Tiers) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-4">
          {/* TIER 1: KAWAN BRIMAS */}
          <div className="relative rounded-3xl border-4 border-slate-950 dark:border-white bg-white dark:bg-slate-900 p-8 shadow-[8px_8px_0px_0px_rgba(22,101,52,1)] flex flex-col justify-between hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            <div className="space-y-6">
              {/* Badge & Title */}
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-lg bg-[#166534] text-white font-mono font-black text-xs border-2 border-slate-950 dark:border-white uppercase tracking-wider">
                  {MEMBERSHIP_PLANS.KAWAN_BRIMAS.badge}
                </span>
                <h2 className="text-3xl font-black font-mono text-slate-950 dark:text-white uppercase tracking-tight">
                  {MEMBERSHIP_PLANS.KAWAN_BRIMAS.title}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                  {MEMBERSHIP_PLANS.KAWAN_BRIMAS.description}
                </p>
              </div>

              {/* Price Display */}
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-950 dark:border-white font-mono">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white">
                    {formatRupiah(MEMBERSHIP_PLANS.KAWAN_BRIMAS.priceIdr)}
                  </span>
                  <span className="text-xs font-bold text-slate-500">/ bulan</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-500 mt-1">
                  Atau setara ${MEMBERSHIP_PLANS.KAWAN_BRIMAS.priceUsd} USD
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-mono font-black uppercase text-slate-950 dark:text-white tracking-wider">
                  FITUR & HAK AKSES:
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-sans">
                  {MEMBERSHIP_PLANS.KAWAN_BRIMAS.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#166534] dark:text-[#00E676] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-8">
              <button
                onClick={() => handleUpgrade("KAWAN_BRIMAS")}
                disabled={loadingPlan !== null}
                className="w-full py-4 rounded-2xl bg-[#166534] hover:bg-[#15803d] text-white font-mono font-black text-xs uppercase tracking-wider border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {loadingPlan === "KAWAN_BRIMAS" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>MEMPROSES INVOICE XENDIT...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {currentTier === "KAWAN_BRIMAS"
                        ? "PERPANJANG KAWAN BRIMAS"
                        : "GABUNG KAWAN BRIMAS"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* TIER 2: SAHABAT BRIMAS (HIGHLIGHTED VIP) */}
          <div className="relative rounded-3xl border-4 border-slate-950 dark:border-white bg-[#166534]/10 dark:bg-slate-900 p-8 shadow-[10px_10px_0px_0px_rgba(234,179,8,1)] flex flex-col justify-between hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            {/* Recommended Tag */}
            <div className="absolute -top-5 left-8 bg-[#EAB308] text-slate-950 px-4 py-1 rounded-full font-mono font-black text-xs uppercase tracking-wider border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 fill-slate-950" />
              RECOMMENDED VIP
            </div>

            <div className="space-y-6 pt-2">
              {/* Badge & Title */}
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-lg bg-[#EAB308] text-slate-950 font-mono font-black text-xs border-2 border-slate-950 uppercase tracking-wider">
                  {MEMBERSHIP_PLANS.SAHABAT_BRIMAS.badge}
                </span>
                <h2 className="text-3xl font-black font-mono text-slate-950 dark:text-white uppercase tracking-tight flex items-center gap-2">
                  {MEMBERSHIP_PLANS.SAHABAT_BRIMAS.title}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                  {MEMBERSHIP_PLANS.SAHABAT_BRIMAS.description}
                </p>
              </div>

              {/* Price Display */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-950 dark:border-white font-mono">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white">
                    {formatRupiah(MEMBERSHIP_PLANS.SAHABAT_BRIMAS.priceIdr)}
                  </span>
                  <span className="text-xs font-bold text-slate-500">/ bulan</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-500 mt-1">
                  Atau setara ${MEMBERSHIP_PLANS.SAHABAT_BRIMAS.priceUsd} USD
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-mono font-black uppercase text-slate-950 dark:text-white tracking-wider">
                  FITUR UNGGULAN & ADMIN PRIVILEGE:
                </div>
                <ul className="space-y-2.5 text-xs text-slate-800 dark:text-slate-200 font-sans font-medium">
                  {MEMBERSHIP_PLANS.SAHABAT_BRIMAS.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Zap className="w-4 h-4 text-[#EAB308] fill-[#EAB308] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-8">
              <button
                onClick={() => handleUpgrade("SAHABAT_BRIMAS")}
                disabled={loadingPlan !== null}
                className="w-full py-4 rounded-2xl bg-[#EAB308] hover:bg-[#ca8a04] text-slate-950 font-mono font-black text-xs uppercase tracking-wider border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {loadingPlan === "SAHABAT_BRIMAS" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>MEMPROSES INVOICE XENDIT...</span>
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4 fill-slate-950" />
                    <span>
                      {currentTier === "SAHABAT_BRIMAS"
                        ? "PERPANJANG SAHABAT VIP"
                        : "UPGRADE SAHABAT BRIMAS (VIP)"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Security & Xendit Guarantee Badge */}
        <div className="p-6 rounded-2xl border-2 border-slate-950 dark:border-white bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-[#166534] dark:text-[#00E676] shrink-0" />
            <div>
              <h5 className="font-black text-slate-950 dark:text-white uppercase">
                PEMBAYARAN DILINDUNGI KHUSUS KHUSUS TERINTEGRASI XENDIT
              </h5>
              <p className="text-[11px] text-slate-500 font-sans">
                Mendukung Transfer Bank (VA), QRIS (Gopay/OVO/Dana), Kartu Kredit, dan Retail Outlet.
              </p>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 shrink-0">
            XENDIT REST API V2
          </div>
        </div>
      </div>
    </div>
  );
}

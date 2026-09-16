"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, KeyRound, Lock, CheckCircle2, ShieldAlert, RefreshCw, Eye, EyeOff } from "lucide-react";
import { sendForgotPasswordOtp, verifyOtpAndResetPassword } from "@/lib/actions/auth";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [email, setEmail] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // UI Status State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await sendForgotPasswordOtp(email);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccessMsg(`Kode OTP 6-digit berhasil dikirimkan ke email: ${email}`);
        setStep(2);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP Token & Update Password
  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok. Silakan periksa kembali.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Kata sandi baru minimal 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      const res = await verifyOtpAndResetPassword(email, otpToken, newPassword);
      if (res.error) {
        setError(res.error);
      } else {
        setStep(3);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat verifikasi OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 font-mono text-slate-900 bg-[#F2F3F4] dark:bg-[#0B0F17] dark:text-white selection:bg-[#DC2626] selection:text-white">
      
      {/* Background Neo-Brutalist Grid Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30 bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top Header */}
      <div className="w-full max-w-lg mb-6 relative z-10 flex items-center justify-between">
        <Link
          href="/login"
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-950 dark:text-white text-xs font-mono font-bold flex items-center gap-2 transition-all border-2 border-slate-900 dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0"
        >
          <ArrowLeft className="w-4 h-4 text-[#DC2626]" />
          <span>KEMBALI KE LOGIN</span>
        </Link>
      </div>

      {/* Main Neo-Brutalist Card */}
      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-[#0E121D] border-3 sm:border-4 border-slate-900 dark:border-white rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] space-y-6">
        
        {/* Header Title */}
        <div className="space-y-2 border-b-3 border-slate-900 dark:border-white pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFFF00] text-black border-2 border-slate-900 font-mono text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <KeyRound className="w-3.5 h-3.5" />
            <span>RESET PASSWORD PORTAL</span>
          </div>
          <h1 className="font-mono text-2xl sm:text-3xl font-black tracking-tight text-slate-950 dark:text-white uppercase">
            {step === 1 && "LUPA KATA SANDI"}
            {step === 2 && "VERIFIKASI KODE OTP"}
            {step === 3 && "PASSWORD BERHASIL DI-RESET"}
          </h1>
          <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
            {step === 1 && "Masukkan alamat email Anda untuk menerima kode OTP 6-digit."}
            {step === 2 && "Masukkan kode OTP yang dikirimkan ke email Anda & buat kata sandi baru."}
            {step === 3 && "Kata sandi Anda telah diperbarui. Silakan masuk dengan kata sandi baru."}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-xl border-3 border-slate-900 bg-red-500 text-white p-4 text-xs font-mono font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && step === 2 && (
          <div className="rounded-xl border-3 border-slate-900 bg-[#00FF66] text-black p-4 text-xs font-mono font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* ======================================================================= */}
        {/* STEP 1: ENTER EMAIL FORM */}
        {/* ======================================================================= */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                ALAMAT EMAIL TERDAFTAR
              </label>
              <div className="relative flex items-center">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full bg-slate-50 dark:bg-slate-900 border-3 border-slate-900 dark:border-white rounded-xl px-4 py-3 pl-11 text-xs font-mono font-bold text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-[#DC2626] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] transition-all"
                />
                <Mail className="w-5 h-5 text-slate-950 dark:text-white absolute left-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#DC2626] text-white border-3 border-slate-900 dark:border-white py-3.5 px-4 text-xs font-mono font-black uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:bg-[#FFFF00] hover:text-slate-950 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>MEMERIKSA EMAIL...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>KIRIM KODE OTP RESET</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ======================================================================= */}
        {/* STEP 2: ENTER OTP & NEW PASSWORD */}
        {/* ======================================================================= */}
        {step === 2 && (
          <form onSubmit={handleVerifyAndReset} className="space-y-4">
            
            {/* OTP Input */}
            <div className="space-y-1.5">
              <label htmlFor="otp" className="block text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                KODE OTP 6-DIGIT (DARI EMAIL)
              </label>
              <div className="relative flex items-center">
                <input
                  id="otp"
                  type="text"
                  required
                  maxLength={10}
                  value={otpToken}
                  onChange={(e) => setOtpToken(e.target.value)}
                  placeholder="Contoh: 123456"
                  className="w-full bg-slate-50 dark:bg-slate-900 border-3 border-slate-900 dark:border-white rounded-xl px-4 py-3 text-center text-base font-mono font-black tracking-widest text-[#DC2626] focus:outline-none focus:bg-white dark:focus:bg-slate-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] uppercase"
                />
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label htmlFor="newPassword" className="block text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                KATA SANDI BARU
              </label>
              <div className="relative flex items-center">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border-3 border-slate-900 dark:border-white rounded-xl px-4 py-3 pl-11 pr-11 text-xs font-mono font-bold text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
                />
                <Lock className="w-5 h-5 text-slate-950 dark:text-white absolute left-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 text-slate-950 dark:text-white hover:text-[#DC2626] p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                KONFIRMASI KATA SANDI BARU
              </label>
              <div className="relative flex items-center">
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border-3 border-slate-900 dark:border-white rounded-xl px-4 py-3 pl-11 text-xs font-mono font-bold text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
                />
                <Lock className="w-5 h-5 text-slate-950 dark:text-white absolute left-3.5" />
              </div>
            </div>

            <div className="pt-3 space-y-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#00FF66] text-black border-3 border-slate-900 dark:border-white py-3.5 px-4 text-xs font-mono font-black uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:bg-[#FFFF00] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>VERIFIKASI &amp; PERBAARUI...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-black" />
                    <span>VERIFIKASI &amp; RESET PASSWORD</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center text-xs font-mono font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white uppercase pt-2 cursor-pointer"
              >
                ← Ganti Email
              </button>
            </div>
          </form>
        )}

        {/* ======================================================================= */}
        {/* STEP 3: SUCCESS SCREEN */}
        {/* ======================================================================= */}
        {step === 3 && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-[#00FF66] border-4 border-slate-900 flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CheckCircle2 className="w-10 h-10 text-black stroke-[3]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-mono font-black uppercase text-slate-950 dark:text-white">
                RESET PASSWORD SUKSES!
              </h2>
              <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                Kata sandi akun Anda telah diperbarui. Anda sekarang dapat masuk menggunakan kata sandi baru Anda.
              </p>
            </div>

            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#DC2626] text-white border-3 border-slate-900 dark:border-white py-3.5 px-4 text-xs font-mono font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFFF00] hover:text-black transition-all"
            >
              <span>MASUK SEKARANG (LOGIN)</span>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

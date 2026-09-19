"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, KeyRound, Lock, CheckCircle2, ShieldAlert, RefreshCw, Eye, EyeOff, ShieldCheck, Smartphone, Sparkles } from "lucide-react";
import { sendForgotPasswordOtp, verifyOtpOnly, updatePasswordWithSession, verifyOtpAndResetPassword } from "@/lib/actions/auth";
import { useDebouncedAction } from "@/lib/hooks/useDebouncedAction";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Resend Timer State
  const [resendTimer, setResendTimer] = useState(0);

  // UI Status State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Countdown timer effect for Resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Handle OTP digit input changes
  const handleOtpChange = (index: number, value: string) => {
    const char = value.replace(/[^0-9]/g, "").slice(-1);
    const updated = [...otpDigits];
    updated[index] = char;
    setOtpDigits(updated);

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP backspace key navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (!pastedData) return;

    const updated = Array(6).fill("");
    for (let i = 0; i < pastedData.length; i++) {
      updated[i] = pastedData[i];
    }
    setOtpDigits(updated);

    const targetIndex = Math.min(pastedData.length, 5);
    inputRefs.current[targetIndex]?.focus();
  };

  const debouncedSendOtp = useDebouncedAction(async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await sendForgotPasswordOtp(email);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccessMsg(`KODE OTP 6-DIGIT TELAH DIKIRIMKAN KE EMAIL: ${email.toUpperCase()}`);
        setStep(2);
        setResendTimer(30);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim OTP.");
    } finally {
      setLoading(false);
    }
  }, 700);

  const debouncedVerifyOtp = useDebouncedAction(async () => {
    setError(null);
    setSuccessMsg(null);

    const fullCode = otpDigits.join("");
    if (fullCode.length < 6) {
      setError("Silakan masukkan 6-digit kode OTP secara lengkap.");
      return;
    }

    setLoading(true);

    try {
      const res = await verifyOtpOnly(email, fullCode);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccessMsg("KODE OTP BERHASIL TERVERIFIKASI! SILAKAN BUAT KATA SANDI BARU.");
        setStep(3);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat verifikasi OTP.");
    } finally {
      setLoading(false);
    }
  }, 700);

  const debouncedSaveNewPassword = useDebouncedAction(async () => {
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
      const res = await verifyOtpAndResetPassword(email, otpDigits.join(""), newPassword);
      if (res.error) {
        setError(res.error);
      } else {
        setStep(4);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memperbarui kata sandi.");
    } finally {
      setLoading(false);
    }
  }, 700);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loading) return;
    await debouncedSendOtp();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    await debouncedVerifyOtp();
  };

  const handleSaveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    await debouncedSaveNewPassword();
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 font-mono text-slate-900 bg-[#F2F3F4] dark:bg-[#0B0F17] dark:text-white selection:bg-[#DC2626] selection:text-white">
      
      {/* Background Neo-Brutalist Grid Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30 bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top Header */}
      <div className="w-full max-w-lg mb-6 relative z-10 flex items-center justify-between">
        <Link
          href="/login"
          className="px-4 py-2.5 bg-white dark:bg-black text-black dark:text-white text-xs font-mono font-black uppercase flex items-center gap-2 border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF0000]" />
          <span>← KEMBALI KE LOGIN</span>
        </Link>
      </div>

      {/* Main Pure Neo-Brutalist Card */}
      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-[#0E121D] border-4 border-black dark:border-white p-6 sm:p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] space-y-6">
        
        {/* Step Indicator Header (Neo-Brutalist High Contrast Badge) */}
        <div className="flex items-center justify-between pb-3 border-b-4 border-black dark:border-white gap-2 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFFF00] text-black border-2 border-black font-mono text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <KeyRound className="w-4 h-4 stroke-[3]" />
            <span>RESET PASSWORD PORTAL</span>
          </div>

          {step <= 3 && (
            <span className="text-xs font-mono font-black uppercase bg-[#FF0000] text-white px-3 py-1 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              STEP {step} / 3
            </span>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="border-4 border-black bg-[#FF0000] text-white p-4 text-xs font-mono font-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 shrink-0 stroke-[3]" />
            <span className="leading-relaxed uppercase">{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="border-4 border-black bg-[#00FF66] text-black p-4 text-xs font-mono font-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 shrink-0 stroke-[3]" />
            <span className="leading-relaxed uppercase">{successMsg}</span>
          </div>
        )}

        {/* ======================================================================= */}
        {/* STEP 1: ENTER EMAIL FORM */}
        {/* ======================================================================= */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-[#FFFF00] border-4 border-black flex items-center justify-center mx-auto shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <Mail className="w-10 h-10 text-black stroke-[3]" />
              </div>
              <h1 className="font-mono text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
                Lupa Kata Sandi?
              </h1>
              <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 max-w-xs mx-auto uppercase">
                Masukkan email terdaftar Anda untuk menerima kode OTP 6-digit.
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-mono font-black text-slate-950 dark:text-white uppercase tracking-wider">
                  ALAMAT EMAIL TERDAFTAR
                </label>
                <div className="relative flex items-center">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="NAMA@EMAIL.COM"
                    className="w-full bg-slate-50 dark:bg-slate-900 border-4 border-black dark:border-white px-4 py-3.5 pl-12 text-xs font-mono font-bold text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:bg-[#FFFF00] focus:text-black focus:border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] uppercase transition-all"
                  />
                  <Mail className="w-5 h-5 text-slate-950 dark:text-white absolute left-4 stroke-[2.5]" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF0000] text-white border-4 border-black dark:border-white py-4 px-4 text-xs font-mono font-black uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:bg-[#FFFF00] hover:text-black active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin stroke-[3]" />
                    <span>MEMERIKSA EMAIL...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-5 h-5 stroke-[3]" />
                    <span>KIRIM KODE OTP FE EMAIL</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ======================================================================= */}
        {/* STEP 2: ENTER 6-DIGIT OTP CODE ONLY (PURE NEO-BRUTALIST STYLING) */}
        {/* ======================================================================= */}
        {step === 2 && (
          <div className="space-y-6 text-center">
            
            {/* Chunky Phone Illustration Graphic */}
            <div className="w-24 h-24 bg-[#FFFF00] border-4 border-black flex items-center justify-center mx-auto shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative">
              <Smartphone className="w-12 h-12 text-black stroke-[3]" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#FF0000] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Lock className="w-4 h-4 text-white stroke-[3]" />
              </div>
            </div>

            {/* Title & Email Badge */}
            <div className="space-y-2">
              <h1 className="font-mono text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
                VERIFIKASI OTP
              </h1>
              <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">
                HALO, MASUKKAN KODE OTP 6-DIGIT YANG DIKIRIMKAN KE EMAIL:
              </p>
              <div className="bg-[#FFFF00] text-black border-2 border-black py-1 px-3.5 text-xs font-mono font-black inline-block uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                {email}
              </div>
            </div>

            {/* 6 Individual OTP Digit Input Boxes */}
            <form onSubmit={handleVerifyOtp} className="space-y-6 pt-2">
              <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-14 sm:w-13 sm:h-16 bg-white dark:bg-black border-4 border-black dark:border-white text-center font-mono text-2xl font-black text-[#FF0000] dark:text-[#00FF66] focus:outline-none focus:bg-[#FFFF00] focus:text-black focus:border-black focus:scale-110 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] uppercase transition-all"
                  />
                ))}
              </div>

              {/* Resend OTP Block */}
              <div className="bg-slate-100 dark:bg-slate-900 border-2 border-black dark:border-white p-3 text-xs font-mono font-black uppercase flex items-center justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-slate-700 dark:text-slate-300">OTP BELUM DITERIMA?</span>
                {resendTimer > 0 ? (
                  <span className="text-[#FF0000] bg-white dark:bg-black px-2 py-0.5 border border-black">
                    KIRIM ULANG ({resendTimer}s)
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    className="bg-[#FFFF00] text-black px-2.5 py-1 border border-black hover:bg-[#FF0000] hover:text-white transition-all cursor-pointer"
                  >
                    KIRIM ULANG
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={loading || otpDigits.join("").length < 6}
                  className="w-full bg-[#00FF66] text-black border-4 border-black dark:border-white py-4 px-4 text-xs font-mono font-black uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:bg-[#FFFF00] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin stroke-[3]" />
                      <span>MEMVERIFIKASI KODE...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5 text-black stroke-[3]" />
                      <span>VERIFIKASI KODE OTP</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-center text-xs font-mono font-black text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white uppercase pt-1 cursor-pointer"
                >
                  ← GANTI ALAMAT EMAIL
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================================================================= */}
        {/* STEP 3: CREATE NEW PASSWORD ONLY */}
        {/* ======================================================================= */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-[#00FF66] border-4 border-black flex items-center justify-center mx-auto shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <Lock className="w-10 h-10 text-black stroke-[3]" />
              </div>
              <h1 className="font-mono text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
                Buat Kata Sandi Baru
              </h1>
              <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 max-w-xs mx-auto uppercase">
                Kode OTP terverifikasi! Silakan masukkan kata sandi baru untuk akun Anda.
              </p>
            </div>

            <form onSubmit={handleSaveNewPassword} className="space-y-5">
              {/* New Password */}
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-xs font-mono font-black text-slate-950 dark:text-white uppercase tracking-wider">
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
                    placeholder="MINIMAL 6 KARAKTER..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border-4 border-black dark:border-white px-4 py-3.5 pl-12 pr-12 text-xs font-mono font-bold text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:bg-[#FFFF00] focus:text-black focus:border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] uppercase transition-all"
                  />
                  <Lock className="w-5 h-5 text-slate-950 dark:text-white absolute left-4 stroke-[2.5]" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 text-slate-950 dark:text-white hover:text-[#FF0000] p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 stroke-[2.5]" /> : <Eye className="w-5 h-5 stroke-[2.5]" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-xs font-mono font-black text-slate-950 dark:text-white uppercase tracking-wider">
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
                    placeholder="ULANGI KATA SANDI BARU..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border-4 border-black dark:border-white px-4 py-3.5 pl-12 text-xs font-mono font-bold text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:bg-[#FFFF00] focus:text-black focus:border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] uppercase transition-all"
                  />
                  <Lock className="w-5 h-5 text-slate-950 dark:text-white absolute left-4 stroke-[2.5]" />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00FF66] text-black border-4 border-black dark:border-white py-4 px-4 text-xs font-mono font-black uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:bg-[#FFFF00] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin stroke-[3]" />
                      <span>MENYIMPAN KATA SANDI BARU...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-black stroke-[3]" />
                      <span>SIMPAN KATA SANDI BARU</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================================================================= */}
        {/* STEP 4: SUCCESS SCREEN */}
        {/* ======================================================================= */}
        {step === 4 && (
          <div className="space-y-6 text-center py-4">
            <div className="w-20 h-20 bg-[#00FF66] border-4 border-black flex items-center justify-center mx-auto shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="w-10 h-10 text-black stroke-[3]" />
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-mono font-black uppercase text-slate-950 dark:text-white">
                RESET PASSWORD SUKSES!
              </h2>
              <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 max-w-sm mx-auto uppercase">
                Kata sandi akun Anda telah berhasil diperbarui. Anda sekarang dapat masuk menggunakan kata sandi baru Anda.
              </p>
            </div>

            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#FF0000] text-white border-4 border-black dark:border-white py-4 px-4 text-xs font-mono font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFFF00] hover:text-black transition-all"
            >
              <span>MASUK SEKARANG (LOGIN) →</span>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

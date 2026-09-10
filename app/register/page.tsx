"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ArrowLeft, Zap, Lock, Mail, User } from "lucide-react";
import { signUpWithPassword, signInWithGoogle, signInWithGithub } from "@/lib/actions/auth";

const RiveTeddyAnimation = dynamic(() => import("@/components/RiveTeddyAnimation"), {
  ssr: false,
  loading: () => <div className="w-[280px] h-[280px] rounded-full bg-slate-100 animate-pulse border border-slate-200" />,
});

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [nameText, setNameText] = useState("");
  const [emailText, setEmailText] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const teddyContainerRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  const handleNameFocus = () => {
    setIsPasswordFocused(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameText(e.target.value);
    setIsPasswordFocused(false);
  };

  const handleEmailFocus = () => {
    setIsPasswordFocused(false);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailText(e.target.value);
    setIsPasswordFocused(false);
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordChange = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordBlur = (e?: React.FocusEvent<HTMLInputElement>) => {
    if (e?.relatedTarget && toggleBtnRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
    setIsPasswordFocused(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const result = await signUpWithPassword(formData);
      if (result?.error) {
        setError(result.error);
        setIsPasswordFocused(false);
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 1500);
      }
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan saat mendaftar.");
      setIsPasswordFocused(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    setGoogleLoading(true);

    try {
      const result = await signInWithGoogle();
      if (result?.error) {
        setError(result.error);
        setIsPasswordFocused(false);
      } else if (result?.url) {
        window.location.href = result.url;
        return;
      }
    } catch (err: any) {
      setError(err?.message || "Gagal menghubungkan ke Google.");
      setIsPasswordFocused(false);
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleGithubLogin() {
    setError(null);
    setGithubLoading(true);

    try {
      const result = await signInWithGithub();
      if (result?.error) {
        setError(result.error);
        setIsPasswordFocused(false);
      } else if (result?.url) {
        window.location.href = result.url;
        return;
      }
    } catch (err: any) {
      setError(err?.message || "Gagal menghubungkan ke GitHub.");
      setIsPasswordFocused(false);
    } finally {
      setGithubLoading(false);
    }
  }

  const isAnyLoading = loading || googleLoading || githubLoading;

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 font-sans text-slate-900 bg-[#F8FAFC] selection:bg-[#DC2626] selection:text-white">
      
      {/* Subtle Web HUD Background Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-10 bg-[radial-gradient(#DC2626_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Soft Ambient Red/Blue Orbs */}
      <div className="fixed top-10 left-10 w-96 h-96 bg-[#DC2626]/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="fixed bottom-10 right-10 w-96 h-96 bg-[#2563EB]/10 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Top Back Navigation Bar */}
      <div className="w-full max-w-3xl mb-4 relative z-10 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-md shadow-slate-200/60 border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4 text-[#DC2626]" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-600">
          <Zap className="w-4 h-4 text-[#DC2626] animate-pulse" />
          <span>REGISTER PORTAL</span>
        </div>
      </div>

      {/* Main Card Wrapper (Light Theme Modern Card) */}
      <div className="relative z-10 w-full max-w-3xl bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl overflow-hidden flex flex-col md:flex-row my-auto shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
        
        {/* Top Gradient Accent Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#DC2626] via-[#F5B301] to-[#2563EB]" />

        {/* Left Animation Panel */}
        <div className="w-full md:w-[45%] bg-[#F1F5F9] p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200/80 shrink-0 relative">
          
          <div ref={teddyContainerRef} className="w-[260px] h-[260px] relative flex items-center justify-center z-10">
            <RiveTeddyAnimation
              nameText={nameText}
              emailText={emailText}
              isPasswordFocused={isPasswordFocused}
              showPassword={showPassword}
              error={error}
              success={success}
            />
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-[55%] p-6 sm:p-8 flex flex-col justify-center bg-white">
          <div className="space-y-4 max-w-sm w-full mx-auto">
            
            <div className="text-center space-y-1">
              <h1 className="font-display text-3xl font-black uppercase text-slate-900 tracking-tight">
                DAFTAR <span className="text-[#DC2626]">AKUN</span>
              </h1>
              <p className="text-xs font-mono text-slate-500">
                Buat identitas akun baru Anda
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700 shadow-sm">
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-700 shadow-sm">
                <span>Berhasil mendaftar! Mengarahkan ke halaman login...</span>
              </div>
            )}

            {/* Form Register */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSubmit(formData);
              }}
              action={handleSubmit}
              className="space-y-3.5"
            >
              <div className="space-y-1">
                <label htmlFor="name" className="block text-xs font-bold font-mono text-slate-700 uppercase">
                  Nama Lengkap
                </label>
                <div className="relative flex items-center">
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    value={nameText}
                    onChange={handleNameChange}
                    onFocus={handleNameFocus}
                    placeholder="Nama Lengkap Anda"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pl-9 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20 transition-all"
                  />
                  <User className="w-4 h-4 text-[#DC2626] absolute left-3" />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="block text-xs font-bold font-mono text-slate-700 uppercase">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    value={emailText}
                    onChange={handleEmailChange}
                    onFocus={handleEmailFocus}
                    placeholder="nama@email.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pl-9 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20 transition-all"
                  />
                  <Mail className="w-4 h-4 text-[#DC2626] absolute left-3" />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-xs font-bold font-mono text-slate-700 uppercase">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    minLength={6}
                    onChange={handlePasswordChange}
                    onFocus={handlePasswordFocus}
                    onBlur={handlePasswordBlur}
                    placeholder="Minimal 6 karakter"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pl-9 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20 transition-all"
                  />
                  <Lock className="w-4 h-4 text-[#DC2626] absolute left-3" />
                  <button
                    type="button"
                    ref={toggleBtnRef}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
                    className="absolute right-3 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.03 10.03 0 013.122-.84m4.542.493a10.05 10.05 0 013.7 2.278M21 12a9.97 9.97 0 01-1.563 3.029m-5.858 5.908l-9.56-9.56" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isAnyLoading}
                  className="w-full rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] py-3 px-4 text-xs font-black uppercase tracking-wider text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#DC2626]/20 border border-[#DC2626] hover:scale-[1.01] active:scale-[0.99]"
                >
                  {loading && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}
                  <span>{loading ? "Memproses..." : "Daftar Akun"}</span>
                </button>
              </div>
            </form>

            {/* Separator */}
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="font-mono text-[10px] text-slate-500 uppercase">Atau Gunakan</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* OAuth Register Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isAnyLoading}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-[#DC2626]/40 py-2.5 px-4 text-xs font-bold text-slate-700 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                </svg>
                <span>Google Account</span>
              </button>

              <button
                type="button"
                onClick={handleGithubLogin}
                disabled={isAnyLoading}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-[#DC2626]/40 py-2.5 px-4 text-xs font-bold text-slate-700 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              >
                <svg className="h-4 w-4 shrink-0 fill-current text-slate-900" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub Account</span>
              </button>
            </div>

            {/* Switch to Login */}
            <div className="pt-2 text-center">
              <p className="text-xs text-slate-600">
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className="font-bold text-[#DC2626] hover:underline"
                >
                  Masuk
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Zap, Lock, Mail, ShieldCheck, Terminal, Cpu } from "lucide-react";
import { signInWithGoogle, signInWithGithub, signInWithPassword } from "@/lib/actions/auth";

function LoginForm() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (urlError) {
      let msg = decodeURIComponent(urlError);
      const lower = msg.toLowerCase();
      if (lower.includes("invalid api key") || lower.includes("invalid_api_key")) {
        msg = "API Key Supabase (NEXT_PUBLIC_SUPABASE_ANON_KEY) tidak valid atau belum di-set.";
      } else if (lower.includes("auth_callback_failed") || lower.includes("invalid_grant") || lower.includes("code verifier")) {
        msg = "Gagal melakukan autentikasi dengan akun OAuth. Silakan coba masuk kembali.";
      }
      setError(msg);
    }
  }, [urlError]);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailText, setEmailText] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailText(e.target.value);
  };

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    try {
      const result = await signInWithPassword(formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err: any) {
      if (err?.digest?.startsWith("NEXT_REDIRECT") || err?.message?.includes("NEXT_REDIRECT")) {
        return;
      }
      setError(err?.message || "Terjadi kesalahan saat masuk.");
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
      } else if (result?.url) {
        window.location.href = result.url;
        return;
      }
    } catch (err: any) {
      setError(err?.message || "Gagal menghubungkan ke Google.");
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
      } else if (result?.url) {
        window.location.href = result.url;
        return;
      }
    } catch (err: any) {
      setError(err?.message || "Gagal menghubungkan ke GitHub.");
    } finally {
      setGithubLoading(false);
    }
  }

  const isAnyLoading = loading || googleLoading || githubLoading;

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 font-sans text-white bg-[#0A0A0A] selection:bg-[#DC2626] selection:text-white">
      
      {/* Subtle Web Grid Backdrop */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-15 bg-[radial-gradient(#DC2626_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Crimson Ambient Glows */}
      <div className="fixed top-1/4 -left-20 w-96 h-96 bg-[#DC2626]/15 rounded-full filter blur-[140px] pointer-events-none" />
      <div className="fixed bottom-1/4 -right-20 w-96 h-96 bg-[#DC2626]/10 rounded-full filter blur-[140px] pointer-events-none" />

      {/* Top Navigation Header */}
      <div className="w-full max-w-4xl mb-6 relative z-10 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all border border-white/10 hover:border-white/20 backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4 text-[#DC2626]" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-white/70 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <Zap className="w-4 h-4 text-[#DC2626] animate-pulse" />
          <span>AUTH PORTAL</span>
        </div>
      </div>

      {/* Main Editorial Auth Card */}
      <div className="relative z-10 w-full max-w-4xl bg-[#141414] border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row my-auto shadow-[0_25px_70px_rgba(0,0,0,0.8)]">
        
        {/* Top Crimson Accent Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#B91C1C]" />

        {/* Left Editorial Brand Panel */}
        <div className="w-full md:w-[46%] bg-[#0D0D0D] p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 shrink-0 relative overflow-hidden">
          
          {/* Top Brand Tag */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] animate-ping" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-white/60">
                PORTFOLIO SUITE
              </span>
            </div>
            <Cpu className="w-4 h-4 text-[#DC2626]" />
          </div>

          {/* Center Editorial Portrait & Quote */}
          <div className="relative z-10 my-8 flex flex-col items-center text-center">
            {/* Portrait Container with Feather Masking */}
            <div
              className="relative w-36 h-44 rounded-xl overflow-hidden mb-5 border border-white/10 shadow-2xl"
              style={{
                maskImage: "radial-gradient(ellipse 90% 90% at center, black 65%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(ellipse 90% 90% at center, black 65%, transparent 100%)",
              }}
            >
              <Image
                src="/images/avatar.webp"
                alt="Brimas Pradika Utama"
                fill
                className="object-cover object-center filter grayscale brightness-110 contrast-125"
                unoptimized
              />
            </div>

            <h2 className="font-display text-2xl font-black uppercase tracking-tight text-white mb-2">
              BRIMAS PRADIKA<br /><span className="text-[#DC2626]">UTAMA</span>
            </h2>
            
            <p className="text-xs text-white/70 leading-relaxed font-sans max-w-xs">
              &quot;Building high-performance AI systems &amp; interactive digital experiences with modern web architecture.&quot;
            </p>
          </div>

          {/* Bottom Security Footer */}
          <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-white/40 pt-4 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#DC2626]" />
              <span>SUPABASE ENCRYPTED</span>
            </div>
            <div className="flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>v2.4</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-[54%] p-7 sm:p-10 flex flex-col justify-center bg-[#141414]">
          <div className="space-y-6 max-w-sm w-full mx-auto">
            
            <div className="text-left space-y-1.5">
              <h1 className="font-display text-3xl font-black uppercase tracking-tight text-white">
                MASUK <span className="text-[#DC2626]">AKUN</span>
              </h1>
              <p className="text-xs font-mono text-white/50">
                Akses dashboard &amp; suite aplikasi Anda
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs font-bold text-red-400 shadow-sm">
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSubmit(formData);
              }}
              action={handleSubmit}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-bold font-mono text-white/70 uppercase">
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
                    placeholder="nama@email.com"
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-3.5 py-2.5 pl-9 text-sm text-white placeholder-white/30 focus:bg-[#222222] focus:outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626] transition-all"
                  />
                  <Mail className="w-4 h-4 text-[#DC2626] absolute left-3" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-xs font-bold font-mono text-white/70 uppercase">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-3.5 py-2.5 pl-9 pr-10 text-sm text-white placeholder-white/30 focus:bg-[#222222] focus:outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626] transition-all"
                  />
                  <Lock className="w-4 h-4 text-[#DC2626] absolute left-3" />
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                    className="absolute right-3 text-white/40 hover:text-white p-1 cursor-pointer"
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

              {/* Red Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isAnyLoading}
                  className="w-full rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] py-3 px-4 text-xs font-black uppercase tracking-wider text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#DC2626]/30 border border-[#DC2626] hover:scale-[1.01] active:scale-[0.99]"
                >
                  {loading && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}
                  <span>{loading ? "Memproses..." : "Masuk Sekarang"}</span>
                </button>
              </div>
            </form>

            {/* Separator */}
            <div className="flex items-center gap-3 text-xs text-white/30 pt-1">
              <div className="h-px flex-1 bg-white/10" />
              <span className="font-mono text-[10px] text-white/40 uppercase">Atau Gunakan</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isAnyLoading}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-[#1A1A1A] hover:bg-[#222222] hover:border-[#DC2626]/40 py-2.5 px-4 text-xs font-bold text-white transition-all disabled:opacity-50 cursor-pointer"
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
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-[#1A1A1A] hover:bg-[#222222] hover:border-[#DC2626]/40 py-2.5 px-4 text-xs font-bold text-white transition-all disabled:opacity-50 cursor-pointer"
              >
                <svg className="h-4 w-4 shrink-0 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub Account</span>
              </button>
            </div>

            {/* Switch to Register */}
            <div className="pt-2 text-center">
              <p className="text-xs text-white/60">
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  className="font-bold text-[#DC2626] hover:underline"
                >
                  Daftar Akun Baru
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A]" />}>
      <LoginForm />
    </Suspense>
  );
}

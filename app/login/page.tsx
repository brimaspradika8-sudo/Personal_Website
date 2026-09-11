"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { signInWithGoogle, signInWithGithub, signInWithPassword } from "@/lib/actions/auth";

const RiveTeddyAnimation = dynamic(
  () => import("@/components/RiveTeddyAnimation"),
  { ssr: false }
);

function LoginForm() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (urlError) {
      let msg = decodeURIComponent(urlError);
      const lower = msg.toLowerCase();
      if (lower.includes("invalid api key") || lower.includes("invalid_api_key")) {
        msg = "API Key Supabase tidak valid atau belum di-set.";
      } else if (lower.includes("auth_callback_failed") || lower.includes("invalid_grant") || lower.includes("code verifier")) {
        msg = "Gagal autentikasi OAuth. Silakan coba lagi.";
      }
      setError(msg);
    }
  }, [urlError]);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
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
      } else if (result?.targetPath) {
        window.location.href = result.targetPath;
        return;
      }
    } catch (err: any) {
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
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 font-sans text-slate-900 bg-[#FAFAFA] selection:bg-[#DC2626] selection:text-white">
      
      {/* Soft Light Background Glows & Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="fixed top-1/4 -left-20 w-96 h-96 bg-[#DC2626]/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 -right-20 w-96 h-96 bg-red-400/10 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <div className="w-full max-w-4xl mb-6 relative z-10 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-full bg-white text-slate-700 text-xs font-bold flex items-center gap-2 transition-all border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow"
        >
          <ArrowLeft className="w-4 h-4 text-[#DC2626]" />
          <span>Beranda</span>
        </Link>
      </div>

      {/* Main Elegant Light Auth Card */}
      <div className="relative z-10 w-full max-w-4xl bg-white border border-slate-200/80 rounded-3xl overflow-hidden flex flex-col md:flex-row my-auto shadow-[0_20px_60px_-15px_rgba(0,0,0,0.07)]">
        
        {/* Left Rive Teddy Panel (Clean & Bright) */}
        <div className="w-full md:w-[46%] bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-50 p-8 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-slate-200/60 shrink-0 relative">
          
          <div className="w-full max-w-xs h-56 flex items-center justify-center relative">
            <RiveTeddyAnimation
              emailText={emailText}
              isPasswordFocused={isPasswordFocused}
              showPassword={showPassword}
              error={error}
            />
          </div>

          <div className="text-center mt-4">
            <h2 className="font-display text-lg font-black tracking-tight text-slate-900">
              Brimas Pradika Utama
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Personal Portfolio Access
            </p>
          </div>
        </div>

        {/* Right Form Panel (Minimalist Text & Clean Inputs) */}
        <div className="w-full md:w-[54%] p-8 sm:p-11 flex flex-col justify-center bg-white">
          <div className="space-y-6 max-w-sm w-full mx-auto">
            
            <div className="text-left space-y-1">
              <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                Masuk
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Silakan masukkan email dan kata sandi Anda
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-600 shadow-sm">
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
                <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email
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
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2.5 pl-9 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20 transition-all font-medium"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2.5 pl-9 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20 transition-all font-medium"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isAnyLoading}
                  className="w-full rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] py-3 px-4 text-xs font-bold uppercase tracking-wider text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#DC2626]/25 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {loading && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}
                  <span>{loading ? "Memproses..." : "Masuk"}</span>
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-[11px] font-medium text-slate-400">atau</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isAnyLoading}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100 hover:border-slate-300 py-2.5 px-4 text-xs font-bold text-slate-800 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={handleGithubLogin}
                disabled={isAnyLoading}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100 hover:border-slate-300 py-2.5 px-4 text-xs font-bold text-slate-800 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              >
                <svg className="h-4 w-4 shrink-0 fill-current text-slate-900" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>

            {/* Switch to Register */}
            <div className="pt-2 text-center">
              <p className="text-xs text-slate-500 font-medium">
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  className="font-bold text-[#DC2626] hover:underline"
                >
                  Daftar
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
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA]" />}>
      <LoginForm />
    </Suspense>
  );
}

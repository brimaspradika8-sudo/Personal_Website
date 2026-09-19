"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import { signUpWithPassword, signInWithGoogle, signInWithGithub } from "@/lib/actions/auth";
import { useDebouncedAction } from "@/lib/hooks/useDebouncedAction";

const RiveTeddyAnimation = dynamic(
  () => import("@/components/RiveTeddyAnimation"),
  { ssr: false }
);

function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [nameText, setNameText] = useState("");
  const [emailText, setEmailText] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameText(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailText(e.target.value);
  };

  const debouncedRegister = useDebouncedAction(async (formData: FormData) => {
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const result = await signUpWithPassword(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 1500);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat mendaftar.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, 700);

  const debouncedGoogle = useDebouncedAction(async () => {
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghubungkan ke Google.";
      setError(msg);
    } finally {
      setGoogleLoading(false);
    }
  }, 700);

  const debouncedGithub = useDebouncedAction(async () => {
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghubungkan ke GitHub.";
      setError(msg);
    } finally {
      setGithubLoading(false);
    }
  }, 700);

  async function handleSubmit(formData: FormData) {
    if (loading || googleLoading || githubLoading) return;
    await debouncedRegister(formData);
  }

  async function handleGoogleLogin() {
    if (loading || googleLoading || githubLoading) return;
    await debouncedGoogle();
  }

  async function handleGithubLogin() {
    if (loading || googleLoading || githubLoading) return;
    await debouncedGithub();
  }

  const isAnyLoading = loading || googleLoading || githubLoading;

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 font-sans text-slate-900 bg-[#F2F3F4] dark:bg-[#0B0F17] dark:text-white selection:bg-[#DC2626] selection:text-white">
      
      {/* Background Neo-Brutalist Pattern & Accent Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30 bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* Top Header */}
      <div className="w-full max-w-4xl mb-6 relative z-10 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-950 dark:text-white text-xs font-mono font-bold flex items-center gap-2 transition-all border-2 border-slate-900 dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0"
        >
          <ArrowLeft className="w-4 h-4 text-[#DC2626]" />
          <span>KEMBALI KE BERANDA</span>
        </Link>
      </div>

      {/* Main Neo-Brutalist Auth Card */}
      <div className="relative z-10 w-full max-w-4xl bg-white dark:bg-[#0E121D] border-3 sm:border-4 border-slate-900 dark:border-white rounded-3xl overflow-hidden flex flex-col md:flex-row my-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
        
        {/* Left Rive Teddy Panel */}
        <div className="w-full md:w-[46%] bg-amber-400/20 dark:bg-amber-400/10 p-6 sm:p-8 flex flex-col justify-center items-center border-b-3 md:border-b-0 md:border-r-3 border-slate-900 dark:border-white shrink-0 relative">
          
          <div className="w-full max-w-xs h-44 sm:h-56 flex items-center justify-center relative">
            <RiveTeddyAnimation
              emailText={emailText}
              isPasswordFocused={isPasswordFocused}
              showPassword={showPassword}
              error={error}
            />
          </div>

          <div className="text-center mt-3 sm:mt-4 space-y-1">
            <h2 className="font-mono text-base sm:text-lg font-black tracking-tight text-slate-950 dark:text-white uppercase">
              Brimas Pradika Utama
            </h2>
            <p className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-amber-400 text-slate-950 px-2 py-0.5 rounded border border-slate-900 inline-block uppercase">
              REGISTRASI AKUN BARU
            </p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-[54%] p-6 sm:p-10 flex flex-col justify-center bg-white dark:bg-[#0E121D]">
          <div className="space-y-6 max-w-sm w-full mx-auto text-left">
            
            <div className="text-left space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 bg-[#DC2626] text-white border-2 border-slate-900 dark:border-white rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                REGISTER SYSTEM
              </span>
              <h1 className="font-mono text-2xl sm:text-3xl font-black tracking-tight text-slate-950 dark:text-white uppercase pt-1">
                DAFTAR AKUN
              </h1>
              <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                Buat akun baru untuk mengakses seluruh fitur portofolio interaktif.
              </p>
            </div>

            {error && (
              <div className="rounded-xl border-2 border-slate-900 bg-red-100 text-red-950 p-3.5 text-xs font-mono font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <span>⚠️ {error}</span>
              </div>
            )}

            {success && (
              <div className="rounded-xl border-2 border-slate-900 bg-emerald-100 text-emerald-950 p-3.5 text-xs font-mono font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <span>✅ Berhasil mendaftar! Mengarahkan ke halaman login...</span>
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
                <label htmlFor="name" className="block text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  NAMA LENGKAP
                </label>
                <div className="relative flex items-center">
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    value={nameText}
                    onChange={handleNameChange}
                    placeholder="Nama Lengkap Anda"
                    className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-900 dark:border-white rounded-xl px-3.5 py-2.5 pl-9 text-xs font-mono font-bold text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-[#DC2626] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all"
                  />
                  <User className="w-4 h-4 text-slate-950 dark:text-white absolute left-3" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  ALAMAT EMAIL
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
                    className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-900 dark:border-white rounded-xl px-3.5 py-2.5 pl-9 text-xs font-mono font-bold text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-[#DC2626] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all"
                  />
                  <Mail className="w-4 h-4 text-slate-950 dark:text-white absolute left-3" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  KATA SANDI
                </label>
                <div className="relative flex items-center">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    minLength={6}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    placeholder="Minimal 6 karakter"
                    className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-900 dark:border-white rounded-xl px-3.5 py-2.5 pl-9 pr-10 text-xs font-mono font-bold text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-[#DC2626] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-950 dark:text-white absolute left-3" />
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                    className="absolute right-3 text-slate-950 dark:text-white hover:text-[#DC2626] p-1 cursor-pointer"
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
                  className="w-full rounded-xl bg-[#DC2626] text-white border-2 border-slate-900 dark:border-white py-3 px-4 text-xs font-mono font-black uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:bg-amber-400 hover:text-slate-950 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  {loading && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}
                  <span>{loading ? "MEMPROSES..." : "DAFTAR AKUN BARU"}</span>
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 text-xs font-mono text-slate-500 pt-1">
              <div className="h-0.5 flex-1 bg-slate-900 dark:bg-white" />
              <span className="text-[11px] font-bold text-slate-950 dark:text-white uppercase">ATAU DAFTAR DENGAN</span>
              <div className="h-0.5 flex-1 bg-slate-900 dark:bg-white" />
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isAnyLoading}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 dark:border-white bg-white dark:bg-slate-900 py-2.5 px-3 text-xs font-mono font-bold text-slate-950 dark:text-white transition-all disabled:opacity-50 cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                </svg>
                <span>GOOGLE</span>
              </button>

              <button
                type="button"
                onClick={handleGithubLogin}
                disabled={isAnyLoading}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 dark:border-white bg-white dark:bg-slate-900 py-2.5 px-3 text-xs font-mono font-bold text-slate-950 dark:text-white transition-all disabled:opacity-50 cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <svg className="h-4 w-4 shrink-0 fill-current text-slate-950 dark:text-white" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GITHUB</span>
              </button>
            </div>

            {/* Switch to Login */}
            <div className="pt-2 text-center">
              <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 uppercase">
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className="font-black text-[#DC2626] hover:underline"
                >
                  MASUK DI SINI
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA]" />}>
      <RegisterForm />
    </Suspense>
  );
}

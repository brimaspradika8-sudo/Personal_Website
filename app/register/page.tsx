"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { signUpWithPassword, signInWithGoogle, signInWithGithub } from "@/lib/actions/auth";

const RiveTeddyAnimation = dynamic(() => import("@/components/RiveTeddyAnimation"), {
  ssr: false,
  loading: () => <div className="w-[280px] h-[280px] rounded-full bg-[#1A211A] animate-pulse" />,
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

    const result = await signUpWithPassword(formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
      setIsPasswordFocused(false);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    setGoogleLoading(true);

    const result = await signInWithGoogle();
    if (result?.error) {
      setError(result.error);
      setGoogleLoading(false);
      setIsPasswordFocused(false);
    } else if (result?.url) {
      window.location.href = result.url;
    }
  }

  async function handleGithubLogin() {
    setError(null);
    setGithubLoading(true);

    const result = await signInWithGithub();
    if (result?.error) {
      setError(result.error);
      setGithubLoading(false);
      setIsPasswordFocused(false);
    } else if (result?.url) {
      window.location.href = result.url;
    }
  }

  const isAnyLoading = loading || googleLoading || githubLoading;

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col md:flex-row items-center justify-center p-4 sm:p-6 font-sans text-[#F1EFE9]">
      
      {/* Background Overlay (Color-Graded to Pine & Ember) */}
      <div
        className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none bg-cover bg-top bg-fixed bg-no-repeat saturate-[0.6] brightness-[0.7] contrast-[1.05]"
        style={{ backgroundImage: "url('/animations/day-landscape.webp')" }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/animations/day-landscape.webp"
          className="absolute inset-0 object-cover object-top w-full h-full saturate-[0.6] brightness-[0.7] contrast-[1.05]"
        >
          <source src="/animations/day-landscape.mp4" type="video/mp4" />
        </video>
        {/* Option A: Multiply Blend Layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#12160F]/60 via-[#12160F]/40 to-[#12160F]/70 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#12160F]/40 via-transparent to-[#12160F]/40 pointer-events-none" />
      </div>

      {/* Outer Card Wrapper */}
      <div className="w-full max-w-3xl bg-[#1A211A]/80 backdrop-blur-md border border-[#2A2F26]/70 rounded-xl overflow-hidden flex flex-col md:flex-row my-auto shadow-2xl">
        
        {/* Left Animation Section */}
        <div className="w-full md:w-[45%] bg-[#12160F] p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#2A2F26] shrink-0 relative">
          
          <div ref={teddyContainerRef} className="w-[280px] h-[280px] relative flex items-center justify-center z-10">
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

        {/* Right Form Section */}
        <div className="w-full md:w-[55%] p-6 sm:p-8 flex flex-col justify-center">
          <div className="space-y-4 max-w-sm w-full mx-auto">
            <h1 className="font-display text-2xl font-bold text-[#F1EFE9] text-center">
              Daftar Akun Baru
            </h1>

            {error && (
              <div className="rounded-lg border border-[#7A3B32] bg-[#7A3B32]/10 p-3 text-xs text-[#F1EFE9]">
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-[#3B5D42] bg-[#3B5D42]/20 p-3 text-xs text-[#F1EFE9]">
                <span>Berhasil mendaftar! Mengarahkan ke halaman login...</span>
              </div>
            )}

            {/* Form Register */}
            <form action={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label htmlFor="name" className="block text-xs font-medium text-[#A8A79C]">
                  Nama Lengkap
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  value={nameText}
                  onChange={handleNameChange}
                  onFocus={handleNameFocus}
                  className="w-full bg-[#12160F] border border-[#2A2F26] rounded-lg px-3.5 py-2 text-sm text-[#F1EFE9] focus:outline-none focus:border-[#3B5D42]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="block text-xs font-medium text-[#A8A79C]">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={emailText}
                  onChange={handleEmailChange}
                  onFocus={handleEmailFocus}
                  className="w-full bg-[#12160F] border border-[#2A2F26] rounded-lg px-3.5 py-2 text-sm text-[#F1EFE9] focus:outline-none focus:border-[#3B5D42]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-xs font-medium text-[#A8A79C]">
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
                    className="w-full bg-[#12160F] border border-[#2A2F26] rounded-lg px-3.5 py-2 pr-10 text-sm text-[#F1EFE9] focus:outline-none focus:border-[#3B5D42]"
                  />
                  <button
                    type="button"
                    ref={toggleBtnRef}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
                    className="absolute right-2 text-[#A8A79C] hover:text-[#F1EFE9] p-1 cursor-pointer"
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

              {/* 1 Ember CTA for Register */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isAnyLoading}
                  className="w-full rounded-lg bg-[#A6532D] hover:bg-[#8A4425] py-2.5 px-4 text-sm font-medium text-[#F1EFE9] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#F1EFE9] border-t-transparent" />
                  )}
                  <span>{loading ? "Memproses..." : "Daftar"}</span>
                </button>
              </div>
            </form>

            {/* Separator */}
            <div className="flex items-center gap-3 text-xs text-[#A8A79C] pt-1">
              <div className="h-px flex-1 bg-[#2A2F26]" />
              <span className="font-medium text-[10px] text-[#A8A79C]">Atau</span>
              <div className="h-px flex-1 bg-[#2A2F26]" />
            </div>

            {/* Social OAuth Register Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isAnyLoading}
                className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-[#2A2F26] bg-[#12160F] hover:bg-[#212A20] py-2 px-4 text-xs font-medium text-[#F1EFE9] transition-colors disabled:opacity-50 cursor-pointer"
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
                className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-[#2A2F26] bg-[#12160F] hover:bg-[#212A20] py-2 px-4 text-xs font-medium text-[#F1EFE9] transition-colors disabled:opacity-50 cursor-pointer"
              >
                <svg className="h-4 w-4 shrink-0 fill-current text-[#F1EFE9]" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>

            {/* Switch to Login */}
            <div className="pt-2 text-center">
              <p className="text-xs text-[#A8A79C]">
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className="font-medium text-[#F1EFE9] hover:underline"
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

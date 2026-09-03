"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { signUpWithPassword, signInWithGoogle, signInWithGithub } from "@/lib/actions/auth";

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

  // Animation frame reference & lerp targets for smooth numLook eye movement
  const targetLookRef = useRef(50);
  const currentLookRef = useRef(50);
  const animFrameRef = useRef<number | null>(null);

  const STATE_MACHINE_NAME = "Login Machine";

  // Load Rive animation with explicit stateMachine name 'Login Machine'
  const { RiveComponent, rive } = useRive(
    {
      src: "/animations/auth-teddy.riv",
      stateMachines: STATE_MACHINE_NAME,
      autoplay: true,
    },
    {
      shouldResizeCanvasToContainer: true,
    }
  );

  const activeStateMachineName = rive?.stateMachineNames?.[0] || STATE_MACHINE_NAME;

  // Primary State Machine Inputs
  const isFocusInput = useStateMachineInput(rive, activeStateMachineName, "isFocus");
  const numLookInput = useStateMachineInput(rive, activeStateMachineName, "numLook");
  const isPrivateFieldInput = useStateMachineInput(rive, activeStateMachineName, "isPrivateField");
  const isPrivateFieldShowInput = useStateMachineInput(rive, activeStateMachineName, "isPrivateFieldShow");
  const successTriggerInput = useStateMachineInput(rive, activeStateMachineName, "successTrigger");
  const failTriggerInput = useStateMachineInput(rive, activeStateMachineName, "failTrigger");

  // Safe setter helpers
  const setFocusState = (focused: boolean) => {
    if (isFocusInput) isFocusInput.value = focused;
  };

  const setNumLookValue = (val: number) => {
    const clamped = Math.min(Math.max(val, 0), 100);
    if (numLookInput) numLookInput.value = clamped;
  };

  const setPrivateFieldState = (covered: boolean) => {
    if (isPrivateFieldInput) isPrivateFieldInput.value = covered;
  };

  const setPrivateFieldShowState = (peeking: boolean) => {
    if (isPrivateFieldShowInput) isPrivateFieldShowInput.value = peeking;
  };

  const fireSuccessTrigger = () => {
    if (successTriggerInput) successTriggerInput.fire();
  };

  const fireFailTrigger = () => {
    if (failTriggerInput) failTriggerInput.fire();
  };

  // Ultra-responsive lerp animation loop for numLook (eye cursor tracking)
  const updateSmoothNumLook = (targetVal: number) => {
    targetLookRef.current = targetVal;
    if (animFrameRef.current !== null) return;

    const step = () => {
      const diff = targetLookRef.current - currentLookRef.current;
      if (Math.abs(diff) > 0.1) {
        currentLookRef.current += diff * 0.45;
        setNumLookValue(currentLookRef.current);
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        currentLookRef.current = targetLookRef.current;
        setNumLookValue(currentLookRef.current);
        if (animFrameRef.current !== null) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }
      }
    };
    animFrameRef.current = requestAnimationFrame(step);
  };

  // Ultra-Responsive Mouse Cursor Tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isPasswordFocused || isPrivateFieldInput?.value) return;

      let targetNumLook = 50;

      if (teddyContainerRef.current) {
        const rect = teddyContainerRef.current.getBoundingClientRect();
        const teddyCenterX = rect.left + rect.width / 2;
        const deltaX = e.clientX - teddyCenterX;
        targetNumLook = Math.min(Math.max(((deltaX + 450) / 900) * 100, 0), 100);
      } else {
        const mouseRatio = e.clientX / window.innerWidth;
        targetNumLook = Math.min(Math.max(mouseRatio * 100, 0), 100);
      }

      setFocusState(true);
      updateSmoothNumLook(targetNumLook);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isPasswordFocused, isPrivateFieldInput]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Name Input Handlers
  const handleNameFocus = () => {
    setIsPasswordFocused(false);
    setFocusState(true);
    setPrivateFieldState(false);
    setPrivateFieldShowState(false);
    updateSmoothNumLook(Math.min(nameText.length * 3.3, 100));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setNameText(text);
    setIsPasswordFocused(false);
    setFocusState(true);
    setPrivateFieldState(false);
    setPrivateFieldShowState(false);
    updateSmoothNumLook(Math.min(text.length * 3.3, 100));
  };

  // Email Input Handlers
  const handleEmailFocus = () => {
    setIsPasswordFocused(false);
    setFocusState(true);
    setPrivateFieldState(false);
    setPrivateFieldShowState(false);
    updateSmoothNumLook(Math.min(emailText.length * 3.3, 100));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setEmailText(text);
    setIsPasswordFocused(false);
    setFocusState(true);
    setPrivateFieldState(false);
    setPrivateFieldShowState(false);
    updateSmoothNumLook(Math.min(text.length * 3.3, 100));
  };

  // Password Input Handlers
  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
    setFocusState(false);
    setPrivateFieldState(true);
    setPrivateFieldShowState(showPassword);
  };

  const handlePasswordChange = () => {
    setIsPasswordFocused(true);
    setFocusState(false);
    setPrivateFieldState(true);
    setPrivateFieldShowState(showPassword);
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
    setPrivateFieldState(false);
    setPrivateFieldShowState(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => {
      const nextShow = !prev;
      setPrivateFieldState(true);
      setPrivateFieldShowState(nextShow);
      return nextShow;
    });
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
      setPrivateFieldState(false);
      setPrivateFieldShowState(false);
      setFocusState(false);
      fireFailTrigger();
    } else {
      setSuccess(true);
      fireSuccessTrigger();
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
      setPrivateFieldState(false);
      setPrivateFieldShowState(false);
      setFocusState(false);
      fireFailTrigger();
    } else if (result?.url) {
      fireSuccessTrigger();
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
      setPrivateFieldState(false);
      setPrivateFieldShowState(false);
      setFocusState(false);
      fireFailTrigger();
    } else if (result?.url) {
      fireSuccessTrigger();
      window.location.href = result.url;
    }
  }

  const isAnyLoading = loading || googleLoading || githubLoading;

  return (
    <div className="flex min-h-[100dvh] w-full flex-col md:flex-row items-center justify-start md:justify-center bg-[#0B132B] md:bg-[#DDE2E8] px-4 py-4 sm:p-6 md:p-8 font-sans text-slate-900 overflow-y-auto">
      {/* Outer Card Wrapper: Desktop 2-column card compact md:max-w-[800px] md:min-h-[480px], Mobile Vertical Flow Container */}
      <div className="w-full max-w-[420px] md:max-w-[800px] min-h-0 md:min-h-[480px] bg-transparent md:bg-white rounded-none md:rounded-[24px] shadow-none md:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12)] overflow-visible md:overflow-hidden flex flex-col md:flex-row border-0 md:border md:border-slate-100 my-0 md:my-auto">
        
        {/* Panel Kiri / Top Animation Section */}
        <div className="w-full md:w-[45%] bg-transparent md:bg-gradient-to-br md:from-[#0F172A] md:via-[#1E1B4B] md:to-[#0B132B] p-0 md:p-6 flex flex-col items-center justify-center border-b-0 md:border-r md:border-slate-800 shrink-0 relative">
          {/* Ambient Lighting & Glow FX (Desktop only) */}
          <div className="hidden md:block absolute w-60 h-60 rounded-full bg-indigo-500/20 blur-3xl -top-10 -left-10 pointer-events-none" />
          <div className="hidden md:block absolute w-60 h-60 rounded-full bg-blue-600/15 blur-3xl -bottom-10 -right-10 pointer-events-none" />
          <div className="hidden md:block absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Title on Mobile Top - Exact text: "Brimas Website" */}
          <h2 className="md:hidden text-xs sm:text-sm font-semibold tracking-wider text-slate-300 text-center mb-1 mt-1">
            Brimas Website
          </h2>

          {/* Rive Teddy Animation Container */}
          <div ref={teddyContainerRef} className="w-[340px] h-[340px] md:w-[310px] md:h-[310px] relative flex items-center justify-center z-10 drop-shadow-2xl overflow-visible -mb-8 md:mb-0 md:-mt-4">
            <RiveComponent className="w-full h-full min-w-[220px] min-h-[220px]" />
          </div>
        </div>

        {/* Panel Kanan / Mobile Bottom White Card */}
        <div className="w-full md:w-[55%] bg-white rounded-3xl md:rounded-none p-6 sm:p-8 md:p-8 lg:p-10 shadow-2xl md:shadow-none flex flex-col justify-between border border-slate-100/50 md:border-0 mt-0 z-0">
          <div className="my-auto space-y-3.5 sm:space-y-4 md:space-y-5 max-w-[340px] w-full mx-auto">
            {/* Header Title Centered */}
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#0B132B] text-center">
              Register
            </h1>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs sm:text-sm text-red-600 flex items-start gap-2">
                <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs sm:text-sm text-emerald-600 flex items-start gap-2">
                <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Berhasil daftar! Mengarahkan ke halaman login...</span>
              </div>
            )}

            {/* Form Register Manual */}
            <form action={handleSubmit} className="space-y-3.5 sm:space-y-4">
              {/* Name Input */}
              <div className="space-y-1">
                <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-slate-500">
                  Nama Lengkap
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder=""
                  required
                  value={nameText}
                  onChange={handleNameChange}
                  onFocus={handleNameFocus}
                  className="w-full border-b border-slate-300 bg-transparent py-1.5 text-sm sm:text-base text-slate-900 transition-colors focus:border-[#0B132B] focus:outline-none"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-slate-500">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder=""
                  required
                  value={emailText}
                  onChange={handleEmailChange}
                  onFocus={handleEmailFocus}
                  className="w-full border-b border-slate-300 bg-transparent py-1.5 text-sm sm:text-base text-slate-900 transition-colors focus:border-[#0B132B] focus:outline-none"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-slate-500">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder=""
                    required
                    minLength={6}
                    onChange={handlePasswordChange}
                    onFocus={handlePasswordFocus}
                    onBlur={handlePasswordBlur}
                    className="w-full border-b border-slate-300 bg-transparent py-1.5 pr-10 text-sm sm:text-base text-slate-900 transition-colors focus:border-[#0B132B] focus:outline-none [::-ms-reveal]:hidden"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
                    className="absolute right-0 text-slate-400 hover:text-slate-600 focus:outline-none p-1.5"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? (
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.03 10.03 0 013.122-.84m4.542.493a10.05 10.05 0 013.7 2.278M21 12a9.97 9.97 0 01-1.563 3.029m-5.858 5.908l-9.56-9.56" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Tombol Register Navy/Deep Blue */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isAnyLoading}
                  className="w-full rounded-2xl bg-[#0B132B] hover:bg-[#162244] active:bg-[#060D1E] py-2.5 sm:py-3 px-4 text-sm sm:text-base font-semibold text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#0B132B]/40 shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}
                  <span>{loading ? "Memproses..." : "Daftar"}</span>
                </button>
              </div>
            </form>

            {/* Separator ATAU */}
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="font-medium text-slate-400 uppercase tracking-wider text-[10px] sm:text-xs">ATAU</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Social OAuth Register Buttons (Google & GitHub) */}
            <div className="space-y-2">
              {/* Google OAuth Register Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isAnyLoading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-2 sm:py-2.5 px-4 text-xs sm:text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 shadow-xs disabled:opacity-50"
              >
                {googleLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-700 border-t-transparent" />
                ) : (
                  <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                    <path fill="#FBBC05" d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                  </svg>
                )}
                <span>{googleLoading ? "Mengarahkan..." : "Daftar dengan Google"}</span>
              </button>

              {/* GitHub OAuth Register Button */}
              <button
                type="button"
                onClick={handleGithubLogin}
                disabled={isAnyLoading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-2 sm:py-2.5 px-4 text-xs sm:text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 shadow-xs disabled:opacity-50"
              >
                {githubLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-700 border-t-transparent" />
                ) : (
                  <svg className="h-4.5 w-4.5 shrink-0 fill-current text-slate-900" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                )}
                <span>{githubLoading ? "Mengarahkan..." : "Daftar dengan GitHub"}</span>
              </button>
            </div>

            {/* Login Link (Already have an account? Log in) */}
            <div className="pt-1.5 text-center">
              <p className="text-xs sm:text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[#0B132B] hover:underline transition-colors"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

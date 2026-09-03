"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { signInWithGoogle, signInWithPassword } from "@/lib/actions/auth";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  useEffect(() => {
    if (rive) {
      console.log("[Rive Debug] Asset Loaded!", {
        stateMachines: rive.stateMachineNames,
        selected: activeStateMachineName,
      });
    }
  }, [rive, activeStateMachineName]);

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
        currentLookRef.current += diff * 0.45; // ultra-responsive lerp factor
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
      // Pause eye tracking if password field is focused (hands covering eyes)
      if (isPasswordFocused || isPrivateFieldInput?.value) return;

      let targetNumLook = 50;

      if (teddyContainerRef.current) {
        const rect = teddyContainerRef.current.getBoundingClientRect();
        const teddyCenterX = rect.left + rect.width / 2;
        const deltaX = e.clientX - teddyCenterX;
        // Map deltaX from -450px to +450px to 0..100
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

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Event Handlers for Email Input
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

  const handleEmailBlur = () => {
    // Keep eyes open and responsive
  };

  // Event Handlers for Password Input
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

  // Toggle Password Visibility (Eye icon button)
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => {
      const nextShow = !prev;
      setPrivateFieldState(true);
      setPrivateFieldShowState(nextShow);
      return nextShow;
    });
  };

  // Form Submission
  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    const result = await signInWithPassword(formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
      setIsPasswordFocused(false);
      setPrivateFieldState(false);
      setPrivateFieldShowState(false);
      setFocusState(false);
      fireFailTrigger();
    } else {
      fireSuccessTrigger();
    }
  }

  // Google Login
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

  const isAnyLoading = loading || googleLoading;

  return (
    <div className="flex min-h-screen w-full bg-slate-50/60 font-sans text-slate-900">
      {/* Panel Kiri (±45% width): background putih, logo top-left, teddy animation centered */}
      <div className="hidden md:flex md:w-[45%] bg-white flex-col justify-between p-8 lg:p-12 border-r border-slate-200/70 shadow-sm relative overflow-hidden">
        {/* Logo / App Name */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Focus
          </span>
        </div>

        {/* Rive Teddy Animation Container */}
        <div className="w-full flex-1 flex items-center justify-center py-6">
          <div ref={teddyContainerRef} className="w-[360px] h-[360px] relative flex items-center justify-center">
            <RiveComponent className="w-full h-full min-w-[300px] min-h-[300px]" />
          </div>
        </div>

        {/* Footer/Subtext */}
        <div className="text-xs text-slate-400 z-10">
          © {new Date().getFullYear()} Focus App. All rights reserved.
        </div>
      </div>

      {/* Panel Kanan (±55% width): form login in center, max-w 400px */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-10 lg:p-12">
        {/* Top Header Link */}
        <div className="flex justify-between items-center w-full max-w-[400px] mx-auto md:max-w-none md:justify-end">
          <div className="md:hidden flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
              F
            </div>
            <span className="text-lg font-bold text-slate-900">Focus</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors hover:underline"
            >
              Daftar
            </Link>
          </p>
        </div>

        {/* Center Form Box */}
        <div className="w-full max-w-[400px] mx-auto my-auto py-8">
          <div className="mb-8 space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500">Login to your account</p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs sm:text-sm text-red-600 flex items-start gap-2.5">
              <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form Login Manual */}
          <form action={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="nama@email.com"
                required
                value={emailText}
                onChange={handleEmailChange}
                onFocus={handleEmailFocus}
                onBlur={handleEmailBlur}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  required
                  onChange={handlePasswordChange}
                  onFocus={handlePasswordFocus}
                  onBlur={handlePasswordBlur}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none p-1"
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

            {/* Tombol Login */}
            <button
              type="submit"
              disabled={isAnyLoading}
              className="w-full rounded-md bg-indigo-600 py-2.5 px-4 text-sm font-medium text-white transition hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              <span>{loading ? "Logging in..." : "Login"}</span>
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="font-medium text-slate-400 uppercase tracking-wider text-[11px]">atau</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Tombol Login dengan Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isAnyLoading}
            className="flex w-full items-center justify-center gap-3 rounded-md border border-slate-300 bg-white py-2.5 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm disabled:opacity-50"
          >
            {googleLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            ) : (
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                />
              </svg>
            )}
            <span>{googleLoading ? "Redirecting..." : "Login dengan Google"}</span>
          </button>
        </div>

        {/* Footer Subtext */}
        <div className="text-center text-xs text-slate-400 max-w-[400px] mx-auto w-full">
          Dengan melanjutkan, Anda menyetujui Ketentuan Layanan & Kebijakan Privasi kami.
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  ShieldCheck,
  ArrowLeft,
  LogOut,
  LogIn,
  HelpCircle,
  Edit3,
  Lock,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Save,
  Check,
  Camera,
  ChevronRight,
  Globe,
  X,
  Quote,
  ImageIcon,
  Sparkles,
  Palette,
} from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import {
  updateUserProfile,
  uploadAvatarFile,
  uploadBannerFile,
  updateBannerPreset,
} from "@/lib/actions/profile";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import MobileBottomNav from "@/components/MobileBottomNav";
import { soundFx } from "@/lib/audio/sound";
import { getSavedTheme, saveTheme } from "@/lib/theme";

interface ProfileClientProps {
  user: {
    id: string;
    email?: string;
    created_at?: string;
    app_metadata?: {
      provider?: string;
      providers?: string[];
    };
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
      banner_url?: string;
      name?: string;
      picture?: string;
    };
  } | null;
  dbUser: {
    id: string;
    email: string;
    name: string | null;
    avatar: string | null;
    created_at: Date | string;
  } | null;
}

// Preset banner gradients / patterns for quick customization
const BANNER_PRESETS = [
  {
    id: "preset-1",
    name: "CYBER YELLOW RED",
    style: "bg-gradient-to-r from-[#FF0000] via-[#FFFF00] to-amber-500",
  },
  {
    id: "preset-2",
    name: "NEON ACID GREEN",
    style: "bg-gradient-to-r from-[#00FF66] via-emerald-400 to-cyan-500",
  },
  {
    id: "preset-3",
    name: "RETRO EMERALD CODE",
    style: "bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-600",
  },
  {
    id: "preset-4",
    name: "MIDNIGHT HYPER PUNK",
    style: "bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600",
  },
];

export default function ProfileClient({ user, dbUser }: ProfileClientProps) {
  const { lang, toggleLang } = useLanguage();
  const router = useRouter();
  
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  const [activeModal, setActiveModal] = useState<"none" | "info" | "edit" | "banner" | "help">("none");

  const isAuthenticated = !!user;

  // Real user data when logged in vs Guest placeholder when unauthenticated
  const userName = isAuthenticated
    ? dbUser?.name ||
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.email?.split("@")[0] ||
      "Brimas Pradika Utama"
    : "Brimas Pradika Utama";

  const userEmail = isAuthenticated
    ? user?.email || dbUser?.email || "brimaspradika8@gmail.com"
    : "Tamu (Belum Login)";

  const defaultAvatar = isAuthenticated
    ? dbUser?.avatar || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || ""
    : "";

  const defaultBanner = isAuthenticated
    ? user?.user_metadata?.banner_url || ""
    : "";

  const [name, setName] = useState(isAuthenticated ? userName : "");
  const [avatarUrl, setAvatarUrl] = useState(defaultAvatar);
  const [bannerUrl, setBannerUrl] = useState(defaultBanner);

  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [sfxEnabled, setSfxEnabled] = useState(soundFx.getIsEnabled());
  const [mode, setMode] = useState<"day" | "night">("day");

  useEffect(() => {
    setMode(getSavedTheme());
  }, []);

  useEffect(() => {
    saveTheme(mode);
  }, [mode]);

  const handleToggleMode = () => {
    const nextMode = mode === "day" ? "night" : "day";
    setMode(nextMode);
    saveTheme(nextMode);
    soundFx.playClick();
  };

  const isNight = mode === "night";

  const initialLetter = isAuthenticated && userName ? userName.charAt(0).toUpperCase() : "B";
  const avatarSrc = avatarUrl;
  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  // Handle Avatar Image File Upload
  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: lang === "id" ? "File harus berupa gambar (JPG, PNG, WEBP)." : "File must be an image." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: lang === "id" ? "Ukuran file terlalu besar (Maks 5MB)." : "File size too large (Max 5MB)." });
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setAvatarUrl(localPreview);
    setUploadingAvatar(true);
    soundFx.playClick();

    const formData = new FormData();
    formData.append("avatarFile", file);

    const uploadRes = await uploadAvatarFile(formData);
    setUploadingAvatar(false);

    if (uploadRes.error) {
      setMessage({ type: "error", text: uploadRes.error });
      return;
    }

    if (uploadRes.avatarUrl) {
      const finalUrl = uploadRes.avatarUrl;
      setAvatarUrl(finalUrl);
      const updateRes = await updateUserProfile(name || userName, finalUrl);
      if (updateRes.error) {
        setMessage({ type: "error", text: updateRes.error });
      } else {
        setMessage({ type: "success", text: lang === "id" ? "Foto profil berhasil diperbarui!" : "Profile picture updated!" });
        router.refresh();
      }
    }
  };

  // Handle Banner Image File Upload
  const handleBannerFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "File harus berupa gambar (JPG, PNG, WEBP, GIF)." });
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setMessage({ type: "error", text: "Ukuran file banner terlalu besar (Maksimal 8MB)." });
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setBannerUrl(localPreview);
    setUploadingBanner(true);
    soundFx.playClick();

    const formData = new FormData();
    formData.append("bannerFile", file);

    const uploadRes = await uploadBannerFile(formData);
    setUploadingBanner(false);

    if (uploadRes.error) {
      setMessage({ type: "error", text: uploadRes.error });
      return;
    }

    if (uploadRes.bannerUrl) {
      setBannerUrl(uploadRes.bannerUrl);
      setMessage({ type: "success", text: "Gambar Cover Banner berhasil diperbarui!" });
      router.refresh();
    }
  };

  // Select Preset Banner Gradient
  const handleSelectPresetBanner = async (presetStyle: string) => {
    if (!user) return;
    setBannerUrl(presetStyle);
    soundFx.playClick();

    const res = await updateBannerPreset(presetStyle);
    if (res.error) {
      setMessage({ type: "error", text: res.error });
    } else {
      setMessage({ type: "success", text: "Tema Cover Banner berhasil diperbarui!" });
      router.refresh();
      setTimeout(() => {
        setMessage(null);
        setActiveModal("none");
      }, 1500);
    }
  };

  // Save Name & Profile Details
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage(null);

    soundFx.playClick();
    const res = await updateUserProfile(name, avatarUrl);
    setSaving(false);

    if (res.error) {
      setMessage({ type: "error", text: res.error });
    } else {
      setMessage({ type: "success", text: lang === "id" ? "Profil berhasil tersimpan!" : "Profile saved!" });
      router.refresh();
      setTimeout(() => {
        setMessage(null);
        setActiveModal("none");
      }, 2000);
    }
  };

  const handleToggleSfxLocal = () => {
    const newState = soundFx.toggleMute();
    setSfxEnabled(newState);
    if (newState) soundFx.playClick();
  };

  // Render logic for banner background: custom URL vs CSS gradient preset
  const isCustomBannerUrl = bannerUrl.startsWith("http://") || bannerUrl.startsWith("https://") || bannerUrl.startsWith("blob:");

  return (
    <div
      className={`relative min-h-[100dvh] w-full font-mono antialiased pb-32 sm:pb-24 transition-colors duration-300 ${
        isNight ? "bg-black text-white" : "bg-[#F4F4F0] text-black"
      }`}
    >
      {/* Hidden File Inputs for Avatar & Banner */}
      {isAuthenticated && (
        <>
          <input
            ref={avatarFileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarFileSelect}
          />
          <input
            ref={bannerFileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBannerFileSelect}
          />
        </>
      )}

      {/* Main Responsive Wrapper */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8 space-y-6 sm:space-y-8">
        
        {/* 1. TOP HEADER BANNER CARD (Neo-Brutalist Cover Photo + Overlapping Avatar) */}
        <div className="rounded-none border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
          
          {/* Cover Header Image/Gradient Background */}
          <div
            className={`h-48 sm:h-64 w-full relative flex items-start justify-between p-4 border-b-4 border-black ${
              !isCustomBannerUrl ? (bannerUrl || BANNER_PRESETS[0].style) : "bg-black"
            }`}
          >
            {/* Custom Background Image if Uploaded */}
            {isCustomBannerUrl && (
              <Image
                src={bannerUrl}
                alt="Profile Cover Banner"
                fill
                className="object-cover"
                unoptimized
              />
            )}

            {/* Retro Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:16px_16px] pointer-events-none" />
            
            {/* Navigation Back Button */}
            <Link
              href="/dashboard"
              onClick={() => soundFx.playClick()}
              className="relative z-10 px-3 py-1.5 rounded-none bg-white text-black border-3 border-black text-xs font-mono font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFFF00] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === "id" ? "BERANDA" : "HOME"}</span>
            </Link>

            {/* Upper Right Action Buttons: Edit Banner */}
            <div className="relative z-10 flex items-center gap-2">
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setActiveModal("banner");
                  }}
                  className="px-3.5 py-1.5 rounded-none bg-[#FFFF00] text-black border-3 border-black text-xs font-mono font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FF0000] hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                  title="Edit Gambar & Tema Cover Banner"
                >
                  <Camera className="w-4 h-4" />
                  <span>{lang === "id" ? "EDIT BANNER" : "EDIT BANNER"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Overlapping Avatar Profile Picture */}
          <div className="relative -mt-16 sm:-mt-20 flex flex-col items-center text-center px-4 pb-6 sm:pb-8">
            <div className="relative z-20">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    avatarFileInputRef.current?.click();
                  }}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative group cursor-pointer bg-white flex items-center justify-center"
                  title="Klik untuk mengganti foto profil"
                >
                  {avatarSrc ? (
                    <Image
                      src={avatarSrc}
                      alt={userName}
                      fill
                      className="object-cover rounded-full"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#FF0000] flex items-center justify-center text-4xl sm:text-5xl font-mono font-black text-white">
                      {initialLetter}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white rounded-full">
                    <Camera className="w-7 h-7 text-white" />
                    <span className="text-[9px] font-black uppercase mt-1">UBAH FOTO</span>
                  </div>
                </button>
              ) : (
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-[#FFFF00] text-black flex items-center justify-center">
                  <UserIcon className="w-14 h-14 sm:w-16 sm:h-16" />
                </div>
              )}

              {/* Verified Badge */}
              <div className="absolute bottom-1 right-1 bg-[#00FF66] border-2 border-black p-1 sm:p-1.5 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Check className="w-4 h-4 text-black stroke-[3]" />
              </div>
            </div>

            {/* Profile Name & Tagline Quote */}
            <div className="mt-4 space-y-2 w-full max-w-lg">
              <h1 className="text-2xl sm:text-3xl font-mono font-black uppercase tracking-tight text-black">
                {userName}
              </h1>

              <p className="text-xs sm:text-sm font-mono font-bold text-neutral-700 max-w-md mx-auto leading-relaxed flex items-center justify-center gap-1.5">
                <Quote className="w-4 h-4 text-[#FF0000] shrink-0 inline" />
                <span>Work hard in silence. Let your success be the noise.</span>
              </p>

              <div className="pt-2 flex items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none border-2 border-black bg-[#FFFF00] text-black font-mono text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-black animate-ping" />
                  <span>{isAuthenticated ? (lang === "id" ? "MEMBER AKTIF" : "ACTIVE MEMBER") : (lang === "id" ? "GUEST SESSION" : "GUEST SESSION")}</span>
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 2. DESKTOP 2-COLUMN GRID (Account Settings & Preferences Side-by-Side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* LEFT COLUMN: INFORMASI AKUN & PROFIL */}
          {isAuthenticated ? (
            <div className="rounded-none border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] divide-y-3 divide-black flex flex-col justify-between">
              <div>
                <div className="p-4 bg-[#FFFF00] border-b-3 border-black text-black font-mono font-black text-xs uppercase flex items-center gap-2">
                  <UserIcon className="w-4 h-4 stroke-[3]" />
                  <span>{lang === "id" ? "MANAJEMEN AKUN & PROFIL" : "ACCOUNT & PROFILE MANAGEMENT"}</span>
                </div>

                {/* Item 1: Detail Status Akun */}
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setActiveModal("info");
                  }}
                  className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-neutral-100 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-none bg-[#FFFF00] border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
                      <ShieldCheck className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h3 className="text-sm font-mono font-black uppercase text-black group-hover:text-[#FF0000] transition-colors">
                        {lang === "id" ? "Detail Status Akun" : "Account Status Details"}
                      </h3>
                      <p className="text-[11px] font-mono font-bold text-neutral-500">
                        {userEmail}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Item 2: Edit Nama & Foto Profil */}
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setActiveModal("edit");
                  }}
                  className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-neutral-100 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-none bg-[#FF0000] border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
                      <Edit3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-mono font-black uppercase text-black group-hover:text-[#FF0000] transition-colors">
                        {lang === "id" ? "Edit Nama & Foto Profil" : "Edit Name & Profile Photo"}
                      </h3>
                      <p className="text-[11px] font-mono font-bold text-neutral-500">
                        {lang === "id" ? "Perbarui nama tampilan & foto profil" : "Update display name & custom avatar"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Item 3: Edit Cover Banner Header */}
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setActiveModal("banner");
                  }}
                  className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-neutral-100 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-none bg-sky-400 border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
                      <ImageIcon className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h3 className="text-sm font-mono font-black uppercase text-black group-hover:text-[#FF0000] transition-colors">
                        {lang === "id" ? "Edit Cover Banner" : "Edit Cover Banner"}
                      </h3>
                      <p className="text-[11px] font-mono font-bold text-neutral-500">
                        {lang === "id" ? "Unggah gambar kustom atau tema banner" : "Upload custom photo or select theme preset"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ) : (
            /* Unauthenticated Prompt Box */
            <div className="p-6 rounded-none border-4 border-black bg-[#FFFF00] text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-5 font-mono flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-none bg-[#FF0000] border-2 border-black flex items-center justify-center text-white shrink-0 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <Lock className="w-6 h-6 stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="text-base font-black uppercase">{lang === "id" ? "MASUK ATAU DAFTAR AKUN" : "SIGN IN OR REGISTER"}</h3>
                    <p className="text-xs font-bold leading-relaxed">
                      {lang === "id" 
                        ? "Silakan masuk atau mendaftar untuk mengakses status akun, mengedit profil, dan mengubah banner Anda."
                        : "Please sign in or register to access account status, edit profile details, and customize your banner."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Link
                  href="/login"
                  onClick={() => soundFx.playClick()}
                  className="w-full py-3 px-4 text-center rounded-none bg-[#FF0000] text-white border-3 border-black text-xs font-mono font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-black transition-all cursor-pointer"
                >
                  {lang === "id" ? "MASUK / LOGIN" : "SIGN IN"}
                </Link>
                <Link
                  href="/register"
                  onClick={() => soundFx.playClick()}
                  className="w-full py-3 px-4 text-center rounded-none bg-white text-black border-3 border-black text-xs font-mono font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-all cursor-pointer"
                >
                  {lang === "id" ? "DAFTAR AKUN" : "REGISTER"}
                </Link>
              </div>
            </div>
          )}

          {/* RIGHT COLUMN: PREFERENSI & ANTARMUKA */}
          <div className="rounded-none border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] divide-y-3 divide-black flex flex-col justify-between">
            <div>
              <div className="p-4 bg-[#00FF66] border-b-3 border-black text-black font-mono font-black text-xs uppercase flex items-center gap-2">
                <Globe className="w-4 h-4 stroke-[3]" />
                <span>{lang === "id" ? "PREFERENSI & SISTEM" : "PREFERENCES & SYSTEM"}</span>
              </div>

              {/* Item 1: Efek Suara (Ambient SFX) */}
              <div className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-none bg-[#00FF66] border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
                    {sfxEnabled ? <Volume2 className="w-5 h-5 text-black" /> : <VolumeX className="w-5 h-5 text-black" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-black uppercase text-black">
                      {lang === "id" ? "Efek Suara (SFX)" : "Sound Effects (SFX)"}
                    </h3>
                    <p className="text-[11px] font-mono font-bold text-neutral-500">
                      {sfxEnabled ? (lang === "id" ? "Efek Suara Aktif" : "Sound Enabled") : (lang === "id" ? "Efek Suara Dibisukan" : "Sound Muted")}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleToggleSfxLocal}
                  className={`px-3 py-1.5 rounded-none border-2 border-black text-xs font-mono font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer ${
                    sfxEnabled ? "bg-[#00FF66] text-black" : "bg-neutral-300 text-black"
                  }`}
                >
                  {sfxEnabled ? "ON" : "OFF"}
                </button>
              </div>

              {/* Item 2: Bahasa Antarmuka (Language ID/EN) */}
              <div className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-none bg-sky-400 border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
                    <Globe className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-black uppercase text-black">
                      {lang === "id" ? "Bahasa Antarmuka" : "Interface Language"}
                    </h3>
                    <p className="text-[11px] font-mono font-bold text-neutral-500">
                      {lang === "id" ? "Bahasa Indonesia" : "English (US)"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    toggleLang();
                  }}
                  className="px-3 py-1.5 rounded-none border-2 border-black text-xs font-mono font-black uppercase bg-sky-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  {lang.toUpperCase()}
                </button>
              </div>

              {/* Item 3: Pusat Bantuan & FAQ */}
              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveModal("help");
                }}
                className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-neutral-100 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-none bg-purple-400 border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
                    <HelpCircle className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-black uppercase text-black group-hover:text-[#FF0000] transition-colors">
                      {lang === "id" ? "Pusat Bantuan & FAQ" : "Help Center & FAQ"}
                    </h3>
                    <p className="text-[11px] font-mono font-bold text-neutral-500">
                      {lang === "id" ? "Panduan penggunaan & pertanyaan umum" : "Usage guide & common questions"}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>

        {/* 3. SIGN OUT / LOGIN ACTION BUTTON */}
        <div className="pt-2">
          {isAuthenticated ? (
            <form action={signOut}>
              <button
                type="submit"
                onClick={() => soundFx.playClick()}
                className="w-full py-4 rounded-none border-4 border-black bg-[#FF0000] text-white font-mono font-black text-sm uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFFF00] hover:text-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                <span>{lang === "id" ? "KELUAR DARI AKUN (SIGN OUT)" : "SIGN OUT FROM ACCOUNT"}</span>
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              onClick={() => soundFx.playClick()}
              className="w-full py-4 rounded-none border-4 border-black bg-[#FFFF00] text-black font-mono font-black text-sm uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FF0000] hover:text-white active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              <span>{lang === "id" ? "MASUK / LOGIN KE AKUN" : "SIGN IN / LOGIN TO ACCOUNT"}</span>
            </Link>
          )}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL / DRAWER DIALOGS FOR INTERACTIVE MENU SECTIONS */}
      {/* ========================================================================= */}
      
      {/* MODAL 1: INFO STATUS AKUN */}
      {activeModal === "info" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-none border-4 border-black dark:border-white bg-white dark:bg-black p-6 space-y-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] font-mono relative">
            <div className="flex items-center justify-between pb-3 border-b-3 border-black dark:border-white">
              <h3 className="text-base font-black uppercase text-black dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#FF0000]" />
                <span>INFORMASI STATUS AKUN</span>
              </h3>
              <button
                onClick={() => setActiveModal("none")}
                className="p-1 rounded-none border-2 border-black bg-[#FF0000] text-white hover:bg-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isAuthenticated ? (
              <div className="space-y-3 text-xs font-mono font-bold">
                <div className="p-3 bg-neutral-100 dark:bg-neutral-900 border-2 border-black dark:border-white flex justify-between items-center">
                  <span className="text-neutral-500 dark:text-neutral-400">STATUS SESI</span>
                  <span className="text-[#00FF66] font-black">TERAUTENTIKASI</span>
                </div>
                <div className="p-3 bg-neutral-100 dark:bg-neutral-900 border-2 border-black dark:border-white flex justify-between items-center">
                  <span className="text-neutral-500 dark:text-neutral-400">EMAIL UTAMA</span>
                  <span className="text-black dark:text-white truncate max-w-[180px]">{userEmail}</span>
                </div>
                <div className="p-3 bg-neutral-100 dark:bg-neutral-900 border-2 border-black dark:border-white flex justify-between items-center">
                  <span className="text-neutral-500 dark:text-neutral-400">TERDAFTAR SEJAK</span>
                  <span className="text-black dark:text-white">{createdAt}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT PROFILE FORM */}
      {activeModal === "edit" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-none border-4 border-black dark:border-white bg-white dark:bg-black p-6 space-y-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] font-mono relative">
            <div className="flex items-center justify-between pb-3 border-b-3 border-black dark:border-white">
              <h3 className="text-base font-black uppercase text-black dark:text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#FF0000]" />
                <span>EDIT NAMA &amp; FOTO PROFIL</span>
              </h3>
              <button
                onClick={() => setActiveModal("none")}
                className="p-1 rounded-none border-2 border-black bg-[#FF0000] text-white hover:bg-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {message && (
                <div
                  className={`p-3 rounded-none text-xs font-black uppercase border-2 ${
                    message.type === "success"
                      ? "bg-[#00FF66] border-black text-black"
                      : "bg-[#FF0000] border-black text-white"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-black dark:text-white block">
                  NAMA TAMPILAN PROFIL
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap..."
                  required
                  className="w-full px-4 py-3 rounded-none border-3 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 text-xs font-black text-black dark:text-white focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving || uploadingAvatar}
                  className="w-full py-3.5 rounded-none bg-[#00FF66] text-black border-3 border-black font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{uploadingAvatar ? "MENGUNGGAH..." : saving ? "MENSIMPAN..." : "SIMPAN PERUBAHAN"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT COVER BANNER (UPLOAD FILE & PRESETS) */}
      {activeModal === "banner" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-none border-4 border-black dark:border-white bg-white dark:bg-black p-6 space-y-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] font-mono relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b-3 border-black dark:border-white">
              <h3 className="text-base font-black uppercase text-black dark:text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-sky-400" />
                <span>EDIT COVER BANNER</span>
              </h3>
              <button
                onClick={() => setActiveModal("none")}
                className="p-1 rounded-none border-2 border-black bg-[#FF0000] text-white hover:bg-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {message && (
              <div
                className={`p-3 rounded-none text-xs font-black uppercase border-2 ${
                  message.type === "success"
                    ? "bg-[#00FF66] border-black text-black"
                    : "bg-[#FF0000] border-black text-white"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Option A: Upload Custom Banner Image */}
            <div className="space-y-3 p-4 bg-neutral-100 dark:bg-neutral-900 border-3 border-black dark:border-white">
              <h4 className="text-xs font-black uppercase text-black dark:text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#FF0000]" />
                <span>1. UNGGAH GAMBAR BANNER KUSTOM</span>
              </h4>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                Pilih berkas foto dari komputer/HP Anda (Maksimal 8MB).
              </p>

              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  bannerFileInputRef.current?.click();
                }}
                disabled={uploadingBanner}
                className="w-full py-3 rounded-none bg-[#FFFF00] text-black border-2 border-black font-black text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FF0000] hover:text-white transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                <span>{uploadingBanner ? "MENGUNGGAH BANNER..." : "PILIH BERKAS BANNER"}</span>
              </button>
            </div>

            {/* Option B: Choose Preset Gradients */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black uppercase text-black dark:text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#00FF66]" />
                <span>2. ATAU PILIH TEMA GRADIENT PRESET</span>
              </h4>

              <div className="grid grid-cols-2 gap-3">
                {BANNER_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPresetBanner(preset.style)}
                    className={`h-16 rounded-none border-3 border-black relative overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transition-all cursor-pointer ${preset.style} flex items-end p-2`}
                  >
                    <span className="text-[9px] font-black text-white bg-black/70 px-1.5 py-0.5 rounded-none border border-black truncate max-w-full">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: BANTUAN & FAQ */}
      {activeModal === "help" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-none border-4 border-black dark:border-white bg-white dark:bg-black p-6 space-y-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] font-mono relative max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b-3 border-black dark:border-white">
              <h3 className="text-base font-black uppercase text-black dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#FF0000]" />
                <span>PUSAT BANTUAN &amp; FAQ</span>
              </h3>
              <button
                onClick={() => setActiveModal("none")}
                className="p-1 rounded-none border-2 border-black bg-[#FF0000] text-white hover:bg-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-3.5 bg-neutral-100 dark:bg-neutral-900 border-2 border-black dark:border-white space-y-1.5">
                <h4 className="font-black text-black dark:text-white uppercase">Bagaimana cara ganti Cover Banner?</h4>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Klik tombol &quot;EDIT BANNER&quot; di sudut kanan atas cover photo atau buka menu &quot;Edit Cover Banner&quot; di bawah profil untuk mengunggah gambar kustom atau memilih preset warna.
                </p>
              </div>

              <div className="p-3.5 bg-neutral-100 dark:bg-neutral-900 border-2 border-black dark:border-white space-y-1.5">
                <h4 className="font-black text-black dark:text-white uppercase">Bagaimana cara ganti foto profil?</h4>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Buka menu &quot;Edit Nama &amp; Foto Profil&quot; atau klik langsung pada foto melingkar di atas untuk mengunggah gambar baru dari perangkat Anda.
                </p>
              </div>

              <div className="p-3.5 bg-neutral-100 dark:bg-neutral-900 border-2 border-black dark:border-white space-y-1.5">
                <h4 className="font-black text-black dark:text-white uppercase">Bagaimana cara ganti mode gelap/terang?</h4>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Gunakan tombol toggle cepat di sudut kanan atas cover banner atau klik tombol `LIGHT/DARK` di grup Pengaturan Tampilan.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Mobile Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  );
}

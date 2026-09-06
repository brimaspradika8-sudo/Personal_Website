"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Mail,
  ShieldCheck,
  Calendar,
  ArrowLeft,
  LogOut,
  Sparkles,
  Compass,
  CheckCircle2,
  LogIn,
  Settings,
  HelpCircle,
  Edit3,
  Lock,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Languages,
  Save,
  Check,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  UploadCloud,
  Camera,
} from "lucide-react";
import { signOut, updateUserProfile, uploadAvatarFile } from "@/lib/actions/auth";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import MobileBottomNav from "@/components/MobileBottomNav";
import { soundFx } from "@/lib/audio/sound";

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

export default function ProfileClient({ user, dbUser }: ProfileClientProps) {
  const { lang, toggleLang, dict } = useLanguage();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"info" | "edit" | "settings" | "help">("info");

  // Form State for Edit Profile
  const defaultName =
    dbUser?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    "";
  const userAvatar = dbUser?.avatar || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const defaultAvatar = userAvatar || "";

  const [name, setName] = useState(defaultName);
  const [avatarUrl, setAvatarUrl] = useState(defaultAvatar);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Settings State
  const [sfxEnabled, setSfxEnabled] = useState(soundFx.getIsEnabled());
  const [mode, setMode] = useState<"day" | "night">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("landscape_mode") as "day" | "night") || "day";
    }
    return "day";
  });

  const [headerImgError, setHeaderImgError] = useState(false);

  useEffect(() => {
    setHeaderImgError(false);
  }, [user?.id, dbUser?.id, avatarUrl]);

  const userName =
    dbUser?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    (user ? "User Brimas Retreat" : "Pengunjung Publik (Tamu)");
  
  const initialLetter = user && userName ? userName.charAt(0).toUpperCase() : "G";
  
  const userEmail = user?.email || "Belum Login (Sesi Tamu)";
  const avatarSrc = avatarUrl;
  const provider = user?.app_metadata?.provider || "Guest Access";
  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  const presetAvatars = [
    { name: "Portfolio Original", url: "/images/avatar.png" },
    { name: "Golden Adventurer", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=BrimasGold" },
    { name: "Cyberpunk Bot", url: "https://api.dicebear.com/7.x/bottts/svg?seed=CyberArchitect" },
    { name: "Wilderness Nomad", url: "https://api.dicebear.com/7.x/micah/svg?seed=WildernessDev" },
    { name: "Gold Artisan", url: "https://api.dicebear.com/7.x/thumbs/svg?seed=GoldArtisan" },
    { name: "Lorelei Sage", url: "https://api.dicebear.com/7.x/lorelei/svg?seed=CreativeSage" },
    { name: "Notionist Minimal", url: "https://api.dicebear.com/7.x/notionists/svg?seed=CleanMinimalist" },
    { name: "Tech Leader", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=TechLeader" },
    { name: "Sparkle Champion", url: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=SparkleChampion" },
    { name: "8-Bit Retro Dev", url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=RetroDeveloper" },
    { name: "Big Smile Dev", url: "https://api.dicebear.com/7.x/big-smile/svg?seed=PositiveArchitect" },
    { name: "Geometric Abstract", url: "https://api.dicebear.com/7.x/shapes/svg?seed=AbstractGeometry" },
  ];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      const err = lang === "id" ? "File harus berupa gambar (JPG, PNG, WEBP)." : "File must be an image.";
      setMessage({ type: "error", text: err });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const err = lang === "id" ? "Ukuran file terlalu besar (Maks 5MB)." : "File size too large (Max 5MB).";
      setMessage({ type: "error", text: err });
      return;
    }

    // Instant local preview
    const localPreview = URL.createObjectURL(file);
    setAvatarUrl(localPreview);
    setUploading(true);
    soundFx.playClick();

    const formData = new FormData();
    formData.append("avatarFile", file);

    const uploadRes = await uploadAvatarFile(formData);
    setUploading(false);

    if (uploadRes.error) {
      setMessage({ type: "error", text: uploadRes.error });
      return;
    }

    if (uploadRes.avatarUrl) {
      const finalUrl = uploadRes.avatarUrl;
      setAvatarUrl(finalUrl);
      const updateRes = await updateUserProfile(name || defaultName, finalUrl);
      if (updateRes.error) {
        setMessage({ type: "error", text: updateRes.error });
      } else {
        const successMsg = lang === "id" ? "Foto profil berhasil diperbarui! 📸" : "Profile picture updated successfully! 📸";
        setMessage({ type: "success", text: successMsg });
        showToast(successMsg);
        router.refresh();
      }
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage(null);

    soundFx.playClick();
    let finalAvatarUrl = avatarUrl;

    if (selectedFile) {
      setUploading(true);
      const formData = new FormData();
      formData.append("avatarFile", selectedFile);

      const uploadRes = await uploadAvatarFile(formData);
      setUploading(false);

      if (uploadRes.error) {
        setSaving(false);
        setMessage({ type: "error", text: uploadRes.error });
        return;
      }

      if (uploadRes.avatarUrl) {
        finalAvatarUrl = uploadRes.avatarUrl;
        setAvatarUrl(finalAvatarUrl);
        setSelectedFile(null);
      }
    } else {
      const res = await updateUserProfile(name, finalAvatarUrl);
      if (res.error) {
        setSaving(false);
        setMessage({ type: "error", text: res.error });
        return;
      }
    }

    setSaving(false);
    setMessage({ type: "success", text: "Profil & Foto Profil berhasil tersimpan secara permanen!" });
    router.refresh();

    setTimeout(() => setMessage(null), 5000);
  };

  const handleToggleSfx = () => {
    const newState = soundFx.toggleMute();
    setSfxEnabled(newState);
    if (newState) soundFx.playClick();
  };

  const handleToggleTheme = () => {
    soundFx.playClick();
    const nextMode = mode === "day" ? "night" : "day";
    setMode(nextMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("landscape_mode", nextMode);
      if (nextMode === "night") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    soundFx.playClick();
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    const handleStorageChange = () => {
      const savedMode = localStorage.getItem("landscape_mode") as "day" | "night";
      if (savedMode && (savedMode === "day" || savedMode === "night")) {
        setMode(savedMode);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const isDay = mode === "day";

  const handleToggleSfxLocal = () => {
    const newState = soundFx.toggleMute();
    setSfxEnabled(newState);
    if (newState) soundFx.playClick();
    showToast(newState ? (lang === "id" ? "Efek Suara Diaktifkan 🔊" : "Sound FX Enabled 🔊") : (lang === "id" ? "Efek Suara Dimatikan 🔇" : "Sound FX Muted 🔇"));
  };

  const handleToggleThemeLocal = () => {
    soundFx.playClick();
    const nextMode = mode === "day" ? "night" : "day";
    setMode(nextMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("landscape_mode", nextMode);
      if (nextMode === "night") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    showToast(nextMode === "night" ? (lang === "id" ? "Mode Malam Hari Diaktifkan 🌙" : "Night Mode Activated 🌙") : (lang === "id" ? "Mode Siang Hari Diaktifkan ☀️" : "Day Mode Activated ☀️"));
  };

  const handleToggleLangLocal = () => {
    soundFx.playClick();
    toggleLang();
    showToast(lang === "id" ? "Language switched to English 🌐" : "Bahasa diubah ke Indonesia 🌐");
  };

  return (
    <div className={`relative min-h-[100dvh] w-full font-sans transition-colors duration-500 overflow-y-auto pb-32 sm:pb-24 ${
      isDay ? "bg-amber-50/80 text-stone-900" : "bg-stone-950 text-slate-100"
    }`}>
      
      {/* Background Nature Landscape with Soft Vignette */}
      <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <Image
          src={isDay ? "/animations/day-landscape.webp" : "/animations/night-landscape.webp"}
          alt="Nature Background"
          fill
          priority
          className={`object-cover w-full h-full filter contrast-105 blur-xs scale-105 transition-opacity duration-700 ${
            isDay ? "opacity-45 brightness-105" : "opacity-30 brightness-90"
          }`}
        />
        <div className={`absolute inset-0 transition-colors duration-500 backdrop-blur-[3px] ${
          isDay
            ? "bg-gradient-to-t from-amber-50/90 via-amber-50/80 to-amber-100/60"
            : "bg-gradient-to-t from-stone-950 via-stone-950/85 to-stone-950/60"
        }`} />
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
        
        {/* Top Navbar Back & Badge */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className={`min-h-[44px] px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm border flex items-center gap-2.5 backdrop-blur-md transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg ${
              isDay
                ? "bg-white/80 hover:bg-white text-stone-900 border-amber-900/15 shadow-amber-900/5"
                : "bg-white/10 hover:bg-white/20 text-white border-white/15"
            }`}
          >
            <ArrowLeft className={`w-4 h-4 ${isDay ? "text-amber-700" : "text-amber-300"}`} />
            <span>{dict.profile?.backBtn || (lang === "id" ? "Kembali ke Dashboard" : "Back to Dashboard")}</span>
          </Link>

          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-extrabold uppercase tracking-widest backdrop-blur-md shadow-md ${
            isDay
              ? "bg-amber-500/20 text-amber-950 border-amber-500/40"
              : "bg-amber-500/20 text-amber-300 border-amber-400/40"
          }`}>
            <Sparkles className={`w-4 h-4 animate-pulse ${isDay ? "text-amber-700" : "text-amber-300"}`} />
            <span>{dict.profile?.title || (lang === "id" ? "Pusat Akun & Profil" : "Account & Profile Center")}</span>
          </div>
        </div>

        {/* HERO COVER CARD (Modern Profile Header) */}
        <div className={`relative overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-2xl transition-all duration-500 ${
          isDay
            ? "bg-white/85 border-amber-500/30 shadow-amber-900/10 text-stone-900"
            : "bg-stone-900/90 border-amber-400/30 text-white"
        }`}>
          
          {/* Decorative Gradient Cover Banner */}
          <div className={`relative h-36 sm:h-48 w-full overflow-hidden transition-colors duration-500 ${
            isDay
              ? "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600"
              : "bg-gradient-to-r from-amber-950/90 via-stone-950 to-indigo-950/90"
          }`}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-300/30 via-yellow-400/20 to-transparent pointer-events-none" />
            <div className="absolute w-96 h-96 -top-20 -right-20 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
          </div>

          {/* Profile User Info Header */}
          <div className="px-6 sm:px-10 pb-8 relative -mt-16 sm:-mt-20">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 text-center sm:text-left">
              
              {/* Hidden File Input for Instant Avatar Upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />

              {/* Avatar Photo with Halo Ring, Camera Icon & Online Status */}
              <div className="relative group shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (user) {
                      soundFx.playClick();
                      fileInputRef.current?.click();
                    } else {
                      showToast(lang === "id" ? "Silakan login untuk mengunggah foto profil" : "Please sign in to change profile picture");
                    }
                  }}
                  className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 shadow-2xl flex items-center justify-center font-extrabold group-hover:scale-105 transition-all duration-300 cursor-pointer block ${
                    isDay
                      ? "border-amber-500/90 shadow-[0_0_35px_rgba(217,119,6,0.3)] bg-amber-50 text-stone-900"
                      : "border-amber-400/80 shadow-[0_0_35px_rgba(245,158,11,0.4)] bg-stone-950 text-amber-300"
                  }`}
                >
                  {avatarSrc && !headerImgError ? (
                    <Image
                      src={avatarSrc}
                      alt={userName}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized={avatarSrc.startsWith("http")}
                      onError={() => setHeaderImgError(true)}
                      referrerPolicy="no-referrer"
                    />
                  ) : user ? (
                    <span className="w-full h-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 text-stone-950 flex items-center justify-center font-extrabold text-3xl sm:text-4xl uppercase shadow-inner">
                      {initialLetter}
                    </span>
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${isDay ? "bg-amber-100 text-amber-900" : "bg-stone-900 text-amber-300"}`}>
                      <UserIcon className={`w-12 h-12 ${isDay ? "text-amber-800" : "text-amber-300"}`} />
                    </div>
                  )}

                  {/* Dark overlay on hover with Camera text */}
                  {user && (
                    <div className="absolute inset-0 bg-stone-950/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-amber-300 font-bold text-xs gap-1">
                      <Camera className="w-6 h-6 text-amber-300 animate-bounce" />
                      <span>{lang === "id" ? "Ganti Foto" : "Change Photo"}</span>
                    </div>
                  )}
                </button>

                {/* Camera Icon Overlay Badge (Bottom Right corner) */}
                {user && (
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      fileInputRef.current?.click();
                    }}
                    title={lang === "id" ? "Ganti Foto Profil" : "Change Profile Picture"}
                    className={`absolute bottom-0 right-0 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-115 active:scale-95 cursor-pointer backdrop-blur-md ${
                      isDay
                        ? "bg-white text-amber-800 border-amber-500 shadow-amber-900/20"
                        : "bg-stone-900 text-amber-300 border-amber-400 shadow-black/80"
                    }`}
                  >
                    <Camera className={`w-4 h-4 sm:w-5 sm:h-5 ${isDay ? "text-amber-800" : "text-amber-300"}`} />
                  </button>
                )}

                {/* Status Dot */}
                {!user && (
                  <div
                    className="absolute bottom-2 right-2 w-6 h-6 rounded-full border-3 border-stone-900 shadow-md bg-slate-500"
                    title="Guest Mode"
                  />
                )}
              </div>

              {/* User Identity Info */}
              <div className="space-y-2 flex-1 pt-2 sm:pt-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${
                    user
                      ? isDay
                        ? "bg-emerald-500/20 text-emerald-900 border-emerald-500/40 shadow-sm"
                        : "bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-sm"
                      : isDay
                        ? "bg-amber-500/20 text-amber-950 border-amber-500/40"
                        : "bg-amber-500/20 text-amber-300 border-amber-400/40"
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{user ? (dict.profile?.authenticated || "Sesi Terautentikasi") : (dict.profile?.guest || "Mode Tamu Publik")}</span>
                  </span>

                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
                    isDay
                      ? "bg-stone-100 text-stone-700 border-stone-300"
                      : "bg-white/10 text-slate-300 border-white/15"
                  }`}>
                    {provider}
                  </span>
                </div>

                <h1 className={`font-serif text-2xl sm:text-4xl font-extrabold tracking-wide ${
                  isDay ? "text-stone-900" : "text-white"
                }`}>
                  {userName}
                </h1>

                <p className={`text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-2 font-mono ${
                  isDay ? "text-stone-700" : "text-slate-300"
                }`}>
                  <Mail className={`w-4 h-4 shrink-0 ${isDay ? "text-amber-700" : "text-amber-400"}`} />
                  <span>{userEmail}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="shrink-0 pt-2 sm:pt-0">
                {user ? (
                  <form action={signOut}>
                    <button
                      type="submit"
                      onClick={() => soundFx.playClick()}
                      className={`min-h-[44px] px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold border shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer ${
                        isDay
                          ? "text-rose-900 bg-rose-100 hover:bg-rose-200 border-rose-300"
                          : "text-rose-300 bg-rose-950/60 hover:bg-rose-900/80 border-rose-400/50"
                      }`}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{dict.auth?.logout || (lang === "id" ? "Keluar" : "Sign Out")}</span>
                    </button>
                  </form>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => soundFx.playClick()}
                    className="min-h-[44px] px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-stone-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 transition-all duration-200 flex items-center gap-2 shadow-xl shadow-amber-500/20 transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{lang === "id" ? "Masuk / Login" : "Sign In / Login"}</span>
                  </Link>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* MODERN SEGMENTED TAB CONTROLLER */}
        <div className={`p-1.5 rounded-2xl border backdrop-blur-xl shadow-xl grid grid-cols-2 sm:grid-cols-4 gap-2 transition-all duration-500 ${
          isDay
            ? "bg-white/80 border-amber-500/25 shadow-amber-900/5"
            : "bg-stone-900/90 border-amber-400/20"
        }`}>
          {[
            { id: "info", label: dict.profile?.overviewTab || "Info Profil", icon: UserIcon },
            { id: "edit", label: dict.profile?.editTab || "Edit Profil", icon: user ? Edit3 : Lock },
            { id: "settings", label: dict.profile?.settingsTab || "Pengaturan", icon: Settings },
            { id: "help", label: dict.profile?.helpTab || "Bantuan & FAQ", icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`min-h-[44px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? isDay
                      ? "bg-amber-500 text-stone-950 font-black shadow-lg shadow-amber-500/25 scale-[1.02]"
                      : "bg-gradient-to-r from-amber-500/25 to-yellow-500/20 text-amber-300 border border-amber-400/50 shadow-md scale-[1.02]"
                    : isDay
                      ? "text-stone-600 hover:text-stone-950 hover:bg-amber-100/60"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? (isDay ? "text-stone-950" : "text-amber-400") : (isDay ? "text-stone-500" : "text-slate-400")}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS CONTAINER */}
        <div className={`border rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl transition-all duration-500 ${
          isDay
            ? "bg-white/85 border-amber-500/30 shadow-amber-900/10 text-stone-900"
            : "bg-stone-900/90 border-amber-400/30 text-slate-100"
        }`}>
          
          {/* TAB 1: OVERVIEW INFO */}
          {activeTab === "info" && (
            <div className="space-y-6 animate-fadeIn">
              <div className={`border-b pb-4 ${isDay ? "border-amber-900/15" : "border-white/10"}`}>
                <h3 className={`font-display text-xl font-extrabold flex items-center gap-2.5 ${isDay ? "text-stone-900" : "text-white"}`}>
                  <UserIcon className={`w-5 h-5 ${isDay ? "text-amber-700" : "text-amber-400"}`} />
                  <span>{dict.profile?.overviewTab || "Ringkasan Info Akun"}</span>
                </h3>
                <p className={`text-xs ${isDay ? "text-stone-600" : "text-slate-300"}`}>
                  {lang === "id" ? "Informasi utama seputar akun dan kredensial akses Anda." : "Primary account information and credentials access."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className={`p-5 rounded-2xl border transition-colors space-y-2 ${
                  isDay
                    ? "bg-amber-50/70 border-amber-900/10 hover:border-amber-500/40"
                    : "bg-white/5 border-white/10 hover:border-amber-400/40"
                }`}>
                  <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isDay ? "text-stone-500" : "text-slate-400"}`}>
                    <ShieldCheck className={`w-4 h-4 ${isDay ? "text-amber-700" : "text-amber-400"}`} />
                    <span>{dict.profile?.accountStatus || "Status Akun"}</span>
                  </span>
                  <p className={`text-base font-extrabold ${isDay ? "text-stone-900" : "text-white"}`}>
                    {user ? (lang === "id" ? "Terautentikasi (Aktif)" : "Authenticated (Active)") : (lang === "id" ? "Pengunjung Publik (Mode Tamu)" : "Public Guest Mode")}
                  </p>
                </div>

                <div className={`p-5 rounded-2xl border transition-colors space-y-2 ${
                  isDay
                    ? "bg-amber-50/70 border-amber-900/10 hover:border-amber-500/40"
                    : "bg-white/5 border-white/10 hover:border-amber-400/40"
                }`}>
                  <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isDay ? "text-stone-500" : "text-slate-400"}`}>
                    <Calendar className={`w-4 h-4 ${isDay ? "text-amber-700" : "text-amber-400"}`} />
                    <span>{dict.profile?.memberSince || "Terdaftar Sejak"}</span>
                  </span>
                  <p className={`text-base font-extrabold ${isDay ? "text-stone-900" : "text-white"}`}>{createdAt}</p>
                </div>

                <div className={`p-5 rounded-2xl border transition-colors space-y-2 sm:col-span-2 ${
                  isDay
                    ? "bg-amber-50/70 border-amber-900/10 hover:border-amber-500/40"
                    : "bg-white/5 border-white/10 hover:border-amber-400/40"
                }`}>
                  <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isDay ? "text-stone-500" : "text-slate-400"}`}>
                    <Mail className={`w-4 h-4 ${isDay ? "text-amber-700" : "text-amber-400"}`} />
                    <span>{dict.profile?.primaryEmail || "Email Utama"}</span>
                  </span>
                  <p className={`text-base font-mono font-extrabold ${isDay ? "text-amber-800" : "text-amber-300"}`}>
                    {userEmail}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EDIT PROFILE & AVATAR */}
          {activeTab === "edit" && (
            <div className="space-y-6 animate-fadeIn">
              <div className={`border-b pb-4 ${isDay ? "border-amber-900/15" : "border-white/10"}`}>
                <h3 className={`font-display text-xl font-extrabold flex items-center gap-2.5 ${isDay ? "text-stone-900" : "text-white"}`}>
                  <Edit3 className={`w-5 h-5 ${isDay ? "text-amber-700" : "text-amber-400"}`} />
                  <span>{dict.profile?.editTab || "Edit Profil & Avatar"}</span>
                </h3>
                <p className={`text-xs ${isDay ? "text-stone-600" : "text-slate-300"}`}>
                  {dict.profile?.editTabDesc || (lang === "id" ? "Perbarui nama tampilan dan pasang foto profil dari komputer/HP." : "Update your display name and set your custom avatar photo.")}
                </p>
              </div>

              {!user ? (
                /* LOCKED STATE FOR GUEST USER */
                <div className={`p-8 sm:p-12 rounded-3xl border text-center space-y-5 backdrop-blur-md ${
                  isDay
                    ? "bg-amber-100/60 border-amber-500/30 text-stone-900"
                    : "bg-amber-950/30 border-amber-400/40 text-white"
                }`}>
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-400/40 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20">
                    <Lock className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2 max-w-md mx-auto">
                    <h3 className={`font-display text-2xl font-extrabold ${isDay ? "text-stone-900" : "text-white"}`}>
                      {lang === "id" ? "Fitur Edit Profil Terkunci" : "Edit Profile Feature Locked"}
                    </h3>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isDay ? "text-stone-700" : "text-slate-300"}`}>
                      {lang === "id"
                        ? "Anda sedang berada dalam Mode Tamu. Silakan login terlebih dahulu untuk dapat mengunggah foto profil kustom ke Supabase Storage."
                        : "You are currently in Guest Mode. Please sign in to upload your custom avatar photo to Supabase Storage."}
                    </p>
                  </div>

                  <Link
                    href="/login"
                    onClick={() => soundFx.playClick()}
                    className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-stone-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{lang === "id" ? "Login Sekarang" : "Sign In Now"}</span>
                  </Link>
                </div>
              ) : (
                /* LOGGED IN USER FORM */
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {message && (
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-3 border ${
                        message.type === "success"
                          ? "bg-emerald-950/70 text-emerald-300 border-emerald-400/50 shadow-lg shadow-emerald-900/20"
                          : "bg-rose-950/70 text-rose-300 border-rose-400/50 shadow-lg shadow-rose-900/20"
                      }`}
                    >
                      {message.type === "success" ? (
                        <Check className="w-5 h-5 shrink-0 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                      )}
                      <span>{message.text}</span>
                    </div>
                  )}

                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className={`text-xs font-extrabold uppercase tracking-wider block ${isDay ? "text-stone-700" : "text-slate-300"}`}>
                      {dict.profile?.editNameLabel || (lang === "id" ? "Nama Tampilan Profil" : "Display Name")}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={dict.profile?.namePlaceholder || (lang === "id" ? "Masukkan nama lengkap Anda..." : "Enter your full name...")}
                      required
                      className={`w-full px-5 py-3.5 rounded-2xl border text-sm focus:outline-none focus:ring-1 transition-all ${
                        isDay
                          ? "bg-white border-stone-300 text-stone-900 placeholder-stone-400 focus:border-amber-600 focus:ring-amber-600/30"
                          : "bg-white/5 border-white/15 text-white placeholder-slate-400 focus:border-amber-400 focus:ring-amber-400/30"
                      }`}
                    />
                  </div>

                  {/* Camera Icon Hint Card */}
                  <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
                    isDay
                      ? "bg-amber-100/70 border-amber-400/40 text-stone-900"
                      : "bg-amber-500/10 border-amber-400/30 text-slate-300"
                  }`}>
                    <div className={`p-2.5 rounded-xl border shrink-0 ${
                      isDay
                        ? "bg-white text-amber-800 border-amber-400/60"
                        : "bg-amber-500/20 text-amber-300 border-amber-400/40"
                    }`}>
                      <Camera className={`w-5 h-5 ${isDay ? "text-amber-800" : "text-amber-400"}`} />
                    </div>
                    <p className={`text-xs leading-relaxed ${isDay ? "text-stone-800 font-medium" : "text-slate-300"}`}>
                      {dict.profile?.cameraHint || (lang === "id"
                        ? "Klik icon kamera 📸 pada foto profil di atas untuk langsung mengunggah foto baru dari Komputer/HP Anda secara otomatis."
                        : "Click the camera icon 📸 on your profile photo above to instantly upload a new photo from your device.")}
                    </p>
                  </div>

                  {/* Preset Avatars (12 Expanded Cards Grid) */}
                  <div className="space-y-3">
                    <label className={`text-xs font-extrabold uppercase tracking-wider block ${isDay ? "text-stone-700" : "text-slate-300"}`}>
                      {dict.profile?.presetAvatarsLabel || (lang === "id" ? "Koleksi Preset Avatar & Karakter (Klik untuk memilih)" : "Avatar & Character Preset Collection (Click to select)")}
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {presetAvatars.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          title={item.name}
                          onClick={() => {
                            soundFx.playClick();
                            setAvatarUrl(item.url);
                          }}
                          className={`group relative flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all cursor-pointer ${
                            avatarUrl === item.url
                              ? isDay
                                ? "bg-amber-500/20 border-amber-600 scale-105 shadow-[0_0_20px_rgba(217,119,6,0.3)]"
                                : "bg-amber-500/20 border-amber-400 scale-105 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                              : isDay
                                ? "bg-white/80 border-stone-200 hover:border-amber-500/60 hover:bg-amber-50 opacity-85 hover:opacity-100"
                                : "bg-white/5 border-white/10 hover:border-amber-400/40 hover:bg-white/10 opacity-75 hover:opacity-100"
                          }`}
                        >
                          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20 group-hover:scale-105 transition-transform">
                            <Image src={item.url} alt={item.name} fill className="object-cover rounded-full" unoptimized />
                          </div>
                          <span className={`text-[10px] font-bold truncate w-full text-center ${
                            isDay ? "text-stone-700 group-hover:text-amber-900" : "text-slate-300 group-hover:text-amber-300"
                          }`}>
                            {item.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="min-h-[44px] w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-stone-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer transform hover:scale-[1.01] active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {uploading
                        ? (dict.profile?.uploading || "Mengunggah Foto...")
                        : saving
                        ? (dict.profile?.saving || "Menyimpan...")
                        : (dict.profile?.saveBtn || "Simpan Perubahan Profil")}
                    </span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fadeIn">
              <div className={`border-b pb-4 ${isDay ? "border-amber-900/15" : "border-white/10"}`}>
                <h3 className={`font-display text-xl font-extrabold flex items-center gap-2.5 ${isDay ? "text-stone-900" : "text-white"}`}>
                  <Settings className={`w-5 h-5 ${isDay ? "text-amber-700" : "text-amber-400"}`} />
                  <span>{dict.profile?.settingsTab || "Pengaturan Sesi & Tampilan"}</span>
                </h3>
                <p className={`text-xs ${isDay ? "text-stone-600" : "text-slate-300"}`}>
                  {lang === "id" ? "Sesuaikan mode warna, efek suara, dan bahasa antarmuka aplikasi." : "Customize theme mode, sound effects, and interface language."}
                </p>
              </div>

              <div className="space-y-4">
                {/* Theme Toggle Card */}
                <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 transition-colors ${
                  isDay
                    ? "bg-amber-50/70 border-amber-900/10 hover:border-amber-500/40"
                    : "bg-white/5 border-white/10 hover:border-amber-400/40"
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl border ${
                      isDay
                        ? "bg-amber-500/20 text-amber-900 border-amber-500/40"
                        : "bg-amber-500/20 text-amber-300 border-amber-400/30"
                    }`}>
                      {mode === "night" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className={`text-sm font-extrabold ${isDay ? "text-stone-900" : "text-white"}`}>{dict.profile?.themeSetting || "Mode Tampilan Lanskap"}</p>
                      <p className={`text-xs ${isDay ? "text-stone-600" : "text-slate-400"}`}>{dict.profile?.themeDesc || "Pilih antara mode Siang Hari atau Malam Hari"}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleThemeLocal}
                    className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs font-extrabold border transition-all cursor-pointer shadow-md ${
                      isDay
                        ? "bg-amber-500 text-stone-950 border-amber-600 hover:bg-amber-400"
                        : "bg-white/10 hover:bg-white/20 text-amber-300 border-white/20"
                    }`}
                  >
                    <span>{mode === "night" ? "🌙 Malam" : "☀️ Siang"}</span>
                  </button>
                </div>

                {/* SFX Toggle Card */}
                <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 transition-colors ${
                  isDay
                    ? "bg-amber-50/70 border-amber-900/10 hover:border-amber-500/40"
                    : "bg-white/5 border-white/10 hover:border-amber-400/40"
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl border ${
                      isDay
                        ? "bg-amber-500/20 text-amber-900 border-amber-500/40"
                        : "bg-amber-500/20 text-amber-300 border-amber-400/30"
                    }`}>
                      {sfxEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className={`text-sm font-extrabold ${isDay ? "text-stone-900" : "text-white"}`}>{dict.profile?.sfxSetting || "Ambient Sound Effects (SFX)"}</p>
                      <p className={`text-xs ${isDay ? "text-stone-600" : "text-slate-400"}`}>{dict.profile?.sfxDesc || "Efek suara sintetis saat tombol diklik atau di-hover"}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleSfxLocal}
                    className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs font-extrabold border transition-all cursor-pointer shadow-md ${
                      sfxEnabled
                        ? isDay
                          ? "bg-amber-500 text-stone-950 border-amber-600"
                          : "bg-amber-400/20 text-amber-300 border-amber-400/50"
                        : isDay
                          ? "bg-stone-200 text-stone-600 border-stone-300"
                          : "bg-white/10 text-slate-400 border-white/20"
                    }`}
                  >
                    <span>{sfxEnabled ? "🔊 ON" : "🔇 OFF"}</span>
                  </button>
                </div>

                {/* Language Switcher Card */}
                <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 transition-colors ${
                  isDay
                    ? "bg-amber-50/70 border-amber-900/10 hover:border-amber-500/40"
                    : "bg-white/5 border-white/10 hover:border-amber-400/40"
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl border ${
                      isDay
                        ? "bg-amber-500/20 text-amber-900 border-amber-500/40"
                        : "bg-amber-500/20 text-amber-300 border-amber-400/30"
                    }`}>
                      <Languages className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={`text-sm font-extrabold ${isDay ? "text-stone-900" : "text-white"}`}>{dict.profile?.langSetting || "Bahasa Antarmuka (Language)"}</p>
                      <p className={`text-xs ${isDay ? "text-stone-600" : "text-slate-400"}`}>{dict.profile?.langDesc || "Pilih Bahasa Indonesia atau English"}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleLangLocal}
                    className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs font-extrabold border transition-all cursor-pointer shadow-md ${
                      isDay
                        ? "bg-amber-500 text-stone-950 border-amber-600 hover:bg-amber-400"
                        : "bg-white/10 hover:bg-white/20 text-amber-300 border-white/20"
                    }`}
                  >
                    <span>{lang === "id" ? "🇮🇩 Indonesia" : "🇬🇧 English"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HELP & FAQ */}
          {activeTab === "help" && (
            <div className="space-y-6 animate-fadeIn">
              <div className={`border-b pb-4 ${isDay ? "border-amber-900/15" : "border-white/10"}`}>
                <h3 className={`font-display text-xl font-extrabold flex items-center gap-2.5 ${isDay ? "text-stone-900" : "text-white"}`}>
                  <HelpCircle className={`w-5 h-5 ${isDay ? "text-amber-700" : "text-amber-400"}`} />
                  <span>{dict.profile?.helpTab || "Pusat Bantuan & FAQ"}</span>
                </h3>
                <p className={`text-xs ${isDay ? "text-stone-600" : "text-slate-300"}`}>
                  {lang === "id" ? "Jawaban untuk pertanyaan umum seputar navigasi dan akun." : "Answers to common questions about navigation and account."}
                </p>
              </div>

              <div className="space-y-4">
                <div className={`p-5 rounded-2xl border space-y-2 transition-colors ${
                  isDay
                    ? "bg-amber-50/70 border-amber-900/10 hover:border-amber-500/40"
                    : "bg-white/5 border-white/10 hover:border-amber-400/40"
                }`}>
                  <h4 className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 ${isDay ? "text-amber-900" : "text-amber-300"}`}>
                    <MessageSquare className={`w-4 h-4 ${isDay ? "text-amber-700" : "text-amber-400"}`} />
                    <span>{lang === "id" ? "Bagaimana cara kerja fitur Login?" : "How does Login authentication work?"}</span>
                  </h4>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDay ? "text-stone-700" : "text-slate-300"}`}>
                    {lang === "id"
                      ? "Website BRIMAS didesain publik. Anda dapat menikmati seluruh konten dashboard tanpa perlu login. Login memberikan akses mengunggah foto profil kustom ke Supabase Storage."
                      : "BRIMAS website is publicly accessible. You can explore all dashboard features without logging in. Signing in allows uploading custom avatar photos to Supabase Storage."}
                  </p>
                </div>

                <div className={`p-5 rounded-2xl border space-y-2 transition-colors ${
                  isDay
                    ? "bg-amber-50/70 border-amber-900/10 hover:border-amber-500/40"
                    : "bg-white/5 border-white/10 hover:border-amber-400/40"
                }`}>
                  <h4 className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 ${isDay ? "text-amber-900" : "text-amber-300"}`}>
                    <Settings className={`w-4 h-4 ${isDay ? "text-amber-700" : "text-amber-400"}`} />
                    <span>{lang === "id" ? "Cara menggunakan Command Palette (⌘K / Ctrl+K)" : "How to use Command Palette (⌘K / Ctrl+K)"}</span>
                  </h4>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDay ? "text-stone-700" : "text-slate-300"}`}>
                    {lang === "id"
                      ? "Tekan Ctrl+K di Windows atau Cmd+K di Mac kapan saja untuk memunculkan modal pintas navigasi ke project, email, atau pengubah tema secara kilat."
                      : "Press Ctrl+K on Windows or Cmd+K on Mac anytime to bring up quick navigation shortcuts for projects, email, or theme toggling."}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Ambient Gold Cursor Glow Follower (Desktop Only) */}
      <div
        className="pointer-events-none fixed z-30 hidden md:block w-80 h-80 rounded-full bg-amber-500/10 blur-3xl transition-transform duration-200 ease-out -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
        }}
      />

      {/* Floating Toast Notification Overlay */}
      {toastMsg && (
        <div className="fixed bottom-24 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-stone-950/95 border border-amber-400/60 text-amber-300 text-xs sm:text-sm font-extrabold shadow-2xl backdrop-blur-xl animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <MobileBottomNav />
    </div>
  );
}


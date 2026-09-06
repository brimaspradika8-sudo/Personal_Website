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
    "/images/avatar.png",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=BrimasExplorer",
    "https://api.dicebear.com/7.x/bottts/svg?seed=AIArchitect",
    "https://api.dicebear.com/7.x/micah/svg?seed=NatureDeveloper",
    "https://api.dicebear.com/7.x/thumbs/svg?seed=LandscapeDesign",
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "File yang dipilih harus berupa format gambar (JPG, PNG, WEBP, SVG, GIF)." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Ukuran file foto terlalu besar (Maksimal 5MB)." });
      return;
    }

    setSelectedFile(file);
    const localPreview = URL.createObjectURL(file);
    setAvatarUrl(localPreview);
    setMessage({ type: "success", text: `Foto '${file.name}' dipilih. Klik 'Simpan Perubahan' di bawah untuk mengunggah ke Storage.` });
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
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
    <div className="relative min-h-[100dvh] w-full bg-stone-950 font-sans text-slate-100 overflow-y-auto pb-32 sm:pb-24">
      
      {/* Background Nature Landscape with Soft Vignette */}
      <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <Image
          src={mode === "night" ? "/animations/night-landscape.webp" : "/animations/day-landscape.webp"}
          alt="Nature Background"
          fill
          priority
          className="object-cover w-full h-full opacity-30 filter brightness-90 contrast-105 blur-xs scale-105 transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/85 to-stone-950/60 backdrop-blur-[3px]" />
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
        
        {/* Top Navbar Back & Badge */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/15 flex items-center gap-2.5 backdrop-blur-md transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 text-amber-300" />
            <span>{dict.profile?.backBtn || (lang === "id" ? "Kembali ke Dashboard" : "Back to Dashboard")}</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-extrabold uppercase tracking-widest backdrop-blur-md shadow-md">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>{dict.profile?.title || (lang === "id" ? "Pusat Akun & Profil" : "Account & Profile Center")}</span>
          </div>
        </div>

        {/* HERO COVER CARD (Modern Profile Header) */}
        <div className="relative overflow-hidden rounded-3xl bg-stone-900/90 border border-amber-400/30 shadow-2xl backdrop-blur-2xl transition-all duration-300">
          
          {/* Decorative Gradient Cover Banner */}
          <div className="relative h-36 sm:h-48 w-full bg-gradient-to-r from-amber-950/90 via-stone-950 to-indigo-950/90 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-yellow-500/10 to-transparent pointer-events-none" />
            <div className="absolute w-96 h-96 -top-20 -right-20 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          </div>

          {/* Profile User Info Header */}
          <div className="px-6 sm:px-10 pb-8 relative -mt-16 sm:-mt-20">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 text-center sm:text-left">
              
              {/* Avatar Photo with Halo Ring & Online Status */}
              <div className="relative group shrink-0">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-amber-400/80 shadow-[0_0_35px_rgba(245,158,11,0.4)] bg-stone-950 flex items-center justify-center font-extrabold text-amber-300">
                  {avatarSrc && !headerImgError ? (
                    <Image
                      src={avatarSrc}
                      alt={userName}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized={avatarSrc.startsWith("http")}
                      onError={() => setHeaderImgError(true)}
                      referrerPolicy="no-referrer"
                    />
                  ) : user ? (
                    <span className="w-full h-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 text-stone-950 flex items-center justify-center font-extrabold text-3xl sm:text-4xl uppercase shadow-inner">
                      {initialLetter}
                    </span>
                  ) : (
                    <div className="w-full h-full bg-stone-900 flex items-center justify-center text-amber-300">
                      <UserIcon className="w-12 h-12 text-amber-300" />
                    </div>
                  )}
                </div>

                {/* Status Dot */}
                <div
                  className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-3 border-stone-900 shadow-md ${
                    user ? "bg-emerald-400 shadow-emerald-500/50 animate-pulse" : "bg-slate-500"
                  }`}
                  title={user ? "Session Active" : "Guest Mode"}
                />
              </div>

              {/* User Identity Info */}
              <div className="space-y-2 flex-1 pt-2 sm:pt-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${
                    user
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-sm"
                      : "bg-amber-500/20 text-amber-300 border-amber-400/40"
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{user ? (dict.profile?.authenticated || "Sesi Terautentikasi") : (dict.profile?.guest || "Mode Tamu Publik")}</span>
                  </span>

                  <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-white/10 text-slate-300 border border-white/15">
                    {provider}
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-white tracking-wide">
                  {userName}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 flex items-center justify-center sm:justify-start gap-2 font-mono">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
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
                      className="min-h-[44px] px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-rose-300 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-400/50 shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
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
        <div className="p-1.5 rounded-2xl bg-stone-900/90 border border-amber-400/20 backdrop-blur-xl shadow-xl grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                    ? "bg-gradient-to-r from-amber-500/25 to-yellow-500/20 text-amber-300 border border-amber-400/50 shadow-md scale-[1.02]"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS CONTAINER */}
        <div className="bg-stone-900/90 border border-amber-400/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
          
          {/* TAB 1: OVERVIEW INFO */}
          {activeTab === "info" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-display text-xl font-extrabold text-white flex items-center gap-2.5">
                  <UserIcon className="w-5 h-5 text-amber-400" />
                  <span>{dict.profile?.overviewTab || "Ringkasan Info Akun"}</span>
                </h3>
                <p className="text-xs text-slate-300">
                  {lang === "id" ? "Informasi utama seputar akun dan kredensial akses Anda." : "Primary account information and credentials access."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-colors space-y-2">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>{dict.profile?.accountStatus || "Status Akun"}</span>
                  </span>
                  <p className="text-base font-extrabold text-white">
                    {user ? (lang === "id" ? "Terautentikasi (Aktif)" : "Authenticated (Active)") : (lang === "id" ? "Pengunjung Publik (Mode Tamu)" : "Public Guest Mode")}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-colors space-y-2">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>{dict.profile?.memberSince || "Terdaftar Sejak"}</span>
                  </span>
                  <p className="text-base font-extrabold text-white">{createdAt}</p>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-colors space-y-2 sm:col-span-2">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>{dict.profile?.primaryEmail || "Email Utama"}</span>
                  </span>
                  <p className="text-base font-mono font-extrabold text-amber-300">
                    {userEmail}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EDIT PROFILE & AVATAR */}
          {activeTab === "edit" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-display text-xl font-extrabold text-white flex items-center gap-2.5">
                  <Edit3 className="w-5 h-5 text-amber-400" />
                  <span>{dict.profile?.editTab || "Edit Profil & Avatar"}</span>
                </h3>
                <p className="text-xs text-slate-300">
                  {lang === "id" ? "Perbarui nama tampilan dan pasang foto profil dari komputer/HP." : "Update your display name and set your custom avatar photo."}
                </p>
              </div>

              {!user ? (
                /* LOCKED STATE FOR GUEST USER */
                <div className="p-8 sm:p-12 rounded-3xl bg-amber-950/30 border border-amber-400/40 text-center space-y-5 backdrop-blur-md">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-400/40 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20">
                    <Lock className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2 max-w-md mx-auto">
                    <h3 className="font-display text-2xl font-extrabold text-white">
                      {lang === "id" ? "Fitur Edit Profil Terkunci" : "Edit Profile Feature Locked"}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
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
                    <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block">
                      {dict.profile?.editNameLabel || "Nama Tampilan Profil"}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={lang === "id" ? "Masukkan nama lengkap Anda..." : "Enter your full name..."}
                      required
                      className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                    />
                  </div>

                  {/* Upload File Zone */}
                  <div className="space-y-3 p-5 rounded-2xl bg-white/5 border border-white/10">
                    <label className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                      <UploadCloud className="w-4 h-4 text-amber-400" />
                      <span>{dict.profile?.uploadPhotoLabel || "Upload Foto Dari Perangkat"}</span>
                    </label>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="min-h-[44px] px-5 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-extrabold text-xs sm:text-sm border border-amber-400/40 flex items-center justify-center gap-2 backdrop-blur-md transition-all cursor-pointer shadow-md"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>{selectedFile ? `File: ${selectedFile.name}` : (lang === "id" ? "Pilih File Foto Baru..." : "Choose New Photo File...")}</span>
                      </button>
                      {selectedFile && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setAvatarUrl(defaultAvatar);
                            setMessage(null);
                          }}
                          className="text-xs text-rose-400 hover:text-rose-300 font-bold underline text-center sm:text-left cursor-pointer"
                        >
                          {lang === "id" ? "Batal" : "Cancel"}
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {dict.profile?.uploadDesc || "Format: JPG, PNG, WEBP (Maks 5MB). Foto disimpan di Supabase Storage."}
                    </p>
                  </div>

                  {/* Preset Avatars */}
                  <div className="space-y-3">
                    <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block">
                      {dict.profile?.presetAvatarsLabel || "Atau Pilih Preset Avatar Lanskap"}
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {presetAvatars.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            soundFx.playClick();
                            setAvatarUrl(url);
                          }}
                          className={`relative w-14 h-14 rounded-full overflow-hidden border-2 transition-all p-0.5 cursor-pointer ${
                            avatarUrl === url
                              ? "border-amber-400 scale-110 shadow-[0_0_20px_rgba(245,158,11,0.6)]"
                              : "border-white/20 hover:border-white/50 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <Image src={url} alt={`Preset ${idx + 1}`} fill className="object-cover rounded-full" unoptimized />
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
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-display text-xl font-extrabold text-white flex items-center gap-2.5">
                  <Settings className="w-5 h-5 text-amber-400" />
                  <span>{dict.profile?.settingsTab || "Pengaturan Sesi & Tampilan"}</span>
                </h3>
                <p className="text-xs text-slate-300">
                  {lang === "id" ? "Sesuaikan mode warna, efek suara, dan bahasa antarmuka aplikasi." : "Customize theme mode, sound effects, and interface language."}
                </p>
              </div>

              <div className="space-y-4">
                {/* Theme Toggle Card */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4 hover:border-amber-400/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      {mode === "night" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-white">{dict.profile?.themeSetting || "Mode Tampilan Lanskap"}</p>
                      <p className="text-xs text-slate-400">{dict.profile?.themeDesc || "Pilih antara mode Siang Hari atau Malam Hari"}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleThemeLocal}
                    className="min-h-[44px] px-4 py-2 rounded-2xl text-xs font-extrabold bg-white/10 hover:bg-white/20 text-amber-300 border border-white/20 transition-all cursor-pointer shadow-md"
                  >
                    <span>{mode === "night" ? "🌙 Malam" : "☀️ Siang"}</span>
                  </button>
                </div>

                {/* SFX Toggle Card */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4 hover:border-amber-400/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      {sfxEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-white">{dict.profile?.sfxSetting || "Ambient Sound Effects (SFX)"}</p>
                      <p className="text-xs text-slate-400">{dict.profile?.sfxDesc || "Efek suara sintetis saat tombol diklik atau di-hover"}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleSfxLocal}
                    className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs font-extrabold border transition-all cursor-pointer shadow-md ${
                      sfxEnabled
                        ? "bg-amber-400/20 text-amber-300 border-amber-400/50"
                        : "bg-white/10 text-slate-400 border-white/20"
                    }`}
                  >
                    <span>{sfxEnabled ? "🔊 ON" : "🔇 OFF"}</span>
                  </button>
                </div>

                {/* Language Switcher Card */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4 hover:border-amber-400/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      <Languages className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-white">{dict.profile?.langSetting || "Bahasa Antarmuka (Language)"}</p>
                      <p className="text-xs text-slate-400">{dict.profile?.langDesc || "Pilih Bahasa Indonesia atau English"}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleLangLocal}
                    className="min-h-[44px] px-4 py-2 rounded-2xl text-xs font-extrabold bg-white/10 hover:bg-white/20 text-amber-300 border border-white/20 transition-all cursor-pointer shadow-md"
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
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-display text-xl font-extrabold text-white flex items-center gap-2.5">
                  <HelpCircle className="w-5 h-5 text-amber-400" />
                  <span>{dict.profile?.helpTab || "Pusat Bantuan & FAQ"}</span>
                </h3>
                <p className="text-xs text-slate-300">
                  {lang === "id" ? "Jawaban untuk pertanyaan umum seputar navigasi dan akun." : "Answers to common questions about navigation and account."}
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-amber-400/40 transition-colors">
                  <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    <span>{lang === "id" ? "Bagaimana cara kerja fitur Login?" : "How does Login authentication work?"}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {lang === "id"
                      ? "Website BRIMAS didesain publik. Anda dapat menikmati seluruh konten dashboard tanpa perlu login. Login memberikan akses mengunggah foto profil kustom ke Supabase Storage."
                      : "BRIMAS website is publicly accessible. You can explore all dashboard features without logging in. Signing in allows uploading custom avatar photos to Supabase Storage."}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-amber-400/40 transition-colors">
                  <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <Settings className="w-4 h-4 text-amber-400" />
                    <span>{lang === "id" ? "Cara menggunakan Command Palette (⌘K / Ctrl+K)" : "How to use Command Palette (⌘K / Ctrl+K)"}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
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


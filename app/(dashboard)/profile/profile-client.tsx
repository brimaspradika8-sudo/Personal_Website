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
  LogIn,
  Settings,
  HelpCircle,
  Edit3,
  Lock,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Save,
  Check,
  AlertCircle,
  Camera,
  MessageSquare,
  Sparkles,
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

import { getSavedTheme, saveTheme } from "@/lib/theme";

export default function ProfileClient({ user, dbUser }: ProfileClientProps) {
  const { lang } = useLanguage();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"info" | "edit" | "settings" | "help">("info");

  const isAuthenticated = !!user;

  // Real user data when logged in vs Guest placeholder when unauthenticated
  const userName = isAuthenticated
    ? dbUser?.name ||
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.email?.split("@")[0] ||
      "User"
    : "Guest User";

  const userEmail = isAuthenticated
    ? user?.email || dbUser?.email || "No email provided"
    : "Tamu (Belum Login)";

  const defaultAvatar = isAuthenticated
    ? dbUser?.avatar || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || ""
    : "";

  const [name, setName] = useState(isAuthenticated ? userName : "");
  const [avatarUrl, setAvatarUrl] = useState(defaultAvatar);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [sfxEnabled, setSfxEnabled] = useState(soundFx.getIsEnabled());
  const [mode, setMode] = useState<"day" | "night">("night");

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

  const initialLetter = isAuthenticated && userName ? userName.charAt(0).toUpperCase() : "G";
  const avatarSrc = avatarUrl;
  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const updateRes = await updateUserProfile(name || userName, finalUrl);
      if (updateRes.error) {
        setMessage({ type: "error", text: updateRes.error });
      } else {
        setMessage({ type: "success", text: lang === "id" ? "Foto profil berhasil diperbarui!" : "Profile picture updated!" });
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
    }

    const res = await updateUserProfile(name, finalAvatarUrl);
    setSaving(false);

    if (res.error) {
      setMessage({ type: "error", text: res.error });
    } else {
      setMessage({ type: "success", text: lang === "id" ? "Profil berhasil tersimpan!" : "Profile saved!" });
      router.refresh();
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleToggleSfxLocal = () => {
    const newState = soundFx.toggleMute();
    setSfxEnabled(newState);
    if (newState) soundFx.playClick();
  };

  return (
    <div className={`relative min-h-[100dvh] w-full font-sans antialiased pb-32 sm:pb-24 transition-colors duration-300 selection:bg-[#DC2626] selection:text-white ${
      isNight ? "bg-[#0A0A0B] text-[#F1EFE9]" : "bg-[#F8F9FA] text-[#1A1A1A]"
    }`}>
      
      {/* Single Subtle Ambient Orb */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#DC2626]/5 rounded-full filter blur-[140px] pointer-events-none" />

      {/* Header / Sticky Top Navbar (Neo-Brutalist Floating Bar) */}
      <header className={`fixed top-3 sm:top-5 left-3 sm:left-6 right-3 sm:right-6 z-50 transition-colors duration-300 pointer-events-none`}>
        <div className={`max-w-4xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4 rounded-2xl border-2 sm:border-3 border-slate-900 dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] pointer-events-auto ${
          isNight ? "bg-[#0E121D]/90 backdrop-blur-md text-white" : "bg-white/90 backdrop-blur-md text-slate-950"
        }`}>
          <Link
            href="/dashboard"
            prefetch={false}
            onClick={() => soundFx.playClick()}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-950 dark:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:bg-[#DC2626] hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#DC2626] group-hover:text-white" />
            <span>{lang === "id" ? "KEMBALI KE BERANDA" : "BACK TO HOME"}</span>
          </Link>

          <button
            onClick={handleToggleMode}
            className={`p-2 rounded-xl border-2 border-slate-900 dark:border-white transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] ${
              isNight
                ? "bg-amber-400 text-slate-950"
                : "bg-slate-900 text-white"
            }`}
            title={isNight ? "Ganti ke Mode Terang (Light)" : "Ganti ke Mode Malam (Dark)"}
          >
            {isNight ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 space-y-10 relative z-10">

        {/* Hidden File Input for Avatar */}
        {isAuthenticated && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        )}

        {/* Profile Header Block (Neo-Brutalist Box Container) */}
        <div className="p-6 sm:p-8 rounded-3xl border-3 border-slate-900 dark:border-white bg-white dark:bg-[#0E121D] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] flex flex-col sm:flex-row items-center sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 text-center sm:text-left">
            {/* Avatar Container (Thick Neo-Brutalist Ring) */}
            <div className="relative shrink-0">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    fileInputRef.current?.click();
                  }}
                  className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border-3 border-slate-900 dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all cursor-pointer group flex items-center justify-center ${
                    isNight ? "bg-slate-900" : "bg-slate-100"
                  }`}
                  title="Klik untuk mengganti foto profil"
                >
                  {avatarSrc ? (
                    <Image
                      src={avatarSrc}
                      alt={userName}
                      fill
                      className="object-cover rounded-2xl"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-[#DC2626] flex items-center justify-center text-3xl font-mono font-black text-white">
                      {initialLetter}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white rounded-2xl">
                    <Camera className="w-7 h-7 text-white" />
                  </div>
                </button>
              ) : (
                <div className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-3 border-slate-900 dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] shrink-0 flex items-center justify-center ${
                  isNight ? "bg-slate-900 text-slate-400" : "bg-slate-100 text-slate-500"
                }`}>
                  <UserIcon className="w-12 h-12" />
                </div>
              )}
            </div>

            {/* User Identity Info */}
            <div className="space-y-1.5 flex-1">
              {isAuthenticated ? (
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-slate-900 bg-emerald-400 text-slate-950 font-mono text-[11px] font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
                    MEMBER AKTIF
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-slate-900 bg-amber-400 text-slate-950 font-mono text-[11px] font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <span className="w-2 h-2 rounded-full bg-slate-950" />
                    GUEST SESSION
                  </span>
                </div>
              )}

              <h1 className="text-2xl sm:text-3xl font-mono font-black uppercase tracking-tight text-slate-950 dark:text-white">
                {userName}
              </h1>

              <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-4 h-4 text-[#DC2626]" />
                <span>{isAuthenticated ? userEmail : "Silakan masuk untuk mengedit profil Anda"}</span>
              </p>
            </div>
          </div>

          {/* Sign Out / Sign In Button */}
          <div className="shrink-0 sm:ml-auto">
            {isAuthenticated ? (
              <form action={signOut}>
                <button
                  type="submit"
                  onClick={() => soundFx.playClick()}
                  className="px-4 py-2.5 rounded-xl border-2 border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white hover:bg-[#DC2626] hover:text-white text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  <LogOut className="w-4 h-4 text-[#DC2626]" />
                  <span>SIGN OUT</span>
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                onClick={() => soundFx.playClick()}
                className="px-5 py-2.5 rounded-xl bg-[#DC2626] border-2 border-slate-900 dark:border-white hover:bg-amber-400 hover:text-slate-950 text-white font-mono font-black text-xs uppercase transition-all flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <LogIn className="w-4 h-4" />
                <span>SIGN IN / LOGIN</span>
              </Link>
            )}
          </div>
        </div>

        {/* Tab Navigation (Neo-Brutalist Pill Tabs) */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "info", label: "OVERVIEW", icon: UserIcon },
            { id: "edit", label: "EDIT PROFIL", icon: isAuthenticated ? Edit3 : Lock },
            { id: "settings", label: "PENGATURAN", icon: Settings },
            { id: "help", label: "BANTUAN", icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(tab.id as "info" | "edit" | "settings" | "help");
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-black transition-all whitespace-nowrap cursor-pointer border-2 border-slate-900 dark:border-white uppercase ${
                  isActive
                    ? "bg-[#DC2626] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
                    : "bg-white dark:bg-slate-900 text-slate-950 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Box (Neo-Brutalist Main Card) */}
        <div className={`border-3 border-slate-900 dark:border-white rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-colors duration-300 ${
          isNight ? "bg-[#0E121D] text-slate-100" : "bg-white text-slate-950"
        }`}>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "info" && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#DC2626]" />
                  <span>Status Akun &amp; Identitas</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Ringkasan status sesi dan autentikasi Anda.
                </p>
              </div>

              {isAuthenticated ? (
                <div className="divide-y divide-slate-200 dark:divide-white/10 text-xs sm:text-sm">
                  <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#DC2626]" />
                      Status Sesi
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      Terautentikasi (Aktif)
                    </span>
                  </div>

                  <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#DC2626]" />
                      Terdaftar Sejak
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {createdAt}
                    </span>
                  </div>

                  <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#DC2626]" />
                      Email Terhubung
                    </span>
                    <span className="font-mono text-slate-900 dark:text-slate-100">
                      {userEmail}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center space-y-4 max-w-sm mx-auto">
                  <UserIcon className="w-10 h-10 text-slate-400 dark:text-slate-500 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">Anda Belum Login</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Silakan masuk untuk mengakses fitur lengkap profil Anda, mengedit foto profil kustom, dan mengelola identitas Anda.
                    </p>
                  </div>
                  <Link
                    href="/login"
                    onClick={() => soundFx.playClick()}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-medium transition-colors shadow-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Masuk ke Akun Sekarang</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EDIT PROFILE */}
          {activeTab === "edit" && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#DC2626]" />
                  <span>Edit Profil &amp; Foto</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Perbarui nama tampilan dan unggah foto kustom.
                </p>
              </div>

              {!isAuthenticated ? (
                <div className="py-12 text-center space-y-4 max-w-sm mx-auto">
                  <Lock className="w-10 h-10 text-slate-400 dark:text-slate-500 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">Fitur Edit Profil Terkunci</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Silakan login terlebih dahulu untuk memperbarui nama dan foto profil kustom.
                    </p>
                  </div>
                  <Link
                    href="/login"
                    onClick={() => soundFx.playClick()}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-medium transition-colors shadow-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login Sekarang</span>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-6 pt-2">
                  {message && (
                    <div
                      className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2.5 border ${
                        message.type === "success"
                          ? "bg-[#DC2626]/10 border-[#DC2626]/30 text-[#DC2626]"
                          : "bg-red-500/10 border-red-500/30 text-red-500"
                      }`}
                    >
                      {message.type === "success" ? (
                        <Check className="w-4 h-4 text-[#DC2626]" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span>{message.text}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                      Nama Tampilan Profil
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan nama Anda..."
                      required
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#DC2626] transition-colors ${
                        isNight
                          ? "bg-[#0A0A0B] border-white/10 text-white placeholder-slate-600"
                          : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="w-full py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-medium text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {uploading
                        ? "Mengunggah Foto..."
                        : saving
                        ? "Menyimpan..."
                        : "Simpan Perubahan Profil"}
                    </span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#DC2626]" />
                  <span>Pengaturan Tema &amp; Suara</span>
                </h3>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-white/10">
                {/* Theme Mode Option */}
                <div className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {isNight ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                    <div>
                      <p className="text-sm font-medium">Tema Aplikasi (Day / Night)</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {isNight ? "Mode Malam Hari (Aktif)" : "Mode Siang Hari (Aktif)"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleMode}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isNight ? "bg-[#DC2626]" : "bg-slate-200"
                    }`}
                    role="switch"
                    aria-checked={isNight}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        isNight ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Sound FX Option */}
                <div className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {sfxEnabled ? <Volume2 className="w-4 h-4 text-[#DC2626]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                    <div>
                      <p className="text-sm font-medium">Efek Suara (SFX)</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Umpan balik suara interaktif</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleSfxLocal}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      sfxEnabled ? "bg-[#DC2626]" : "bg-slate-200 dark:bg-neutral-800"
                    }`}
                    role="switch"
                    aria-checked={sfxEnabled}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        sfxEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HELP */}
          {activeTab === "help" && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#DC2626]" />
                  <span>Pusat Bantuan &amp; FAQ</span>
                </h3>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-white/10">
                <div className="py-4 space-y-1">
                  <h4 className="text-xs sm:text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
                    <span>Bagaimana cara mengubah tema aplikasi (Day / Night)?</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-5.5">
                    Anda dapat mengubah tema antara mode siang (Light) dan malam (Dark) melalui ikon toggle matahari/bulan di navigasi atas atau lewat tab Pengaturan.
                  </p>
                </div>

                <div className="py-4 space-y-1">
                  <h4 className="text-xs sm:text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
                    <span>Bagaimana cara mengunggah foto profil kustom?</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-5.5">
                    Pastikan Anda telah masuk ke akun Anda, buka tab &quot;Edit Profil&quot;, lalu klik foto profil Anda untuk mengunggah berkas gambar kustom (maksimal 5MB).
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      <MobileBottomNav />
    </div>
  );
}

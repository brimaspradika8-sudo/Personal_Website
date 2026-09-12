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
  Zap,
  Flame,
  Award,
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
  const { lang, toggleLang } = useLanguage();
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
  const [mode, setMode] = useState<"day" | "night">("day");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("landscape_mode") as "day" | "night";
      if (savedMode === "night") {
        setMode("night");
        document.documentElement.classList.add("dark");
      } else {
        setMode("day");
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const handleToggleMode = () => {
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
    soundFx.playClick();
  };

  const isNight = mode === "night";

  useEffect(() => {
    if (isAuthenticated) {
      const effectiveAvatar = dbUser?.avatar || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "";
      setAvatarUrl(effectiveAvatar);

      const effectiveName = dbUser?.name || user?.user_metadata?.full_name || user?.user_metadata?.name || "";
      if (effectiveName) {
        setName(effectiveName);
      }
    }
  }, [
    isAuthenticated,
    dbUser?.avatar,
    dbUser?.name,
    user?.user_metadata?.avatar_url,
    user?.user_metadata?.picture,
    user?.user_metadata?.full_name,
    user?.user_metadata?.name,
  ]);

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
    <div className={`relative min-h-[100dvh] w-full font-sans antialiased pb-32 sm:pb-24 selection:bg-[#DC2626] selection:text-white transition-colors duration-300 ${
      isNight ? "bg-[#12160F] text-[#F1EFE9]" : "bg-[#F8F9FA] text-[#1A1A1A]"
    }`}>
      
      {/* Subtle Ambient Background Overlay */}
      <div className={`fixed inset-0 z-0 pointer-events-none opacity-15 bg-[radial-gradient(#DC2626_1px,transparent_1px)] [background-size:24px_24px]`} />

      {/* Glowing Ambient Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#DC2626]/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="fixed bottom-10 right-1/4 w-96 h-96 bg-[#DC2626]/5 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Header / Sticky Top Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-colors duration-300 border-b ${
        isNight ? "bg-[#12160F]/90 border-[#2A2F26] text-white" : "bg-white/90 border-slate-200 text-slate-900 shadow-sm"
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link
            href="/dashboard"
            prefetch={false}
            onClick={() => soundFx.playClick()}
            className="px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 cursor-pointer shadow-lg shadow-[#DC2626]/20 border border-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === "id" ? "Kembali ke Beranda" : "Back to Home"}</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleMode}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isNight
                  ? "bg-white/10 border-white/20 text-yellow-400 hover:bg-white/20"
                  : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
              }`}
              title={isNight ? "Ganti ke Mode Terang (Light)" : "Ganti ke Mode Malam (Dark)"}
            >
              {isNight ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#DC2626] animate-pulse" />
              <span className="font-display text-sm font-black uppercase tracking-wider">
                PROFILE <span className="text-[#DC2626]">HUB</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 space-y-6 relative z-10">

        {/* Profile Banner Card */}
        <div className={`relative backdrop-blur-xl border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl overflow-hidden group transition-colors duration-300 ${
          isNight ? "bg-[#1A211A]/90 border-[#2A2F26]" : "bg-white border-slate-200 text-slate-900 shadow-md"
        }`}>
          
          {/* Brand Red Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#B91C1C]" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
            
            {isAuthenticated && (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            )}

            {/* Avatar Container: Real Photo if Authenticated, Generic Placeholder if Guest */}
            <div className="relative group shrink-0">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    fileInputRef.current?.click();
                  }}
                  className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-[#DC2626] shrink-0 flex items-center justify-center font-bold transition-transform cursor-pointer p-1 shadow-xl shadow-[#DC2626]/20 hover:scale-105 ${
                    isNight ? "bg-[#0A0D14] text-white" : "bg-slate-100 text-slate-900"
                  }`}
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
                    <div className="w-full h-full rounded-full bg-[#DC2626] flex items-center justify-center text-3xl font-black text-white">
                      {initialLetter}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white rounded-full">
                    <Camera className="w-6 h-6 text-[#DC2626]" />
                  </div>
                </button>
              ) : (
                /* GUEST AVATAR: Generic Silhouette Icon */
                <div className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 shrink-0 flex items-center justify-center shadow-xl ${
                  isNight ? "border-white/20 bg-[#1A212A] text-white/50" : "border-slate-300 bg-slate-100 text-slate-400"
                }`}>
                  <UserIcon className="w-14 h-14" />
                </div>
              )}
            </div>

            {/* User Identity Info */}
            <div className="space-y-2 flex-1">
              {/* Badges: Only render user badges if Authenticated */}
              {isAuthenticated ? (
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-3 py-0.5 rounded-full bg-[#DC2626]/15 border border-[#DC2626] text-[#DC2626] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-[#DC2626]" />
                    <span>MEMBER</span>
                  </span>
                  <span className={`px-3 py-0.5 rounded-full border text-xs font-mono font-bold uppercase tracking-wider ${
                    isNight ? "bg-white/5 border-white/20 text-white/70" : "bg-black/5 border-black/20 text-black/60"
                  }`}>
                    TERAUTENTIKASI
                  </span>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className={`px-3 py-0.5 rounded-full border text-xs font-mono font-bold uppercase tracking-wider ${
                    isNight ? "bg-white/10 border-white/20 text-white/70" : "bg-slate-100 border-slate-300 text-slate-600"
                  }`}>
                    GUEST SESSION
                  </span>
                </div>
              )}

              <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight uppercase">
                {userName}
              </h1>

              <p className={`text-xs sm:text-sm font-mono flex items-center justify-center sm:justify-start gap-2 ${
                isNight ? "text-white/70" : "text-slate-600"
              }`}>
                <Mail className="w-4 h-4 text-[#DC2626]" />
                <span>{isAuthenticated ? userEmail : "Silakan masuk untuk melihat profil Anda"}</span>
              </p>
            </div>

            {/* Sign Out / Sign In Action Button */}
            <div className="shrink-0">
              {isAuthenticated ? (
                <form action={signOut}>
                  <button
                    type="submit"
                    onClick={() => soundFx.playClick()}
                    className="px-5 py-2.5 rounded-xl border border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </form>
              ) : (
                <Link
                  href="/login"
                  onClick={() => soundFx.playClick()}
                  className="px-6 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs sm:text-sm transition-all hover:scale-105 flex items-center gap-2 cursor-pointer shadow-lg shadow-[#DC2626]/30 border border-white/20"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In / Login</span>
                </Link>
              )}
            </div>

          </div>
        </div>

        {/* Tab Controller */}
        <div className={`p-1 rounded-xl border grid grid-cols-2 sm:grid-cols-4 gap-1 shadow-md transition-colors duration-300 ${
          isNight ? "bg-[#1A211A]/90 border-[#2A2F26]" : "bg-white border-slate-200"
        }`}>
          {[
            { id: "info", label: "Overview", icon: UserIcon },
            { id: "edit", label: "Edit Profil", icon: isAuthenticated ? Edit3 : Lock },
            { id: "settings", label: "Pengaturan", icon: Settings },
            { id: "help", label: "Bantuan", icon: HelpCircle },
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
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#DC2626] text-white shadow-lg shadow-[#DC2626]/30"
                    : isNight
                    ? "text-white/70 hover:text-white hover:bg-white/5"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Box */}
        <div className={`border rounded-2xl p-6 sm:p-8 shadow-md transition-colors duration-300 ${
          isNight ? "bg-[#1A211A]/90 border-[#2A2F26]" : "bg-white border-slate-200 text-slate-900"
        }`}>
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "info" && (
            <div className="space-y-6">
              <div className={`border-b pb-4 flex items-center justify-between ${isNight ? "border-white/10" : "border-slate-200"}`}>
                <div>
                  <h3 className="font-display text-lg font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#DC2626]" />
                    <span>STATUS AKUN &amp; IDENTITAS</span>
                  </h3>
                  <p className={`text-xs mt-1 ${isNight ? "text-white/70" : "text-slate-500"}`}>
                    Ringkasan status sesi dan autentikasi Anda.
                  </p>
                </div>
              </div>

              {isAuthenticated ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border space-y-1 ${isNight ? "bg-[#12160F] border-[#DC2626]/30" : "bg-slate-50 border-slate-200"}`}>
                    <span className="text-xs text-[#DC2626] font-mono font-bold uppercase flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>STATUS SESI</span>
                    </span>
                    <p className="text-sm font-bold">Terautentikasi (Aktif)</p>
                  </div>

                  <div className={`p-4 rounded-xl border space-y-1 ${isNight ? "bg-[#121214] border-[#DC2626]/30" : "bg-slate-50 border-slate-200"}`}>
                    <span className="text-xs text-[#DC2626] font-mono font-bold uppercase flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>TERDAFTAR SEJAK</span>
                    </span>
                    <p className="text-sm font-bold">{createdAt}</p>
                  </div>

                  <div className={`p-4 rounded-xl border space-y-1 sm:col-span-2 ${isNight ? "bg-[#12160F] border-[#DC2626]/30" : "bg-slate-50 border-slate-200"}`}>
                    <span className="text-xs text-[#DC2626] font-mono font-bold uppercase flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" />
                      <span>EMAIL TERHUBUNG</span>
                    </span>
                    <p className="text-sm font-mono">{userEmail}</p>
                  </div>
                </div>
              ) : (
                <div className={`p-8 rounded-xl border text-center space-y-4 ${isNight ? "border-white/10 bg-[#12160F]" : "border-slate-200 bg-slate-50"}`}>
                  <UserIcon className="w-12 h-12 text-slate-400 mx-auto" />
                  <div className="space-y-1 max-w-md mx-auto">
                    <h4 className="font-display text-base font-bold">Anda Belum Login</h4>
                    <p className={`text-xs leading-relaxed ${isNight ? "text-white/70" : "text-slate-500"}`}>
                      Silakan masuk untuk mengakses fitur lengkap profil Anda, mengedit foto profil kustom, dan mengelola identitas Anda.
                    </p>
                  </div>
                  <Link
                    href="/login"
                    onClick={() => soundFx.playClick()}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold transition-all shadow-lg shadow-[#DC2626]/30 border border-white/20"
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
              <div className={`border-b pb-4 ${isNight ? "border-white/10" : "border-slate-200"}`}>
                <h3 className="font-display text-lg font-bold flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#DC2626]" />
                  <span>EDIT PROFIL &amp; FOTO</span>
                </h3>
                <p className={`text-xs mt-1 ${isNight ? "text-white/70" : "text-slate-500"}`}>
                  Perbarui nama tampilan dan unggah foto kustom.
                </p>
              </div>

              {!isAuthenticated ? (
                <div className={`p-8 rounded-xl border text-center space-y-4 ${isNight ? "border-[#DC2626]/30 bg-[#12160F]" : "border-slate-200 bg-slate-50"}`}>
                  <Lock className="w-8 h-8 text-[#DC2626] mx-auto" />
                  <div className="space-y-1 max-w-sm mx-auto">
                    <h3 className="font-display text-base font-bold">
                      Fitur Edit Profil Terkunci
                    </h3>
                    <p className={`text-xs ${isNight ? "text-white/70" : "text-slate-500"}`}>
                      Silakan login terlebih dahulu untuk memperbarui nama dan foto profil kustom.
                    </p>
                  </div>
                  <Link
                    href="/login"
                    onClick={() => soundFx.playClick()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold transition-all shadow-lg"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login Sekarang</span>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  {message && (
                    <div
                      className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 border ${
                        message.type === "success"
                          ? "bg-[#DC2626]/10 border-[#DC2626] text-[#DC2626]"
                          : "bg-red-500/10 border-red-500 text-red-500"
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

                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold block ${isNight ? "text-white/70" : "text-slate-700"}`}>
                      Nama Tampilan Profil
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan nama Anda..."
                      required
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#DC2626] ${
                        isNight ? "bg-[#12160F] border-white/20 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="w-full py-3 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#DC2626]/30 cursor-pointer"
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
              <div className={`border-b pb-4 ${isNight ? "border-white/10" : "border-slate-200"}`}>
                <h3 className="font-display text-lg font-bold flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#DC2626]" />
                  <span>PENGATURAN TEMA &amp; SUARA</span>
                </h3>
              </div>

              <div className="space-y-3">
                {/* Theme Mode Option */}
                <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${isNight ? "bg-[#12160F] border-white/10" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center gap-3">
                    {isNight ? <Moon className="w-4 h-4 text-yellow-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                    <div>
                      <p className="text-sm font-bold">Tema Aplikasi (Day / Night)</p>
                      <p className={`text-xs ${isNight ? "text-white/60" : "text-slate-500"}`}>
                        {isNight ? "Mode Malam Hari (Aktif)" : "Mode Siang Hari (Aktif)"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleMode}
                    className="px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-xs font-bold text-white transition-all cursor-pointer shadow-md"
                  >
                    <span>{isNight ? "Ganti ke Mode Terang" : "Ganti ke Mode Malam"}</span>
                  </button>
                </div>

                {/* Sound FX Option */}
                <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${isNight ? "bg-[#12160F] border-white/10" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center gap-3">
                    {sfxEnabled ? <Volume2 className="w-4 h-4 text-[#DC2626]" /> : <VolumeX className="w-4 h-4 opacity-40" />}
                    <div>
                      <p className="text-sm font-bold">Efek Suara (SFX)</p>
                      <p className={`text-xs ${isNight ? "text-white/60" : "text-slate-500"}`}>Umpan balik suara interaktif</p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleSfxLocal}
                    className="px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-xs font-bold text-white transition-all cursor-pointer shadow-md"
                  >
                    <span>{sfxEnabled ? "Aktif" : "Mati"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HELP */}
          {activeTab === "help" && (
            <div className="space-y-6">
              <div className={`border-b pb-4 ${isNight ? "border-white/10" : "border-slate-200"}`}>
                <h3 className="font-display text-lg font-bold flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#DC2626]" />
                  <span>PUSAT BANTUAN &amp; FAQ</span>
                </h3>
              </div>

              <div className="space-y-3">
                <div className={`p-4 rounded-xl border space-y-1 ${isNight ? "bg-[#12160F] border-white/10" : "bg-slate-50 border-slate-200"}`}>
                  <h4 className="text-xs font-bold flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-[#DC2626]" />
                    <span>Bagaimana cara mengubah tema aplikasi (Day / Night)?</span>
                  </h4>
                  <p className={`text-xs leading-relaxed pl-5 ${isNight ? "text-white/70" : "text-slate-600"}`}>
                    Anda dapat mengubah tema antara mode siang (Light) dan malam (Dark) melalui ikon toggle matahari/bulan di navigasi atas atau lewat tab Pengaturan.
                  </p>
                </div>

                <div className={`p-4 rounded-xl border space-y-1 ${isNight ? "bg-[#12160F] border-white/10" : "bg-slate-50 border-slate-200"}`}>
                  <h4 className="text-xs font-bold flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-[#DC2626]" />
                    <span>Bagaimana cara mengunggah foto profil kustom?</span>
                  </h4>
                  <p className={`text-xs leading-relaxed pl-5 ${isNight ? "text-white/70" : "text-slate-600"}`}>
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

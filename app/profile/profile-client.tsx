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
  Languages,
  Save,
  Check,
  AlertCircle,
  Camera,
  MessageSquare,
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
    (user ? "User Brimas" : "Pengunjung Publik");
  
  const initialLetter = user && userName ? userName.charAt(0).toUpperCase() : "G";
  const userEmail = user?.email || "Belum Login (Mode Tamu)";
  const avatarSrc = avatarUrl;
  const provider = user?.app_metadata?.provider || "Guest Access";
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
      const updateRes = await updateUserProfile(name || defaultName, finalUrl);
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
    } else {
      const res = await updateUserProfile(name, finalAvatarUrl);
      if (res.error) {
        setSaving(false);
        setMessage({ type: "error", text: res.error });
        return;
      }
    }

    setSaving(false);
    setMessage({ type: "success", text: lang === "id" ? "Profil berhasil tersimpan secara permanen." : "Profile saved permanently." });
    router.refresh();

    setTimeout(() => setMessage(null), 4000);
  };

  const isNight = mode === "night";

  const handleToggleSfxLocal = () => {
    const newState = soundFx.toggleMute();
    setSfxEnabled(newState);
    if (newState) soundFx.playClick();
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
  };

  const handleToggleLangLocal = () => {
    soundFx.playClick();
    toggleLang();
  };

  return (
    <div className="relative min-h-[100dvh] w-full font-sans antialiased text-[#F1EFE9] bg-[#12160F] pb-32 sm:pb-24">
      
      {/* Background Landscape Video with Pine Dark Overlay (Mountain Illustration Visible) */}
      <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <video
          key={mode}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={mode === "night" ? "/animations/night-landscape.webp" : "/animations/day-landscape.webp"}
          className="absolute inset-0 object-cover w-full h-full"
        >
          <source
            src={mode === "night" ? "/animations/night-landscape.mp4" : "/animations/day-landscape.mp4"}
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#12160F]/75 via-[#12160F]/80 to-[#12160F]/90 transition-colors duration-1000" />
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* Navigation Bar Header */}
        <div className="flex items-center justify-between gap-4 border-b border-[#2A2F26] pb-4">
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="px-4 py-2 rounded-lg bg-[#1A211A] hover:bg-[#212A20] border border-[#2A2F26] text-[#F1EFE9] text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#A8A79C]" />
            <span>{dict.profile?.backBtn || "Kembali ke Dashboard"}</span>
          </Link>

          <span className="text-xs font-medium text-[#A8A79C]">
            {dict.profile?.title || "Pusat Akun & Profil"}
          </span>
        </div>

        {/* Profile User Header Card */}
        <div className="bg-[#1A211A] border border-[#2A2F26] rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />

            {/* Avatar Photo Container (Framed with 2px Pine Ring & Surface Background) */}
            <div className="relative group shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (user) {
                    soundFx.playClick();
                    fileInputRef.current?.click();
                  }
                }}
                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#3B5D42] bg-[#1A211A] shrink-0 flex items-center justify-center font-bold text-[#F1EFE9] transition-opacity cursor-pointer p-0.5"
              >
                {avatarSrc && !headerImgError ? (
                  <Image
                    src={avatarSrc}
                    alt={userName}
                    fill
                    className="object-cover rounded-full"
                    unoptimized={avatarSrc.startsWith("http")}
                    onError={() => setHeaderImgError(true)}
                    referrerPolicy="no-referrer"
                  />
                ) : user ? (
                  <span className="w-full h-full bg-[#3B5D42] text-[#F1EFE9] flex items-center justify-center font-bold text-2xl uppercase rounded-full">
                    {initialLetter}
                  </span>
                ) : (
                  <UserIcon className="w-10 h-10 text-[#A8A79C]" />
                )}

                {user && (
                  <div className="absolute inset-0 bg-[#12160F]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[#F1EFE9] rounded-full">
                    <Camera className="w-5 h-5 text-[#F1EFE9]" />
                  </div>
                )}
              </button>

              {user && (
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    fileInputRef.current?.click();
                  }}
                  title="Ganti Foto Profil"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#1A211A] border border-[#2A2F26] text-[#F1EFE9] flex items-center justify-center hover:bg-[#212A20] transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* User Identity Info */}
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#3B5D42]/20 border border-[#3B5D42] text-[#F1EFE9] text-xs font-medium">
                  {user ? (dict.profile?.authenticated || "Sesi Terautentikasi") : (dict.profile?.guest || "Mode Tamu")}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-[#12160F] border border-[#2A2F26] text-[#A8A79C] text-xs font-mono">
                  {provider}
                </span>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F1EFE9]">
                {userName}
              </h1>

              <p className="text-xs sm:text-sm font-mono text-[#A8A79C] flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-3.5 h-3.5 text-[#A8A79C]" />
                <span>{userEmail}</span>
              </p>
            </div>

            {/* Sign Out / Sign In Action Button */}
            <div className="shrink-0">
              {user ? (
                <form action={signOut}>
                  {/* Destructive Action: --danger-muted (#7A3B32 border + text, bg-transparent) */}
                  <button
                    type="submit"
                    onClick={() => soundFx.playClick()}
                    className="px-4 py-2 rounded-lg border border-[#7A3B32] text-[#F1EFE9] bg-transparent hover:bg-[#7A3B32]/20 text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-[#7A3B32]" />
                    <span>{dict.auth?.logout || "Sign Out"}</span>
                  </button>
                </form>
              ) : (
                <Link
                  href="/login"
                  onClick={() => soundFx.playClick()}
                  className="px-5 py-2.5 rounded-lg bg-[#3B5D42] hover:bg-[#2F4A34] text-[#F1EFE9] text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>

          </div>
        </div>

        {/* Tab Controller */}
        <div className="p-1 rounded-xl bg-[#1A211A] border border-[#2A2F26] grid grid-cols-2 sm:grid-cols-4 gap-1">
          {[
            { id: "info", label: dict.profile?.overviewTab || "Info Profil", icon: UserIcon },
            { id: "edit", label: dict.profile?.editTab || "Edit Profil", icon: user ? Edit3 : Lock },
            { id: "settings", label: dict.profile?.settingsTab || "Pengaturan", icon: Settings },
            { id: "help", label: dict.profile?.helpTab || "Bantuan", icon: HelpCircle },
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
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#212A20] text-[#F1EFE9] border border-[#3B5D42]"
                    : "text-[#A8A79C] hover:text-[#F1EFE9] hover:bg-[#212A20]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Box */}
        <div className="bg-[#1A211A] border border-[#2A2F26] rounded-xl p-6 sm:p-8">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "info" && (
            <div className="space-y-6">
              <div className="border-b border-[#2A2F26] pb-4">
                <h3 className="font-display text-lg font-bold text-[#F1EFE9] flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-[#3B5D42]" />
                  <span>Ringkasan Info Akun</span>
                </h3>
                <p className="text-xs text-[#A8A79C] mt-1">
                  Informasi status akun dan kredensial sesi Anda.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#12160F] border border-[#2A2F26] space-y-1">
                  <span className="text-xs text-[#A8A79C] flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#3B5D42]" />
                    <span>Status Akun</span>
                  </span>
                  <p className="text-sm font-medium text-[#F1EFE9]">
                    {user ? "Terautentikasi (Aktif)" : "Pengunjung Publik (Tamu)"}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-[#12160F] border border-[#2A2F26] space-y-1">
                  <span className="text-xs text-[#A8A79C] flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#3B5D42]" />
                    <span>Terdaftar Sejak</span>
                  </span>
                  <p className="text-sm font-medium text-[#F1EFE9]">{createdAt}</p>
                </div>

                <div className="p-4 rounded-lg bg-[#12160F] border border-[#2A2F26] space-y-1 sm:col-span-2">
                  <span className="text-xs text-[#A8A79C] flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#3B5D42]" />
                    <span>Email Utama</span>
                  </span>
                  <p className="text-sm font-mono text-[#F1EFE9]">
                    {userEmail}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EDIT PROFILE */}
          {activeTab === "edit" && (
            <div className="space-y-6">
              <div className="border-b border-[#2A2F26] pb-4">
                <h3 className="font-display text-lg font-bold text-[#F1EFE9] flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#3B5D42]" />
                  <span>Edit Profil & Avatar</span>
                </h3>
                <p className="text-xs text-[#A8A79C] mt-1">
                  Perbarui nama tampilan dan pilih foto profil kustom.
                </p>
              </div>

              {!user ? (
                <div className="p-8 rounded-xl border border-[#2A2F26] bg-[#12160F] text-center space-y-4">
                  <Lock className="w-8 h-8 text-[#A8A79C] mx-auto" />
                  <div className="space-y-1 max-w-sm mx-auto">
                    <h3 className="font-display text-base font-bold text-[#F1EFE9]">
                      Fitur Edit Profil Terkunci
                    </h3>
                    <p className="text-xs text-[#A8A79C]">
                      Silakan login terlebih dahulu untuk memperbarui profil atau mengunggah foto kustom.
                    </p>
                  </div>
                  <Link
                    href="/login"
                    onClick={() => soundFx.playClick()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#3B5D42] hover:bg-[#2F4A34] text-[#F1EFE9] text-xs font-medium transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login Sekarang</span>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  {message && (
                    <div
                      className={`p-3.5 rounded-lg text-xs font-medium flex items-center gap-2.5 border ${
                        message.type === "success"
                          ? "bg-[#3B5D42]/20 border-[#3B5D42] text-[#F1EFE9]"
                          : "bg-[#7A3B32]/20 border-[#7A3B32] text-[#F1EFE9]"
                      }`}
                    >
                      {message.type === "success" ? (
                        <Check className="w-4 h-4 text-[#3B5D42]" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-[#7A3B32]" />
                      )}
                      <span>{message.text}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#A8A79C] block">
                      Nama Tampilan Profil
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan nama Anda..."
                      required
                      className="w-full px-4 py-2.5 rounded-lg bg-[#12160F] border border-[#2A2F26] text-sm text-[#F1EFE9] placeholder-[#A8A79C] focus:outline-none focus:border-[#3B5D42]"
                    />
                  </div>

                  {/* Option B: OAuth Photo or File Upload */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#A8A79C] block">
                      Sumber Foto Profil
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playClick();
                          const oauthPic = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "";
                          setAvatarUrl(oauthPic);
                        }}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                          avatarUrl === (user?.user_metadata?.avatar_url || user?.user_metadata?.picture)
                            ? "bg-[#212A20] border-[#3B5D42]"
                            : "bg-[#12160F] border-[#2A2F26] hover:bg-[#212A20]"
                        }`}
                      >
                        <UserIcon className="w-4 h-4 text-[#3B5D42] shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-[#F1EFE9]">Gunakan Foto Akun OAuth</p>
                          <p className="text-[10px] text-[#A8A79C]">Foto dari Google / GitHub</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playClick();
                          fileInputRef.current?.click();
                        }}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-[#12160F] border-[#2A2F26] hover:bg-[#212A20] text-left transition-colors cursor-pointer"
                      >
                        <Camera className="w-4 h-4 text-[#A8A79C] shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-[#F1EFE9]">Upload Foto Sendiri</p>
                          <p className="text-[10px] text-[#A8A79C]">Pilih file dari perangkat (Max 5MB)</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* 1 Ember CTA for Form Submit */}
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="w-full py-2.5 rounded-lg bg-[#A6532D] hover:bg-[#8A4425] text-[#F1EFE9] font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
              <div className="border-b border-[#2A2F26] pb-4">
                <h3 className="font-display text-lg font-bold text-[#F1EFE9] flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#3B5D42]" />
                  <span>Pengaturan Sesi & Tampilan</span>
                </h3>
                <p className="text-xs text-[#A8A79C] mt-1">
                  Sesuaikan mode tema, suara, dan bahasa.
                </p>
              </div>

              <div className="space-y-3">
                {/* Theme Setting */}
                <div className="p-4 rounded-lg bg-[#12160F] border border-[#2A2F26] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {mode === "night" ? <Moon className="w-4 h-4 text-[#A8A79C]" /> : <Sun className="w-4 h-4 text-[#F1EFE9]" />}
                    <div>
                      <p className="text-sm font-medium text-[#F1EFE9]">Mode Tampilan Lanskap</p>
                      <p className="text-xs text-[#A8A79C]">Mode Siang Hari atau Malam Hari</p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleThemeLocal}
                    className="px-3.5 py-1.5 rounded-lg bg-[#1A211A] hover:bg-[#212A20] border border-[#2A2F26] text-xs font-medium text-[#F1EFE9] transition-colors cursor-pointer"
                  >
                    <span>{mode === "night" ? "Malam" : "Siang"}</span>
                  </button>
                </div>

                {/* SFX Setting */}
                <div className="p-4 rounded-lg bg-[#12160F] border border-[#2A2F26] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {sfxEnabled ? <Volume2 className="w-4 h-4 text-[#3B5D42]" /> : <VolumeX className="w-4 h-4 text-[#A8A79C]" />}
                    <div>
                      <p className="text-sm font-medium text-[#F1EFE9]">Efek Suara (SFX)</p>
                      <p className="text-xs text-[#A8A79C]">Umpan balik suara sintetis saat tombol diklik</p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleSfxLocal}
                    className="px-3.5 py-1.5 rounded-lg bg-[#1A211A] hover:bg-[#212A20] border border-[#2A2F26] text-xs font-medium text-[#F1EFE9] transition-colors cursor-pointer"
                  >
                    <span>{sfxEnabled ? "Aktif" : "Mati"}</span>
                  </button>
                </div>

                {/* Language Setting */}
                <div className="p-4 rounded-lg bg-[#12160F] border border-[#2A2F26] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Languages className="w-4 h-4 text-[#3B5D42]" />
                    <div>
                      <p className="text-sm font-medium text-[#F1EFE9]">Bahasa Antarmuka</p>
                      <p className="text-xs text-[#A8A79C]">Bahasa Indonesia atau English</p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleLangLocal}
                    className="px-3.5 py-1.5 rounded-lg bg-[#1A211A] hover:bg-[#212A20] border border-[#2A2F26] text-xs font-medium text-[#F1EFE9] transition-colors cursor-pointer"
                  >
                    <span>{lang === "id" ? "Indonesia" : "English"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HELP */}
          {activeTab === "help" && (
            <div className="space-y-6">
              <div className="border-b border-[#2A2F26] pb-4">
                <h3 className="font-display text-lg font-bold text-[#F1EFE9] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#3B5D42]" />
                  <span>Pusat Bantuan & FAQ</span>
                </h3>
                <p className="text-xs text-[#A8A79C] mt-1">
                  Pertanyaan umum seputar fitur website.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-[#12160F] border border-[#2A2F26] space-y-1">
                  <h4 className="text-xs font-medium text-[#F1EFE9] flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-[#3B5D42]" />
                    <span>Apakah login diwajibkan untuk melihat portofolio?</span>
                  </h4>
                  <p className="text-xs text-[#A8A79C] leading-relaxed pl-5">
                    Tidak. Seluruh konten portofolio dapat diakses publik secara bebas. Login diperlukan jika Anda ingin memperbarui foto profil kustom.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-[#12160F] border border-[#2A2F26] space-y-1">
                  <h4 className="text-xs font-medium text-[#F1EFE9] flex items-center gap-2">
                    <Settings className="w-3.5 h-3.5 text-[#3B5D42]" />
                    <span>Bagaimana cara membuka pintasan pencarian (Ctrl+K)?</span>
                  </h4>
                  <p className="text-xs text-[#A8A79C] leading-relaxed pl-5">
                    Tekan tombol Ctrl+K (Windows) atau Cmd+K (Mac) kapan saja untuk membuka Command Palette.
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

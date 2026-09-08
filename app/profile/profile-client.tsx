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
  const [mode, setMode] = useState<"day" | "night">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("landscape_mode") as "day" | "night") || "day";
    }
    return "day";
  });

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

  const tabs = [
    { id: "info", label: "Overview", icon: UserIcon },
    { id: "edit", label: "Edit Profil", icon: isAuthenticated ? Edit3 : Lock },
    { id: "settings", label: "Pengaturan", icon: Settings },
    { id: "help", label: "Bantuan", icon: HelpCircle },
  ];

  return (
    <div className="relative min-h-[100dvh] w-full font-sans antialiased bg-[#F8F9FA] text-[#0E0E10] pb-32 sm:pb-12 selection:bg-[#E62429] selection:text-white">
      
      {/* Header Container - Spiderman Dark Navy */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B1D3A] text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold flex items-center gap-2 transition-all hover:scale-105 cursor-pointer backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali ke Beranda</span>
            <span className="inline sm:hidden">Kembali</span>
          </Link>

          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#E62429]" />
            <span className="font-bold text-lg tracking-wide">
              PROFILE <span className="text-[#E62429]">HUB</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-12 relative z-10 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Profile Card (Sticky on Desktop) */}
        <aside className="w-full lg:w-1/3 shrink-0">
          <div className="lg:sticky lg:top-24 bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center sm:items-start text-center sm:text-left transition-all relative overflow-hidden">
            
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E62429] to-[#3A6FF5]" />
            
            {isAuthenticated && (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            )}

            {/* Avatar */}
            <div className="relative group shrink-0 mb-6 mx-auto sm:mx-0">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    fileInputRef.current?.click();
                  }}
                  className="relative w-32 h-32 rounded-full overflow-hidden border-[4px] border-white shadow-xl bg-gray-50 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer ring-2 ring-[#E62429]/20"
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
                    <div className="w-full h-full rounded-full bg-[#1A2C55] flex items-center justify-center text-4xl font-bold text-white">
                      {initialLetter}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white rounded-full">
                    <Camera className="w-6 h-6" />
                  </div>
                </button>
              ) : (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-[4px] border-white shadow-xl bg-gray-100 flex items-center justify-center text-gray-400">
                  <UserIcon className="w-14 h-14" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="w-full">
              <h1 className="text-2xl font-bold text-[#0E0E10] tracking-tight mb-1">
                {userName}
              </h1>
              <p className="text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-1.5 mb-4">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{isAuthenticated ? userEmail : "Belum Login"}</span>
              </p>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-8">
                {isAuthenticated ? (
                  <>
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-[#E62429]/30 bg-[#E62429]/10 text-[#E62429] text-[11px] font-semibold tracking-wide uppercase gap-1">
                      <Flame className="w-3 h-3" />
                      Member
                    </span>
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-[#3A6FF5]/30 bg-[#3A6FF5]/10 text-[#3A6FF5] text-[11px] font-semibold tracking-wide uppercase gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Terautentikasi
                    </span>
                  </>
                ) : (
                  <span className="inline-flex px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-gray-500 text-[11px] font-semibold tracking-wide uppercase">
                    Guest Session
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 w-full">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setActiveTab("edit");
                      }}
                      className="w-full py-2.5 rounded-full bg-[#E62429] hover:bg-[#c91d22] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Profil</span>
                    </button>
                    <form action={signOut} className="w-full">
                      <button
                        type="submit"
                        onClick={() => soundFx.playClick()}
                        className="w-full py-2.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </form>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => soundFx.playClick()}
                    className="w-full py-2.5 rounded-full bg-[#E62429] hover:bg-[#c91d22] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </div>
            
          </div>
        </aside>

        {/* Right Column: Tab Content */}
        <div className="w-full lg:w-2/3 flex flex-col">
          
          {/* Horizontal Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-6 p-1 bg-white rounded-2xl shadow-sm border border-gray-100">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveTab(tab.id as any);
                  }}
                  className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#E62429]/10 text-[#E62429]"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex-1">
            
            {/* TAB 1: OVERVIEW */}
            {activeTab === "info" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#0E0E10] mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#3A6FF5]" />
                    Status Akun & Identitas
                  </h3>
                  <p className="text-sm text-gray-500">
                    Ringkasan aktivitas dan informasi dasar akun Anda.
                  </p>
                </div>

                {isAuthenticated ? (
                  <div className="space-y-3 mt-6">
                    {/* Item 1 */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors border border-transparent">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E62429]/10 flex items-center justify-center text-[#E62429]">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Status Sesi</span>
                      </div>
                      <div className="mt-2 sm:mt-0 text-sm font-bold text-[#E62429] ml-13 sm:ml-0">
                        Terautentikasi (Aktif)
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors border border-transparent">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#3A6FF5]/10 flex items-center justify-center text-[#3A6FF5]">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Terdaftar Sejak</span>
                      </div>
                      <div className="mt-2 sm:mt-0 text-sm font-medium text-gray-900 ml-13 sm:ml-0">
                        {createdAt}
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors border border-transparent">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0B1D3A]/10 flex items-center justify-center text-[#0B1D3A]">
                          <Mail className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Email Terhubung</span>
                      </div>
                      <div className="mt-2 sm:mt-0 text-sm font-medium text-gray-900 ml-13 sm:ml-0">
                        {userEmail}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 mb-4">
                      <UserIcon className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Anda Belum Login</h4>
                    <p className="text-sm text-gray-500 max-w-sm mb-6">
                      Silakan masuk untuk mengakses fitur lengkap profil Anda, mengedit foto profil kustom, dan mengelola identitas Anda.
                    </p>
                    <Link
                      href="/login"
                      onClick={() => soundFx.playClick()}
                      className="px-6 py-2.5 rounded-full bg-[#E62429] hover:bg-[#c91d22] text-white text-sm font-semibold transition-colors shadow-sm flex items-center gap-2"
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
                <div>
                  <h3 className="text-xl font-bold text-[#0E0E10] mb-2 flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-[#E62429]" />
                    Edit Profil
                  </h3>
                  <p className="text-sm text-gray-500">
                    Perbarui nama tampilan dan preferensi profil Anda.
                  </p>
                </div>

                {!isAuthenticated ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-300 mb-4">
                      <Lock className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Fitur Terkunci</h4>
                    <p className="text-sm text-gray-500 max-w-sm mb-6">
                      Silakan login terlebih dahulu untuk memperbarui nama dan foto profil kustom.
                    </p>
                    <Link
                      href="/login"
                      onClick={() => soundFx.playClick()}
                      className="px-6 py-2.5 rounded-full bg-[#E62429] hover:bg-[#c91d22] text-white text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Login Sekarang</span>
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSaveProfile} className="space-y-5 mt-6">
                    {message && (
                      <div
                        className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 ${
                          message.type === "success"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {message.type === "success" ? (
                          <Check className="w-5 h-5 shrink-0" />
                        ) : (
                          <AlertCircle className="w-5 h-5 shrink-0" />
                        )}
                        <span>{message.text}</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 block">
                        Nama Tampilan
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Masukkan nama Anda..."
                        required
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#E62429]/20 focus:border-[#E62429] transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={saving || uploading}
                      className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#0B1D3A] hover:bg-[#1A2C55] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 mt-4 shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>
                        {uploading
                          ? "Mengunggah..."
                          : saving
                          ? "Menyimpan..."
                          : "Simpan Perubahan"}
                      </span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB 3: SETTINGS */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#0E0E10] mb-2 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-gray-700" />
                    Pengaturan
                  </h3>
                  <p className="text-sm text-gray-500">
                    Sesuaikan pengalaman pengguna Anda.
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between p-5 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 shadow-sm">
                        {sfxEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Efek Suara (SFX)</p>
                        <p className="text-xs text-gray-500">Aktifkan umpan balik suara</p>
                      </div>
                    </div>
                    
                    {/* Toggle Button */}
                    <button
                      onClick={handleToggleSfxLocal}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        sfxEnabled ? 'bg-[#3A6FF5]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          sfxEnabled ? 'translate-x-6' : 'translate-x-1'
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
                <div>
                  <h3 className="text-xl font-bold text-[#0E0E10] mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[#E62429]" />
                    Pusat Bantuan
                  </h3>
                  <p className="text-sm text-gray-500">
                    Pertanyaan yang sering diajukan.
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-[#3A6FF5]" />
                      Bagaimana cara mengubah foto profil?
                    </h4>
                    <p className="text-sm text-gray-600 ml-6 leading-relaxed">
                      Klik pada area foto profil Anda di sebelah kiri (dengan ikon kamera saat di-hover), pilih file gambar, dan sistem akan mengunggahnya secara otomatis.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}

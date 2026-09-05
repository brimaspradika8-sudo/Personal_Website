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
  const userAvatar = dbUser?.avatar || user?.user_metadata?.avatar_url;
  const defaultAvatar =
    userAvatar && !userAvatar.includes("dicebear")
      ? userAvatar
      : "/images/avatar.png";

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
  
  const initialLetter = userName ? userName.charAt(0).toUpperCase() : "U";
  
  const userEmail = user?.email || "Belum Login (Sesi Tamu)";
  const avatarSrc = avatarUrl || "/images/avatar.png";
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

  return (
    <div className="relative min-h-[100dvh] w-full bg-stone-950 font-sans text-slate-100 overflow-y-auto pb-24 sm:pb-12">
      {/* Background Nature Landscape */}
      <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <Image
          src="/animations/day-landscape.webp"
          alt="Nature Background"
          fill
          priority
          className="object-cover w-full h-full opacity-40 filter brightness-90 contrast-105 blur-xs scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/60 backdrop-blur-[2px]" />
      </div>

      {/* Header Container */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        
        {/* Top Navbar Back & Badge */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/15 flex items-center gap-2 backdrop-blur-md transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-amber-300" />
            <span>Kembali ke Dashboard</span>
          </Link>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pusat Akun & Profile</span>
          </div>
        </div>

        {/* Main Card Wrapper */}
        <div className="bg-stone-900/90 border border-amber-400/30 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          
          {/* Header User Banner */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-white/10 text-center sm:text-left">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.4)] shrink-0 bg-stone-900 flex items-center justify-center font-extrabold text-amber-300">
              {avatarSrc && !headerImgError ? (
                <Image
                  src={avatarSrc}
                  alt={userName}
                  fill
                  className="object-cover"
                  unoptimized={avatarSrc.startsWith("http")}
                  onError={() => setHeaderImgError(true)}
                />
              ) : (
                <span className="w-full h-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 text-stone-950 flex items-center justify-center font-extrabold text-xl sm:text-2xl uppercase shadow-inner">
                  {initialLetter}
                </span>
              )}
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-md transition-all bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{user ? "Sesi Terautentikasi (User)" : "Mode Tamu Publik (Guest)"}</span>
              </div>
              
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                {userName}
              </h1>
              
              <p className="text-xs sm:text-sm text-slate-300 flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>{userEmail}</span>
              </p>
            </div>

            {user ? (
              <form action={signOut} className="shrink-0">
                <button
                  type="submit"
                  onClick={() => soundFx.playClick()}
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold text-rose-300 bg-rose-950/50 hover:bg-rose-900/70 border border-rose-400/40 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{dict.auth.logout}</span>
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                onClick={() => soundFx.playClick()}
                className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-yellow-200 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 shrink-0 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Login Sekarang (Masuk)</span>
              </Link>
            )}
          </div>

          {/* Tab Navigation Menu */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab("info");
              }}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "info"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Info Profil</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab("edit");
              }}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "edit"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {user ? <Edit3 className="w-4 h-4" /> : <Lock className="w-4 h-4 text-amber-400" />}
              <span>Edit Profil</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab("settings");
              }}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "settings"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab("help");
              }}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "help"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Pusat Bantuan</span>
            </button>
          </div>

          {/* TAB 1: INFO PROFIL */}
          {activeTab === "info" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Status Akun</span>
                  </span>
                  <p className="text-sm font-bold text-white">
                    {user ? "Terautentikasi (Aktif)" : "Pengunjung Publik (Mode Tamu)"}
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Terdaftar Sejak</span>
                  </span>
                  <p className="text-sm font-bold text-white">{createdAt}</p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1 sm:col-span-2">
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>Email Utama</span>
                  </span>
                  <p className="text-sm font-bold text-amber-300">
                    {userEmail}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EDIT PROFIL & AVATAR (LOCKED UNTUK GUEST) */}
          {activeTab === "edit" && (
            <div className="space-y-6 animate-fadeIn">
              {!user ? (
                /* LOCKED FOR GUEST USER */
                <div className="p-8 rounded-3xl bg-amber-950/30 border border-amber-400/40 text-center space-y-4 backdrop-blur-md">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-400/40 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
                    <Lock className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-1 max-w-md mx-auto">
                    <h3 className="font-display text-xl font-bold text-white">
                      Fitur Edit Profil & Avatar Terkunci
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Anda sedang menggunakan <span className="text-amber-300 font-semibold">Mode Tamu</span>. Untuk dapat mengubah nama dan memilih avatar kustom, silakan login terlebih dahulu.
                    </p>
                  </div>

                  <Link
                    href="/login"
                    onClick={() => soundFx.playClick()}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-yellow-200 text-stone-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all transform hover:scale-105"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login Sekarang untuk Mengubah Profil</span>
                  </Link>
                </div>
              ) : (
                /* LOGGED IN USER EDIT FORM */
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {message && (
                    <div
                      className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 border ${
                        message.type === "success"
                          ? "bg-emerald-950/60 text-emerald-300 border-emerald-400/40"
                          : "bg-rose-950/60 text-rose-300 border-rose-400/40"
                      }`}
                    >
                      {message.type === "success" ? (
                        <Check className="w-4 h-4 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0" />
                      )}
                      <span>{message.text}</span>
                    </div>
                  )}

                  {/* Edit Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Nama Tampilan Profil
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan nama lengkap Anda..."
                      required
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                    />
                  </div>

                  {/* Upload Foto Dari Perangkat (Komputer/HP) */}
                  <div className="space-y-2.5 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <label className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                      <UploadCloud className="w-4 h-4 text-amber-400" />
                      <span>Upload Foto Dari Perangkat (Komputer / HP)</span>
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
                        className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs sm:text-sm border border-amber-400/30 flex items-center justify-center gap-2 backdrop-blur-md transition-all cursor-pointer"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>{selectedFile ? `Terpilih: ${selectedFile.name}` : "Pilih File Foto Baru..."}</span>
                      </button>
                      {selectedFile && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setAvatarUrl(defaultAvatar);
                            setMessage(null);
                          }}
                          className="text-xs text-rose-400 hover:text-rose-300 font-semibold underline text-center sm:text-left cursor-pointer"
                        >
                          Batal
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Format didukung: JPG, PNG, WEBP, GIF (Maksimal 5MB). Foto akan diunggah secara aman ke Supabase Storage & tersimpan di database.
                    </p>
                  </div>

                  {/* Preset Avatars Selection */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Atau Pilih Preset Avatar Lanskap
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
                              ? "border-amber-400 scale-110 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                              : "border-white/20 hover:border-white/50 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <Image src={url} alt={`Preset ${idx + 1}`} fill className="object-cover rounded-full" unoptimized />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Avatar URL Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Atau Masukkan URL Avatar Kustom
                    </label>
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {uploading
                        ? "Mengunggah Foto ke Storage..."
                        : saving
                        ? "Menyimpan Perubahan..."
                        : "Simpan Perubahan Profil"}
                    </span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: SETTINGS (PENGATURAN) */}
          {activeTab === "settings" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-3">
                {/* Theme Toggle Setting */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      {mode === "night" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-white">Mode Tampilan Lanskap</p>
                      <p className="text-[11px] text-slate-400">Pilih antara mode Siang Hari atau Malam Hari</p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleTheme}
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-amber-300 border border-white/20 transition-all cursor-pointer"
                  >
                    <span>{mode === "night" ? "🌙 Malam" : "☀️ Siang"}</span>
                  </button>
                </div>

                {/* SFX Sound Toggle Setting */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      {sfxEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-white">Ambient Sound Effects (SFX)</p>
                      <p className="text-[11px] text-slate-400">Efek suara sintetis saat tombol diklik atau di-hover</p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleSfx}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      sfxEnabled
                        ? "bg-amber-400/20 text-amber-300 border-amber-400/40"
                        : "bg-white/10 text-slate-400 border-white/20"
                    }`}
                  >
                    <span>{sfxEnabled ? "🔊 ON" : "🔇 OFF"}</span>
                  </button>
                </div>

                {/* Language Switcher Setting */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      <Languages className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-white">Bahasa Antarmuka (Language)</p>
                      <p className="text-[11px] text-slate-400">Pilih Bahasa Indonesia atau English</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      toggleLang();
                    }}
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-amber-300 border border-white/20 transition-all cursor-pointer"
                  >
                    <span>{lang === "id" ? "🇮🇩 Bahasa Indonesia" : "🇬🇧 English"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PUSAT BANTUAN (HELP CENTER / FAQ) */}
          {activeTab === "help" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Bagaimana cara kerja fitur Login?</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Website BRIMAS didesain publik. Anda dapat menikmati dashboard tanpa login. Login hanya diperlukan jika Anda ingin memberikan reaksi atau berkomentar pada modul blog/artikel.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5" />
                    <span>Cara menggunakan Command Palette (`Ctrl + K`)</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Tekan `Ctrl + K` (Windows) atau `Cmd + K` (Mac) di mana saja untuk membuka pencarian kilat ke project, navigasi halaman, atau pengubah bahasa.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Butuh bantuan lebih lanjut atau konsultasi?</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Hubungi kami langsung via email di <a href="mailto:brimaspradika8@gmail.com" className="text-amber-300 hover:underline font-semibold">brimaspradika8@gmail.com</a> atau melalui tombol kontak di Dashboard.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Mobile Bottom Navigation Component */}
      <MobileBottomNav />
    </div>
  );
}


"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  User,
  Search,
  Bell,
  Sun,
  Moon
} from "lucide-react";
import { soundFx } from "@/lib/audio/sound";

interface UserDashboardProps {
  user: any;
  dbUser: any;
}

export default function UserDashboard({
  user,
  dbUser,
}: UserDashboardProps) {
  const [isNight, setIsNight] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("dashboard_theme");
    if (saved === "day") {
      setIsNight(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsNight(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    soundFx.playClick();
    setIsNight((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("dashboard_theme", "night");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("dashboard_theme", "day");
      }
      return next;
    });
  };

  const displayName = dbUser?.name || user?.user_metadata?.full_name || "User";

  const USER_NAV_ITEMS = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard", active: true },
    { label: "My Profile", icon: User, href: "/profile" },
  ];

  return (
    <div className={`min-h-screen flex transition-colors duration-500 ${isNight ? "bg-[#0b0c10] text-[#c5c6c7]" : "bg-[#f4f7f6] text-[#2c3e50]"}`}>
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        <header className={`h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0 backdrop-blur-xl border-b transition-colors duration-300 ${isNight ? "bg-[#111216]/80 border-white/5" : "bg-white/80 border-[#e0e0e0]"}`}>
          <div className="flex items-center gap-3 md:gap-6">
            
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#DC2626] to-[#991b1b] flex items-center justify-center text-white font-black text-sm shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform">
                B
              </div>
              <h1 className={`text-lg sm:text-xl font-bold font-display uppercase tracking-tight hidden sm:block ${isNight ? "text-white" : "text-black"}`}>
                Dashboard <span className="text-[#DC2626]">Overview</span>
              </h1>
            </Link>

            {/* Horizontal Navbar for Users */}
            <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
              {USER_NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => soundFx.playClick()}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap ${item.active ? (isNight ? "bg-white/10 text-white shadow-sm" : "bg-[#DC2626]/10 text-[#DC2626] font-semibold") : (isNight ? "text-white/60 hover:bg-white/5 hover:text-white" : "text-black/60 hover:bg-black/5 hover:text-black")}`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-xs sm:text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className={`hidden sm:flex items-center px-3 py-1.5 rounded-full border transition-colors ${isNight ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>
              <Search className="w-4 h-4 opacity-50 mr-2" />
              <input type="text" placeholder="Search..." className="bg-transparent text-xs outline-none w-32 placeholder:opacity-50" />
            </div>

            <button onClick={toggleTheme} className={`p-2 rounded-full transition-all ${isNight ? "hover:bg-white/10 text-white/80" : "hover:bg-black/10 text-black/80"}`}>
              {isNight ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <button className={`p-2 rounded-full transition-all relative ${isNight ? "hover:bg-white/10 text-white/80" : "hover:bg-black/10 text-black/80"}`}>
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#DC2626] rounded-full"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-sm font-mono text-[#DC2626] uppercase tracking-widest mb-1">Welcome back</p>
                <h2 className={`font-display text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none ${isNight ? "text-white" : "text-black"}`}>
                  {displayName}
                </h2>
              </div>
            </div>

            <div className={`p-8 rounded-2xl border text-center mt-8 ${isNight ? "bg-white/5 border-white/10" : "bg-white border-[#e0e0e0] shadow-sm"}`}>
              <User className="w-16 h-16 mx-auto mb-4 text-[#DC2626] opacity-50" />
              <h3 className={`text-2xl font-black font-display tracking-tight mb-2 ${isNight ? "text-white" : "text-black"}`}>User Dashboard</h3>
              <p className="text-sm opacity-70 max-w-md mx-auto mb-6">
                Terima kasih telah menjadi bagian dari komunitas ini. Anda dapat mengelola profil Anda atau membaca artikel terbaru di halaman utama.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link href="/profile" className="px-6 py-2.5 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 shadow-lg shadow-[#DC2626]/30">
                  My Profile
                </Link>
                <Link href="/posts" className={`px-6 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 flex items-center gap-2 ${isNight ? "border-white/20 text-white hover:bg-white/10" : "border-black/20 text-black hover:bg-black/5"}`}>
                  Baca Artikel
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}

"use client";

import React, { useState } from "react";
import { User, ShieldCheck, RefreshCw, Key, Mail, Calendar, CheckCircle2, Sparkles, Code2 } from "lucide-react";
import { soundFx } from "@/lib/audio/sound";
import { createClient } from "@/lib/supabase/client";

interface SupabaseUserFetchWidgetProps {
  isNight: boolean;
  user: {
    id: string;
    email?: string;
    last_sign_in_at?: string;
    created_at?: string;
    app_metadata?: {
      provider?: string;
    };
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
      name?: string;
    };
  } | null;
  dbUser?: {
    id: string;
    email: string;
    name: string | null;
    avatar: string | null;
  } | null;
}

export default function SupabaseUserFetchWidget({ isNight, user, dbUser }: SupabaseUserFetchWidgetProps) {
  const [clientUserData, setClientUserData] = useState<any | null>(null);
  const [isFetchingClient, setIsFetchingClient] = useState(false);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const handleFetchUserClient = async () => {
    soundFx.playClick();
    setIsFetchingClient(true);
    setFetchError(null);

    try {
      const supabase = createClient();
      
      // 1. Fetch public profile record from Supabase "User" table (No login required!)
      const { data: publicUsers, error: dbErr } = await supabase.from("User").select("*").limit(5);

      // 2. Fetch session user if authenticated
      const { data: { user: liveAuthUser } } = await supabase.auth.getUser();

      if (dbErr) {
        setFetchError(dbErr.message);
      } else {
        setClientUserData({
          mode: "PUBLIC_DATABASE_FETCH (TANPA LOGIN)",
          supabaseSourceTable: "User",
          totalRecordsFetched: publicUsers?.length || 0,
          publicDeveloperProfile: publicUsers && publicUsers.length > 0 ? publicUsers[0] : {
            name: "Brimas Pradika Utama",
            role: "AI Systems Developer",
            school: "SMK Bhakti Mulia Pare",
            email: "brimaspradika8@gmail.com",
            status: "Supabase Public Profile"
          },
          currentUserAuthSession: liveAuthUser ? {
            id: liveAuthUser.id,
            email: liveAuthUser.email,
            provider: liveAuthUser.app_metadata?.provider
          } : "Visitor / Guest (Belum Login)"
        });
      }
      setFetchedAt(new Date().toLocaleTimeString("id-ID"));
    } catch (err: any) {
      setFetchError(err?.message || "Failed to fetch user data");
    } finally {
      setIsFetchingClient(false);
    }
  };

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || dbUser?.name || "Brimas Pradika Utama";
  const userEmail = user?.email || dbUser?.email || "brimaspradika8@gmail.com";
  const userId = user?.id || dbUser?.id || "supa-public-user-01";
  const provider = user?.app_metadata?.provider || (user ? "Auth Session" : "Public DB Record");

  return (
    <div className={`p-6 rounded-2xl border transition-all shadow-xl ${
      isNight ? "bg-[#161B15]/90 border-[#2A2F26]" : "bg-white border-[#E5E5E2]"
    }`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-current/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#DC2626] text-white flex items-center justify-center font-bold shadow-md shadow-[#DC2626]/30">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-black text-lg uppercase tracking-tight flex items-center gap-2">
              <span>SUPABASE USER PROFILE FETCH</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                PUBLIC DATA (NO LOGIN)
              </span>
            </h3>
            <p className="text-xs opacity-75 font-sans">
              Pengambilan data profil publik pengembang langsung dari tabel Supabase Database tanpa harus login terlebih dahulu.
            </p>
          </div>
        </div>

        {/* Client Fetch Trigger Button */}
        <button
          type="button"
          onClick={handleFetchUserClient}
          disabled={isFetchingClient}
          className="px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#DC2626]/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetchingClient ? "animate-spin" : ""}`} />
          <span>{isFetchingClient ? "Fetching Public Data..." : "Fetch Public User Data (Supabase)"}</span>
        </button>
      </div>

      {/* Grid Display: Server Component Fetched Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Card 1: Nama User */}
        <div className={`p-4 rounded-xl border space-y-1.5 ${
          isNight ? "bg-[#0D110C] border-[#2A2F26]" : "bg-[#F8F8F6] border-[#E5E5E2]"
        }`}>
          <div className="flex items-center justify-between text-xs font-mono font-bold text-[#DC2626] uppercase">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Display Name</span>
            </span>
            <span className="text-[9px] opacity-60">Server Fetch</span>
          </div>
          <p className="font-bold text-sm truncate">{displayName}</p>
        </div>

        {/* Card 2: Email */}
        <div className={`p-4 rounded-xl border space-y-1.5 ${
          isNight ? "bg-[#0D110C] border-[#2A2F26]" : "bg-[#F8F8F6] border-[#E5E5E2]"
        }`}>
          <div className="flex items-center justify-between text-xs font-mono font-bold text-[#DC2626] uppercase">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>User Email</span>
            </span>
            <span className="text-[9px] opacity-60">Server Fetch</span>
          </div>
          <p className="font-bold text-sm truncate">{userEmail}</p>
        </div>

        {/* Card 3: User ID */}
        <div className={`p-4 rounded-xl border space-y-1.5 ${
          isNight ? "bg-[#0D110C] border-[#2A2F26]" : "bg-[#F8F8F6] border-[#E5E5E2]"
        }`}>
          <div className="flex items-center justify-between text-xs font-mono font-bold text-[#DC2626] uppercase">
            <span className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" />
              <span>Supabase User UUID</span>
            </span>
            <span className="text-[9px] opacity-60">UUID</span>
          </div>
          <p className="font-mono text-xs font-semibold truncate opacity-90">{userId}</p>
        </div>

        {/* Card 4: Provider & Session */}
        <div className={`p-4 rounded-xl border space-y-1.5 ${
          isNight ? "bg-[#0D110C] border-[#2A2F26]" : "bg-[#F8F8F6] border-[#E5E5E2]"
        }`}>
          <div className="flex items-center justify-between text-xs font-mono font-bold text-[#DC2626] uppercase">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Auth Provider</span>
            </span>
            <span className="text-[9px] opacity-60">Session</span>
          </div>
          <p className="font-bold text-sm truncate uppercase">{provider}</p>
        </div>

      </div>

      {/* Client Fetch Output Box (If triggered) */}
      {clientUserData && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4 space-y-2 text-left">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>HASIL FETCH BROWSER CLIENT (REAL-TIME SUPABASE AUTH)</span>
            </span>
            <span>Fetched at: {fetchedAt}</span>
          </div>

          <div className="p-3 rounded-lg bg-black/60 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
            <pre><code>{JSON.stringify(clientUserData, null, 2)}</code></pre>
          </div>
        </div>
      )}

      {fetchError && (
        <div className="rounded-xl border border-red-500 bg-red-950/40 p-3 text-xs font-bold text-red-300">
          <span>Error Fetching User: {fetchError}</span>
        </div>
      )}

      {/* Code Snippet Info Footer */}
      <div className="mt-4 pt-3 border-t border-current/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono opacity-80">
        <div className="flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-[#DC2626]" />
          <span>Server Fetch Syntax: <code>const &#123; data: &#123; user &#125; &#125; = await supabase.auth.getUser();</code></span>
        </div>
        <span className="text-[#DC2626] font-bold">READY IN PERSONAL WEBSITE</span>
      </div>

    </div>
  );
}

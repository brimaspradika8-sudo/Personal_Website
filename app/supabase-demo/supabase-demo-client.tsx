"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Code, Database, Server, Laptop, RefreshCw, CheckCircle2, AlertCircle, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface SupabaseDemoClientProps {
  serverResult: {
    timestamp: string;
    supabaseUrl: string;
    isConfigured: boolean;
    user: { id: string; email?: string } | null;
    projects: { data: any[]; error: string | null };
    articles: { data: any[]; error: string | null };
  };
}

export default function SupabaseDemoClient({ serverResult }: SupabaseDemoClientProps) {
  const [activeTab, setActiveTab] = useState<"server" | "client" | "api">("server");

  // Client Component Fetching State
  const [clientData, setClientData] = useState<any>(null);
  const [clientLoading, setClientLoading] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  // Route Handler Fetching State
  const [apiData, setApiData] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Function to fetch data dynamically on Client Component
  const handleClientFetch = async () => {
    setClientLoading(true);
    setClientError(null);
    try {
      const supabase = createClient();
      // Fetch user & session
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      // Fetch projects
      const { data: projects, error: projErr } = await supabase.from("Project").select("*").limit(3);

      setClientData({
        fetchedAt: new Date().toLocaleTimeString("id-ID"),
        user: user ? { id: user.id, email: user.email } : null,
        projects: projects || [],
        authError: authErr?.message || null,
        projectError: projErr?.message || null,
      });
    } catch (err: any) {
      setClientError(err.message || "Gagal fetch dari client");
    } finally {
      setClientLoading(false);
    }
  };

  // Function to fetch data from Next.js Route Handler
  const handleApiFetch = async () => {
    setApiLoading(true);
    setApiError(null);
    try {
      const res = await fetch("/api/demo-supabase");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Route Handler Error");
      setApiData(json);
    } catch (err: any) {
      setApiError(err.message || "Gagal fetch dari API route");
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#12160F] text-[#F1EFE9] p-4 sm:p-6 md:p-10 font-sans selection:bg-red-500 selection:text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="space-y-4 border-b border-[#2A2F26] pb-6">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-xs font-medium text-[#A8A79C] hover:text-[#DC2626] transition-colors gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-red-950/60 text-[#DC2626] border border-red-800/40 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Next.js 15/16 + Supabase
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-[#1A211A] text-[#A8A79C] border border-[#2A2F26]">
                  App Router Data Fetching
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F1EFE9]">
                Panduan & Demo Fetch Data Supabase
              </h1>
            </div>
            <div className="flex items-center gap-2 bg-[#1A211A] px-4 py-2 rounded-xl border border-[#2A2F26] text-xs">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Status Supabase:</span>
              {serverResult.isConfigured ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Terkoneksi
                </span>
              ) : (
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Belum Konfigurasi
                </span>
              )}
            </div>
          </div>
          <p className="text-[#A8A79C] text-sm sm:text-base leading-relaxed max-w-3xl">
            Pelajari 3 cara utama mengambil (fetch) data di Next.js App Router: 
            <strong className="text-white"> Server Components</strong>, 
            <strong className="text-white"> Client Components</strong>, dan 
            <strong className="text-white"> Route Handlers (API Routes)</strong>.
          </p>
        </header>

        {/* 3 Methods Tab Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab("server")}
            className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-3 cursor-pointer ${
              activeTab === "server"
                ? "bg-[#1A211A] border-[#DC2626] shadow-lg shadow-red-950/20 ring-1 ring-[#DC2626]"
                : "bg-[#161B15] border-[#2A2F26] hover:border-[#3A4235]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-lg bg-red-950/40 text-[#DC2626] border border-red-900/30">
                <Server className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono uppercase bg-[#212A20] px-2 py-0.5 rounded text-[#A8A79C]">
                Default / Recommended
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">1. Server Component</h3>
              <p className="text-xs text-[#A8A79C] mt-1">
                Data di-fetch langsung di server sebelum HTML dikirim ke browser (`async/await`).
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("client")}
            className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-3 cursor-pointer ${
              activeTab === "client"
                ? "bg-[#1A211A] border-[#DC2626] shadow-lg shadow-red-950/20 ring-1 ring-[#DC2626]"
                : "bg-[#161B15] border-[#2A2F26] hover:border-[#3A4235]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-lg bg-blue-950/40 text-blue-400 border border-blue-900/30">
                <Laptop className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono uppercase bg-[#212A20] px-2 py-0.5 rounded text-[#A8A79C]">
                `'use client'`
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">2. Client Component</h3>
              <p className="text-xs text-[#A8A79C] mt-1">
                Data di-fetch dari browser pengguna secara dinamis saat tombol diklik atau event terjadi.
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("api")}
            className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-3 cursor-pointer ${
              activeTab === "api"
                ? "bg-[#1A211A] border-[#DC2626] shadow-lg shadow-red-950/20 ring-1 ring-[#DC2626]"
                : "bg-[#161B15] border-[#2A2F26] hover:border-[#3A4235]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-900/30">
                <Code className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono uppercase bg-[#212A20] px-2 py-0.5 rounded text-[#A8A79C]">
                API Route
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">3. Route Handler</h3>
              <p className="text-xs text-[#A8A79C] mt-1">
                Endpoint backend (`app/api/.../route.ts`) yang mengembalikan data JSON.
              </p>
            </div>
          </button>
        </div>

        {/* Tab Content 1: Server Component */}
        {activeTab === "server" && (
          <div className="space-y-6 bg-[#161B15] border border-[#2A2F26] rounded-2xl p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2A2F26] pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Server className="w-5 h-5 text-[#DC2626]" /> Fetch di Server Component (RSC)
                </h2>
                <p className="text-xs text-[#A8A79C] mt-1">
                  Hasil berikut di-generate di server pada {serverResult.timestamp}
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-950/50 text-emerald-400 text-xs font-mono rounded-md border border-emerald-800/30">
                Status: Executed on Server
              </span>
            </div>

            {/* Live Data Card */}
            <div className="bg-[#1A211A] border border-[#2A2F26] rounded-xl p-5 space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#DC2626]">
                Data yang Di-fetch dari Supabase:
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-[#12160F] p-4 rounded-lg border border-[#2A2F26]">
                  <p className="text-[#A8A79C] font-mono mb-1">Session User (auth.getUser()):</p>
                  {serverResult.user ? (
                    <div className="text-emerald-400 font-mono">
                      ID: {serverResult.user.id}<br/>
                      Email: {serverResult.user.email || "N/A"}
                    </div>
                  ) : (
                    <p className="text-amber-400 italic">Belum ada user login (guest session)</p>
                  )}
                </div>

                <div className="bg-[#12160F] p-4 rounded-lg border border-[#2A2F26]">
                  <p className="text-[#A8A79C] font-mono mb-1">Tabel &quot;Project&quot; Query Status:</p>
                  {serverResult.projects.error ? (
                    <p className="text-[#DC2626] font-mono leading-relaxed">
                      Error/Info: {serverResult.projects.error}
                    </p>
                  ) : (
                    <p className="text-emerald-400 font-mono">
                      Ditemukan {serverResult.projects.data.length} project(s)
                    </p>
                  )}
                </div>
              </div>

              {/* Raw JSON Preview */}
              <div className="space-y-1">
                <p className="text-xs text-[#A8A79C] font-mono">Raw Server Output:</p>
                <pre className="bg-[#0D100B] p-4 rounded-lg border border-[#2A2F26] text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-48">
                  {JSON.stringify(serverResult, null, 2)}
                </pre>
              </div>
            </div>

            {/* Code Explanation */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-[#DC2626]" /> Kode Server Component (`app/supabase-demo/page.tsx`):
              </h3>
              <pre className="bg-[#0D100B] p-4 rounded-xl border border-[#2A2F26] text-xs font-mono text-slate-200 overflow-x-auto">
{`// App Router (Next.js 15/16) - Server Component secara default
import { createClient } from "@/lib/supabase/server";

export default async function DemoPage() {
  // 1. Buat Supabase server client
  const supabase = await createClient();

  // 2. Fetch data langsung dengan await
  const { data: projects, error } = await supabase
    .from("Project")
    .select("*");

  // 3. Render HTML langsung dengan data yang sudah di-fetch
  return (
    <div>
      {projects?.map(project => (
        <div key={project.id}>{project.title}</div>
      ))}
    </div>
  );
}`}
              </pre>
            </div>
          </div>
        )}

        {/* Tab Content 2: Client Component */}
        {activeTab === "client" && (
          <div className="space-y-6 bg-[#161B15] border border-[#2A2F26] rounded-2xl p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2A2F26] pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-blue-400" /> Fetch di Client Component (`&apos;use client&apos;`)
                </h2>
                <p className="text-xs text-[#A8A79C] mt-1">
                  Jalankan fetch interaktif dari browser penguna.
                </p>
              </div>
              <button
                onClick={handleClientFetch}
                disabled={clientLoading}
                className="px-4 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${clientLoading ? "animate-spin" : ""}`} />
                {clientLoading ? "Fetching..." : "Jalankan Fetch di Browser"}
              </button>
            </div>

            {/* Output */}
            <div className="bg-[#1A211A] border border-[#2A2F26] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                  Hasil Fetch Browser:
                </h4>
                {clientData && (
                  <span className="text-[10px] text-[#A8A79C] font-mono">
                    Fetched at: {clientData.fetchedAt}
                  </span>
                )}
              </div>

              {clientError && (
                <div className="p-3 bg-red-950/50 border border-red-800/40 rounded-lg text-xs text-red-300 font-mono">
                  Error: {clientError}
                </div>
              )}

              {clientData ? (
                <pre className="bg-[#0D100B] p-4 rounded-lg border border-[#2A2F26] text-[11px] font-mono text-blue-300 overflow-x-auto max-h-48">
                  {JSON.stringify(clientData, null, 2)}
                </pre>
              ) : (
                <div className="p-8 text-center border border-dashed border-[#2A2F26] rounded-lg text-xs text-[#A8A79C]">
                  Klik tombol <strong>&quot;Jalankan Fetch di Browser&quot;</strong> di atas untuk menguji fetch dari Client Component.
                </div>
              )}
            </div>

            {/* Code Explanation */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-400" /> Kode Client Component:
              </h3>
              <pre className="bg-[#0D100B] p-4 rounded-xl border border-[#2A2F26] text-xs font-mono text-slate-200 overflow-x-auto">
{`"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function MyClientComponent() {
  const [data, setData] = useState(null);

  const loadData = async () => {
    const supabase = createClient();
    const { data: projects } = await supabase.from("Project").select("*");
    setData(projects);
  };

  return (
    <button onClick={loadData}>Fetch Data</button>
  );
}`}
              </pre>
            </div>
          </div>
        )}

        {/* Tab Content 3: Route Handler */}
        {activeTab === "api" && (
          <div className="space-y-6 bg-[#161B15] border border-[#2A2F26] rounded-2xl p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2A2F26] pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-emerald-400" /> Fetch via Route Handler (`/api/demo-supabase`)
                </h2>
                <p className="text-xs text-[#A8A79C] mt-1">
                  Panggil API Endpoint backend Next.js secara HTTP GET.
                </p>
              </div>
              <button
                onClick={handleApiFetch}
                disabled={apiLoading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${apiLoading ? "animate-spin" : ""}`} />
                {apiLoading ? "Requesting..." : "Panggil GET /api/demo-supabase"}
              </button>
            </div>

            {/* Output */}
            <div className="bg-[#1A211A] border border-[#2A2F26] rounded-xl p-5 space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Respon JSON dari Endpoint:
              </h4>

              {apiError && (
                <div className="p-3 bg-red-950/50 border border-red-800/40 rounded-lg text-xs text-red-300 font-mono">
                  Error: {apiError}
                </div>
              )}

              {apiData ? (
                <pre className="bg-[#0D100B] p-4 rounded-lg border border-[#2A2F26] text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-48">
                  {JSON.stringify(apiData, null, 2)}
                </pre>
              ) : (
                <div className="p-8 text-center border border-dashed border-[#2A2F26] rounded-lg text-xs text-[#A8A79C]">
                  Klik tombol <strong>&quot;Panggil GET /api/demo-supabase&quot;</strong> untuk menguji Route Handler.
                </div>
              )}
            </div>

            {/* Code Explanation */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-400" /> Kode Route Handler (`app/api/demo-supabase/route.ts`):
              </h3>
              <pre className="bg-[#0D100B] p-4 rounded-xl border border-[#2A2F26] text-xs font-mono text-slate-200 overflow-x-auto">
{`// app/api/demo-supabase/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: projects } = await supabase.from("Project").select("*");
  
  return NextResponse.json({ success: true, data: projects });
}`}
              </pre>
            </div>
          </div>
        )}

        {/* Explanation Card about Row Level Security (RLS) */}
        <div className="bg-[#161B15] border border-amber-900/40 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-amber-950/60 text-amber-400 rounded-lg border border-amber-800/40">
              <AlertCircle className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-white text-base">Catatan Penting: Supabase Row Level Security (RLS)</h3>
              <p className="text-xs text-[#A8A79C]">Mengapa terjadi error &apos;permission denied&apos; saat querying via anon key?</p>
            </div>
          </div>
          <div className="text-xs text-[#A8A79C] leading-relaxed space-y-2 border-t border-[#2A2F26] pt-4">
            <p>
              Supabase secara default mengaktifkan <strong>Row Level Security (RLS)</strong> pada setiap tabel di PostgreSQL. Supabase client yang menggunakan kunci <code className="text-amber-300 font-mono">ANON_KEY</code> dianggap sebagai peran anonim.
            </p>
            <p>
              Jika tabel belum memiliki kebijakan (Policy) akses publik untuk <code className="text-amber-300 font-mono">SELECT</code>, PostgreSQL akan menolak query anonim.
            </p>
            <div className="bg-[#0D100B] p-3 rounded-lg font-mono text-[11px] text-slate-300 border border-[#2A2F26]">
              <span className="text-emerald-400">-- Solusi SQL di Dashboard Supabase / SQL Editor:</span><br/>
              ALTER TABLE &quot;Project&quot; ENABLE ROW LEVEL SECURITY;<br/>
              CREATE POLICY &quot;Izinkan pembacaan publik untuk Project&quot; ON &quot;Project&quot; FOR SELECT USING (true);
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

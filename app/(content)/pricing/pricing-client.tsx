"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  Mail,
  MessageSquare,
  Globe,
  Layers,
  Code2,
  Cpu,
  Calculator,
  ArrowRight,
  Star,
  Clock,
  FileCode2,
  Lock,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { soundFx } from "@/lib/audio/sound";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import QuickContactFAB from "@/components/QuickContactFAB";

// Calculator feature options
const CALCULATOR_OPTIONS = [
  { id: "landing", label: "Landing Page / Web Profile", priceIdr: 1500000, priceUsd: 100 },
  { id: "auth", label: "Autentikasi User (Google / Email OTP)", priceIdr: 800000, priceUsd: 55 },
  { id: "admin", label: "Admin Management Dashboard", priceIdr: 1200000, priceUsd: 80 },
  { id: "db", label: "Database Supabase / PostgreSQL", priceIdr: 1000000, priceUsd: 65 },
  { id: "ai", label: "Integrasi AI Agent / OpenAI / Gemini", priceIdr: 2500000, priceUsd: 165 },
  { id: "i18n", label: "Dua Bahasa (English & Indonesia)", priceIdr: 500000, priceUsd: 35 },
];

export default function PricingClient() {
  const { lang } = useLanguage();
  const [currency, setCurrency] = useState<"IDR" | "USD">("IDR");
  const [selectedCalcOptions, setSelectedCalcOptions] = useState<string[]>(["landing", "auth"]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Toggle calculator options
  const toggleOption = (id: string) => {
    soundFx.playClick();
    if (selectedCalcOptions.includes(id)) {
      if (selectedCalcOptions.length > 1) {
        setSelectedCalcOptions(selectedCalcOptions.filter((item) => item !== id));
      }
    } else {
      setSelectedCalcOptions([...selectedCalcOptions, id]);
    }
  };

  // Calculate total price
  const calcTotalIdr = selectedCalcOptions.reduce((acc, currId) => {
    const item = CALCULATOR_OPTIONS.find((opt) => opt.id === currId);
    return acc + (item ? item.priceIdr : 0);
  }, 0);

  const calcTotalUsd = selectedCalcOptions.reduce((acc, currId) => {
    const item = CALCULATOR_OPTIONS.find((opt) => opt.id === currId);
    return acc + (item ? item.priceUsd : 0);
  }, 0);

  const formatPrice = (idr: number, usd: number) => {
    if (currency === "USD") {
      return `$${usd}`;
    }
    return `Rp ${idr.toLocaleString("id-ID")}`;
  };

  const FAQS = [
    {
      q_id: "Berapa lama durasi estimasi pengerjaan proyek?",
      q_en: "How long does project delivery take?",
      a_id: "Untuk paket Starter (Landing Page) pengerjaan memakan waktu 3-5 hari kerja. Paket Pro (Fullstack App & Dashboard) berkisar 1-2 minggu, dan paket Enterprise disesuaikan dengan kompleksitas sistem.",
      a_en: "Starter landing pages take 3-5 business days. Pro Fullstack Apps take 1-2 weeks, while Enterprise custom systems depend on feature scope.",
    },
    {
      q_id: "Apakah saya mendapatkan hak cipta penuh terhadap Source Code?",
      q_en: "Do I get full ownership of the source code?",
      a_id: "Ya, 100%! Setelah pelunasan, seluruh repository GitHub, kode sumber, skema database, dan aset digital akan sepenuhnya diserahkan kepada Anda tanpa biaya tersembunyi.",
      a_en: "Yes, 100%! Upon completion, full GitHub repository ownership, source code, database schemas, and digital assets belong entirely to you.",
    },
    {
      q_id: "Bagaimana tahapan pembayaran proyek?",
      q_en: "What is the project payment structure?",
      a_id: "Pembayaran menggunakan skema 50% DP (Down Payment) di awal sebagai komitmen dimulainya proyek, dan 50% pelunasan setelah proyek selesai diuji dan siap dirilis.",
      a_en: "Payments follow a 50% DP (Down Payment) structure to initiate the project, and 50% final payment after testing and ready for deployment.",
    },
    {
      q_id: "Apakah ada garansi & pemeliharaan setelah proyek selesai?",
      q_en: "Is there post-launch warranty and maintenance support?",
      a_id: "Setiap paket mencakup garansi perbaikan bug gratis selama 1 hingga 3 bulan pasca-rilis untuk memastikan aplikasi berjalan tanpa kendala.",
      a_en: "Every package includes free bug fix warranty support for 1 to 3 months post-launch to guarantee optimal system stability.",
    },
    {
      q_id: "Apakah bisa request fitur khusus di luar paket?",
      q_en: "Can I request custom features outside standard packages?",
      a_id: "Tentu! Anda dapat memilih paket kustom atau menggunakan Kalkulator Estimasi di bawah untuk menyesuaikan fitur spesifik sesuai kebutuhan bisnis Anda.",
      a_en: "Absolutely! You can choose custom features or use the Project Estimator calculator below to customize exact requirements.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-[#EAB308] selection:text-black pb-28 sm:pb-20">
      
      {/* Wrapper container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-12 sm:space-y-16">

        {/* 1. TOP BREADCRUMB & NAV */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            onClick={() => soundFx.playClick()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-white dark:bg-black border-3 border-black dark:border-white text-xs font-mono font-black text-black dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer group uppercase"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#166534] dark:text-[#EAB308]" />
            <span>{lang === "id" ? "KEMBALI KE BERANDA" : "BACK TO HOME"}</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#EAB308] text-black border-2 border-black text-[11px] font-mono font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <ShieldCheck className="w-3.5 h-3.5 text-black" />
            <span>TRANSPARENT PRICING 🏷️</span>
          </div>
        </div>

        {/* 2. HERO TITLE SECTION */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none bg-[#166534] text-white border-3 border-black dark:border-white text-xs font-mono font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Zap className="w-4 h-4 text-[#EAB308]" />
            <span>{lang === "id" ? "PAKET LAYANAN & FREELANCE ESTIMATE" : "SERVICES & FREELANCE PRICING"}</span>
          </div>

          <h1 className="font-serif font-black text-3xl sm:text-6xl uppercase tracking-tight text-black dark:text-white leading-tight">
            INVESTASI SOFTWARE &amp; <span className="text-[#166534] dark:text-[#00E676] underline decoration-4 underline-offset-4">PENGEMBANGAN SISTEM</span>
          </h1>

          <p className="text-xs sm:text-base font-mono font-bold text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            {lang === "id"
              ? "Penawaran harga transparan untuk pembuatan landing page modern, aplikasi web fullstack Next.js 15, integrasi AI Agent, dan arsitektur backend."
              : "Transparent pricing options for modern landing pages, fullstack Next.js 15 web apps, AI Agent integrations, and backend architecture."}
          </p>

          {/* Currency Switcher Toggle */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <span className="text-xs font-mono font-black uppercase text-neutral-600 dark:text-neutral-400">
              {lang === "id" ? "MATA UANG:" : "CURRENCY:"}
            </span>
            <div className="inline-flex p-1 bg-neutral-200 dark:bg-neutral-800 border-2 border-black dark:border-white">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setCurrency("IDR");
                }}
                className={`px-3 py-1 text-xs font-mono font-black uppercase transition-all cursor-pointer ${
                  currency === "IDR"
                    ? "bg-[#166534] text-white border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    : "text-black dark:text-white"
                }`}
              >
                IDR (Rp)
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setCurrency("USD");
                }}
                className={`px-3 py-1 text-xs font-mono font-black uppercase transition-all cursor-pointer ${
                  currency === "USD"
                    ? "bg-[#EAB308] text-black border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    : "text-black dark:text-white"
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>
        </div>

        {/* 3. THREE PRICING TIER CARDS (Brazil Neo-Brutalist Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          
          {/* TIER 1: STARTER */}
          <div className="p-6 rounded-none border-4 border-black dark:border-white bg-white dark:bg-[#0A0D14] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 bg-[#166534] text-white border-2 border-black text-xs font-mono font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                STARTER &bull; LANDING PAGE
              </div>

              <div className="space-y-1">
                <h3 className="font-serif font-black text-2xl uppercase text-black dark:text-white">PROFIL &amp; LANDING PAGE</h3>
                <p className="text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400">
                  {lang === "id" ? "Cocok untuk Personal Branding, Portofolio & UMKM." : "Ideal for Personal Branding, Portfolios & SMBs."}
                </p>
              </div>

              <div className="py-3 border-y-3 border-black dark:border-white">
                <span className="font-serif font-black text-3xl sm:text-4xl text-black dark:text-white">
                  {formatPrice(1500000, 100)}
                </span>
                <span className="text-xs font-mono font-bold text-neutral-500 block">
                  {lang === "id" ? "/ flat per proyek" : "/ flat per project"}
                </span>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-3 text-xs font-mono font-bold text-black dark:text-white">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                  <span>1-3 Halaman Web Responsive (Next.js 15)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                  <span>Desain Modern / Neo-Brutalisme Kustom</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                  <span>Formulir Kontak &amp; Integrasi WhatsApp</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                  <span>Optimasi Performa &amp; SEO dasar</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                  <span>Free Deployment Vercel &amp; Domain Setup</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                  <span>1 Bulan Garansi Support &amp; Revisi</span>
                </li>
              </ul>
            </div>

            <a
              href="https://wa.me/6283830718168?text=Halo%20Brimas,%20saya%20tertarik%20dengan%20Paket%20Starter%20(Landing%20Page)"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playClick()}
              className="w-full py-3 rounded-none bg-white dark:bg-black text-black dark:text-white hover:bg-[#166534] hover:text-white border-3 border-black dark:border-white font-mono font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-center inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{lang === "id" ? "PESAN PAKET STARTER" : "GET STARTER PLAN"}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* TIER 2: PRO / FULLSTACK APP & DASHBOARD (MOST POPULAR HIGHLIGHT) */}
          <div className="relative p-6 rounded-none border-4 border-black dark:border-white bg-[#FEF9C3] dark:bg-[#141C10] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col justify-between space-y-6 transform md:-translate-y-2">
            
            {/* Featured Badge Pill */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#EAB308] text-black border-2 border-black px-4 py-1 font-mono font-black text-[11px] uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5 whitespace-nowrap">
              <Star className="w-3.5 h-3.5 fill-black" />
              <span>{lang === "id" ? "PALING POPULER & RECOMMENDED" : "MOST POPULAR CHOICE"}</span>
            </div>

            <div className="space-y-4 pt-2">
              <div className="inline-block px-3 py-1 bg-[#EAB308] text-black border-2 border-black text-xs font-mono font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                PRO &bull; FULLSTACK &amp; DASHBOARD
              </div>

              <div className="space-y-1">
                <h3 className="font-serif font-black text-2xl uppercase text-black dark:text-white">FULLSTACK WEB APP</h3>
                <p className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                  {lang === "id" ? "Solusi lengkap aplikasi bisnis, SaaS, & Admin Portal." : "Complete solution for SaaS, custom portals & business apps."}
                </p>
              </div>

              <div className="py-3 border-y-3 border-black dark:border-white">
                <span className="font-serif font-black text-3xl sm:text-5xl text-[#166534] dark:text-[#00E676]">
                  {formatPrice(4500000, 300)}
                </span>
                <span className="text-xs font-mono font-bold text-neutral-600 dark:text-neutral-300 block">
                  {lang === "id" ? "/ flat per proyek" : "/ flat per project"}
                </span>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-3 text-xs font-mono font-bold text-black dark:text-white">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#166534] dark:text-[#00E676] shrink-0 mt-0.5" />
                  <span>Arsitektur Fullstack (Next.js 15 &amp; React 19)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#166534] dark:text-[#00E676] shrink-0 mt-0.5" />
                  <span>Database Supabase / PostgreSQL &amp; Prisma ORM</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#166534] dark:text-[#00E676] shrink-0 mt-0.5" />
                  <span>Sistem Autentikasi (Google OAuth, Email, OTP)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#166534] dark:text-[#00E676] shrink-0 mt-0.5" />
                  <span>Dashboard Manajemen Admin &amp; CRUD Data</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#166534] dark:text-[#00E676] shrink-0 mt-0.5" />
                  <span>Upload File / Gambar dengan RLS Storage</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#166534] dark:text-[#00E676] shrink-0 mt-0.5" />
                  <span>Integrasi Fitur Multibahasa (ID / EN i18n)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#166534] dark:text-[#00E676] shrink-0 mt-0.5" />
                  <span>3 Bulan Garansi Support &amp; Maintenance</span>
                </li>
              </ul>
            </div>

            <a
              href="https://wa.me/6283830718168?text=Halo%20Brimas,%20saya%20tertarik%20dengan%20Paket%20PRO%20(Fullstack%20Web%20App)"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playClick()}
              className="w-full py-3.5 rounded-none bg-[#166534] hover:bg-[#14532D] text-white border-3 border-black font-mono font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-center inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{lang === "id" ? "PESAN PAKET PRO SEKARANG" : "CHOOSE PRO PLAN"}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* TIER 3: ENTERPRISE / AI & SYSTEM ARCHITECTURE */}
          <div className="p-6 rounded-none border-4 border-black dark:border-white bg-white dark:bg-[#0A0D14] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 bg-[#00E676] text-black border-2 border-black text-xs font-mono font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                ENTERPRISE &bull; AI &amp; SYSTEM
              </div>

              <div className="space-y-1">
                <h3 className="font-serif font-black text-2xl uppercase text-black dark:text-white">AI AGENT &amp; CUSTOM SYSTEM</h3>
                <p className="text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400">
                  {lang === "id" ? "Integrasi kecerdasan buatan & arsitektur kompleks." : "Custom AI Agents, automation & enterprise architecture."}
                </p>
              </div>

              <div className="py-3 border-y-3 border-black dark:border-white">
                <span className="font-serif font-black text-3xl sm:text-4xl text-black dark:text-white">
                  CUSTOM
                </span>
                <span className="text-xs font-mono font-bold text-neutral-500 block">
                  {lang === "id" ? "Mulai dari " + formatPrice(8500000, 550) : "Starts from " + formatPrice(8500000, 550)}
                </span>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-3 text-xs font-mono font-bold text-black dark:text-white">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                  <span>Semua Fitur Paket Pro Tersebut</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                  <span>Integrasi OpenAI API / Gemini / Custom LLM</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                  <span>Automated Workflow Agent &amp; RAG System</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                  <span>Desain Arsitektur Backend Skala Tinggi</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                  <span>Setup Kontainer Docker &amp; CI/CD Deployment</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                  <span>Prioritas Dukungan 24/7 &amp; Pendampingan</span>
                </li>
              </ul>
            </div>

            <a
              href="https://wa.me/6283830718168?text=Halo%20Brimas,%20saya%20ingin%20diskusi%20Paket%20Enterprise%20/%20Custom%20AI%20System"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playClick()}
              className="w-full py-3 rounded-none bg-[#EAB308] text-black border-3 border-black dark:border-white font-mono font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-center inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{lang === "id" ? "KONSULTASI ENTERPRISE" : "DISCUSS CUSTOM SCOPE"}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* 4. INTERACTIVE PROJECT ESTIMATOR CALCULATOR */}
        <section className="p-6 sm:p-10 rounded-none border-4 border-black dark:border-white bg-white dark:bg-[#0A0D14] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-3 border-black dark:border-white pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#166534] text-white border-2 border-black text-xs font-mono font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Calculator className="w-3.5 h-3.5 text-white" />
                <span>{lang === "id" ? "KALKULATOR ESTIMASI PROYEK" : "PROJECT ESTIMATOR CALCULATOR"}</span>
              </div>
              <h2 className="font-serif font-black text-2xl sm:text-3xl uppercase text-black dark:text-white">
                SIMULASI BIAYA FITUR KUSTOM
              </h2>
            </div>

            <div className="p-4 rounded-none bg-[#EAB308] border-3 border-black text-black text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[10px] font-mono font-black uppercase block">ESTIMASI TOTAL BIAYA</span>
              <span className="font-serif font-black text-2xl sm:text-3xl">
                {formatPrice(calcTotalIdr, calcTotalUsd)}
              </span>
            </div>
          </div>

          {/* Options Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {CALCULATOR_OPTIONS.map((opt) => {
              const isSelected = selectedCalcOptions.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleOption(opt.id)}
                  className={`p-4 rounded-none border-3 border-black text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#FEF9C3] dark:bg-[#162414] dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-white dark:bg-[#121620] dark:border-white hover:bg-neutral-100"
                  }`}
                >
                  <div className="space-y-1 pr-2">
                    <span className="text-xs font-mono font-black uppercase block text-black dark:text-white">
                      {opt.label}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#166534] dark:text-[#00E676] block">
                      +{formatPrice(opt.priceIdr, opt.priceUsd)}
                    </span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-none border-2 border-black flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-[#166534] text-white" : "bg-white"
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Direct WhatsApp Quote Link for Custom Estimate */}
          <div className="pt-2 text-right">
            <a
              href={`https://wa.me/6283830718168?text=Halo%20Brimas,%20saya%20telah%20menghitung%20estimasi%20proyek%20menggunakan%20kalkulator%20dengan%20total%20${encodeURIComponent(
                formatPrice(calcTotalIdr, calcTotalUsd)
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playClick()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-[#166534] hover:bg-[#14532D] text-white border-3 border-black font-mono font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{lang === "id" ? "PESAN ESTIMASI INI VIA WHATSAPP" : "ORDER ESTIMATE VIA WHATSAPP"}</span>
            </a>
          </div>
        </section>

        {/* 5. FREQUENTLY ASKED QUESTIONS (FAQ Accordion) */}
        <section className="space-y-6">
          <div className="space-y-2 border-b-4 border-black dark:border-white pb-4 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#EAB308] text-black border-3 border-black text-xs font-mono font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <HelpCircle className="w-3.5 h-3.5 text-black" />
              <span>FAQ &bull; PERTANYAAN POPULER</span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-4xl uppercase text-black dark:text-white">
              PERTANYAAN SERING DIAJUKAN
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div
                  key={i}
                  className="rounded-none border-3 border-black dark:border-white bg-white dark:bg-[#0A0D14] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] overflow-hidden"
                >
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setOpenFaqIndex(isOpen ? null : i);
                    }}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-mono font-black text-xs sm:text-sm uppercase text-black dark:text-white cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[#166534] dark:text-[#EAB308]">[{i + 1}]</span>
                      <span>{lang === "id" ? faq.q_id : faq.q_en}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? "rotate-180 text-[#166534]" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-4 sm:px-5 pb-5 pt-1 border-t border-neutral-200 dark:border-neutral-800 font-mono text-xs font-bold leading-relaxed text-neutral-700 dark:text-neutral-300"
                      >
                        {lang === "id" ? faq.a_id : faq.a_en}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. CALL TO ACTION BANNER */}
        <section className="p-8 sm:p-12 rounded-none border-4 border-black dark:border-white bg-[#166534] text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] space-y-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#EAB308] text-black border-2 border-black text-xs font-mono font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>MULAI DISKUSI PROYEK</span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-4xl uppercase leading-tight text-white">
              SIAP MEMBANGUN PROYEK IMPIAN ANDA?
            </h2>
            <p className="text-xs sm:text-sm font-mono font-bold leading-relaxed text-slate-100">
              Hubungi saya sekarang melalui WhatsApp atau Email untuk konsultasi gratis dan pembahasan requirement proyek Anda.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="https://wa.me/6283830718168?text=Halo%20Brimas,%20saya%20ingin%20konsultasi%20pembuatan%20proyek%20website"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playClick()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-none bg-[#EAB308] hover:bg-[#d9a207] text-black border-3 border-black font-mono font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>CHAT VIA WHATSAPP</span>
            </a>
          </div>
        </section>

      </div>

      {/* Floating Bottom Nav */}
      <MobileBottomNav />

      {/* Quick Contact FAB */}
      <QuickContactFAB />

      {/* Footer */}
      <div className="pt-16">
        <Footer />
      </div>
    </div>
  );
}

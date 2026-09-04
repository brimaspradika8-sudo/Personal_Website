"use server";

import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/client";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

function formatAuthError(errorMsg: string): string {
  if (
    errorMsg.toLowerCase().includes("invalid api key") ||
    errorMsg.toLowerCase().includes("invalid_api_key")
  ) {
    return "API Key Supabase (NEXT_PUBLIC_SUPABASE_ANON_KEY) tidak valid atau belum di-set di Dashboard Vercel.";
  }
  return errorMsg;
}

// --- Sinkronisasi user Supabase ke tabel `User` di database sendiri ---
// Sesuaikan nama field (name, email, dst) dengan schema.prisma kamu.
export async function syncUserToDatabase(email: string, name?: string | null) {
  try {
    const dbPromise = prisma.user.upsert({
      where: { email },
      update: {
        ...(name ? { name } : {}),
      },
      create: {
        email,
        name: name ?? email.split("@")[0],
      },
    });

    const timeoutPromise = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), 4000)
    );

    return await Promise.race([dbPromise, timeoutPromise]);
  } catch (error) {
    console.warn("Failed or timed out syncing user to database:", error);
    return null;
  }
}

async function getSiteUrl(): Promise<string> {
  // 1. Cek NEXT_PUBLIC_SITE_URL jika di-set manual
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    let url = process.env.NEXT_PUBLIC_SITE_URL.trim();
    url = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
    return url.endsWith("/") ? url.slice(0, -1) : url;
  }

  // 2. Ambil dari request headers jika dipanggil saat HTTP request
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");
    if (origin && !origin.includes("localhost")) {
      return origin.endsWith("/") ? origin.slice(0, -1) : origin;
    }

    const host = headersList.get("x-forwarded-host") || headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") || "https";
    if (host && !host.includes("localhost")) {
      const fullUrl = `${proto}://${host}`;
      return fullUrl.endsWith("/") ? fullUrl.slice(0, -1) : fullUrl;
    }
  } catch (e) {
    // Fallback jika di luar request context
  }

  // 3. Cek VERCEL_URL dari environment otomatis Vercel
  if (process.env.VERCEL_URL) {
    let url = process.env.VERCEL_URL.trim();
    url = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
    return url.endsWith("/") ? url.slice(0, -1) : url;
  }

  // 4. Default untuk pengembangan lokal
  return "http://localhost:3000";
}

// --- Login dengan Google (OAuth) ---
export async function signInWithGoogle() {
  const { isConfigured } = getSupabaseEnv();
  if (!isConfigured) {
    return { error: "API Key Supabase (NEXT_PUBLIC_SUPABASE_ANON_KEY) belum di-set di Dashboard Vercel." };
  }

  const supabase = await createClient();
  const siteUrl = await getSiteUrl();
  const redirectUrl = `${siteUrl}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
    },
  });

  if (error) {
    return { error: formatAuthError(error.message) };
  }

  if (data.url) {
    return { url: data.url };
  }

  return { error: "Gagal mendapatkan URL authentikasi Google." };
}

// --- Login dengan GitHub (OAuth) ---
export async function signInWithGithub() {
  const { isConfigured } = getSupabaseEnv();
  if (!isConfigured) {
    return { error: "API Key Supabase (NEXT_PUBLIC_SUPABASE_ANON_KEY) belum di-set di Dashboard Vercel." };
  }

  const supabase = await createClient();
  const siteUrl = await getSiteUrl();
  const redirectUrl = `${siteUrl}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: redirectUrl,
    },
  });

  if (error) {
    return { error: formatAuthError(error.message) };
  }

  if (data.url) {
    return { url: data.url };
  }

  return { error: "Gagal mendapatkan URL authentikasi GitHub." };
}

// --- Login manual (email + password) ---
export async function signInWithPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { isConfigured } = getSupabaseEnv();
  if (!isConfigured) {
    return { error: "API Key Supabase (NEXT_PUBLIC_SUPABASE_ANON_KEY) belum di-set di Dashboard Vercel." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: formatAuthError(error.message) };
  }

  // Pastikan user juga ada di tabel User sendiri
  if (data.user?.email) {
    await syncUserToDatabase(
      data.user.email,
      data.user.user_metadata?.full_name
    );
  }

  redirect("/dashboard");
}

// --- Register manual (nama, email, password) ---
export async function signUpWithPassword(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { isConfigured } = getSupabaseEnv();
  if (!isConfigured) {
    return { error: "API Key Supabase (NEXT_PUBLIC_SUPABASE_ANON_KEY) belum di-set di Dashboard Vercel." };
  }

  const supabase = await createClient();
  const siteUrl = await getSiteUrl();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name }, // disimpan di user_metadata Supabase
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    return { error: formatAuthError(error.message) };
  }

  // Jika email confirmation di Supabase dimatikan, session langsung aktif
  if (data.user?.email) {
    await syncUserToDatabase(data.user.email, name);
  }

  return { success: true };
}

// --- Logout ---
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

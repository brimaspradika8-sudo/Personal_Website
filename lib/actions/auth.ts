"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

// --- Sinkronisasi user Supabase ke tabel `User` di database sendiri ---
// Sesuaikan nama field (name, email, dst) dengan schema.prisma kamu.
export async function syncUserToDatabase(email: string, name?: string | null) {
  return prisma.user.upsert({
    where: { email },
    update: {
      // Update field yang mungkin berubah, misal nama dari Google
      ...(name ? { name } : {}),
    },
    create: {
      email,
      name: name ?? email.split("@")[0],
    },
  });
}

// --- Login dengan Google (OAuth) ---
export async function signInWithGoogle() {
  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    return { url: data.url };
  }

  return { error: "Gagal mendapatkan URL authentikasi Google." };
}

// --- Login dengan GitHub (OAuth) ---
export async function signInWithGithub() {
  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
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

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
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

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name }, // disimpan di user_metadata Supabase
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
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

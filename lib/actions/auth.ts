"use server";

import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/client";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

function formatAuthError(errorMsg: string): string {
  const lower = errorMsg.toLowerCase();
  if (
    lower.includes("invalid api key") ||
    lower.includes("invalid_api_key")
  ) {
    return "API Key Supabase (NEXT_PUBLIC_SUPABASE_ANON_KEY) tidak valid atau belum di-set di Dashboard Vercel.";
  }
  if (
    lower.includes("invalid login credentials") ||
    lower.includes("invalid_credentials") ||
    lower.includes("wrong password")
  ) {
    return "Email atau password yang Anda masukkan salah. Silakan periksa kembali.";
  }
  if (lower.includes("email not confirmed")) {
    return "Email Anda belum dikonfirmasi. Silakan periksa inbox email Anda.";
  }
  if (lower.includes("user not found")) {
    return "Akun dengan email ini tidak ditemukan.";
  }
  return errorMsg;
}

import { revalidatePath } from "next/cache";

export async function checkIsAdmin(email?: string | null): Promise<boolean> {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase().trim();

  const envAdminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (normalizedEmail === "brimaspradika8@gmail.com") {
    return true;
  }

  if (envAdminEmails.length > 0 && envAdminEmails.includes(normalizedEmail)) {
    return true;
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { role: true },
    });
    if (dbUser && dbUser.role === "ADMIN") {
      return true;
    }
  } catch {}

  return false;
}

// --- Sinkronisasi user Supabase ke tabel `User` di database sendiri ---
// Sesuaikan nama field (name, email, dst) dengan schema.prisma kamu.
export async function syncUserToDatabase(
  email: string,
  name?: string | null,
  avatar?: string | null
) {
  try {
    const isAdmin = await checkIsAdmin(email);
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, avatar: true, role: true },
    });

    if (!existingUser) {
      // First-time signup / first login: save default in DB with ADMIN or USER role
      return await prisma.user.create({
        data: {
          email,
          name: name ?? email.split("@")[0],
          avatar: avatar ?? null,
          role: isAdmin ? "ADMIN" : "USER",
        },
      });
    }

    const shouldUpdateAvatar = !existingUser.avatar && Boolean(avatar);
    const shouldUpdateName = !existingUser.name && Boolean(name);
    const shouldUpdateRole = isAdmin && existingUser.role !== "ADMIN";

    if (shouldUpdateAvatar || shouldUpdateName || shouldUpdateRole) {
      return await prisma.user.update({
        where: { email },
        data: {
          ...(shouldUpdateName && name ? { name } : {}),
          ...(shouldUpdateAvatar && avatar ? { avatar } : {}),
          ...(shouldUpdateRole ? { role: "ADMIN" } : {}),
        },
      });
    }

    return existingUser;
  } catch (err) {
    console.error("Failed to sync user to database:", err);
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
  try {
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
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) {
      return { error: formatAuthError(error.message) };
    }

    if (data.url) {
      return { url: data.url };
    }

    return { error: "Gagal mendapatkan URL autentikasi Google." };
  } catch (err: any) {
    console.error("Error during signInWithGoogle:", err);
    return { error: formatAuthError(err?.message || "Gagal melakukan autentikasi Google.") };
  }
}

// --- Login dengan GitHub (OAuth) ---
export async function signInWithGithub() {
  try {
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

    return { error: "Gagal mendapatkan URL autentikasi GitHub." };
  } catch (err: any) {
    console.error("Error during signInWithGithub:", err);
    return { error: formatAuthError(err?.message || "Gagal melakukan autentikasi GitHub.") };
  }
}

// --- Login manual (email + password) ---
export async function signInWithPassword(formData: FormData) {
  try {
    const email = (formData.get("email") as string || "").trim();
    const password = (formData.get("password") as string || "").trim();

    if (!email || !password) {
      return { error: "Email dan password wajib diisi." };
    }

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

    let targetPath = "/dashboard";
    if (data.user?.email) {
      await syncUserToDatabase(
        data.user.email,
        data.user.user_metadata?.full_name,
        data.user.user_metadata?.avatar_url
      );

      const isAdmin = await checkIsAdmin(data.user.email);
      targetPath = isAdmin ? "/admin" : "/dashboard";
    }

    revalidatePath("/dashboard");
    revalidatePath("/admin");
    revalidatePath("/profile");
    revalidatePath("/", "layout");

    return { success: true, targetPath };
  } catch (err: any) {
    console.error("Error during signInWithPassword:", err);
    return { error: formatAuthError(err?.message || "Gagal melakukan proses masuk.") };
  }
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
  revalidatePath("/", "layout");
  redirect("/login");
}

// --- Update Profile (Nama & Avatar) ---
export async function updateUserProfile(name: string, avatarUrl?: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Harus login terlebih dahulu untuk mengubah profil." };
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: name,
      name: name,
      ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (user.email) {
    await syncUserToDatabase(user.email, name, avatarUrl);
  }

  revalidatePath("/dashboard");
  revalidatePath("/profile");

  return { success: true };
}

// --- Upload Avatar File ke Supabase Storage & Database ---
export async function uploadAvatarFile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Harus login terlebih dahulu untuk mengunggah foto profil." };
  }

  const file = formData.get("avatarFile") as File | null;
  if (!file || file.size === 0) {
    return { error: "Silakan pilih file gambar avatar terlebih dahulu." };
  }

  if (!file.type.startsWith("image/")) {
    return { error: "File harus berupa format gambar (JPG, PNG, WEBP, SVG, GIF)." };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: "Ukuran file terlalu besar. Maksimal 5MB." };
  }

  try {
    const fileExt = file.name.split(".").pop() || "png";
    const sanitizedExt = fileExt.replace(/[^a-zA-Z0-9]/g, "");
    const fileName = `${user.id}/${Date.now()}.${sanitizedExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    let { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.warn("Upload to 'avatars' bucket failed, attempting fallback:", uploadError.message);

      if (
        uploadError.message.includes("Bucket not found") ||
        uploadError.message.includes("not_found") ||
        uploadError.message.includes("does not exist")
      ) {
        const { error: createBucketError } = await supabase.storage.createBucket("avatars", {
          public: true,
        });

        if (!createBucketError) {
          const { error: retryError } = await supabase.storage
            .from("avatars")
            .upload(fileName, fileBuffer, {
              contentType: file.type,
              upsert: true,
            });

          if (retryError) {
            return { error: `Gagal mengunggah foto ke Storage: ${retryError.message}` };
          }
        } else {
          return { error: "Bucket Storage 'avatars' belum ada di Supabase. Silakan buat bucket 'avatars' di Supabase Dashboard -> Storage." };
        }
      } else {
        return { error: `Gagal mengunggah foto ke Supabase Storage: ${uploadError.message}` };
      }
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName, {
        transform: {
          width: 250,
          quality: 80,
        },
      });

    const publicUrl = publicUrlData?.publicUrl;

    if (!publicUrl) {
      return { error: "Gagal mendapatkan Public URL foto profil dari Supabase Storage." };
    }

    const currentName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "User";

    const updateRes = await updateUserProfile(currentName, publicUrl);

    if (updateRes.error) {
      return { error: updateRes.error };
    }

    return { success: true, avatarUrl: publicUrl };
  } catch (err: any) {
    console.error("Unexpected error in uploadAvatarFile:", err);
    return { error: err?.message || "Terjadi kesalahan saat mengunggah foto profil." };
  }
}

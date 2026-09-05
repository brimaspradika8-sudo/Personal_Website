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

import { revalidatePath } from "next/cache";

// --- Sinkronisasi user Supabase ke tabel `User` di database sendiri ---
// Sesuaikan nama field (name, email, dst) dengan schema.prisma kamu.
export async function syncUserToDatabase(
  email: string,
  name?: string | null,
  avatar?: string | null
) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, avatar: true },
    });

    if (!existingUser) {
      // First-time signup / first login with Google: save Google avatar ONCE as default in DB
      return await prisma.user.create({
        data: {
          email,
          name: name ?? email.split("@")[0],
          avatar: avatar ?? null,
        },
      });
    }

    // Existing user: ONLY update avatar if existingUser.avatar is currently empty/null.
    // Once user sets their own photo in DB, Google OAuth MUST NOT override it!
    const shouldUpdateAvatar = !existingUser.avatar && Boolean(avatar);
    const shouldUpdateName = !existingUser.name && Boolean(name);

    if (shouldUpdateAvatar || shouldUpdateName) {
      return await prisma.user.update({
        where: { email },
        data: {
          ...(shouldUpdateName && name ? { name } : {}),
          ...(shouldUpdateAvatar && avatar ? { avatar } : {}),
        },
      });
    }

    return existingUser;
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
      data.user.user_metadata?.full_name,
      data.user.user_metadata?.avatar_url
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

"use server";

import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/client";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { checkRateLimit, RATE_LIMIT_PRESETS } from "@/lib/security/rate-limit";
import { stripHtml } from "@/lib/security/sanitize";
import { cleanText, normalizeEmail, validatePassword } from "@/lib/security/validation";

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
  if (lower.includes("email not confirmed") || lower.includes("email_not_confirmed")) {
    return "Konfirmasi email masih aktif di Supabase. Matikan Authentication > Providers > Email > Confirm email, lalu coba masuk lagi.";
  }
  if (lower.includes("user not found")) {
    return "Akun dengan email ini tidak ditemukan.";
  }
  return errorMsg;
}

import { revalidatePath } from "next/cache";
import { cache } from "react";
import { getAuthenticatedUser } from "@/lib/auth/get-user";

const checkIsAdminMemoized = cache(async (email?: string | null, userRole?: string | null): Promise<boolean> => {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Cek langsung jika userRole sudah didapat dari kueri dbUser sebelumnya
  if (userRole === "ADMIN") {
    return true;
  }

  // 2. Cek email Admin dari environment variable atau superadmin email
  const envAdminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (envAdminEmails.length > 0 && envAdminEmails.includes(normalizedEmail)) {
    return true;
  }

  if (normalizedEmail === "brimaspradika8@gmail.com") {
    return true;
  }

  // 3. Jika userRole sudah disuplai dan bernilai bukan "ADMIN", hindari kueri Prisma tambahan
  if (userRole !== undefined && userRole !== null) {
    return false;
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
});

export async function checkIsAdmin(email?: string | null, userRole?: string | null): Promise<boolean> {
  return checkIsAdminMemoized(email, userRole);
}

export async function checkIsOwner(email?: string | null, userRole?: string | null): Promise<boolean> {
  return checkIsAdmin(email, userRole);
}

export async function updateUserRole(userId: string, role: "ADMIN" | "USER") {
  try {
    const currentUser = await getAuthenticatedUser();
    const currentEmail = currentUser?.email?.toLowerCase().trim();

    if (!currentEmail) {
      return { error: "Sesi Anda tidak valid. Silakan login ulang." };
    }

    const isAdmin = await checkIsAdmin(currentEmail);
    if (!isAdmin) {
      return { error: "Anda tidak memiliki izin untuk mengubah role user." };
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true },
    });

    if (!targetUser) {
      return { error: "User yang dipilih tidak ditemukan." };
    }

    if (targetUser.email.toLowerCase() === currentEmail && role === "USER") {
      return { error: "Role admin Anda tidak dapat diubah menjadi user." };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, role: true },
    });

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath("/", "layout");

    return { success: true, user: updatedUser };
  } catch (err) {
    console.error("Failed to update user role:", err);
    return { error: "Gagal mengubah role pengguna. Silakan coba lagi." };
  }
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
  } catch (err: unknown) {
    console.error("Error during signInWithGoogle:", err);
    return { error: formatAuthError((err as Error)?.message || "Gagal melakukan autentikasi Google.") };
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
  } catch (err: unknown) {
    console.error("Error during signInWithGithub:", err);
    return { error: formatAuthError((err as Error)?.message || "Gagal melakukan autentikasi GitHub.") };
  }
}

// --- Login manual (email + password) ---
export async function signInWithPassword(formData: FormData) {
  try {
    const email = normalizeEmail(formData.get("email"));
    const password = (formData.get("password") as string || "").trim();

    if (!email || !password) {
      return { error: "Email valid dan password wajib diisi." };
    }

    // Rate Limiting Guard
    const rateLimit = checkRateLimit(`login:${email}`, RATE_LIMIT_PRESETS.AUTH_LOGIN.limit, RATE_LIMIT_PRESETS.AUTH_LOGIN.windowMs);
    if (!rateLimit.success) {
      const waitSeconds = Math.ceil(rateLimit.resetMs / 1000);
      return { error: `Terlalu banyak percakapan masuk. Silakan tunggu ${waitSeconds} detik sebelum mencoba lagi.` };
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
  } catch (err: unknown) {
    console.error("Error during signInWithPassword:", err);
    return { error: formatAuthError((err as Error)?.message || "Gagal melakukan proses masuk.") };
  }
}

// --- Register manual (nama, email, password) ---
export async function signUpWithPassword(formData: FormData) {
  const rawName = cleanText(formData.get("name"), 80);
  const name = rawName.value;
  const email = normalizeEmail(formData.get("email"));
  const password = (formData.get("password") as string || "").trim();

  if (rawName.error) {
    return { error: rawName.error };
  }

  if (!email || !password || !name) {
    return { error: "Nama, email valid, dan password wajib diisi." };
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return { error: passwordError };
  }

  // Rate Limiting Guard
  const rateLimit = checkRateLimit(`signup:${email}`, RATE_LIMIT_PRESETS.AUTH_SIGNUP.limit, RATE_LIMIT_PRESETS.AUTH_SIGNUP.windowMs);
  if (!rateLimit.success) {
    const waitSeconds = Math.ceil(rateLimit.resetMs / 1000);
    return { error: `Terlalu banyak pendaftaran dari email ini. Silakan tunggu ${waitSeconds} detik.` };
  }

  const { isConfigured } = getSupabaseEnv();
  if (!isConfigured) {
    return { error: "API Key Supabase (NEXT_PUBLIC_SUPABASE_ANON_KEY) belum di-set di Dashboard Vercel." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name }, // disimpan di user_metadata Supabase
    },
  });

  if (error) {
    return { error: formatAuthError(error.message) };
  }

  if (data.user?.email) {
    await syncUserToDatabase(data.user.email, name);
  }

  if (!data.session) {
    return {
      error: "Pendaftaran berhasil, tetapi konfirmasi email masih aktif. Matikan Confirm email di Supabase Auth agar bisa langsung masuk.",
    };
  }

  const isAdmin = await checkIsAdmin(data.user?.email);
  revalidatePath("/dashboard");
  revalidatePath("/", "layout");
  return { success: true, targetPath: isAdmin ? "/admin" : "/dashboard" };
}

// --- Logout ---
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

// --- Send Forgot Password OTP to Email ---
export async function sendForgotPasswordOtp(email: string) {
  try {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
      return { error: "Silakan masukkan alamat email yang valid." };
    }

    // Rate Limiting Guard for OTP Request
    const rateLimit = checkRateLimit(`otp:${normalizedEmail}`, RATE_LIMIT_PRESETS.AUTH_OTP.limit, RATE_LIMIT_PRESETS.AUTH_OTP.windowMs);
    if (!rateLimit.success) {
      const waitSeconds = Math.ceil(rateLimit.resetMs / 1000);
      return { error: `Permintaan OTP terlalu sering. Silakan tunggu ${waitSeconds} detik sebelum meminta lagi.` };
    }

    const { isConfigured } = getSupabaseEnv();
    if (!isConfigured) {
      return { error: "API Key Supabase (NEXT_PUBLIC_SUPABASE_ANON_KEY) belum di-set di Dashboard Vercel." };
    }

    // Validasi apakah email sudah terdaftar di database kita
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, email: true },
    });

    if (!existingUser) {
      return { error: "Email ini tidak terdaftar di sistem kami. Silakan periksa kembali atau daftar akun baru." };
    }

    const supabase = await createClient();

    // Mengirimkan kode OTP / link reset password dari Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail);

    if (error) {
      return { error: formatAuthError(error.message) };
    }

    return { success: true, email: normalizedEmail };
  } catch (err: unknown) {
    console.error("Error sending forgot password OTP:", err);
    return { error: (err as Error)?.message || "Gagal mengirimkan kode OTP reset password." };
  }
}

// --- Verify OTP Token Only (Step 2) ---
export async function verifyOtpOnly(email: string, token: string) {
  try {
    const normalizedEmail = normalizeEmail(email);
    const sanitizedToken = token.trim();

    if (!normalizedEmail || !sanitizedToken) {
      return { error: "Email dan kode OTP 6-digit wajib diisi." };
    }

    const { isConfigured } = getSupabaseEnv();
    if (!isConfigured) {
      return { error: "API Key Supabase (NEXT_PUBLIC_SUPABASE_ANON_KEY) belum di-set di Dashboard Vercel." };
    }

    const supabase = await createClient();

    let verifyRes = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token: sanitizedToken,
      type: "recovery",
    });

    if (verifyRes.error) {
      verifyRes = await supabase.auth.verifyOtp({
        email: normalizedEmail,
        token: sanitizedToken,
        type: "email",
      });
    }

    if (verifyRes.error) {
      return { error: "Kode OTP tidak valid atau sudah kadaluarsa. Silakan periksa kembali email Anda." };
    }

    return { success: true };
  } catch (err: unknown) {
    console.error("Error verifying OTP only:", err);
    return { error: (err as Error)?.message || "Gagal memverifikasi kode OTP." };
  }
}

// --- Update Password After OTP Verified (Step 3) ---
export async function updatePasswordWithSession(newPassword: string) {
  try {
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return { error: passwordError };
    }

    const supabase = await createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return { error: formatAuthError(updateError.message) };
    }

    revalidatePath("/dashboard");
    revalidatePath("/profile");

    return { success: true };
  } catch (err: unknown) {
    console.error("Error updating password:", err);
    return { error: (err as Error)?.message || "Gagal memperbarui kata sandi." };
  }
}

// --- Verify OTP Token & Reset Password (Combined Fallback) ---
export async function verifyOtpAndResetPassword(email: string, token: string, newPassword: string) {
  try {
    const normalizedEmail = normalizeEmail(email);
    const sanitizedToken = token.trim();

    if (!normalizedEmail || !sanitizedToken || !newPassword) {
      return { error: "Email, kode OTP 6-digit, dan kata sandi baru wajib diisi." };
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return { error: passwordError };
    }

    const { isConfigured } = getSupabaseEnv();
    if (!isConfigured) {
      return { error: "API Key Supabase (NEXT_PUBLIC_SUPABASE_ANON_KEY) belum di-set di Dashboard Vercel." };
    }

    const supabase = await createClient();

    let verifyRes = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token: sanitizedToken,
      type: "recovery",
    });

    if (verifyRes.error) {
      verifyRes = await supabase.auth.verifyOtp({
        email: normalizedEmail,
        token: sanitizedToken,
        type: "email",
      });
    }

    if (verifyRes.error) {
      return { error: "Kode OTP tidak valid atau sudah kadaluarsa. Silakan periksa email Anda atau minta kode baru." };
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return { error: formatAuthError(updateError.message) };
    }

    revalidatePath("/dashboard");
    revalidatePath("/profile");

    return { success: true };
  } catch (err: unknown) {
    console.error("Error verifying OTP and resetting password:", err);
    return { error: (err as Error)?.message || "Gagal memperbarui kata sandi." };
  }
}

// --- End of Auth Server Actions ---


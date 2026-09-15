"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { uploadFileToSupabaseStorage } from "@/lib/supabase/storage";
import { checkIsAdmin } from "./auth";

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: "ADMIN" | "USER";
  created_at: string;
}

// 1. Ambil Profil User Terautentikasi (Current User Profile)
export async function getCurrentUserProfile(): Promise<UserProfileData | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) return null;

  try {
    const isAdmin = await checkIsAdmin(user.email);
    let dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split("@")[0],
          avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
          role: isAdmin ? "ADMIN" : "USER",
        },
      });
    }

    return {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      avatar: dbUser.avatar,
      role: dbUser.role as "ADMIN" | "USER",
      created_at: dbUser.created_at.toISOString(),
    };
  } catch (err) {
    console.error("getCurrentUserProfile error:", err);
    return null;
  }
}

// 2. Upload Avatar Profil Pengguna
export async function uploadUserAvatar(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Harus login terlebih dahulu untuk mengunggah avatar." };
  }

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { error: "File gambar tidak ditemukan." };
  }

  if (!file.type.startsWith("image/")) {
    return { error: "File harus berupa format gambar (JPG, PNG, WEBP, SVG)." };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: "Ukuran gambar avatar maksimal 5MB." };
  }

  try {
    const res = await uploadFileToSupabaseStorage({ file, folder: "user-avatars" });
    return res;
  } catch (err: unknown) {
    return { error: (err as Error)?.message || "Gagal mengunggah avatar pengguna." };
  }
}

// 3. Perbarui Data Profil (Nama & Avatar)
export async function updateUserProfile(data: {
  name: string;
  avatar?: string;
}) {
  if (!data.name || data.name.trim().length === 0) {
    return { error: "Nama tidak boleh kosong." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { error: "Silakan login terlebih dahulu untuk memperbarui profil." };
  }

  try {
    const newName = data.name.trim();
    const newAvatar = data.avatar !== undefined ? data.avatar.trim() || null : undefined;

    // 1. Update Supabase Auth User Metadata
    await supabase.auth.updateUser({
      data: {
        full_name: newName,
        name: newName,
        ...(newAvatar !== undefined ? { avatar_url: newAvatar } : {}),
      },
    });

    // 2. Update Database Prisma User Record
    const dbUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: newName,
        ...(newAvatar !== undefined ? { avatar: newAvatar } : {}),
      },
      create: {
        email: user.email,
        name: newName,
        avatar: newAvatar || null,
      },
    });

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    return {
      success: true,
      profile: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        avatar: dbUser.avatar,
        role: dbUser.role as "ADMIN" | "USER",
        created_at: dbUser.created_at.toISOString(),
      },
    };
  } catch (err: unknown) {
    console.error("updateUserProfile error:", err);
    return { error: (err as Error)?.message || "Gagal memperbarui profil pengguna." };
  }
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { syncUserToDatabase } from "@/lib/actions/auth";
import { revalidatePath } from "next/cache";

/**
 * Server Action: Update Profile Name & Avatar URL
 */
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

/**
 * Server Action: Upload Avatar Picture File to Supabase Storage
 */
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

    const { error: uploadError } = await supabase.storage
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
  } catch (err: unknown) {
    console.error("Unexpected error in uploadAvatarFile:", err);
    return { error: (err as Error)?.message || "Terjadi kesalahan saat mengunggah foto profil." };
  }
}

/**
 * Server Action: Upload Custom Cover Banner File to Supabase Storage
 */
export async function uploadBannerFile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Harus login terlebih dahulu untuk mengunggah banner profil." };
  }

  const file = formData.get("bannerFile") as File | null;
  if (!file || file.size === 0) {
    return { error: "Silakan pilih file gambar banner terlebih dahulu." };
  }

  if (!file.type.startsWith("image/")) {
    return { error: "File harus berupa format gambar (JPG, PNG, WEBP, SVG, GIF)." };
  }

  if (file.size > 8 * 1024 * 1024) {
    return { error: "Ukuran file terlalu besar. Maksimal 8MB." };
  }

  try {
    const fileExt = file.name.split(".").pop() || "png";
    const sanitizedExt = fileExt.replace(/[^a-zA-Z0-9]/g, "");
    const fileName = `banners/${user.id}/${Date.now()}.${sanitizedExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return { error: `Gagal mengunggah banner: ${uploadError.message}` };
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData?.publicUrl;

    if (!publicUrl) {
      return { error: "Gagal mendapatkan URL publik gambar banner." };
    }

    const { error: updateErr } = await supabase.auth.updateUser({
      data: {
        banner_url: publicUrl,
      },
    });

    if (updateErr) {
      return { error: updateErr.message };
    }

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return { success: true, bannerUrl: publicUrl };
  } catch (err: unknown) {
    console.error("Unexpected error in uploadBannerFile:", err);
    return { error: (err as Error)?.message || "Terjadi kesalahan saat mengunggah banner profil." };
  }
}

/**
 * Server Action: Update Preset Cover Banner Theme Gradient
 */
export async function updateBannerPreset(bannerUrl: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Harus login terlebih dahulu untuk mengubah banner." };
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      banner_url: bannerUrl,
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return { success: true };
}

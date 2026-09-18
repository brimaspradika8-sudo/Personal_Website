import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";

/**
 * Mendapatkan data user terautentikasi tanpa membuat network request sekuensial ulang ke Supabase.
 * Pertama membaca dari Request Headers yang diset oleh Middleware. Jika tidak ada, fallback ke supabase.auth.getUser().
 */
export async function getAuthenticatedUser(): Promise<User | null> {
  try {
    const headerList = await headers();
    const userId = headerList.get("x-user-id");
    const userEmail = headerList.get("x-user-email");
    const userMetadataRaw = headerList.get("x-user-metadata");

    if (userId && userEmail) {
      let userMetadata: Record<string, any> = {};
      if (userMetadataRaw) {
        try {
          userMetadata = JSON.parse(decodeURIComponent(userMetadataRaw));
        } catch {
          // Ignore JSON parse error
        }
      }

      return {
        id: userId,
        email: userEmail,
        user_metadata: userMetadata,
        app_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as User;
    }
  } catch {
    // Ignore headers reading error
  }

  // Fallback: Panggil Supabase Auth jika header tidak tersedia
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data?.user ?? null;
  } catch {
    return null;
  }
}

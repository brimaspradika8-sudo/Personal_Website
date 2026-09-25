import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "./client";

export async function createClient() {
  const cookieStore = await cookies();
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookieOptions: {
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              const isAuthCookie = name.startsWith("sb-") || name.includes("auth-token");
              cookieStore.set(name, value, {
                ...options,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                httpOnly: isAuthCookie ? true : options?.httpOnly ?? true,
              });
            });
          } catch {
            // Diabaikan jika dipanggil dari Server Component (tanpa akses write cookie).
            // Proxy/Middleware di bawah yang akan menangani refresh session.
          }
        },
      },
    }
  );
}


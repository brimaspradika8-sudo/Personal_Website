import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "./client";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },

          setAll(cookiesToSet) {
            // PENTING: Tulis cookies ke request DAN ke response agar sesi
            // selalu ter-refresh dan tidak pernah membaca token lama.
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );

            supabaseResponse = NextResponse.next({ request });

            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Refresh user session from Supabase Auth server per-request.
    // Allow unauthenticated visitors to view public routes like /dashboard freely.
    const { data: { user } } = await supabase.auth.getUser();

  } catch (err) {
    console.error(
      "Middleware Supabase Session Error:",
      err
    );
  }

  return supabaseResponse;
}
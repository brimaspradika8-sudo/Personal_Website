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

    // KRITIK: Panggil getUser() (bukan getSession()) untuk memvalidasi token
    // dengan Supabase Auth server secara langsung setiap request.
    // getSession() hanya membaca JWT lokal tanpa verifikasi ke server →
    // bisa mengembalikan sesi user lain yang tokennya belum expired!
    const { data: { user } } = await supabase.auth.getUser();

    // Proteksi route /dashboard: redirect ke /login jika tidak ada sesi aktif.
    const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
    if (isDashboardRoute && !user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
      // Buat response redirect yang MEMBAWA cookies sesi terbaru,
      // supaya cookie lama ikut ter-clear dari browser.
      const redirectResponse = NextResponse.redirect(loginUrl);
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, { path: "/" });
      });
      return redirectResponse;
    }
  } catch (err) {
    console.error(
      "Middleware Supabase Session Error:",
      err
    );
  }

  return supabaseResponse;
}
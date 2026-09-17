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

    const pathname = request.nextUrl.pathname;
    const isAdminRoute = pathname.startsWith("/admin");
    const isOwnerAdminOnlyRoute = pathname === "/admin" || pathname.startsWith("/admin/projects") || pathname.startsWith("/admin/users");

    // Fast-path: jika tidak ada cookie Supabase Auth dan bukan route /admin, hindari panggilan HTTP getUser()
    const hasAuthCookie = request.cookies.getAll().some((c) => c.name.startsWith("sb-") || c.name.includes("auth-token"));

    if (!hasAuthCookie && !isAdminRoute) {
      return supabaseResponse;
    }

    // Refresh user session from Supabase Auth server per-request.
    const { data: { user } } = await supabase.auth.getUser();

    if (isAdminRoute) {
      if (!user || !user.email) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirectedFrom", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Khusus route super-admin (seperti /admin overview & /admin/projects) hanya untuk Admin utama
      if (isOwnerAdminOnlyRoute) {
        const userEmail = user.email.toLowerCase().trim();
        const ownerEmail = (process.env.OWNER_EMAIL || "").trim().toLowerCase();
        const adminEmails = (process.env.ADMIN_EMAILS || "")
          .split(",")
          .map((e) => e.trim().toLowerCase())
          .filter(Boolean);

        const isOwnerOrAdmin =
          (ownerEmail && userEmail === ownerEmail) ||
          adminEmails.includes(userEmail) ||
          userEmail === "brimaspradika8@gmail.com";

        if (!isOwnerOrAdmin) {
          const dashboardUrl = new URL("/dashboard", request.url);
          return NextResponse.redirect(dashboardUrl);
        }
      }
    }

    // Teruskan data user yang tervalidasi via Request Headers untuk menghindari duplikasi getUser() di Server Components
    if (user && user.email) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", user.id);
      requestHeaders.set("x-user-email", user.email);
      requestHeaders.set(
        "x-user-name",
        encodeURIComponent(user.user_metadata?.full_name || user.user_metadata?.name || "")
      );
      requestHeaders.set(
        "x-user-avatar",
        encodeURIComponent(user.user_metadata?.avatar_url || user.user_metadata?.picture || "")
      );

      const nextResponse = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      // Salin cookies jika ada pembaruan token dari Supabase Client
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        nextResponse.cookies.set(cookie);
      });

      return nextResponse;
    }

  } catch (err) {
    console.error(
      "Middleware Supabase Session Error:",
      err
    );
  }

  return supabaseResponse;
}
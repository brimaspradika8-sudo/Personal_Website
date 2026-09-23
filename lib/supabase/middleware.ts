import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "./client";
import { generateCsrfToken, CSRF_COOKIE_NAME } from "../security/csrf";

export async function updateSession(request: NextRequest) {
  // 1. Validation CSRF Origin untuk request mutasi (POST, PUT, PATCH, DELETE)
  const method = request.method.toUpperCase();
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const secFetchSite = request.headers.get("sec-fetch-site");
    if (secFetchSite === "cross-site") {
      console.warn("[Fetch Metadata] Cross-site mutation blocked.");
      return new NextResponse(
        JSON.stringify({ error: "Permintaan lintas situs ditolak." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const origin = request.headers.get("origin");
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");

    if (origin && host) {
      try {
        const originHost = new URL(origin).host.toLowerCase().trim();
        const serverHost = host.toLowerCase().trim();

        if (originHost !== serverHost) {
          console.warn(`[CSRF Protection] Mismatched Origin blocked: ${originHost} !== ${serverHost}`);
          return new NextResponse(
            JSON.stringify({ error: "Permintaan ditolak. Origin CSRF tidak cocok." }),
            { status: 403, headers: { "Content-Type": "application/json" } }
          );
        }
      } catch (err) {
        console.warn("[CSRF Protection] Malformed origin header:", err);
      }
    }
  }

  // Anti-spoofing: Hapus header x-user-* jika ada di request awal dari client
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("x-user-id");
  requestHeaders.delete("x-user-email");
  requestHeaders.delete("x-user-metadata");

  let supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

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

            supabaseResponse = NextResponse.next({
              request: {
                headers: requestHeaders,
              },
            });

            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const pathname = request.nextUrl.pathname;
    const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/dashboard/admin");
    const isOwnerAdminOnlyRoute =
      pathname === "/admin" ||
      pathname === "/dashboard/admin" ||
      pathname.startsWith("/admin/projects") ||
      pathname.startsWith("/admin/users") ||
      pathname.startsWith("/dashboard/admin/projects");

    // Fast-path: jika tidak ada cookie Supabase Auth dan bukan route /admin, hindari panggilan HTTP getUser()
    const hasAuthCookie = request.cookies.getAll().some((c) => c.name.startsWith("sb-") || c.name.includes("auth-token"));

    if (!hasAuthCookie && !isAdminRoute) {
      return supabaseResponse;
    }

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

    // Teruskan data user ter-validasi ke Request Headers untuk Server Components
    if (user && user.email) {
      requestHeaders.set("x-user-id", user.id);
      requestHeaders.set("x-user-email", user.email);
      requestHeaders.set("x-user-metadata", encodeURIComponent(JSON.stringify(user.user_metadata ?? {})));

      const finalResponse = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      // Salin cookies jika ada pembaruan token dari Supabase Client
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        finalResponse.cookies.set(cookie);
      });

      if (!request.cookies.has(CSRF_COOKIE_NAME)) {
        finalResponse.cookies.set(CSRF_COOKIE_NAME, generateCsrfToken(), {
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          httpOnly: false, // Memungkinkan akses JS untuk Double Submit Cookie pattern
        });
      }

      return finalResponse;
    }

  } catch (err) {
    console.error(
      "Middleware Supabase Session Error:",
      err
    );
  }

  if (!request.cookies.has(CSRF_COOKIE_NAME)) {
    supabaseResponse.cookies.set(CSRF_COOKIE_NAME, generateCsrfToken(), {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: false,
    });
  }

  return supabaseResponse;
}

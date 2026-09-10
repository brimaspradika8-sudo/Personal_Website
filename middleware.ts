import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // updateSession memperbarui cookie sesi Supabase setiap request,
  // memastikan token tidak pernah basi dan selalu konsisten dengan Supabase Auth server.
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match semua request path KECUALI:
     * - _next/static (file statis)
     * - _next/image (optimisasi image)
     * - favicon.ico, manifest.json, robots.txt
     * - file publik (gambar, dll)
     * - api route auth/callback (jangan intercept flow OAuth)
     *
     * Middleware WAJIB jalan di /dashboard/** untuk memastikan
     * cookie sesi selalu fresh sebelum Server Component membaca getUser().
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.xml|images/|icons/|api/auth/).*)",
  ],
};

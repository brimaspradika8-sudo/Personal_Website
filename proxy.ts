import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match semua request path KECUALI:
     * - _next/static (file statis)
     * - _next/image (optimisasi image)
     * - favicon.ico, manifest.json, robots.txt, sitemap.xml
     * - file publik (gambar, icons, dll)
     * - api/auth/ (OAuth callback — jangan intercept)
     *
     * Middleware WAJIB jalan di /dashboard/** untuk memastikan
     * cookie sesi selalu fresh sebelum Server Component membaca getUser().
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.xml|images/|icons/|api/auth/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

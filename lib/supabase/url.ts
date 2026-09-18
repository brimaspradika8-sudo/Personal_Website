/**
 * Memastikan URL Supabase Storage berstatus public dengan menyisipkan '/public/' jika belum ada,
 * untuk mencegah error 400 Bad Request saat browser memuat gambar/video.
 */
export function ensurePublicSupabaseUrl(url: string): string {
  if (!url) return url;
  if (url.includes("/storage/v1/object/") && !url.includes("/storage/v1/object/public/")) {
    return url.replace("/storage/v1/object/", "/storage/v1/object/public/");
  }
  return url;
}

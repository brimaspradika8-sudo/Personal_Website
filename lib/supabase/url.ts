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

/**
 * Parsing data thumbnail (baik berupa string URL tunggal maupun JSON array string)
 * menjadi array of URL yang valid dan dipastikan publik.
 */
export function parseThumbnailUrls(thumbnail: string | null | undefined): string[] {
  if (!thumbnail) return [];
  if (thumbnail.startsWith("[")) {
    try {
      const parsed = JSON.parse(thumbnail);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((u: string) => ensurePublicSupabaseUrl(u));
      }
    } catch {}
  }
  return [ensurePublicSupabaseUrl(thumbnail)];
}

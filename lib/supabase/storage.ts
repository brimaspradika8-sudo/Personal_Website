import { createClient } from "./server";

/**
 * Membaca nama Supabase Storage Bucket dari Environment Variable (.env)
 * dengan fallback default jika env belum di-set.
 */
export function getStorageBucketConfig() {
  const articleBucket =
    process.env.SUPABASE_BUCKET ||
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
    "articles";
  const avatarBucket =
    process.env.NEXT_PUBLIC_SUPABASE_AVATARS_BUCKET || "avatars";

  return { articleBucket, avatarBucket };
}

interface UploadFileOptions {
  file: File;
  bucketName?: string;
  folder?: string;
}

/**
 * Modul Helper Terintegrasi: Mengunggah file ke Supabase Storage Bucket
 * berdasarkan variabel environment (ENV) yang telah dikonfigurasi.
 */
export async function uploadFileToSupabaseStorage({
  file,
  bucketName,
  folder = "article-images",
}: UploadFileOptions) {
  const { articleBucket } = getStorageBucketConfig();

  // Gunakan bucket khusus atau fallback ke variabel env NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET
  const targetBucket = bucketName || articleBucket;

  const fileExt = file.name.split(".").pop() || "png";
  const sanitizedExt = fileExt.replace(/[^a-zA-Z0-9]/g, "");
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${sanitizedExt}`;

  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);

  let supabase = await createClient();

  // Jika terdapat SUPABASE_SERVICE_ROLE_KEY di .env, gunakan Service Role Client untuk bypass RLS di Server Action
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;

  if (serviceKey && serviceKey.includes("service_role") && supabaseUrl) {
    const { createClient: createSupabaseJsClient } = await import("@supabase/supabase-js");
    supabase = createSupabaseJsClient(supabaseUrl, serviceKey) as unknown as typeof supabase;
  }

  // Upload file ke Supabase Storage Bucket
  const { error: uploadError } = await supabase.storage
    .from(targetBucket)
    .upload(fileName, fileBuffer, {
      contentType: file.type,
      upsert: true,
    });

  // Penanganan otomatis jika bucket belum ada di Supabase
  if (
    uploadError &&
    (uploadError.message.includes("Bucket not found") ||
      uploadError.message.includes("not_found") ||
      uploadError.message.includes("does not exist"))
  ) {
    const { error: createError } = await supabase.storage.createBucket(
      targetBucket,
      { public: true }
    );

    if (!createError) {
      const { error: retryError } = await supabase.storage
        .from(targetBucket)
        .upload(fileName, fileBuffer, {
          contentType: file.type,
          upsert: true,
        });

      if (retryError) {
        return { error: `Gagal mengunggah file: ${retryError.message}` };
      }
    } else {
      return {
        error: `Bucket Storage '${targetBucket}' belum ada. Silakan buat bucket '${targetBucket}' berstatus Public di Dashboard Supabase Storage.`,
      };
    }
  } else if (uploadError) {
    if (uploadError.message.includes("row-level security")) {
      return {
        error: `Gagal upload karena izin RLS Supabase Storage. Silakan jalankan Policy SQL atau izinkan akses INSERT di Dashboard Supabase Storage > Policies.`,
      };
    }
    return { error: `Gagal mengunggah ke Supabase Storage: ${uploadError.message}` };
  }

  // Ambil Public URL gambar dari Supabase Storage
  const { data: publicUrlData } = supabase.storage
    .from(targetBucket)
    .getPublicUrl(fileName);

  if (!publicUrlData?.publicUrl) {
    return { error: "Gagal mendapatkan Public URL gambar dari Supabase Storage." };
  }

  return {
    success: true,
    url: publicUrlData.publicUrl,
    bucket: targetBucket,
    path: fileName,
  };
}

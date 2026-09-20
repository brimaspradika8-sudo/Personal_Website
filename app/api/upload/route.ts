import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStorageBucketConfig, ensurePublicSupabaseUrl } from "@/lib/supabase/storage";
import { getAuthenticatedUser } from "@/lib/auth/get-user";
import { checkIsAdmin } from "@/lib/actions/auth";
import { checkRateLimit, RATE_LIMIT_PRESETS } from "@/lib/security/rate-limit";
import sharp from "sharp";

/**
 * API ROUTE ENDPOINT: POST /api/upload
 * Menerima unggahan file dari client/frontend, mengonversi gambar ke WebP secara otomatis,
 * mengunggah ke Supabase Storage, dan mengembalikan JSON respons yang valid.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user via fast header auth
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const isAdmin = await checkIsAdmin(user.email);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya Admin yang dapat mengunggah berkas media." },
        { status: 403 }
      );
    }

    // Rate Limiting Guard for Uploads
    const rateLimit = checkRateLimit(`upload:${user.id}`, RATE_LIMIT_PRESETS.API_UPLOAD.limit, RATE_LIMIT_PRESETS.API_UPLOAD.windowMs);
    if (!rateLimit.success) {
      const waitSeconds = Math.ceil(rateLimit.resetMs / 1000);
      return NextResponse.json(
        { error: `Terlalu banyak unggahan file. Silakan tunggu ${waitSeconds} detik.` },
        { status: 429 }
      );
    }

    // 2. Extract file from FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "project-media";

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: "File media tidak ditemukan." },
        { status: 400 }
      );
    }

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    const isGif = file.type === "image/gif";
    const maxLimit = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;

    if (file.size > maxLimit) {
      return NextResponse.json(
        {
          error: `Ukuran file "${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)}MB) melebihi batas ${
            isVideo ? "video (50MB)" : "gambar/GIF (10MB)"
          }.`,
        },
        { status: 413 }
      );
    }

    // 3. Get target storage bucket
    const { articleBucket } = getStorageBucketConfig();
    const targetBucket = articleBucket;

    const arrayBuffer = await file.arrayBuffer();
    let fileBuffer = Buffer.from(arrayBuffer);
    let finalContentType = file.type || "application/octet-stream";
    let fileNameExt = file.name.split(".").pop() || (isVideo ? "mp4" : "png");

    // Convert non-GIF images to WebP for optimal compression
    if (isImage && !isGif) {
      try {
        fileBuffer = await sharp(fileBuffer).webp({ quality: 82 }).toBuffer();
        finalContentType = "image/webp";
        fileNameExt = "webp";
      } catch (convErr) {
        console.warn("Sharp WebP conversion warning:", convErr);
      }
    }

    const sanitizedExt = fileNameExt.replace(/[^a-zA-Z0-9]/g, "");
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${sanitizedExt}`;

    const supabase = await createClient();

    // 4. Upload file to Supabase Storage Bucket
    const { error: uploadError } = await supabase.storage
      .from(targetBucket)
      .upload(fileName, fileBuffer, {
        contentType: finalContentType,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: `Gagal upload ke Supabase Storage: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // 5. Generate and sanitize Public URL
    const { data: publicUrlData } = supabase.storage
      .from(targetBucket)
      .getPublicUrl(fileName);

    const finalUrl = ensurePublicSupabaseUrl(publicUrlData?.publicUrl || "");

    return NextResponse.json({
      success: true,
      url: finalUrl,
      bucket: targetBucket,
      path: fileName,
      convertedToWebp: isImage && !isGif,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan internal server.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

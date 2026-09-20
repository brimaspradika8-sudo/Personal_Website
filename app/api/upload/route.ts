import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStorageBucketConfig, ensurePublicSupabaseUrl } from "@/lib/supabase/storage";
import { getAuthenticatedUser } from "@/lib/auth/get-user";
import { checkIsAdmin } from "@/lib/actions/auth";
import { checkRateLimit, RATE_LIMIT_PRESETS } from "@/lib/security/rate-limit";
import { guardMutationRequest, getClientIp, rejectLargeRequest } from "@/lib/security/request";
import { sanitizeFileExtension, sanitizeStorageFolder, validateUploadBuffer } from "@/lib/security/file-validation";
import sharp from "sharp";
import crypto from "crypto";

const MAX_UPLOAD_PAYLOAD_BYTES = 52 * 1024 * 1024;
const ALLOWED_UPLOAD_FOLDERS = ["project-media", "article-images"];

/**
 * API ROUTE ENDPOINT: POST /api/upload
 * Menerima unggahan file dari client/frontend, mengonversi gambar ke WebP secara otomatis,
 * mengunggah ke Supabase Storage, dan mengembalikan JSON respons yang valid.
 */
export async function POST(request: NextRequest) {
  try {
    const guard = await guardMutationRequest(request);
    if (guard) return guard;

    const largeRequest = rejectLargeRequest(request, MAX_UPLOAD_PAYLOAD_BYTES);
    if (largeRequest) return largeRequest;

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
    const rateLimit = checkRateLimit(`upload:${user.id}:${getClientIp(request)}`, RATE_LIMIT_PRESETS.API_UPLOAD.limit, RATE_LIMIT_PRESETS.API_UPLOAD.windowMs);
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
    const folder = sanitizeStorageFolder((formData.get("folder") as string) || "project-media", ALLOWED_UPLOAD_FOLDERS);

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
    const validation = validateUploadBuffer(fileBuffer, file.type, true);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

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

    const sanitizedExt = sanitizeFileExtension(fileNameExt);
    const fileName = `${folder}/${crypto.randomUUID()}.${sanitizedExt}`;

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
    }, {
      headers: {
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-store",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan internal server.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

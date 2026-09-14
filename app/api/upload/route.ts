import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStorageBucketConfig } from "@/lib/supabase/storage";

/**
 * API ROUTE ENDPOINT: POST /api/upload
 * Menerima unggahan file dari client/frontend, lalu mengunggahnya ke Supabase Storage Endpoint.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 1. Verifikasi User Sesi (Security Check)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    // 2. Extract File dari FormData Request Body
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: "File gambar tidak ditemukan." },
        { status: 400 }
      );
    }

    // 3. Ambil Nama Bucket dari Env
    const { articleBucket } = getStorageBucketConfig();
    const targetBucket = articleBucket;

    const fileExt = file.name.split(".").pop() || "png";
    const sanitizedExt = fileExt.replace(/[^a-zA-Z0-9]/g, "");
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${sanitizedExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // 4. Kirim File ke Supabase Storage REST Endpoint via SDK
    const { error: uploadError } = await supabase.storage
      .from(targetBucket)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: `Gagal upload ke Supabase Storage: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // 5. Ambil URL Publik Gambar
    const { data: publicUrlData } = supabase.storage
      .from(targetBucket)
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      bucket: targetBucket,
      path: fileName,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}

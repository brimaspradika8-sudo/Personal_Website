import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json(
        { error: "Kamu harus login dulu untuk memberikan reaksi" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { article_id, type } = body;

    if (!article_id || !type || (type !== "LIKE" && type !== "DISLIKE")) {
      return NextResponse.json(
        { error: "article_id dan type (LIKE/DISLIKE) wajib diisi." },
        { status: 400 }
      );
    }

    // 1. Pastikan data user tersedia di Prisma database (Gunakan Upsert agar aman dari race condition)
    const userEmail = user.email.toLowerCase().trim();
    const userName = user.user_metadata?.full_name || user.user_metadata?.name || userEmail.split("@")[0];
    const userAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

    const dbUser = await prisma.user.upsert({
      where: { email: userEmail },
      update: {
        name: userName,
        avatar: userAvatar,
      },
      create: {
        email: userEmail,
        name: userName,
        avatar: userAvatar,
      },
    });

    // 2. Cari artikel berdasarkan UUID id atau slug
    const isValidUuid = (str: string) =>
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);

    let articleExists = null;
    if (isValidUuid(article_id)) {
      articleExists = await prisma.article.findUnique({ where: { id: article_id } });
    }
    if (!articleExists) {
      articleExists = await prisma.article.findUnique({ where: { slug: article_id } });
    }

    if (!articleExists) {
      return NextResponse.json(
        { error: "Artikel tidak ditemukan." },
        { status: 404 }
      );
    }

    // 3. Logic Toggle Reaction
    const existingReaction = await prisma.reaction.findUnique({
      where: {
        user_id_article_id: {
          user_id: dbUser.id,
          article_id: articleExists.id,
        },
      },
    });

    let action: "deleted" | "updated" | "created" = "created";
    let finalType: "LIKE" | "DISLIKE" | null = type;

    if (existingReaction) {
      if (existingReaction.type === type) {
        // Toggle: Hapus reaksi jika diklik tombol tipe yang sama
        await prisma.reaction.delete({ where: { id: existingReaction.id } });
        action = "deleted";
        finalType = null;
      } else {
        // Switch: Ganti tipe jika diklik tipe berbeda (LIKE <-> DISLIKE)
        await prisma.reaction.update({
          where: { id: existingReaction.id },
          data: { type },
        });
        action = "updated";
      }
    } else {
      // Create: Buat reaksi baru
      await prisma.reaction.create({
        data: {
          user_id: dbUser.id,
          article_id: articleExists.id,
          type,
        },
      });
    }

    return NextResponse.json({
      success: true,
      action,
      type: finalType,
      article_id: articleExists.id,
    });
  } catch (error: unknown) {
    console.error("Error in POST /api/reaction:", error);
    const message = error instanceof Error ? error.message : "Terjadi kesalahan server.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

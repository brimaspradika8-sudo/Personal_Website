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
        { error: "Kamu harus login dulu untuk berkomentar" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { article_id, content } = body;

    if (!article_id || !content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "article_id dan content komentar wajib diisi." },
        { status: 400 }
      );
    }

    // 1. Dapatkan / Buat user di database Prisma dengan upsert
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

    // 3. Simpan komentar baru ke tabel Comment
    const newComment = await prisma.comment.create({
      data: {
        article_id: articleExists.id,
        user_id: dbUser.id,
        content: content.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            tier: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      comment: {
        id: newComment.id,
        content: newComment.content,
        created_at: newComment.created_at.toISOString(),
        user_id: newComment.user_id,
        user: {
          id: newComment.user.id,
          name: newComment.user.name,
          avatar: newComment.user.avatar,
          tier: (newComment.user as any).tier || "FREE",
        },
      },
    });
  } catch (error: unknown) {
    console.error("Error in POST /api/comment:", error);
    const message = error instanceof Error ? error.message : "Terjadi kesalahan server.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

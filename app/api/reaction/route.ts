import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth/get-user";
import { checkRateLimit, RATE_LIMIT_PRESETS } from "@/lib/security/rate-limit";
import { verifyCsrfToken, verifyRequestOrigin } from "@/lib/security/csrf";

export async function POST(request: NextRequest) {
  try {
    const origin = await verifyRequestOrigin();
    if (!origin.valid || !(await verifyCsrfToken(request.headers.get("x-csrf-token")))) {
      return NextResponse.json({ error: "Permintaan ditolak." }, { status: 403 });
    }
    const user = await getAuthenticatedUser();

    if (!user || !user.email) {
      return NextResponse.json(
        { error: "Kamu harus login dulu untuk memberikan reaksi" },
        { status: 401 }
      );
    }

    // Rate Limiting Guard
    const rateLimit = checkRateLimit(`reaction:${user.id || user.email}`, RATE_LIMIT_PRESETS.API_REACTION.limit, RATE_LIMIT_PRESETS.API_REACTION.windowMs);
    if (!rateLimit.success) {
      const waitSeconds = Math.ceil(rateLimit.resetMs / 1000);
      return NextResponse.json(
        { error: `Terlalu banyak reaksi dalam waktu singkat. Silakan tunggu ${waitSeconds} detik.` },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { article_id, type, comment_id: commentId } = body;

    if (commentId !== undefined) {
      if (typeof commentId !== "string" || !/^[0-9a-fA-F-]{36}$/.test(commentId)) {
        return NextResponse.json({ error: "ID komentar tidak valid." }, { status: 400 });
      }
      const email = user.email.toLowerCase().trim();
      const dbUser = await prisma.user.upsert({
        where: { email },
        update: {},
        create: { email, name: email.split("@")[0] },
      });
      const comment = await prisma.comment.findUnique({ where: { id: commentId }, select: { id: true, user_id: true } });
      if (!comment) return NextResponse.json({ error: "Komentar tidak ditemukan." }, { status: 404 });
      if (comment.user_id === dbUser.id) {
        return NextResponse.json({ error: "Kamu tidak bisa menyukai komentar sendiri." }, { status: 403 });
      }
      const existing = await prisma.commentLike.findUnique({ where: { user_id_comment_id: { user_id: dbUser.id, comment_id: commentId } } });
      if (existing) {
        await prisma.commentLike.delete({ where: { id: existing.id } });
        const likeCount = await prisma.commentLike.count({ where: { comment_id: commentId } });
        return NextResponse.json({ success: true, liked: false, likeCount });
      }
      await prisma.commentLike.create({ data: { user_id: dbUser.id, comment_id: commentId } });
      const likeCount = await prisma.commentLike.count({ where: { comment_id: commentId } });
      return NextResponse.json({ success: true, liked: true, likeCount });
    }

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
        await prisma.reaction.delete({ where: { id: existingReaction.id } });
        action = "deleted";
        finalType = null;
      } else {
        await prisma.reaction.update({
          where: { id: existingReaction.id },
          data: { type },
        });
        action = "updated";
      }
    } else {
      await prisma.reaction.create({
        data: {
          user_id: dbUser.id,
          article_id: articleExists.id,
          type,
        },
      });
    }

    const [likeCount, dislikeCount] = await Promise.all([
      prisma.reaction.count({ where: { article_id: articleExists.id, type: "LIKE" } }),
      prisma.reaction.count({ where: { article_id: articleExists.id, type: "DISLIKE" } }),
    ]);

    return NextResponse.json({
      success: true,
      action,
      type: finalType,
      article_id: articleExists.id,
      likeCount,
      dislikeCount,
    });
  } catch (error: unknown) {
    console.error("Error in POST /api/reaction:", error);
    const message = error instanceof Error ? error.message : "Terjadi kesalahan server.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth/get-user";
import { checkRateLimitDistributed, RATE_LIMIT_PRESETS } from "@/lib/security/rate-limit";
import { getCommentModerationError, stripHtml } from "@/lib/security/sanitize";
import { verifyCsrfToken, verifyRequestOrigin } from "@/lib/security/csrf";

import { z } from "zod";

const MAX_COMMENT_LENGTH = 500;

const postCommentSchema = z.object({
  article_id: z.string().trim().min(1, "article_id wajib diisi."),
  content: z
    .string()
    .transform((val) => stripHtml(val).trim())
    .refine((val) => val.length > 0, { message: "Komentar tidak boleh kosong atau hanya whitespace." })
    .refine((val) => val.length <= MAX_COMMENT_LENGTH, {
      message: `Komentar terlalu panjang. Maksimal ${MAX_COMMENT_LENGTH} karakter.`,
    }),
  parent_id: z
    .string()
    .uuid("ID komentar induk tidak valid.")
    .optional()
    .nullable(),
});

const deleteCommentSchema = z.object({
  comment_id: z.string().uuid("ID komentar tidak valid."),
});

async function getDbUser(user: NonNullable<Awaited<ReturnType<typeof getAuthenticatedUser>>>) {
  const email = user.email?.toLowerCase().trim();
  if (!email) return null;
  return prisma.user.upsert({
    where: { email },
    update: {
      name: user.user_metadata?.full_name || user.user_metadata?.name || email.split("@")[0],
      avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
    },
    create: {
      email,
      name: user.user_metadata?.full_name || user.user_metadata?.name || email.split("@")[0],
      avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
    },
  });
}

async function guardRequest(request: NextRequest, sessionOrUserId?: string | { id: string } | null) {
  const origin = await verifyRequestOrigin();
  if (!origin.valid) {
    return NextResponse.json(
      { error: origin.reason || "Permintaan ditolak. Origin tidak valid." },
      { status: 403 }
    );
  }
  const userId = typeof sessionOrUserId === "string" ? sessionOrUserId : sessionOrUserId?.id;
  const csrfToken = request.headers.get("x-csrf-token");
  const isCsrfValid = await verifyCsrfToken(csrfToken, userId);
  if (!isCsrfValid) {
    return NextResponse.json(
      { error: "Token CSRF tidak valid atau telah kedaluwarsa." },
      { status: 403 }
    );
  }
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const articleId = request.nextUrl.searchParams.get("article_id") || "";
    const page = Math.max(1, Number(request.nextUrl.searchParams.get("page") || "1"));
    const pageSize = Math.min(50, Math.max(1, Number(request.nextUrl.searchParams.get("page_size") || "20")));
    const isValidUuid = (value: string) => /^[0-9a-fA-F-]{36}$/.test(value);
    const article = isValidUuid(articleId)
      ? await prisma.article.findUnique({ where: { id: articleId }, select: { id: true } })
      : await prisma.article.findUnique({ where: { slug: articleId }, select: { id: true } });
    if (!article) return NextResponse.json({ error: "Artikel tidak ditemukan." }, { status: 404 });

    const user = await getAuthenticatedUser();
    const dbUser = user?.email
      ? await prisma.user.findUnique({ where: { email: user.email.toLowerCase().trim() }, select: { id: true } })
      : null;
    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { article_id: article.id },
        orderBy: { created_at: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { user: { select: { id: true, name: true, avatar: true } }, likes: { select: { user_id: true } } },
      }),
      prisma.comment.count({ where: { article_id: article.id } }),
    ]);
    return NextResponse.json({
      comments: comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at.toISOString(),
        user_id: comment.user_id,
        parent_id: comment.parent_id,
        likeCount: comment.likes.length,
        likedByUser: Boolean(dbUser && comment.likes.some((like) => like.user_id === dbUser.id)),
        canDelete: comment.user_id === dbUser?.id,
        user: comment.user,
      })),
      pagination: { page, pageSize, total, hasMore: page * pageSize < total },
    });
  } catch (error) {
    console.error("Error in GET /api/comment:", error);
    return NextResponse.json({ error: "Gagal mengambil komentar." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Check Origin Header terlebih dahulu (Prioritas 3 & 5)
    const origin = await verifyRequestOrigin();
    if (!origin.valid) {
      return NextResponse.json(
        { error: origin.reason || "Permintaan ditolak. Origin tidak valid." },
        { status: 403 }
      );
    }

    const user = await getAuthenticatedUser();

    // 2. Check CSRF Token 3-arah (Prioritas 1, 2, & 5)
    const csrfToken = request.headers.get("x-csrf-token");
    const isCsrfValid = await verifyCsrfToken(csrfToken, user?.id);
    if (!isCsrfValid) {
      return NextResponse.json(
        { error: "Token CSRF tidak valid atau telah kedaluwarsa." },
        { status: 403 }
      );
    }

    // 3. Check User Authentication
    if (!user || !user.email) {
      return NextResponse.json(
        { error: "Kamu harus login dulu untuk berkomentar" },
        { status: 401 }
      );
    }

    // 4. Rate Limiting Guard (Tetap berjalan & terlindungi)
    const rateLimit = await checkRateLimitDistributed(
      `comment:${user.id || user.email}`,
      RATE_LIMIT_PRESETS.API_COMMENT.limit,
      RATE_LIMIT_PRESETS.API_COMMENT.windowMs
    );
    if (!rateLimit.success) {
      const waitSeconds = Math.ceil(rateLimit.resetMs / 1000);
      return NextResponse.json(
        { error: `Terlalu banyak komentar. Silakan tunggu ${waitSeconds} detik.` },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const parseResult = postCommentSchema.safeParse(body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues[0]?.message || "Input komentar tidak valid.";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { article_id, content, parent_id: parentId } = parseResult.data;

    const moderationError = getCommentModerationError(content);
    if (moderationError) return NextResponse.json({ error: moderationError }, { status: 422 });

    const dbUser = await getDbUser(user);
    if (!dbUser) return NextResponse.json({ error: "Akun pengguna tidak valid." }, { status: 401 });

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

    const duplicate = await prisma.comment.findFirst({
      where: { article_id: articleExists.id, user_id: dbUser.id, content: content.trim(), created_at: { gte: new Date(Date.now() - 60_000) } },
      select: { id: true },
    });
    if (duplicate) return NextResponse.json({ error: "Komentar yang sama baru saja dikirim." }, { status: 409 });

    let validParentId: string | null = null;
    if (parentId !== undefined && parentId !== null && parentId !== "") {
      if (typeof parentId !== "string" || !isValidUuid(parentId)) {
        return NextResponse.json({ error: "Komentar induk tidak valid." }, { status: 400 });
      }
      const parent = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { id: true, article_id: true, parent_id: true },
      });
      if (!parent || parent.article_id !== articleExists.id) {
        return NextResponse.json({ error: "Komentar induk tidak ditemukan pada artikel ini." }, { status: 400 });
      }
      validParentId = parent.parent_id || parent.id;
    }

    // 3. Simpan komentar baru ke tabel Comment
    const newComment = await prisma.comment.create({
      data: {
        article_id: articleExists.id,
        user_id: dbUser.id,
        parent_id: validParentId,
        content: content.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
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
        parent_id: newComment.parent_id,
        likeCount: 0,
        likedByUser: false,
        canDelete: true,
        user: {
          id: newComment.user.id,
          name: newComment.user.name,
          avatar: newComment.user.avatar,
        },
      },
    });
  } catch (error: unknown) {
    console.error("Error in POST /api/comment:", error);
    const message = error instanceof Error ? error.message : "Terjadi kesalahan server.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const guard = await guardRequest(request, user?.id);
    if (guard) return guard;
    if (!user?.email) return NextResponse.json({ error: "Kamu harus login dulu." }, { status: 401 });
    const body = await request.json().catch(() => ({}));
    const parseResult = deleteCommentSchema.safeParse(body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues[0]?.message || "ID komentar tidak valid.";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }
    const { comment_id } = parseResult.data;
    const dbUser = await getDbUser(user);
    if (!dbUser) return NextResponse.json({ error: "Akun pengguna tidak valid." }, { status: 401 });
    const comment = await prisma.comment.findUnique({ where: { id: comment_id }, select: { user_id: true } });
    if (!comment) return NextResponse.json({ error: "Komentar tidak ditemukan." }, { status: 404 });
    if (comment.user_id !== dbUser.id) return NextResponse.json({ error: "Kamu hanya dapat menghapus komentar milikmu sendiri." }, { status: 403 });
    await prisma.comment.delete({ where: { id: comment_id } });
    return NextResponse.json({ success: true, comment_id });
  } catch (error) {
    console.error("Error in DELETE /api/comment:", error);
    return NextResponse.json({ error: "Gagal menghapus komentar." }, { status: 500 });
  }
}

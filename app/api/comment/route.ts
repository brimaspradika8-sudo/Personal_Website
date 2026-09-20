import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth/get-user";
import { checkRateLimit, RATE_LIMIT_PRESETS } from "@/lib/security/rate-limit";
import { stripHtml } from "@/lib/security/sanitize";
import { verifyCsrfToken, verifyRequestOrigin } from "@/lib/security/csrf";

const MAX_COMMENT_LENGTH = 1000;

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

async function guardRequest(request: NextRequest) {
  const origin = await verifyRequestOrigin();
  if (!origin.valid) return NextResponse.json({ error: "Permintaan ditolak." }, { status: 403 });
  if (!(await verifyCsrfToken(request.headers.get("x-csrf-token")))) {
    return NextResponse.json({ error: "Token keamanan tidak valid." }, { status: 403 });
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const guard = await guardRequest(request);
    if (guard) return guard;
    const user = await getAuthenticatedUser();

    if (!user || !user.email) {
      return NextResponse.json(
        { error: "Kamu harus login dulu untuk berkomentar" },
        { status: 401 }
      );
    }

    // Rate Limiting Guard
    const rateLimit = checkRateLimit(`comment:${user.id || user.email}`, RATE_LIMIT_PRESETS.API_COMMENT.limit, RATE_LIMIT_PRESETS.API_COMMENT.windowMs);
    if (!rateLimit.success) {
      const waitSeconds = Math.ceil(rateLimit.resetMs / 1000);
      return NextResponse.json(
        { error: `Terlalu banyak komentar. Silakan tunggu ${waitSeconds} detik.` },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { article_id, content: rawContent, parent_id: parentId } = body;

    const content = typeof rawContent === "string" ? stripHtml(rawContent) : "";

    if (!article_id || !content || !content.trim()) {
      return NextResponse.json(
        { error: "article_id dan content komentar valid wajib diisi." },
        { status: 400 }
      );
    }
    if (content.length > MAX_COMMENT_LENGTH) {
      return NextResponse.json(
        { error: `Komentar terlalu panjang. Maksimal ${MAX_COMMENT_LENGTH} karakter.` },
        { status: 400 }
      );
    }

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
    const guard = await guardRequest(request);
    if (guard) return guard;
    const user = await getAuthenticatedUser();
    if (!user?.email) return NextResponse.json({ error: "Kamu harus login dulu." }, { status: 401 });
    const body = await request.json().catch(() => ({}));
    if (typeof body.comment_id !== "string" || !/^[0-9a-fA-F-]{36}$/.test(body.comment_id)) {
      return NextResponse.json({ error: "ID komentar tidak valid." }, { status: 400 });
    }
    const dbUser = await getDbUser(user);
    if (!dbUser) return NextResponse.json({ error: "Akun pengguna tidak valid." }, { status: 401 });
    const comment = await prisma.comment.findUnique({ where: { id: body.comment_id }, select: { user_id: true } });
    if (!comment) return NextResponse.json({ error: "Komentar tidak ditemukan." }, { status: 404 });
    if (comment.user_id !== dbUser.id) return NextResponse.json({ error: "Kamu hanya dapat menghapus komentar milikmu sendiri." }, { status: 403 });
    await prisma.comment.delete({ where: { id: body.comment_id } });
    return NextResponse.json({ success: true, comment_id: body.comment_id });
  } catch (error) {
    console.error("Error in DELETE /api/comment:", error);
    return NextResponse.json({ error: "Gagal menghapus komentar." }, { status: 500 });
  }
}

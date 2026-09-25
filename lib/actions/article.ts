"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { checkRateLimit, RATE_LIMIT_PRESETS } from "@/lib/security/rate-limit";
import { stripHtml } from "@/lib/security/sanitize";

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail: string | null;
  category?: string;
  readTime?: string;
  views?: number;
  created_at: string;
  updated_at?: string;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  authorName?: string;
  authorAvatar?: string;
}

export interface CommentItem {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  parent_id: string | null;
  likeCount: number;
  likedByUser: boolean;
  canDelete: boolean;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

export interface AdminCommentItem {
  id: string;
  content: string;
  created_at: string;
  user: {
    name: string;
    avatar: string | null;
    email: string;
  };
  article: {
    title: string;
    slug: string;
  };
}

export interface ArticleDetail extends ArticleItem {
  comments: CommentItem[];
  userReaction: "LIKE" | "DISLIKE" | null;
}


const SAMPLE_ARTICLES: ArticleItem[] = [];

function calculateReadTime(content: string): string {
  if (!content) return "1 min read";
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min read`;
}

import { checkIsAdmin } from "./auth";
export { checkIsAdmin };

import { cache } from "react";

// 1. Ambil daftar artikel dengan filter search, kategori, dan sort
const getArticlesMemoized = cache(async (params?: {
  query?: string;
  category?: string;
  sort?: "latest" | "oldest" | "popular";
}): Promise<ArticleItem[]> => {
  try {
    const whereClause: Record<string, unknown> = {};
    if (params?.query) {
      const q = params.query.toLowerCase();
      whereClause.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { slug: { contains: q, mode: "insensitive" } },
      ];
    }

    // Fetch dari database via Prisma dengan SELECT ringan (tanpa full content, reactions, & comments)
    const dbArticles = await prisma.article.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnail: true,
        views: true,
        created_at: true,
        updated_at: true,
        author: {
          select: {
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
        reactions: {
          select: {
            type: true,
          },
        },
      },
      orderBy:
        params?.sort === "oldest"
          ? { created_at: "asc" }
          : { created_at: "desc" },
    });

    if (dbArticles && dbArticles.length > 0) {
      let articles: ArticleItem[] = dbArticles.map((art) => {
        const likeCount = art.reactions.filter((r) => r.type === "LIKE").length;
        const dislikeCount = art.reactions.filter((r) => r.type === "DISLIKE").length;

        let category = "Tutorial";
        const titleLower = art.title.toLowerCase();
        if (titleLower.includes("ai") || titleLower.includes("automation") || titleLower.includes("agent")) {
          category = "AI Systems";
        } else if (titleLower.includes("web") || titleLower.includes("next.js") || titleLower.includes("react")) {
          category = "Web Dev";
        } else if (titleLower.includes("database") || titleLower.includes("supabase") || titleLower.includes("prisma")) {
          category = "Database";
        }

        return {
          id: art.id,
          title: art.title,
          slug: art.slug,
          content: "",
          thumbnail: art.thumbnail,
          category,
          readTime: "3 min read",
          views: art.views || 0,
          created_at: art.created_at.toISOString(),
          updated_at: art.updated_at.toISOString(),
          likeCount,
          dislikeCount,
          commentCount: art._count.comments,
          authorName: art.author?.name || "Penulis Platform",
          authorAvatar: art.author?.avatar || "/images/avatar.webp",
        };
      });

      if (params?.category && params.category !== "All" && params.category !== "Semua") {
        articles = articles.filter(
          (a) => a.category?.toLowerCase() === params.category?.toLowerCase()
        );
      }

      if (params?.sort === "popular") {
        articles.sort((a, b) => b.likeCount + b.commentCount - (a.likeCount + a.commentCount));
      }

      return articles;
    }
  } catch (err) {
    console.warn("Prisma getArticles fetch warning (falling back to Supabase/Sample):", err);
  }

  // Fallback ke Supabase query langsung
  try {
    const supabase = await createClient();
    const { data: supabasePosts } = await supabase
      .from("Article")
      .select("id, title, slug, content, thumbnail, created_at")
      .order("created_at", { ascending: params?.sort !== "oldest" });

    if (supabasePosts && supabasePosts.length > 0) {
      let articles: ArticleItem[] = supabasePosts.map((art) => ({
        id: art.id,
        title: art.title,
        slug: art.slug,
        content: art.content || "",
        thumbnail: art.thumbnail || null,
        category: "Web Dev",
        readTime: calculateReadTime(art.content || ""),
        created_at: art.created_at,
        likeCount: 12,
        dislikeCount: 0,
        commentCount: 2,
        authorName: "Brimas Pradika Utama",
        authorAvatar: "/images/avatar.webp",
      }));

      if (params?.query) {
        const q = params.query.toLowerCase();
        articles = articles.filter((a) => a.title.toLowerCase().includes(q));
      }
      return articles;
    }
  } catch (err) {
    console.warn("Supabase client fetch warning:", err);
  }

  // Jika DB kosong/gagal, return sampel berkualitas tinggi
  let filtered = [...SAMPLE_ARTICLES];
  if (params?.query) {
    const q = params.query.toLowerCase();
    filtered = filtered.filter(
      (a) => a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q)
    );
  }
  if (params?.category && params.category !== "All" && params.category !== "Semua") {
    filtered = filtered.filter(
      (a) => a.category?.toLowerCase() === params.category?.toLowerCase()
    );
  }
  if (params?.sort === "oldest") {
    filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  } else if (params?.sort === "popular") {
    filtered.sort((a, b) => b.likeCount - a.likeCount);
  }

  return filtered;
});

export async function getArticles(params?: {
  query?: string;
  category?: string;
  sort?: "latest" | "oldest" | "popular";
}): Promise<ArticleItem[]> {
  return getArticlesMemoized(params);
}

// 1b. Ambil daftar artikel karya penulis pengguna
export async function getUserArticles(authorId: string): Promise<ArticleItem[]> {
  if (!authorId) return [];
  try {
    const dbArticles = await prisma.article.findMany({
      where: { author_id: authorId },
      include: {
        reactions: true,
        comments: true,
        author: true,
      },
      orderBy: { created_at: "desc" },
    });

    if (dbArticles && dbArticles.length > 0) {
      return dbArticles.map((art) => {
        const likeCount = art.reactions.filter((r) => r.type === "LIKE").length;
        const dislikeCount = art.reactions.filter((r) => r.type === "DISLIKE").length;

        let category = "Tutorial";
        const titleLower = art.title.toLowerCase();
        if (titleLower.includes("ai") || titleLower.includes("automation") || titleLower.includes("agent")) {
          category = "AI Systems";
        } else if (titleLower.includes("web") || titleLower.includes("next.js") || titleLower.includes("react")) {
          category = "Web Dev";
        } else if (titleLower.includes("database") || titleLower.includes("supabase") || titleLower.includes("prisma")) {
          category = "Database";
        }

        return {
          id: art.id,
          title: art.title,
          slug: art.slug,
          content: art.content,
          thumbnail: art.thumbnail,
          category,
          readTime: calculateReadTime(art.content),
          created_at: art.created_at.toISOString(),
          updated_at: art.updated_at.toISOString(),
          likeCount,
          dislikeCount,
          commentCount: art.comments.length,
          authorName: art.author?.name || "Penulis Platform",
          authorAvatar: art.author?.avatar || "/images/avatar.webp",
        };
      });
    }
  } catch (err) {
    console.warn("getUserArticles fetch warning:", err);
  }
  return [];
}

// 2. Ambil detail artikel berdasarkan Slug
const getArticleBySlugMemoized = cache(async (
  slug: string
): Promise<ArticleDetail | null> => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let dbUserId: string | null = null;
  if (user?.email) {
    try {
      const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
      if (dbUser) dbUserId = dbUser.id;
    } catch {}
  }

  try {
    const art = await prisma.article.findUnique({
      where: { slug },
      include: {
        reactions: true,
        author: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            likes: {
              select: { user_id: true },
            },
          },
          orderBy: { created_at: "desc" },
        },
      },
    });

    if (art) {
      const likeCount = art.reactions.filter((r) => r.type === "LIKE").length;
      const dislikeCount = art.reactions.filter((r) => r.type === "DISLIKE").length;

      let userReaction: "LIKE" | "DISLIKE" | null = null;
      if (dbUserId) {
        const myReaction = art.reactions.find((r) => r.user_id === dbUserId);
        if (myReaction) userReaction = myReaction.type;
      }

      let category = "Tutorial";
      const titleLower = art.title.toLowerCase();
      if (titleLower.includes("ai") || titleLower.includes("automation")) category = "AI Systems";
      else if (titleLower.includes("web") || titleLower.includes("next.js")) category = "Web Dev";
      else if (titleLower.includes("database") || titleLower.includes("supabase")) category = "Database";

      return {
        id: art.id,
        title: art.title,
        slug: art.slug,
        content: art.content,
        thumbnail: art.thumbnail,
        category,
        readTime: calculateReadTime(art.content),
        created_at: art.created_at.toISOString(),
        updated_at: art.updated_at.toISOString(),
        likeCount,
        dislikeCount,
        commentCount: art.comments.length,
        authorName: art.author?.name || "Penulis Platform",
        authorAvatar: art.author?.avatar || "/images/avatar.webp",
        userReaction,
        comments: art.comments.map((c) => ({
          id: c.id,
          content: c.content,
          created_at: c.created_at.toISOString(),
          user_id: c.user_id,
          parent_id: c.parent_id,
          likeCount: c.likes.length,
          likedByUser: c.likes.some((like) => like.user_id === dbUserId),
          canDelete: c.user_id === dbUserId,
          user: {
            id: c.user.id,
            name: c.user.name,
            avatar: c.user.avatar,
          },
        })),
      };
    }
  } catch (err) {
    console.warn("Prisma findUnique article error:", err);
  }

  const sampleMatch = SAMPLE_ARTICLES.find((s) => s.slug === slug);
  if (sampleMatch) {
    return {
      ...sampleMatch,
      userReaction: null,
      comments: [],
    };
  }

  return null;
});

export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  return getArticleBySlugMemoized(slug);
}

const isValidUuid = (str: string) =>
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);

const MAX_COMMENT_LENGTH = 1000;

// Ambil detail artikel berdasarkan ID (untuk halaman Edit)
export async function getArticleById(id: string): Promise<ArticleItem | null> {
  if (isValidUuid(id)) {
    try {
      const art = await prisma.article.findUnique({
        where: { id },
      });
      if (art) {
        return {
          id: art.id,
          title: art.title,
          slug: art.slug,
          content: art.content,
          thumbnail: art.thumbnail,
          created_at: art.created_at.toISOString(),
          updated_at: art.updated_at.toISOString(),
          likeCount: 0,
          dislikeCount: 0,
          commentCount: 0,
        };
      }
    } catch (err) {
      console.warn("Prisma getArticleById error:", err);
    }
  }

  const sampleMatch = SAMPLE_ARTICLES.find((s) => s.id === id || s.slug === id);
  if (sampleMatch) return sampleMatch;

  return null;
}

import { uploadFileToSupabaseStorage } from "@/lib/supabase/storage";

export async function uploadArticleImage(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { error: "Harus login terlebih dahulu untuk mengunggah gambar artikel." };
  }

  const isAdmin = await checkIsAdmin(user.email);
  let dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        email: user.email,
        name: user.user_metadata?.full_name || user.email.split("@")[0],
        avatar: user.user_metadata?.avatar_url || null,
        role: "USER",
      },
    });
  }

  if (!isAdmin) {
    return { error: "Akses ditolak. Hanya Admin yang dapat mengunggah gambar artikel." };
  }

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { error: "File gambar tidak ditemukan." };
  }

  if (!file.type.startsWith("image/")) {
    return { error: "File harus berupa format gambar (JPG, PNG, WEBP, GIF)." };
  }

  if (file.size > 8 * 1024 * 1024) {
    return { error: "Ukuran file terlalu besar. Maksimal 8MB." };
  }

  try {
    const res = await uploadFileToSupabaseStorage({ file, folder: "article-images" });
    return res;
  } catch (err: unknown) {
    return { error: (err as Error)?.message || "Gagal mengunggah gambar." };
  }
}

// 3. Buat Artikel Baru (Dengan Gate Permission & Limit Rolling 7-Hari)
export async function createArticle(data: {
  title: string;
  slug?: string;
  content: string;
  thumbnail?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { error: "Harus login terlebih dahulu untuk membuat artikel baru." };
  }

  const isAdmin = await checkIsAdmin(user.email);
  let dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        email: user.email,
        name: user.user_metadata?.full_name || user.email.split("@")[0],
        avatar: user.user_metadata?.avatar_url || null,
        role: isAdmin ? "ADMIN" : "USER",
      },
    });
  }

  try {
    const rawSlug = (data.slug && data.slug.trim()) ? data.slug : data.title;
    let slugFormatted = rawSlug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    if (!slugFormatted) {
      slugFormatted = `artikel-${Date.now()}`;
    }

    const existingSlug = await prisma.article.findUnique({
      where: { slug: slugFormatted },
    });
    if (existingSlug) {
      slugFormatted = `${slugFormatted}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const newArt = await prisma.article.create({
      data: {
        author_id: dbUser.id,
        title: data.title.trim(),
        slug: slugFormatted,
        content: data.content.trim(),
        thumbnail: data.thumbnail?.trim() || null,
      },
    });

    revalidatePath("/articles");
    revalidatePath("/admin/articles");
    revalidatePath("/dashboard");
    return { success: true, article: newArt };
  } catch (err: unknown) {
    console.error("Error creating article:", err);
    return { error: (err as Error)?.message || "Gagal membuat artikel baru." };
  }
}

// 4. Hapus Artikel (hanya admin)
export async function deleteArticle(articleId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { error: "Harus login terlebih dahulu untuk menghapus artikel." };
  }

  const isAdmin = await checkIsAdmin(user.email);
  const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  if (!dbUser) {
    return { error: "Profil pengguna tidak ditemukan." };
  }

  if (!isAdmin) {
    return { error: "Akses ditolak. Hanya Admin yang dapat menghapus artikel." };
  }

  try {
    if (isValidUuid(articleId)) {
      const existingArt = await prisma.article.findUnique({ where: { id: articleId } });
      if (existingArt) {
        // Admin dapat menghapus artikel apa pun.
        if (!isAdmin && existingArt.author_id !== dbUser.id) {
          return { error: "Anda hanya diizinkan menghapus artikel karya Anda sendiri." };
        }
        await prisma.article.delete({ where: { id: articleId } });
      }
    }
    revalidatePath("/articles");
    revalidatePath("/admin/articles");
    revalidatePath("/dashboard/articles");
    return { success: true };
  } catch (err: unknown) {
    console.error("Error deleting article:", err);
    return { error: (err as Error)?.message || "Gagal menghapus artikel." };
  }
}

// 4b. Update / Edit Artikel (hanya admin)
export async function updateArticle(
  articleId: string,
  data: {
    title: string;
    slug?: string;
    content: string;
    thumbnail?: string;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { error: "Harus login terlebih dahulu untuk mengedit artikel." };
  }

  const isAdmin = await checkIsAdmin(user.email);
  const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  if (!dbUser) {
    return { error: "Profil pengguna tidak ditemukan." };
  }

  if (!isAdmin) {
    return { error: "Akses ditolak. Hanya Admin yang dapat mengedit artikel." };
  }

  try {
    const rawSlug = (data.slug && data.slug.trim()) ? data.slug : data.title;
    let slugFormatted = rawSlug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    if (!slugFormatted) {
      slugFormatted = `artikel-${Date.now()}`;
    }

    let existingArt = null;
    if (isValidUuid(articleId)) {
      existingArt = await prisma.article.findUnique({ where: { id: articleId } });
    }

    if (!existingArt) {
      existingArt = await prisma.article.findUnique({ where: { slug: slugFormatted } });
    }

    if (existingArt && !isAdmin && existingArt.author_id !== dbUser.id) {
      return { error: "Anda hanya diizinkan mengedit artikel karya Anda sendiri." };
    }

    let updatedArt;
    if (!existingArt) {
      updatedArt = await prisma.article.create({
        data: {
          author_id: dbUser.id,
          title: data.title.trim(),
          slug: slugFormatted,
          content: data.content.trim(),
          thumbnail: data.thumbnail?.trim() || null,
        },
      });
    } else {
      updatedArt = await prisma.article.update({
        where: { id: existingArt.id },
        data: {
          title: data.title.trim(),
          slug: slugFormatted,
          content: data.content.trim(),
          thumbnail: data.thumbnail?.trim() || null,
        },
      });
    }

    revalidatePath("/articles");
    revalidatePath(`/articles/${slugFormatted}`);
    revalidatePath("/admin/articles");
    revalidatePath("/dashboard");
    return { success: true, article: updatedArt };
  } catch (err: unknown) {
    console.error("Error updating article:", err);
    return { error: (err as Error)?.message || "Gagal memperbarui artikel." };
  }
}

// 5. Tambah / Toggle Reaksi (LIKE / DISLIKE)
export async function toggleArticleReaction(
  articleId: string,
  reactionType: "LIKE" | "DISLIKE"
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Harus login terlebih dahulu untuk menyukai atau memberikan reaksi pada artikel." };
  }

  try {
    const isAdmin = await checkIsAdmin(user.email);
    let dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
    if (!dbUser && user.email) {
      dbUser = await prisma.user.create({
        data: {
          email: user.email,
          name: user.user_metadata?.full_name || user.email.split("@")[0],
          avatar: user.user_metadata?.avatar_url || null,
          role: isAdmin ? "ADMIN" : "USER",
        },
      });
    }

    if (!dbUser) {
      return { error: "Gagal menemukan profil pengguna." };
    }

    let articleExists = null;
    if (isValidUuid(articleId)) {
      articleExists = await prisma.article.findUnique({ where: { id: articleId } });
    }
    if (!articleExists) {
      articleExists = await prisma.article.findUnique({ where: { slug: articleId } });
    }
    if (!articleExists) {
      const sample = SAMPLE_ARTICLES.find((s) => s.id === articleId || s.slug === articleId);
      if (sample) {
        articleExists = await prisma.article.create({
          data: {
            title: sample.title,
            slug: sample.slug,
            content: sample.content,
            thumbnail: sample.thumbnail,
          },
        });
      }
    }

    if (!articleExists) {
      return { error: "Artikel tidak ditemukan di database." };
    }

    const existingReaction = await prisma.reaction.findUnique({
      where: {
        user_id_article_id: {
          user_id: dbUser.id,
          article_id: articleExists.id,
        },
      },
    });

    if (existingReaction) {
      if (existingReaction.type === reactionType) {
        await prisma.reaction.delete({ where: { id: existingReaction.id } });
      } else {
        await prisma.reaction.update({
          where: { id: existingReaction.id },
          data: { type: reactionType },
        });
      }
    } else {
      await prisma.reaction.create({
        data: {
          user_id: dbUser.id,
          article_id: articleExists.id,
          type: reactionType,
        },
      });
    }

    return { success: true };
  } catch (err: unknown) {
    console.error("Error in toggleArticleReaction:", err);
    return { error: (err as Error)?.message || "Gagal memproses reaksi artikel." };
  }
}

// 6. Tambah Komentar
export async function addArticleComment(articleId: string, rawContent: string, parentId?: string | null) {
  const content = stripHtml(rawContent || "");
  if (!content || content.trim().length === 0) {
    return { error: "Komentar tidak boleh kosong atau hanya berisi tag HTML." };
  }
  if (content.length > MAX_COMMENT_LENGTH) {
    return { error: `Komentar terlalu panjang. Maksimal ${MAX_COMMENT_LENGTH} karakter.` };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Harus login terlebih dahulu untuk menulis komentar." };
  }

  // Rate Limiting Guard
  const rateLimit = checkRateLimit(`comment:${user.id || user.email}`, RATE_LIMIT_PRESETS.API_COMMENT.limit, RATE_LIMIT_PRESETS.API_COMMENT.windowMs);
  if (!rateLimit.success) {
    const waitSeconds = Math.ceil(rateLimit.resetMs / 1000);
    return { error: `Terlalu banyak komentar. Silakan tunggu ${waitSeconds} detik.` };
  }

  try {
    const isAdmin = await checkIsAdmin(user.email);
    let dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
    if (!dbUser && user.email) {
      dbUser = await prisma.user.create({
        data: {
          email: user.email,
          name: user.user_metadata?.full_name || user.email.split("@")[0],
          avatar: user.user_metadata?.avatar_url || null,
          role: isAdmin ? "ADMIN" : "USER",
        },
      });
    }

    if (!dbUser) {
      return { error: "Gagal memverifikasi akun pengguna." };
    }

    let articleExists = null;
    if (isValidUuid(articleId)) {
      articleExists = await prisma.article.findUnique({ where: { id: articleId } });
    }
    if (!articleExists) {
      articleExists = await prisma.article.findUnique({ where: { slug: articleId } });
    }
    if (!articleExists) {
      const sample = SAMPLE_ARTICLES.find((s) => s.id === articleId || s.slug === articleId);
      if (sample) {
        articleExists = await prisma.article.create({
          data: {
            title: sample.title,
            slug: sample.slug,
            content: sample.content,
            thumbnail: sample.thumbnail,
          },
        });
      }
    }

    if (!articleExists) {
      return { error: "Artikel tidak ditemukan." };
    }

    let validParentId: string | null = null;
    if (parentId) {
      if (!isValidUuid(parentId)) {
        return { error: "Komentar yang dibalas tidak valid." };
      }

      const parent = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { id: true, article_id: true, parent_id: true },
      });

      if (!parent || parent.article_id !== articleExists.id) {
        return { error: "Komentar yang dibalas tidak ditemukan di artikel ini." };
      }

      validParentId = parent.parent_id || parent.id;
    }

    const newComment = await prisma.comment.create({
      data: {
        article_id: articleExists.id,
        user_id: dbUser.id,
        parent_id: validParentId,
        content: content.trim(),
      },
      include: {
        user: true,
        likes: {
          select: { user_id: true },
        },
      },
    });

    revalidatePath(`/artikel/${articleExists.slug}`);
    revalidatePath("/artikel");

    return {
      success: true,
      comment: {
        id: newComment.id,
        content: newComment.content,
        created_at: newComment.created_at.toISOString(),
        user_id: newComment.user_id,
        parent_id: newComment.parent_id,
        likeCount: newComment.likes.length,
        likedByUser: false,
        canDelete: true,
        user: {
          id: newComment.user.id,
          name: newComment.user.name,
          avatar: newComment.user.avatar,
        },
      },
    };
  } catch (err: unknown) {
    console.error("Error adding comment:", err);
    return { error: (err as Error)?.message || "Gagal menambahkan komentar." };
  }
}

// 7. Hapus Komentar
export async function deleteArticleComment(commentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Harus login terlebih dahulu untuk menghapus komentar." };
  }

  try {
    const isAdmin = await checkIsAdmin(user.email);
    const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
    if (!dbUser) {
      return { error: "Akun pengguna tidak ditemukan." };
    }

    const existing = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!existing) {
      return { error: "Komentar tidak ditemukan." };
    }

    // Admin dapat menghapus komentar siapa saja; User biasa hanya dapat menghapus miliknya sendiri
    if (existing.user_id !== dbUser.id && !isAdmin) {
      return { error: "Anda hanya dapat menghapus komentar milik Anda sendiri." };
    }

    await prisma.comment.delete({ where: { id: commentId } });

    revalidatePath("/artikel");
    return { success: true };
  } catch (err: unknown) {
    console.error("Error deleting comment:", err);
    return { error: (err as Error)?.message || "Gagal menghapus komentar." };
  }
}

// 7b. Like / Unlike Komentar
export async function toggleCommentLike(commentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { error: "Harus login terlebih dahulu untuk menyukai komentar." };
  }

  if (!isValidUuid(commentId)) {
    return { error: "ID komentar tidak valid." };
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email.toLowerCase().trim() },
    });

    if (!dbUser) {
      return { error: "Akun pengguna tidak ditemukan." };
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, user_id: true },
    });

    if (!comment) {
      return { error: "Komentar tidak ditemukan." };
    }

    if (comment.user_id === dbUser.id) {
      return { error: "Anda tidak dapat menyukai komentar sendiri." };
    }

    const existing = await prisma.commentLike.findUnique({
      where: {
        user_id_comment_id: {
          user_id: dbUser.id,
          comment_id: commentId,
        },
      },
    });

    if (existing) {
      await prisma.commentLike.delete({ where: { id: existing.id } });
    } else {
      await prisma.commentLike.create({
        data: {
          user_id: dbUser.id,
          comment_id: commentId,
        },
      });
    }

    const likeCount = await prisma.commentLike.count({
      where: { comment_id: commentId },
    });

    return { success: true, liked: !existing, likeCount };
  } catch (err: unknown) {
    console.error("Error toggling comment like:", err);
    return { error: (err as Error)?.message || "Gagal memproses like komentar." };
  }
}

// 8. Seed Artikel Sampel ke Database jika kosong (Admin only)
export async function seedSampleArticlesIfEmpty() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await checkIsAdmin(user.email))) {
    return { seeded: false, error: "Akses ditolak. Hanya Admin yang dapat melakukan seeding artikel." };
  }

  try {
    const count = await prisma.article.count();
    if (count === 0) {
      for (const sample of SAMPLE_ARTICLES) {
        await prisma.article.create({
          data: {
            title: sample.title,
            slug: sample.slug,
            content: sample.content,
            thumbnail: sample.thumbnail,
          },
        });
      }
      return { seeded: true, count: SAMPLE_ARTICLES.length };
    }
  } catch (err) {
    console.warn("Seeding articles failed or skipped:", err);
  }
  return { seeded: false };
}

// 9. Admin-only: Ambil Semua Komentar untuk Moderasi
export async function getAllAdminComments() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await checkIsAdmin(user.email))) {
    return [];
  }

  try {
    const comments = await prisma.comment.findMany({
      orderBy: { created_at: "desc" },
      include: {
        user: { select: { name: true, avatar: true, email: true } },
        article: { select: { title: true, slug: true } },
      },
    });

    return comments.map((c) => ({
      id: c.id,
      content: c.content,
      created_at: c.created_at.toISOString(),
      user: {
        name: c.user?.name || "User",
        avatar: c.user?.avatar || null,
        email: c.user?.email || "",
      },
      article: {
        title: c.article?.title || "Artikel",
        slug: c.article?.slug || "",
      },
    }));
  } catch (err) {
    console.error("Error fetching admin comments:", err);
    return [];
  }
}

// 10. Catat Pembaca (Increment Article Views)
export async function incrementArticleViews(slug: string) {
  try {
    const art = await prisma.article.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (art) {
      await prisma.article.update({
        where: { id: art.id },
        data: { views: { increment: 1 } },
      }).catch(() => {});
    }
  } catch {
    // Skip silently if views column is missing or schema error
  }
}

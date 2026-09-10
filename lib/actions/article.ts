"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail: string | null;
  category?: string;
  readTime?: string;
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
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

export interface ArticleDetail extends ArticleItem {
  comments: CommentItem[];
  userReaction: "LIKE" | "DISLIKE" | null;
}

// Data sampel berkualitas jika database masih kosong / belum di-seed
const SAMPLE_ARTICLES: ArticleItem[] = [
  {
    id: "sample-1",
    title: "Membangun AI Agent & Automation Workflow dengan Next.js dan Supabase",
    slug: "membangun-ai-agent-automation-nextjs-supabase",
    category: "AI Systems",
    readTime: "6 min read",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    content: `## Pengenalan AI Agentic System

Perkembangan artificial intelligence (AI) telah bergeser dari sekadar *prompt engineering* sederhana menuju **Agentic Workflows**—sistem di mana AI mampu mengambil keputusan mandiri, memanggil tools (function calling), serta mengeksekusi urutan tugas yang kompleks.

Pada artikel ini, kita akan membahas arsitektur integrasi sistem AI dengan framework **Next.js 16** dan **Supabase**.

---

### Key Components dalam Agentic Architecture

1. **LLM Engine**: Model kecerdasan seperti GPT-4o, Claude 3.5 Sonnet, atau Llama 3 yang memproses penalaran.
2. **Tool Execution Engine**: Kemampuan AI untuk mengeksekusi function calls (misal: fetching API, database query, pembuatan file).
3. **Persistent Memory Store**: Penyimpanan riwayat interaksi dan pengetahuan dalam database relasional (Supabase PostgreSQL / Vector store).
4. **State Machine**: Mengelola transisi alur kerja dari input user hingga respon akhir.

\`\`\`typescript
// Contoh implementasi function tool call sederhana
export async function executeToolCall(toolName: string, args: Record<string, any>) {
  switch (toolName) {
    case "queryDatabase":
      return await supabase.from(args.table).select(args.query);
    case "generateArtifact":
      return await createBuildArtifact(args.type, args.payload);
    default:
      throw new Error(\`Tool \${toolName} tidak ditemukan.\`);
  }
}
\`\`\`

---

### Alur Kerja Sistem AI Agent

Berikut adalah tahapan siklus eksekusi agent yang aman dan reliable:

- **Perencanaan (Planning)**: Agent memecah permintaan user menjadi langkah-langkah terstruktur.
- **Validasi Tool**: Agent memastikan parameter tool valid sebelum mengeksekusi command.
- **Eksekusi & Evaluasi**: Hasil eksekusi diperiksa kembali oleh agent untuk memastikan output sesuai kebutuhan.
- **Penyimpanan Memory**: Riwayat eksekusi disimpan ke tabel database untuk pembelajaran konteks selanjutnya.

---

### Kesimpulan

Integrasi Agentic AI membawa aplikasi web ke tingkat otomatisasi yang jauh lebih responsif. Dengan memadukan Next.js App Router dan Supabase, kita dapat membangun sistem AI modern yang scalable dan efisien.`,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    likeCount: 24,
    dislikeCount: 0,
    commentCount: 5,
    authorName: "Brimas Pradika Utama",
    authorAvatar: "/images/avatar.webp",
  },
  {
    id: "sample-2",
    title: "Optimasi Performa Web Modern: Dari Server Components Hingga Edge Caching",
    slug: "optimasi-performa-web-modern-server-components-edge-caching",
    category: "Web Dev",
    readTime: "4 min read",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    content: `## Mengapa Performa Web Sangat Penting?

Waktu muat halaman (*load time*) secara langsung mempengaruhi pengalaman pengguna (*User Experience*) dan pemeringkatan SEO. Setiap detik penundaan dalam merender komponen dapat menurunkan tingkat konversi hingga 20%.

---

### Strategi Optimasi Utama

1. **React Server Components (RSC)**: Memindahkan logika rendering berat ke server sehingga mengurangi ukuran bundle JavaScript yang dikirim ke browser.
2. **Dynamic Image Optimization**: Menggunakan format Next.js Image (\`webp\` / \`avif\`) dengan teknik blur placeholder.
3. **Edge Caching & Middleware**: Menyiapkan layer caching di lokasi paling dekat dengan pengguna melalui jaringan CDN global.

\`\`\`tsx
// Penggunaan Server Component dengan Caching Strategy
export const revalidate = 3600; // revalidate setiap 1 jam

export default async function DataWidget() {
  const data = await fetch('https://api.example.com/stats', { next: { revalidate: 3600 } });
  const result = await data.json();
  
  return <div className="p-4 rounded-xl bg-[#0F172A] text-[#ffffff]">{result.title}</div>;
}
\`\`\`

---

### Checklist Performa

- [x] Kurangi ukuran font pihak ketiga dengan \`next/font\`
- [x] Hilangkan komponen JavaScript unused
- [x] Aktifkan Brotli compression & HTTP/3
- [x] Manfaatkan Web Vitals monitoring

Performa tinggi bukan sekadar fitur tambahan, melainkan pondasi utama arsitektur web berkualitas profesional.`,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    likeCount: 18,
    dislikeCount: 1,
    commentCount: 3,
    authorName: "Brimas Pradika Utama",
    authorAvatar: "/images/avatar.webp",
  },
  {
    id: "sample-3",
    title: "Panduan Lengkap Arsitektur Database Supabase & Prisma ORM",
    slug: "panduan-lengkap-arsitektur-database-supabase-prisma-orm",
    category: "Database",
    readTime: "7 min read",
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80",
    content: `## Memadukan Supabase PostgreSQL dan Prisma ORM

Supabase memberikan infrastruktur PostgreSQL terkelola yang handal, lengkap dengan **Row Level Security (RLS)** dan autentikasi instan. Ketika digabungkan dengan **Prisma ORM**, pengembang mendapatkan proteksi *type-safety* end-to-end yang sangat kuat saat mengembangkan aplikasi Next.js.

---

### Langkah Konfigurasi Schema Prisma

Berikut adalah contoh skema Prisma relasional untuk sistem artikel, komentar, dan reaksi pengguna:

\`\`\`prisma
model Article {
  id         String     @id @default(uuid()) @db.Uuid
  title      String
  slug       String     @unique
  content    String
  thumbnail  String?
  created_at DateTime   @default(now())
  updated_at DateTime   @updatedAt
  reactions  Reaction[]
  comments   Comment[]
}
\`\`\`

---

### Keuntungan Pendekatan Ini

- **Type Safety Autocomplete**: Mencegah typo nama kolom dan kesalahan tipe data saat querying.
- **Migrasi Terstruktur**: Prisma Migrations memudahkan pelacakan perubahan struktur tabel database secara berkelanjutan.
- **Integrasi Supabase Auth**: Menggabungkan user Supabase Auth ke tabel internal untuk relasi data yang rapi.

Dengan kombinasi ini, siklus pengembangan backend menjadi jauh lebih cepat, aman, dan mudah di-maintain.`,
    created_at: new Date(Date.now() - 86400000 * 9).toISOString(),
    likeCount: 31,
    dislikeCount: 0,
    commentCount: 8,
    authorName: "Brimas Pradika Utama",
    authorAvatar: "/images/avatar.webp",
  }
];

// Helper: hitung estimated read time
function calculateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min read`;
}

// --- HELPER LOGIC ADMIN ROLE ---
export async function checkIsAdmin(email?: string | null): Promise<boolean> {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Cek environment variables ADMIN_EMAILS (daftar email admin eksplisit).
  //    Set di Vercel: ADMIN_EMAILS="email1@domain.com,email2@domain.com"
  const envAdminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (envAdminEmails.length > 0 && envAdminEmails.includes(normalizedEmail)) {
    return true;
  }

  // 2. Periksa role ADMIN di database Prisma (sumber kebenaran utama).
  //    HANYA user dengan role="ADMIN" di DB yang dianggap admin.
  //    TIDAK ada fallback berdasarkan keyword email — itu celah keamanan
  //    karena siapa pun dengan "admin" di emailnya bisa mendapat akses penuh.
  try {
    const dbUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { role: true },
    });
    if (dbUser && dbUser.role === "ADMIN") {
      return true;
    }
  } catch {}

  return false;
}

// 1. Ambil daftar artikel dengan filter search, kategori, dan sort
export async function getArticles(params?: {
  query?: string;
  category?: string;
  sort?: "latest" | "oldest" | "popular";
}): Promise<ArticleItem[]> {
  try {
    // Fetch dari database via Prisma
    const dbArticles = await prisma.article.findMany({
      include: {
        reactions: true,
        comments: true,
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
          content: art.content,
          thumbnail: art.thumbnail,
          category,
          readTime: calculateReadTime(art.content),
          created_at: art.created_at.toISOString(),
          updated_at: art.updated_at.toISOString(),
          likeCount,
          dislikeCount,
          commentCount: art.comments.length,
          authorName: "Brimas Pradika Utama",
          authorAvatar: "/images/avatar.webp",
        };
      });

      if (params?.query) {
        const q = params.query.toLowerCase();
        articles = articles.filter(
          (a) => a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q)
        );
      }

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
}

// 2. Ambil detail artikel berdasarkan Slug
export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
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
        comments: {
          include: {
            user: true,
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
        authorName: "Brimas Pradika Utama",
        authorAvatar: "/images/avatar.webp",
        userReaction,
        comments: art.comments.map((c) => ({
          id: c.id,
          content: c.content,
          created_at: c.created_at.toISOString(),
          user_id: c.user_id,
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
      comments: [
        {
          id: "comment-1",
          content: "Penjelasan yang sangat lengkap dan tajam! Sangat bermanfaat untuk workflow Next.js.",
          created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
          user_id: "user-demo-1",
          user: {
            id: "user-demo-1",
            name: "Alex Pratama",
            avatar: null,
          },
        },
        {
          id: "comment-2",
          content: "Mantap mas Brimas, ditunggu kelanjutan implementasi Supabase RLS-nya!",
          created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
          user_id: "user-demo-2",
          user: {
            id: "user-demo-2",
            name: "Rian Hidayat",
            avatar: null,
          },
        },
      ],
    };
  }

  return null;
}

// 3. Admin-only: Buat Artikel Baru
export async function createArticle(data: {
  title: string;
  slug: string;
  content: string;
  thumbnail?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await checkIsAdmin(user.email))) {
    return { error: "Akses ditolak. Hanya Admin yang dapat membuat artikel baru." };
  }

  try {
    const slugFormatted = data.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-");

    const newArt = await prisma.article.create({
      data: {
        title: data.title.trim(),
        slug: slugFormatted,
        content: data.content.trim(),
        thumbnail: data.thumbnail?.trim() || null,
      },
    });

    revalidatePath("/posts");
    return { success: true, article: newArt };
  } catch (err: any) {
    return { error: err?.message || "Gagal membuat artikel baru." };
  }
}

// 4. Admin-only: Hapus Artikel
export async function deleteArticle(articleId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await checkIsAdmin(user.email))) {
    return { error: "Akses ditolak. Hanya Admin yang dapat menghapus artikel." };
  }

  try {
    await prisma.article.delete({ where: { id: articleId } });
    revalidatePath("/posts");
    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Gagal menghapus artikel." };
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

    let articleExists = await prisma.article.findUnique({ where: { id: articleId } });
    if (!articleExists) {
      const sample = SAMPLE_ARTICLES.find((s) => s.id === articleId || s.slug === articleId);
      if (sample) {
        articleExists = await prisma.article.create({
          data: {
            id: sample.id.startsWith("sample-") ? undefined : sample.id,
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

    revalidatePath(`/posts/${articleExists.slug}`);
    revalidatePath("/posts");

    return { success: true };
  } catch (err: any) {
    console.error("Error in toggleArticleReaction:", err);
    return { error: err?.message || "Gagal memproses reaksi artikel." };
  }
}

// 6. Tambah Komentar
export async function addArticleComment(articleId: string, content: string) {
  if (!content || content.trim().length === 0) {
    return { error: "Komentar tidak boleh kosong." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Harus login terlebih dahulu untuk menulis komentar." };
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

    let articleExists = await prisma.article.findUnique({ where: { id: articleId } });
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

    const newComment = await prisma.comment.create({
      data: {
        article_id: articleExists.id,
        user_id: dbUser.id,
        content: content.trim(),
      },
      include: {
        user: true,
      },
    });

    revalidatePath(`/posts/${articleExists.slug}`);
    revalidatePath("/posts");

    return {
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
        },
      },
    };
  } catch (err: any) {
    console.error("Error adding comment:", err);
    return { error: err?.message || "Gagal menambahkan komentar." };
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

    revalidatePath("/posts");
    return { success: true };
  } catch (err: any) {
    console.error("Error deleting comment:", err);
    return { error: err?.message || "Gagal menghapus komentar." };
  }
}

// 8. Seed Artikel Sampel ke Database jika kosong
export async function seedSampleArticlesIfEmpty() {
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

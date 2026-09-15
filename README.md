# 🚀 Dokumentasi Arsitektur Project: Sistem Artikel & Middleware

Selamat datang! Dokumentasi ini dibuat khusus dengan bahasa yang santai, lugas, dan gampang dipahami (cocok buat teman-teman SMK atau pemula yang baru belajar *fullstack web development*).

Project ini dibangun menggunakan teknologi modern:
- **Framework Core**: Next.js 16 (React 19 App Router & Server Actions)
- **Database & ORM**: PostgreSQL & Prisma ORM
- **Backend & Auth**: Supabase Auth (OAuth Google/GitHub & Password) & Supabase Storage
- **Editor Artikel**: Tiptap Rich Text Editor (Word-like WYSIWYG Editor)

---

## 📘 1. Penjelasan Umum

### 🎯 Project Ini Buat Apa?
Project ini adalah **Website Portofolio & Platform Editorial Interaktif**. Tempat di mana pemilik website (Admin) bisa mempublikasikan artikel teknis, catatan arsitektur perangkat lunak, serta mengelola portofolio. Pengunjung biasa (*User*) bisa membaca artikel, memberikan reaksi (*Like/Dislike*), dan menulis komentar.

### 📰 Sistem Artikel Fungsinya Apa?
Sistem Artikel bertugas mengelola seluruh siklus data artikel (CRUD):
1. **Create**: Membuat artikel baru lengkap dengan judul, slug URL, gambar thumbnail, dan konten format HTML dari Rich Text Editor.
2. **Read**: Menampilkan daftar artikel di halaman publik dengan fitur pencarian (*search*), filter kategori, serta mengurutkan (*sorting*).
3. **Update**: Mengedit artikel yang sudah ada (mengubah judul, konten, atau thumbnail).
4. **Delete**: Menghapus artikel yang tidak lagi digunakan dari database.

### 🛡️ Sistem Middleware Fungsinya Apa?
Middleware adalah **satpam / penjaga pintu gerbang** otomatis yang berjalan di server *sebelum* sebuah *request* HTTP sampai ke rute halaman atau fungsi controller/Server Action.

Fungsi utamanya:
1. **Perpanjang Sesi (Session Refresh)**: Memperbarui token autentikasi cookie Supabase secara otomatis agar pengguna tidak mendadak *logged out*.
2. **Proteksi Rute Admin (`/admin`)**: Memeriksa apakah pengguna yang mencoba mengakses halaman Dashboard Admin atau fitur CRUD artikel benar-benar memiliki akses sebagai Admin.

### 🔗 Kenapa Keduanya Saling Berhubungan?
Sistem Artikel berisi fungsi-fungsi sensitif (seperti `createArticle`, `updateArticle`, `deleteArticle`). Jika tidak ada Middleware dan pemeriksaan hak akses (Admin Check), **siapa pun di internet bisa menghapus atau mengubah isi artikel kamu**.

Middleware dan Server Action bekerja sama: Middleware menyaring akses rute di tingkat navigasi URL (`/admin/*`), sedangkan Server Action memastikan keamanan di tingkat transaksi data database.

---

## 🔄 2. Alur Kerja (Flow) Request ke Response

Berikut adalah gambaran perjalanan sebuah *request* ketika pengguna berinteraksi dengan website:

```text
[ USER (Browser) ]
       │
       │  (1) Pengguna klik "Simpan Artikel" atau buka halaman "/admin"
       ▼
[ MIDDLEWARE (middleware.ts / updateSession) ]
       │
       ├─► (2) Update & Verifikasi Cookie Token Supabase Auth
       │
       ├─► (3) Apakah rute diawali "/admin"?
       │      ├── TIDAK  ──► (Lolos) Lanjut ke rute halaman publik (/posts, /dashboard)
       │      └── YA ─────► Cek Email User ke OWNER_EMAIL / ADMIN_EMAILS / Database
       │                      ├── BUKAN ADMIN ──► ❌ Redirect otomatis ke /login atau /dashboard
       │                      └── ADALAH ADMIN ─► ✅ (Lolos) Lanjut ke rute /admin
       ▼
[ SERVER ACTION / CONTROLLER (lib/actions/article.ts) ]
       │
       ├─► (4) Cek ulang keamanan fungsi (checkIsAdmin)
       ├─► (5) Format Slug URL & Validasi Input (Format UUID, Ukuran File Gambar)
       ├─► (6) Upload Gambar ke Supabase Storage (Jika ada gambar)
       ▼
[ DATABASE (Prisma ORM & PostgreSQL) ]
       │
       ├─► (7) Simpan / Update / Hapus data di tabel 'Article'
       ▼
[ REVALIDATION & RESPONSE ]
       │
       ├─► (8) revalidatePath('/posts') ──► Membersihkan cache agar tampilan artikel langsung terbarui
       └─► (9) Kirim balasan JSON { success: true } ke UI Browser
```

---

## 📁 3. Struktur Folder & File Utama

Berikut susunan file kunci yang mengatur Sistem Artikel dan Middleware:

```text
c:\personal-website\
├── middleware.ts                   # Entry point Middleware utama Next.js
├── lib/
│   ├── supabase/
│   │   ├── middleware.ts           # Logika refresh session & proteksi rute /admin
│   │   ├── client.ts               # Inisialisasi Supabase Client & pembacaan ENV
│   │   └── storage.ts              # Helper pengunggahan file ke Supabase Storage Bucket
│   ├── actions/
│   │   ├── auth.ts                 # Logika Autentikasi (Google/GitHub OAuth, Passwords, checkIsAdmin)
│   │   └── article.ts              # Logika Utama Sistem Artikel (CRUD, Like/Dislike, Komentar)
│   └── prisma.ts                   # Inisialisasi Prisma Client (Koneksi Database)
├── prisma/
│   └── schema.prisma               # Struktur tabel database (User, Article, Reaction, Comment)
├── app/
│   ├── admin/                      # Halaman Dashboard Admin & Pengelolaan Artikel
│   │   └── articles/               # Tabel dan Form Manajemen Artikel
│   └── posts/                      # Halaman Publik Tempat Membaca Artikel
└── components/
    └── RichTextEditor.tsx          # Komponen Editor Tulis Artikel (Tiptap WYSIWYG)
```

---

## 💻 4. Penjelasan Setiap Fungsi & Kode Lengkap

Berikut adalah penjelasan detail fungsi-fungsi utama di dalam sistem. Setiap potongan kode disajikan **LENGKAP tanpa ada yang dipotong (`...`)**.

---

### A. SISTEM MIDDLEWARE

#### 1. Fungsi `updateSession(request: NextRequest)`
- **Lokasi File**: `lib/supabase/middleware.ts`
- **Tujuan**: Memperbarui cookie sesi autentikasi Supabase dan memproteksi rute `/admin`.
- **Parameter Input**: `request: NextRequest` (Objek HTTP Request dari Next.js).
- **Output / Hasil**: `NextResponse` (Meneruskan request atau melakukan *redirect*).

```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "./client";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },

          setAll(cookiesToSet) {
            // PENTING: Tulis cookies ke request DAN ke response agar sesi
            // selalu ter-refresh dan tidak pernah membaca token lama.
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );

            supabaseResponse = NextResponse.next({ request });

            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Refresh user session from Supabase Auth server per-request.
    const { data: { user } } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;
    const isAdminRoute = pathname.startsWith("/admin");

    if (isAdminRoute) {
      if (!user || !user.email) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirectedFrom", pathname);
        return NextResponse.redirect(loginUrl);
      }

      const userEmail = user.email.toLowerCase().trim();
      const ownerEmail = (process.env.OWNER_EMAIL || "").trim().toLowerCase();
      const adminEmails = (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      const isOwnerOrAdmin =
        (ownerEmail && userEmail === ownerEmail) ||
        adminEmails.includes(userEmail) ||
        userEmail === "brimaspradika8@gmail.com";

      if (!isOwnerOrAdmin) {
        const dashboardUrl = new URL("/dashboard", request.url);
        return NextResponse.redirect(dashboardUrl);
      }
    }

  } catch (err) {
    console.error(
      "Middleware Supabase Session Error:",
      err
    );
  }

  return supabaseResponse;
}
```

**Penjelasan Alur Baris Kode:**
- **Baris 11-35**: Membuat klien Supabase SSR khusus server untuk menangani *cookie* pengguna.
- **Baris 38**: Memanggil `supabase.auth.getUser()` untuk memvalidasi token JWT pengguna langsung ke server Supabase.
- **Baris 41-48**: Memeriksa apakah rute diawali dengan `/admin`. Jika iya dan pengguna belum login, jalankan *redirect* ke `/login?redirectedFrom=...`.
- **Baris 50-65**: Memeriksa email pengguna apakah cocok dengan `OWNER_EMAIL`, daftar `ADMIN_EMAILS`, atau email spesifik Admin. Jika pengguna login tetapi **bukan Admin**, mereka di-redirect ke `/dashboard`.

---

#### 2. Fungsi `checkIsAdmin(email?: string | null)`
- **Lokasi File**: `lib/actions/auth.ts`
- **Tujuan**: Memeriksa hak akses Admin di level Server Actions/API.
- **Parameter Input**: `email?: string | null` (Email pengguna yang sedang login).
- **Output / Hasil**: `Promise<boolean>` (`true` jika Admin, `false` jika bukan).

```typescript
export async function checkIsAdmin(email?: string | null): Promise<boolean> {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase().trim();

  const ownerEmail = (process.env.OWNER_EMAIL || "").trim().toLowerCase();
  if (ownerEmail && normalizedEmail === ownerEmail) {
    return true;
  }

  const envAdminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (envAdminEmails.length > 0 && envAdminEmails.includes(normalizedEmail)) {
    return true;
  }

  if (normalizedEmail === "brimaspradika8@gmail.com") {
    return true;
  }

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
```

**Penjelasan Alur Baris Kode:**
- **Baris 36**: Jika email kosong/undefined, langsung kembalikan `false`.
- **Baris 39-55**: Memeriksa kecocokan email terhadap variabel lingkungan (`OWNER_EMAIL`, `ADMIN_EMAILS`) dan email fallback owner.
- **Baris 57-65**: Mengueri tabel `User` di database PostgreSQL melalui Prisma untuk mengecek apakah kolom `role === 'ADMIN'`.

---

### B. SISTEM ARTIKEL

#### 3. Fungsi `getArticles(params)`
- **Lokasi File**: `lib/actions/article.ts`
- **Tujuan**: Mengambil daftar artikel dari database dengan fitur pencarian, filter kategori, dan pengurutan.
- **Parameter Input**: `params?: { query?: string; category?: string; sort?: "latest" | "oldest" | "popular" }`
- **Output / Hasil**: `Promise<ArticleItem[]>` (Array objek daftar artikel).

```typescript
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
```

**Penjelasan Alur Baris Kode:**
- **Baris 233-242**: Mengambil data artikel dari PostgreSQL menggunakan Prisma `findMany`, lengkap dengan data relasi `reactions` dan `comments`.
- **Baris 245-275**: Melakukan pemetaan (*mapping*) data, menghitung jumlah *Like*, serta menentukan kategori otomatis berdasarkan kata kunci judul.
- **Baris 277-293**: Menyaring artikel berdasarkan pencarian kata kunci (`params.query`) dan kategori (`params.category`).
- **Baris 336-354**: Mekanisme *Fail-Safe / Fallback* jika database belum di-seed, mengembalikan daftar sampel artikel default berkualitas tinggi agar tampilan UI tidak crash.

---

#### 4. Fungsi `createArticle(data)`
- **Lokasi File**: `lib/actions/article.ts`
- **Tujuan**: Membuat dan menyimpan artikel baru ke database.
- **Parameter Input**: `data: { title: string; slug: string; content: string; thumbnail?: string }`
- **Output / Hasil**: `Promise<{ success: boolean; article?: Article; error?: string }>`

```typescript
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
    let slugFormatted = data.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-");

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
        title: data.title.trim(),
        slug: slugFormatted,
        content: data.content.trim(),
        thumbnail: data.thumbnail?.trim() || null,
      },
    });

    revalidatePath("/posts");
    revalidatePath("/admin/articles");
    return { success: true, article: newArt };
  } catch (err: unknown) {
    console.error("Error creating article:", err);
    return { error: (err as Error)?.message || "Gagal membuat artikel baru." };
  }
}
```

**Penjelasan Alur Baris Kode:**
- **Baris 542-547**: Verifikasi keamanan ganda. Mengambil user aktif dan memastikan email user adalah Admin (`checkIsAdmin`).
- **Baris 550-565**: Pembersihan format Slug URL. Mengubah huruf besar menjadi kecil, mengganti spasi menjadi tanda hubung (`-`), serta menambahkan karakter acak jika slug sudah pernah terpakai (mencegah *duplicate key error*).
- **Baris 567-574**: Menyimpan artikel baru ke database PostgreSQL via Prisma `create`.
- **Baris 576-577**: Memanggil `revalidatePath` untuk memperbarui cache Next.js pada halaman `/posts` dan `/admin/articles`.

---

#### 5. Fungsi `updateArticle(articleId, data)`
- **Lokasi File**: `lib/actions/article.ts`
- **Tujuan**: Memperbarui artikel yang ada di database atau mengonversi sampel artikel menjadi data DB permanen.
- **Parameter Input**: `articleId: string`, `data: { title: string; slug: string; content: string; thumbnail?: string }`
- **Output / Hasil**: `Promise<{ success: boolean; article?: Article; error?: string }>`

```typescript
export async function updateArticle(
  articleId: string,
  data: {
    title: string;
    slug: string;
    content: string;
    thumbnail?: string;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await checkIsAdmin(user.email))) {
    return { error: "Akses ditolak. Hanya Admin yang dapat mengedit artikel." };
  }

  try {
    let slugFormatted = data.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-");

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

    let updatedArt;
    if (!existingArt) {
      // Jika merupakan sample article atau belum ada di database, buat artikel baru di database
      updatedArt = await prisma.article.create({
        data: {
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

    revalidatePath("/posts");
    revalidatePath(`/posts/${slugFormatted}`);
    revalidatePath("/admin/articles");
    return { success: true, article: updatedArt };
  } catch (err: unknown) {
    console.error("Error updating article:", err);
    return { error: (err as Error)?.message || "Gagal memperbarui artikel." };
  }
}
```

**Penjelasan Alur Baris Kode:**
- **Baris 639-641**: Memeriksa apakah `articleId` berformat UUID yang valid (`isValidUuid`) sebelum memanggil query Prisma untuk mencegah error validasi database.
- **Baris 648-668**: Logika *Upsert* cerdas: Jika artikel yang di-edit adalah sampel (belum ada di database), fungsi ini otomatis menjalankan `prisma.article.create`. Jika sudah ada di database, fungsi menjalankan `prisma.article.update`.

---

#### 6. Fungsi `deleteArticle(articleId)`
- **Lokasi File**: `lib/actions/article.ts`
- **Tujuan**: Menghapus artikel dari database berdasarkan ID.
- **Parameter Input**: `articleId: string` (ID unik artikel).
- **Output / Hasil**: `Promise<{ success: boolean; error?: string }>`

```typescript
export async function deleteArticle(articleId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await checkIsAdmin(user.email))) {
    return { error: "Akses ditolak. Hanya Admin yang dapat menghapus artikel." };
  }

  try {
    if (isValidUuid(articleId)) {
      const existingArt = await prisma.article.findUnique({ where: { id: articleId } });
      if (existingArt) {
        await prisma.article.delete({ where: { id: articleId } });
      }
    }
    revalidatePath("/posts");
    revalidatePath("/admin/articles");
    return { success: true };
  } catch (err: unknown) {
    console.error("Error deleting article:", err);
    return { error: (err as Error)?.message || "Gagal menghapus artikel." };
  }
}
```

**Penjelasan Alur Baris Kode:**
- **Baris 590-592**: Proteksi hak akses Admin.
- **Baris 595-600**: Memastikan `articleId` berformat UUID valid sebelum mengeksekusi `prisma.article.delete`. Jika ID adalah ID artikel sampel (misal `sample-1`), fungsi mengabaikan pemanggilan database agar tidak terjadi *runtime error*.

---

#### 7. Fungsi `uploadArticleImage(formData)`
- **Lokasi File**: `lib/actions/article.ts`
- **Tujuan**: Mengunggah file gambar (thumbnail atau gambar konten) ke Supabase Storage.
- **Parameter Input**: `formData: FormData` (Objek form yang berisi file gambar).
- **Output / Hasil**: `Promise<{ url?: string; error?: string }>`

```typescript
export async function uploadArticleImage(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await checkIsAdmin(user.email))) {
    return { error: "Akses ditolak. Hanya pemilik yang dapat mengunggah gambar artikel." };
  }

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { error: "File gambar tidak ditemukan." };
  }

  if (!file.type.startsWith("image/")) {
    return { error: "File harus berupa format gambar (JPG, PNG, WEBP, SVG, GIF)." };
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
```

**Penjelasan Alur Baris Kode:**
- **Baris 514-525**: Memvalidasi eksistensi file, memastikan tipe MIME file berawalan `image/`, dan membatasi ukuran file maksimal 8MB.
- **Baris 528**: Mengunggah file ke bucket `article-images` di Supabase Storage dan mengembalikan URL publik gambar.

---

## 🛡️ 5. Cara Middleware Bekerja Secara Detail

Middleware Next.js berfungsi di level jaringan HTTP sebelum rute halaman dirender:

1. **Penyaringan Request**:
   - matcher di `middleware.ts` mengonfigurasi rute mana saja yang diperiksa. Seluruh rute aplikasi diperiksa **kecuali** file statis (`_next/static`, `favicon.ico`, gambar, dan rute OAuth callback `/api/auth/`).

2. **Skenario Gagal / Akses Ditolak**:
   - Jika pengguna **belum login** mencoba membuka rute `/admin/*` ──► Middleware memotong request dan meredirect pengguna ke `/login?redirectedFrom=/admin/articles`.
   - Jika pengguna **sudah login tetapi BUKAN Admin** mencoba membuka rute `/admin/*` ──► Middleware memotong request dan meredirect pengguna ke `/dashboard`.

3. **Skenario Lolos**:
   - Jika email pengguna terdaftar di `OWNER_EMAIL` atau `ADMIN_EMAILS` ──► Middleware menambahkan header cookie terbaru dan meneruskan request ke komponen rute `/admin`.

---

## 🚀 6. Contoh Penggunaan (Cara Pakai)

### 📤 Contoh Request Membuat Artikel Baru (Client Component):

```typescript
import { createArticle } from "@/lib/actions/article";

async function handleSaveArticle() {
  const result = await createArticle({
    title: "Membangun RESTful API dengan Next.js 16 & Prisma",
    slug: "membangun-restful-api-nextjs-16-prisma",
    content: "<p>Ini adalah isi artikel tentang arsitektur Next.js 16...</p>",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
  });

  if (result.error) {
    alert(`Gagal: ${result.error}`);
  } else {
    alert("Artikel berhasil disimpan!");
    console.log("Artikel Baru:", result.article);
  }
}
```

---

### ✅ Contoh Response Sukses:
```json
{
  "success": true,
  "article": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "title": "Membangun RESTful API dengan Next.js 16 & Prisma",
    "slug": "membangun-restful-api-nextjs-16-prisma",
    "content": "<p>Ini adalah isi artikel tentang arsitektur Next.js 16...</p>",
    "thumbnail": "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    "created_at": "2026-09-15T07:00:00.000Z",
    "updated_at": "2026-09-15T07:00:00.000Z"
  }
}
```

---

### ❌ Contoh Response Akses Ditolak (Bukan Admin):
```json
{
  "error": "Akses ditolak. Hanya Admin yang dapat membuat artikel baru."
}
```

---

## 💡 7. Catatan Tambahan & Tips Penting

1. **Variabel Lingkungan (Environment Variables)**:
   Pastikan file `.env` di komputer lokal atau *Environment Variables* di Vercel Dashboard terisi dengan benar:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGci..."
   DATABASE_URL="postgresql://postgres:xxx@db.xxx.supabase.co:5432/postgres"
   OWNER_EMAIL="brimaspradika8@gmail.com"
   ADMIN_EMAILS="admin@domain.com,brimaspradika8@gmail.com"
   ```

2. **Validasi Format UUID (`isValidUuid`)**:
   - Selalu gunakan fungsi `isValidUuid(id)` sebelum melakukan `findUnique` atau `delete` ke Prisma untuk ID artikel. Karena jika string seperti `"sample-1"` dipaksa masuk ke query Prisma UUID, database PostgreSQL akan melempar error `Inconsistent column data: Error creating UUID`.

3. **Bucket Supabase Storage**:
   - Pastikan kamu telah membuat Bucket bernama `article-images` dan `avatars` di Dashboard Supabase (`Storage -> Buckets`) dengan akses **Public** agar gambar thumbnail dapat diakses oleh publik.

---
*Dokumentasi ini dibuat untuk proyek Personal Website & Management System oleh Brimas Pradika Utama.*

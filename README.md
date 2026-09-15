# 🌐 FITUR HALAMAN PUBLIK

Bagian ini mendokumentasikan tiga rute halaman publik utama dalam website. Halaman publik ini dapat diakses secara bebas oleh siapa saja tanpa memerlukan autentikasi login (*guest mode*), kecuali untuk memberikan reaksi Suka/Tidak Suka dan menulis Komentar yang membutuhkan login akun terlebih dahulu.

---

## 1. HALAMAN HOMEPAGE (`/` / `/dashboard`)
> **Peta Subtask**: Memenuhi **Subtask 1** — Halaman `/` (Homepage) yang berisi Hero section (foto, nama, tagline), About section (cerita singkat), Portofolio section (list project hardcoded), dan Artikel Terbaru (3 artikel terakhir dari database PostgreSQL/Prisma).

### a. TUJUAN HALAMAN
- **Fungsi Utama**: Sebagai landing page utama untuk memperkenalkan profil Brimas Pradika Utama sebagai Software & AI Systems Developer, memamerkan portofolio karya unggulan, serta menyajikan 3 artikel teknis terbaru.
- **Hak Akses**: Publik (*unauthenticated* / tanpa login). Bisa diakses oleh siapa saja.

### b. ALUR KERJA HALAMAN
1. Pengguna membuka URL `/` (yang di-redirect oleh Next.js Router ke `/dashboard`).
2. Server Component `app/dashboard/page.tsx` dieksekusi di server Next.js.
3. Server mengambil sesi login pengguna dari Supabase Auth via `supabase.auth.getUser()`.
4. Server mengeksekusi query database via Prisma ORM:
   - Query artikel: `prisma.article.findMany({ include: { reactions: true, comments: true }, orderBy: { created_at: "desc" } })` di dalam helper `getArticles()`.
   - Query user: `prisma.user.findUnique({ where: { email } })` untuk mengecek profil pengguna di tabel `User`.
5. Server mengirimkan data hasil query ke Client Component `DashboardClient` (`app/dashboard/dashboard-client.tsx`).
6. Browser merender 4 bagian utama halaman secara interaktif.

### c. STRUKTUR / KOMPONEN DI HALAMAN
- **Top Navigation Bar**: Floating bar berlatar blur (*glassmorphism*) berisi logo, menu navigasi `#hero`, `#about`, `#projects`, `/posts`, tombol ubah bahasa, dan tombol Admin Panel (jika login sebagai Admin).
- **Hero Section**:
  - Foto cutout profil Brimas Pradika Utama (`/images/avatar.webp`).
  - Judul headline utama: Teks greeting berganti 16 bahasa internasional, nama "I'M BRIMAS PRADIKA UTAMA", dan tagline "Software & AI Systems Developer".
  - Background marquee bergerak ("WELCOME").
- **About Section**:
  - Cerita profil singkat Brimas Pradika Utama sebagai siswa SMK Bhakti Mulia Pare yang aktif membangun aplikasi Fullstack Web.
  - Kartu interaktif 3D Physics Lanyard menggunakan Three.js (`<Lanyard />`).
- **Section Artikel Terbaru**:
  - Mengambil 3 artikel paling baru dari database.
  - Tata letak *editorial magazine*: 1 artikel utama (*featured card* besar) di sisi kiri dan 2 artikel sekunder (*stacked cards*) di sisi kanan.
- **Section Portofolio (`components/ProjectShowcase.tsx`)**:
  - Menampilkan daftar karya proyek.
  - **Kenapa Data Portofolio Di-hardcode?**: Karena proyek portofolio utama merupakan karya unggulan yang membutuhkan tampilan khusus, aset gambar statis lokal (`/images/project1.png`), dan link repository yang bersifat tetap. Datanya disimpan dalam variabel array `showcaseProjects` pada file `components/ProjectShowcase.tsx`. Namun, komponen ini tetap dilengkapi fitur *Supabase Live Sync* (`handleSyncSupabase`) untuk mengambil data dinamis dari tabel `Project` di database jika ada proyek baru.

### d. KODE LENGKAP

> 📂 Untuk melihat kode lengkap, buka file sumber langsung:

| No | Deskripsi | Lokasi File |
|----|-----------|-------------|
| 1 | Server Page Homepage | `app/dashboard/page.tsx` |
| 2 | Client Component Homepage | `app/dashboard/dashboard-client.tsx` |
| 3 | Data Portofolio Hardcoded | `components/ProjectShowcase.tsx` |
| 4 | Helper Fetch Artikel | `lib/actions/article.ts` → fungsi `getArticles()` |

**Penjelasan Singkat Kode Kunci:**
- **`app/dashboard/page.tsx`**: Server Component. Menggunakan `noStore()` & `dynamic = "force-dynamic"` agar data selalu fresh. Memanggil `getArticles()` untuk ambil 3 artikel terbaru dari DB.
- **`app/dashboard/dashboard-client.tsx`**: Client Component. Merender Hero Section, About, Portofolio, dan grid 3 artikel terbaru (1 featured + 2 side cards). Jika database kosong, otomatis fallback ke `SAMPLE_ARTICLES`.
- **`components/ProjectShowcase.tsx`**: Menyimpan array `showcaseProjects` (data hardcoded) berisi 3 proyek unggulan dengan thumbnail lokal (`/images/project1.png`). Dilengkapi fitur `handleSyncSupabase` untuk live sync dari tabel `Project`.

### e. RELASI KE DATABASE
- **Tabel `Article`**: Field `id`, `title`, `slug`, `content`, `thumbnail`, `created_at`.
- **Tabel `Project`** (jika live sync aktif): Field `id`, `title`, `slug`, `description`, `thumbnail`, `demo_url`, `repository_url`.

### f. CATATAN & EDGE CASE
- **Database Masih Kosong**: Kode otomatis fallback ke array sampel agar UI tetap berjalan.
- **Gambar Thumbnail Rusak/Kosong**: Menggunakan gambar pengganti dari Unsplash.

---

## 2. HALAMAN LIST ARTIKEL (`/artikel` / `/posts`)
> **Peta Subtask**: Memenuhi **Subtask 2** — Halaman `/artikel` (di aplikasi terpetakan pada rute `/posts`) yang mengambil semua artikel dari database dan menampilkannya dalam bentuk card clickable (thumbnail, judul, tanggal, jumlah reaksi/komentar).

### a. TUJUAN HALAMAN
- **Fungsi Utama**: Menyajikan seluruh daftar artikel teknis yang tersimpan di database PostgreSQL dalam bentuk kartu (*card grid*), dilengkapi pencarian kata kunci, penyaringan kategori, dan pengurutan (*sorting*).
- **Hak Akses**: Publik (*unauthenticated* / tanpa login).

### b. ALUR KERJA HALAMAN
1. Pengguna membuka rute `/posts` atau `/artikel`.
2. Next.js merender Server Component `app/posts/page.tsx`.
3. Server memanggil fungsi `getArticles()` di `lib/actions/article.ts`.
4. Fungsi `getArticles()` menjalankan query Prisma ke PostgreSQL:
   ```typescript
   await prisma.article.findMany({
     include: { reactions: true, comments: true },
     orderBy: { created_at: "desc" },
   });
   ```
5. Prisma mengembalikan daftar artikel beserta relasi `reactions` dan `comments`.
6. Server me-render `PostsClient` (`app/posts/posts-client.tsx`) dan mengoper array artikel ke *state* React.
7. Ketika pengguna mengetik di kotak pencarian atau memilih pill kategori, React melakukan *filtering* reaktif di sisi client tanpa perlu *reload* halaman.
8. Pengguna mengklik kartu artikel untuk menuju ke detail artikel `/posts/[slug]`.

### c. STRUKTUR / KOMPONEN DI HALAMAN
- **Top Navigation & Breadcrumb**: Tombol kembali ke beranda dan tombol "Seed Artikel" (khusus Admin jika DB kosong).
- **Hero Title**: Headings "Artikel & Wawasan Teknis" dan sub-deskripsi.
- **Search & Filter Bar**:
  - Input Teks Pencarian (`Search`) dengan fitur tombol *Clear*.
  - Select Dropdown Pengurutan (Terbaru, Terpopuler, Terlama).
  - Category Filter Pills ("Semua", "AI Systems", "Web Dev", "Database", "Tutorial").
- **Grid Card Artikel**:
  - Component `ArticleThumbnail` (berisi skeleton loading animation & error fallback).
  - Category Badge Pill.
  - Estimated Read Time (hitung otomatis dari jumlah kata).
  - Judul Artikel & Snippet Teks Excerpt.
  - Footer Meta: Tanggal Rilis, Jumlah Suka (`Heart`), Jumlah Komentar (`MessageSquare`), dan Ikon Navigasi.

### d. KODE LENGKAP

> 📂 Untuk melihat kode lengkap, buka file sumber langsung:

| No | Deskripsi | Lokasi File |
|----|-----------|-------------|
| 1 | Server Page List Artikel | `app/posts/page.tsx` |
| 2 | Client Component List Artikel | `app/posts/posts-client.tsx` |
| 3 | Helper Fetch Artikel + Filter | `lib/actions/article.ts` → fungsi `getArticles()` |
| 4 | Helper Seed Artikel Sampel | `lib/actions/article.ts` → fungsi `seedSampleArticlesIfEmpty()` |

**Penjelasan Singkat Kode Kunci:**
- **`app/posts/page.tsx`**: Server Component. Memanggil `getArticles()` dan mengoper hasilnya ke `PostsClient`.
- **`app/posts/posts-client.tsx`**: Client Component utama. Berisi logika pencarian reaktif (`searchQuery`), filter kategori via pill buttons (`CATEGORIES`), dropdown sorting (Terbaru/Terpopuler/Terlama), komponen `ArticleThumbnail` (dengan skeleton loading & error fallback), dan grid kartu artikel responsif 3 kolom.
- **`lib/actions/article.ts` → `getArticles()`**: Mengambil data dari `prisma.article.findMany()` beserta relasi `reactions` dan `comments`, lalu memetakan ke tipe `ArticleItem[]`. Jika Prisma gagal, fallback ke `SAMPLE_ARTICLES`.

### e. RELASI KE DATABASE
- **Tabel `Article`**: Membaca kolom `id`, `title`, `slug`, `content`, `thumbnail`, `created_at`.
- **Tabel `Reaction`**: Menghitung jumlah Like/Dislike per artikel.
- **Tabel `Comment`**: Menghitung total komentar per artikel.

### f. CATATAN & EDGE CASE
- **Tidak Ada Hasil Pencarian**: Menampilkan kartu "Tidak Ada Artikel Ditemukan" dan tombol "Reset Filter".

---

## 3. HALAMAN DETAIL ARTIKEL (`/artikel/[id]` / `/posts/[slug]`)
> **Peta Subtask**: Memenuhi **Subtask 3** — Halaman `/artikel/[id]` (di aplikasi terpetakan pada rute `/posts/[slug]`) yang mengambil detail artikel berdasarkan Slug/ID, menampilkan judul, tanggal, konten rich text/markdown, jumlah reaksi Suka & Tidak Suka, serta section komentar di bawahnya.

### a. TUJUAN HALAMAN
- **Fungsi Utama**: Menampilkan isi lengkap satu artikel teknis beserta metadata (author, tanggal, estimasi waktu baca), indikator persentase membaca (*Reading Progress Bar*), Daftar Isi (*Table of Contents*), renderer konten Rich Text/Markdown dengan fitur salin kode (*Copy Code*), tombol Suka & Tidak Suka, tombol bagikan sosial media, serta kolom diskusi komentar.
- **Hak Akses**: Publik (*unauthenticated* / tanpa login). Namun untuk memberikan Suka/Tidak Suka atau mengirim Komentar, pengguna wajib terautentikasi (login).

### b. ALUR KERJA HALAMAN
1. Pengguna membuka URL `/posts/[slug]` (misal `/posts/transisi-arsitektur-software-membangun-enterprise-ai-agent-nextjs`).
2. Server Component `app/posts/[slug]/page.tsx` dijalankan:
   - Memanggil `incrementArticleViews(slug)` untuk menambah jumlah pembaca pada kolom `views` tabel `Article`.
   - Memanggil `getArticleBySlug(slug)` di `lib/actions/article.ts`.
3. Fungsi `getArticleBySlug(slug)` mengeksekusi Prisma:
   ```typescript
   await prisma.article.findUnique({
     where: { slug },
     include: {
       reactions: true,
       comments: {
         include: { user: true },
         orderBy: { created_at: "desc" },
       },
     },
   });
   ```
4. Jika artikel tidak ditemukan di DB mau pun sampel, server memanggil `notFound()` dari Next.js untuk menampilkan halaman 404.
5. Server mengirimkan data detail artikel dan sesi pengguna ke Client Component `ArticleClient` (`app/posts/[slug]/article-client.tsx`).
6. Di browser client:
   - *Reading Progress Bar* otomatis dihitung berdasarkan scroll posisi jendela browser.
   - *Daftar Isi* dibuat otomatis dari pemindaian baris bertanda `##` dan `###`.
   - Saat pengguna mengklik "Suka", Server Action `toggleArticleReaction(articleId, "LIKE")` dieksekusi.
   - Saat pengguna mengisi form komentar dan mengklik "Kirim", Server Action `addArticleComment(articleId, text)` dieksekusi.

### c. STRUKTUR / KOMPONEN DI HALAMAN
- **Reading Progress Bar**: Baris merah indikator scroll di bagian paling atas layar.
- **Top Nav Breadcrumb & Share**: Tombol kembali ke list artikel dan tombol salin link.
- **Header Meta & Author Card**: Tag Kategori, Estimasi Waktu Baca, Tanggal Publikasi, Judul Artikel (`<h1>`), dan foto avatar/nama author.
- **Hero Thumbnail Image**: Gambar sampul artikel utama.
- **Sidebar Table of Contents (Daftar Isi)**: Navigasi daftar isi yang dibuat otomatis dari heading markdown (`##` dan `###`).
- **Main Content Render**: Renderer HTML/Markdown yang dilengkapi tombol "Salin" pada tiap *code block*.
- **Reaction & Share Bar**: Tombol Suka (`Heart`), Tidak Suka (`ThumbsDown`), serta tombol share ke WhatsApp, X/Twitter, dan LinkedIn.
- **Comment Section**: Form input komentar dan daftar komentar pengguna yang tersimpan di database (dilengkapi tombol hapus komentar bagi pemilik/Admin).

### d. KODE LENGKAP & FUNGSI PENDUKUNG

> 📂 Untuk melihat kode lengkap, buka file sumber langsung:

| No | Deskripsi | Lokasi File |
|----|-----------|-------------|
| 1 | Server Page Detail Artikel | `app/posts/[slug]/page.tsx` |
| 2 | Client Component Detail Artikel | `app/posts/[slug]/article-client.tsx` |
| 3 | Fetch Detail Artikel by Slug | `lib/actions/article.ts` → fungsi `getArticleBySlug()` |
| 4 | Toggle Like/Dislike Reaksi | `lib/actions/article.ts` → fungsi `toggleArticleReaction()` |
| 5 | Tambah Komentar Baru | `lib/actions/article.ts` → fungsi `addArticleComment()` |
| 6 | Hapus Komentar | `lib/actions/article.ts` → fungsi `deleteArticleComment()` |
| 7 | Increment Jumlah Pembaca | `lib/actions/article.ts` → fungsi `incrementArticleViews()` |
| 8 | Skema Database | `prisma/schema.prisma` |

**Penjelasan Singkat Kode Kunci:**
- **`app/posts/[slug]/page.tsx`**: Server Component. Menjalankan `incrementArticleViews(slug)`, lalu `getArticleBySlug(slug)`. Jika artikel tidak ditemukan, memanggil `notFound()`. Juga menghasilkan metadata SEO dinamis (`generateMetadata`) untuk Open Graph & Twitter Card.
- **`app/posts/[slug]/article-client.tsx`**: Client Component utama (658 baris). Mengelola state scroll progress bar, parser Table of Contents otomatis dari heading `##`/`###`, renderer konten HTML/Markdown dengan tombol salin kode, optimistic UI untuk reaksi Suka/Tidak Suka, form komentar, dan tombol share ke WhatsApp/Twitter/LinkedIn.
- **`lib/actions/article.ts` → `getArticleBySlug()`**: Mengambil detail artikel dari `prisma.article.findUnique()` beserta relasi `reactions` dan `comments` (include user). Menghitung `likeCount`, `dislikeCount`, dan `userReaction` untuk pengguna yang sedang login. Jika DB gagal, fallback ke `SAMPLE_ARTICLES`.
- **`lib/actions/article.ts` → `toggleArticleReaction()`**: Memproses toggle reaksi. Jika reaksi sama diklik lagi → hapus (*undo*). Jika reaksi berbeda → update tipe. Menggunakan *Composite Unique Index* `@@unique([user_id, article_id])`.
- **`lib/actions/article.ts` → `addArticleComment()`**: Menyimpan komentar baru ke tabel `Comment`. Auto-create user di tabel `User` jika belum ada. Melakukan `revalidatePath()` setelah sukses.
- **`lib/actions/article.ts` → `deleteArticleComment()`**: Menghapus komentar. User biasa hanya bisa hapus miliknya sendiri, Admin bisa hapus komentar siapa saja (*moderasi*).
- **`lib/actions/article.ts` → `incrementArticleViews()`**: Menambah angka kolom `views` di tabel `Article`. Gagal secara *silent* jika kolom belum di-migrate.

### e. RELASI KE DATABASE
Struktur skema relasi database untuk fitur Detail Artikel, Reaksi, dan Komentar (lihat `prisma/schema.prisma`):

```prisma
model User {
  id         String      @id @default(uuid()) @db.Uuid
  name       String
  email      String      @unique
  avatar     String?
  role       Role        @default(USER)
  created_at DateTime    @default(now())
  updated_at DateTime    @updatedAt
  reactions  Reaction[]
  comments   Comment[]
}

model Article {
  id         String     @id @default(uuid()) @db.Uuid
  title      String
  slug       String     @unique
  content    String
  thumbnail  String?
  views      Int        @default(0)
  created_at DateTime   @default(now())
  updated_at DateTime   @updatedAt
  reactions  Reaction[]
  comments   Comment[]

  @@index([created_at(sort: Desc)])
}

model Reaction {
  id         String       @id @default(uuid()) @db.Uuid
  user_id    String       @db.Uuid
  article_id String       @db.Uuid
  type       ReactionType // Enum: LIKE | DISLIKE
  created_at DateTime     @default(now())

  user    User    @relation(fields: [user_id], references: [id], onDelete: Cascade)
  article Article @relation(fields: [article_id], references: [id], onDelete: Cascade)

  @@unique([user_id, article_id])
  @@index([article_id])
}

model Comment {
  id         String   @id @default(uuid()) @db.Uuid
  user_id    String   @db.Uuid
  article_id String   @db.Uuid
  content    String
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  user    User    @relation(fields: [user_id], references: [id], onDelete: Cascade)
  article Article @relation(fields: [article_id], references: [id], onDelete: Cascade)

  @@index([article_id])
  @@index([user_id])
  @@index([created_at(sort: Desc)])
}
```

- **Relasi Reaction -> User & Article**: Memiliki *Composite Unique Index* `@@unique([user_id, article_id])` sehingga 1 user hanya bisa memberikan 1 reaksi per artikel.
- **Relasi Comment -> User & Article**: Setiap komentar terhubung ke `user_id` (penulis komentar) dan `article_id` (artikel yang dikomentari) dengan mekanisme *Cascade Delete* (jika artikel atau user dihapus, komentar terkait otomatis terhapus).

### f. CATATAN & EDGE CASE
- **Halaman 404 (Not Found)**: Jika parameter Slug URL tidak cocok dengan artikel apa pun di database mau pun sampel, Server Component memanggil `notFound()` Next.js untuk menampilkan halaman error 404 standar.
- **Proteksi Reaksi & Komentar**: Jika pengguna belum login mencoba mengklik Suka/Tidak Suka atau mengirim komentar, sistem menampilkan pesan toast peringatan "Silakan masuk akun terlebih dahulu".
- **Hapus Komentar**: Pengguna biasa dibatasi hanya bisa menghapus komentar buatan mereka sendiri (`existing.user_id === dbUser.id`), sedangkan Admin memiliki akses penuh (*moderasi*) untuk menghapus komentar mana pun.

---
*Dokumentasi Fitur Halaman Publik ini melengkapi sistem manajemen artikel & middleware proyek Personal Website oleh Brimas Pradika Utama.*


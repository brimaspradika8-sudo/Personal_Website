# 📄 Dokumentasi Master Lengkap Logika & Kode Sistem Artikel

Dokumen ini berisi gabungan seluruh **gambaran arsitektur, alur kerja diagram, penjelasan detail potongan kode beserta kegunaannya ("buat apa sih?"), pendekatan gambar, kelebihan & kelebihan, serta kekurangan sistem** untuk fitur Artikel pada portofolio **Brimas Pradika Utama**. Written *to-the-point*, komprehensif, dan mudah dipahami.

---

## 🎯 1. Gambaran Umum & Arsitektur Sistem

Sistem artikel ini dibangun menggunakan kombinasi teknologi modern:
- **Next.js 16 (App Router & Server Actions)**: Seluruh pengolahan data dilakukan langsung di sisi server tanpa memerlukan API Endpoint REST/GraphQL terpisah.
- **Prisma ORM & Supabase PostgreSQL**: Database relasional untuk menyimpan Artikel, User, Reaksi (Like/Dislike), dan Komentar.
- **Hybrid Data Architecture**: Memprioritaskan data utama dari database PostgreSQL. Jika database kosong atau terjadi gangguan koneksi, sistem secara otomatis beralih ke data sampel statis (*Fallback*) agar website tidak pernah *crash* (*error 500*) atau layar kosong (*blank screen*).

---

## 🔄 2. Alur Kerja Sistem (Flow Logic & Diagram)

### A. Alur Pengambilan Daftar Artikel (`/posts`)
```
[User Membuka Halaman /posts]
         │
         ▼
[Panggil getArticles() di Server Action]
         │
         ├──► 1. Cek DB Prisma (PostgreSQL) ────────┐
         │       └─► Ada data? Return data DB.     │ (Sukses)
         │                                         ▼
         ├──► 2. Cek Supabase Client (Fallback 1)  [Tampilkan Artikel di Frontend]
         │                                         ▲
         └──► 3. Gunakan SAMPLE_ARTICLES (Fallback 2)│
                 └─► Jika DB masih kosong. ────────┘
```

### B. Alur Reaksi Suka / Tidak Suka (Like / Dislike)
1. **Cek Autentikasi**: Pengguna **wajib login** terlebih dahulu. Jika belum login, tampilkan pesan peringatan.
2. **Optimistic UI (Klien)**: Angka *Like/Dislike* di layar langsung berubah detik itu juga demi pengalaman pengguna yang responsif.
3. **Proses Server**:
   - Jika pengguna memencet tombol yang sama 2x ➔ Reaksi **dihapus** (*Toggle OFF*).
   - Jika pengguna mengganti dari *Like* ke *Dislike* ➔ Reaksi **diperbarui** (*Update*).
   - Jika belum pernah bereaksi ➔ Reaksi **dibuat baru** (*Create*).

### C. Alur Komentar
1. **Menulis Komentar**:
   - Sistem memvalidasi bahwa isi komentar tidak kosong dan pengguna sudah login.
   - Komentar disimpan ke database Prisma dengan relasi ke `user_id` dan `article_id`.
2. **Menghapus Komentar**:
   - **User Biasa**: Hanya bisa menghapus komentar buatan dirinya sendiri (`user_id === comment.user_id`).
   - **Admin**: Berhak menghapus komentar milik siapa saja untuk keperluan moderasi.

### D. Alur Pembedaan Hak Akses (Admin vs User)
```
[User Mencoba Membuat / Menghapus Artikel atau Moderasi Komentar]
                             │
                             ▼
               [Panggil checkIsAdmin(email)]
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   [Email Terdaftar Admin]           [Email User Biasa]
            │                                 │
            ▼                                 ▼
   [Akses Diizinkan & Diproses]      [Akses Ditolak / Forbidden]
```

---

## 🔑 3. Penjelasan Detail Potongan Kode (Apa Fungsinya & Buat Apa?)

Berikut rincian setiap variabel, fungsi, dan aksi di `lib/actions/article.ts`:

### 1. `SAMPLE_ARTICLES` (Data Sampel Statis)
* **Fungsinya apa?**: Variabel array berisi data sampel artikel lengkap dengan judul, konten Markdown, gambar thumbnail, dan metadata.
* **Buat apa sih?**: Sebagai **Bantalan Keselamatan (*Safety Fallback*)**. Apabila database PostgreSQL / Supabase kamu sedang kosong, belum di-seed, atau mengalami gangguan koneksi, sistem secara otomatis akan menampilkan artikel sampel ini sehingga website **tidak pernah crash atau kosong (*blank screen*)**.

---

### 2. `calculateReadTime(content)`
* **Fungsinya apa?**: Fungsi matematika sederhana untuk menghitung estimasi durasi membaca berdasarkan jumlah kata dalam teks artikel.
* **Buat apa sih?**: Menampilkan badge waktu baca otomatis (seperti `"5 min read"`). Dikalkulasikan dari rata-rata kecepatan membaca manusia yaitu **180 kata per menit**.

---

### 3. `checkIsAdmin(email)`
* **Fungsinya apa?**: Fungsi verifikasi keamanan untuk memeriksa apakah email pengguna yang sedang aktif tergolong sebagai **Admin**.
* **Buat apa sih?**: Mencegah pengguna biasa melakukan tindakan berbahaya. Hanya akun Admin (`ADMIN_EMAILS`, email pemilik `brimaspradika`, atau role `ADMIN`) yang diizinkan untuk **membuat artikel baru** dan **menghapus artikel/komentar**.

---

### 4. `getArticles(params)`
* **Fungsinya apa?**: Server Action utama untuk mengambil daftar semua artikel dari database.
* **Buat apa sih?**: 
  - `params.query`: Mencari kata kunci pada judul atau isi artikel (Pencarian / Search).
  - `params.category`: Memfilter artikel berdasarkan topik (*AI Systems*, *Web Dev*, *Database*, *Tutorial*).
  - `params.sort`: Mengurutkan artikel dari yang terbaru (`latest`), terlama (`oldest`), atau paling populer (`popular`).

---

### 5. `getArticleBySlug(slug)`
* **Fungsinya apa?**: Mengambil detail 1 artikel lengkap berdasarkan URL *slug* (contoh: `/posts/membangun-ai-agent`).
* **Buat apa sih?**: Menampilkan isi lengkap artikel, memformat blok kode (*Syntax Highlighting*), menampilkan daftar komentar, serta mengecek status reaksi pembaca (*Like/Dislike*).

---

### 6. `createArticle(data)` & `deleteArticle(id)`
* **Fungsinya apa?**: Operasi pembuatan dan penghapusan artikel khusus untuk Admin.
* **Buat apa sih?**: 
  - `createArticle`: Membuat artikel baru di database lengkap dengan format slug URL yang aman.
  - `deleteArticle`: Menghapus artikel yang sudah tidak relevan.

---

### 7. `toggleArticleReaction(articleId, reactionType)`
* **Fungsinya apa?**: Mengatur reaksi `LIKE` atau `DISLIKE` pengguna di database.
* **Buat apa sih?**: 
  - Memungkinkan pembaca menyukai atau tidak menyukai artikel.
  - Menggunakan teknik **Optimistic UI** di frontend agar angka Like/Dislike di layar langsung berubah seketika tanpa perlu menunggu proses jaringan server.
  - Jika tombol yang sama diklik 2x, reaksi akan otomatis dihapus (*Toggle Off*).

---

### 8. `addArticleComment` & `deleteArticleComment`
* **Fungsinya apa?**: Menambahkan komentar baru dan menghapus komentar dari database.
* **Buat apa sih?**:
  - `addArticleComment`: Menyimpan komentar yang terhubung dengan akun pengguna yang sedang login.
  - `deleteArticleComment`: Memastikan pengguna **hanya bisa menghapus komentarnya sendiri**, kecuali Admin yang berhak menghapus komentar siapa saja untuk moderasi.

---

### 9. `seedSampleArticlesIfEmpty()`
* **Fungsinya apa?**: Fungsi pemuat data awal yang memasukkan `SAMPLE_ARTICLES` ke dalam database PostgreSQL.
* **Buat apa sih?**: Memudahkan pengembang untuk mengisi database pertama kali secara instan hanya dengan menekan tombol **"Seed Artikel"** di pojok kanan atas halaman `/posts`.

---

## 🖼️ 4. Pendekatan & Penanganan Gambar (Thumbnail & Avatar)

1. **Format Tipe Data Database**:
   Di database (Prisma Schema), gambar disimpan sebagai tipe **`String?`** (URL text), bukan mentah/binary file.
2. **Sumber URL yang Didukung**:
   - **URL Publik Luar**: Unsplash (`https://images.unsplash.com/...`), Imgur, Cloudinary, dsb.
   - **Supabase Storage**: Bucket publik Supabase (`https://<project>.supabase.co/storage/v1/object/public/...`).
   - **File Lokal**: Folder `/public` Next.js (`/images/avatar.webp`).
3. **Fallback Placeholder**:
   Jika `thumbnail` bernilai `null` atau kosong, komponen UI otomatis menampilkan *card placeholder* berdesain modern dengan ikon penanda sehingga tampilan tidak rusak.

---

## 🚀 5. Kelebihan Sistem Artikel Ini

1. ⚡ **Sangat Cepat & Tanpa API Overhead (Next.js Server Actions)**:
   - Pengolahan data dilakukan langsung di server tanpa perlu membuat API Endpoint REST/GraphQL tambahan, sehingga mempercepat waktu muat halaman (*load time*).
2. 🛡️ **Tahan Banting & Anti-Blank (*Fault-Tolerant*)**:
   - Dengan adanya sistem **Hybrid Architecture** (DB PostgreSQL ➔ Supabase Fallback ➔ Sample Fallback), website dijamin **100% selalu menampilkan data** dan tidak akan pernah error meskipun database mati atau kosong.
3. 🏎️ **Pengalaman Pengguna Instan (*Optimistic UI*)**:
   - Reaksi Suka / Tidak Suka langsung berubah di layar seketika saat diklik, memberikan kesan aplikasi yang sangat responsif dan modern.
4. 🔒 **Keamanan Hak Akses Terjamin (RBAC)**:
   - Menggabungkan **Supabase Auth** dengan pengecekan peran **Admin vs User** di sisi server untuk melindungi fitur pembuatan dan penghapusan artikel.
5. 💻 **Dukungan Code Block Interaktif**:
   - Teks artikel mendukung format **Markdown** lengkap dengan penyorotan kode program (*Syntax Highlighting*) dan tombol **"Salin Kode"** (*Copy Code*) satu kali klik.

---

## ⚠️ 6. Kekurangan Sistem Ini & Solusi Pengembangannya

1. 🖼️ **Penyimpanan Gambar Masih Menggunakan String URL**:
   - *Kekurangan*: Thumbnail artikel disimpan dalam bentuk string URL (misal link Unsplash atau Supabase Storage Public URL). Belum ada widget *crop/upload image* langsung di form penulisan.
   - *Solusi Masa Depan*: Menambahkan widget upload file Supabase Storage langsung di panel dashboard admin.
2. 📑 **Belum Mendukung Pagination (Paginasi Halaman 1, 2, 3)**:
   - *Kekurangan*: Semua artikel saat ini ditampilkan dalam satu halaman grid. Jika artikel sudah mencapai ratusan, proses render awal bisa sedikit berat.
   - *Solusi Masa Depan*: Menambahkan *Infinite Scroll* atau tombol *Load More* ketika data artikel sudah sangat banyak.
3. 🏷️ **Kategori Artikel Masih Otomatis/Statis**:
   - *Kekurangan*: Kategori dideteksi secara otomatis dari judul artikel atau daftar statis.
   - *Solusi Masa Depan*: Menambahkan tabel `Category` tersendiri pada skema Prisma agar kategori bisa dibuat dinamis.

---

## 📂 7. Daftar File Utama & Perannya

| File | Peran & Responsibilitas |
| :--- | :--- |
| `prisma/schema.prisma` | Definisi tabel `User`, `Article`, `Reaction`, `Comment`, dan Enum `Role`. |
| `lib/actions/article.ts` | Pusat logika Server Actions (Pencarian, Detail, Reaksi, Komentar, Admin Check). |
| `app/posts/page.tsx` & `posts-client.tsx` | Tampilan katalog artikel (Search bar, Filter Kategori, Sorting, Card Grid). |
| `app/posts/[slug]/page.tsx` & `article-client.tsx` | Tampilan pembaca artikel (Code Highlighting, Reaksi, Kolom Komentar). |

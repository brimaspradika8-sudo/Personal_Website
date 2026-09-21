# Fitur Komentar Artikel

Dokumen ini menjelaskan implementasi fitur komentar pada halaman artikel portfolio Brimas Pradika Utama.

## Ringkasan

Fitur komentar mencakup:

- Endpoint `POST /api/comment` untuk menyimpan komentar baru.
- Validasi session login sebelum komentar dibuat.
- Form komentar yang hanya ditampilkan kepada user yang sudah login.
- Tautan login untuk user yang belum login.
- Daftar komentar pada halaman artikel.
- Informasi avatar, nama, isi komentar, tanggal, jumlah like, dan hak hapus.
- Dukungan balasan melalui `parent_id`.
- Pengurutan thread sehingga balasan muncul di bawah komentar induknya.
- Proteksi CSRF, validasi origin, sanitasi HTML, rate limiting, dan pencegahan duplikasi komentar.

## Lokasi Implementasi

| Bagian | File |
| --- | --- |
| Route API komentar | `app/api/comment/route.ts` |
| Server Action artikel dan komentar | `lib/actions/article.ts` |
| Halaman detail artikel | `app/(content)/artikel/[slug]/page.tsx` |
| Client artikel detail utama | `app/(content)/artikel/[slug]/artikel-detail-client.tsx` |
| Client artikel detail alternatif | `app/(content)/artikel/[slug]/article-client.tsx` |
| Model database | `prisma/schema.prisma` |
| Sanitasi input | `lib/security/sanitize.ts` |
| Validasi CSRF dan origin | `lib/security/csrf.ts` |
| Rate limiting | `lib/security/rate-limit.ts` |
| Helper user session | `lib/auth/get-user.ts` |

## Model Database

Model `Comment` menyimpan komentar dan relasinya:

```prisma
model Comment {
  id         String   @id @default(uuid()) @db.Uuid
  user_id    String   @db.Uuid
  article_id String   @db.Uuid
  parent_id  String?  @db.Uuid
  content    String
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  user    User    @relation(fields: [user_id], references: [id], onDelete: Cascade)
  article Article @relation(fields: [article_id], references: [id], onDelete: Cascade)
  parent  Comment?  @relation("CommentReplies", fields: [parent_id], references: [id], onDelete: Cascade)
  replies Comment[] @relation("CommentReplies")
  likes   CommentLike[]
}
```

`parent_id` bernilai `null` untuk komentar utama. Jika komentar merupakan balasan, `parent_id` berisi ID komentar induknya.

Index yang tersedia:

- `article_id` untuk mengambil komentar berdasarkan artikel.
- `user_id` untuk mengambil komentar milik user.
- `parent_id` untuk membentuk thread balasan.
- `created_at` dan kombinasi `article_id, created_at` untuk pengurutan waktu.

## Alur Menampilkan Halaman Artikel

1. User membuka `/artikel/[slug]`.
2. `app/(content)/artikel/[slug]/page.tsx` mengambil artikel melalui `getArticleBySlug(slug)`.
3. `getArticleBySlug` mengambil data artikel, author, reactions, comments, user setiap komentar, dan likes komentar dari Prisma.
4. Komentar diambil dengan urutan awal terbaru berdasarkan `created_at desc`.
5. Data artikel dan komentar diteruskan ke `ArticleClient` atau `ArtikelDetailClient`.
6. Client menampilkan form berdasarkan status `user`.
7. Komentar disusun kembali secara parent-first agar setiap balasan berada tepat setelah komentar induknya.
8. Komentar anak diberi indentasi visual menggunakan `parent_id`.

## Form Komentar

Jika user sudah login, halaman menampilkan:

- Textarea dengan batas maksimal 1000 karakter.
- Label user yang sedang menulis.
- Tombol `KIRIM KOMENTAR`.
- Mode balasan ketika user memilih tombol `BALAS`.
- Tombol `BATAL BALAS` untuk menghapus target balasan.

Payload yang dikirim:

```json
{
  "article_id": "uuid-atau-slug-artikel",
  "content": "Isi komentar",
  "parent_id": "uuid-komentar-induk-opsional"
}
```

`parent_id` tidak dikirim atau bernilai `null` jika komentar adalah komentar utama.

## User Belum Login

Jika tidak ada user aktif, form digantikan dengan tautan:

```text
LOGIN DULU UNTUK BERKOMENTAR
```

Tautan mengarah ke:

```text
/login?message=Kamu%20harus%20login%20dulu%20untuk%20berkomentar
```

Setelah login, user dapat kembali ke halaman artikel dan mengirim komentar.

## API `POST /api/comment`

### Request

```http
POST /api/comment
Content-Type: application/json
x-csrf-token: <token>
```

Body:

```json
{
  "article_id": "uuid-artikel-atau-slug",
  "content": "Isi komentar",
  "parent_id": "uuid-komentar-induk-opsional"
}
```

### Tahapan proses

1. Memeriksa origin request.
2. Memeriksa CSRF token dari cookie dan header `x-csrf-token`.
3. Mengambil user melalui `getAuthenticatedUser()`.
4. Mengembalikan `401` jika user belum login.
5. Memeriksa rate limit per user.
6. Membaca JSON body.
7. Mengambil `article_id`, `content`, dan `parent_id`.
8. Menghapus HTML dari isi komentar dengan `stripHtml`.
9. Menolak komentar kosong.
10. Menolak komentar lebih dari 1000 karakter.
11. Menjalankan pemeriksaan spam sederhana.
12. Menyinkronkan user ke tabel `User` jika diperlukan.
13. Mencari artikel berdasarkan UUID atau slug.
14. Memeriksa duplikasi komentar yang sama dalam 60 detik terakhir.
15. Jika ada `parent_id`, memastikan komentar induk valid dan berasal dari artikel yang sama.
16. Menyimpan komentar melalui Prisma.
17. Mengembalikan komentar baru beserta data user.

### Response berhasil

Status `200`:

```json
{
  "success": true,
  "comment": {
    "id": "comment-uuid",
    "content": "Isi komentar",
    "created_at": "2026-09-21T10:00:00.000Z",
    "user_id": "user-uuid",
    "parent_id": null,
    "likeCount": 0,
    "likedByUser": false,
    "canDelete": true,
    "user": {
      "id": "user-uuid",
      "name": "Nama User",
      "avatar": null
    }
  }
}
```

### Error response utama

| Status | Kondisi |
| --- | --- |
| `400` | `article_id` atau `content` kosong, format `parent_id` invalid |
| `401` | User belum login atau akun database tidak valid |
| `403` | Origin atau CSRF token tidak valid |
| `404` | Artikel atau komentar induk tidak ditemukan |
| `409` | Komentar identik baru saja dikirim |
| `422` | Komentar ditolak oleh pemeriksaan spam |
| `429` | Rate limit komentar terlampaui |
| `500` | Kesalahan internal server |

## Pengurutan Balasan

Komentar tidak lagi hanya dirender sebagai daftar datar berdasarkan waktu. Client membentuk map berdasarkan `parent_id`:

```text
parent_id = null
  - Komentar utama A
    - Balasan A1
      - Balasan A1.1
    - Balasan A2
  - Komentar utama B
    - Balasan B1
```

Algoritmenya:

1. Kelompokkan semua komentar berdasarkan `parent_id`.
2. Ambil komentar dengan `parent_id = null` sebagai root.
3. Urutkan sibling berdasarkan `created_at`.
4. Render komentar root.
5. Setelah setiap root, render semua turunannya secara rekursif.
6. Tambahkan indentasi pada komentar yang memiliki `parent_id`.

Dengan begitu, balasan selalu muncul langsung di bawah komentar yang dibalas, bukan terpencar di antara komentar terbaru lainnya.

## Optimistic UI

Saat user mengirim komentar:

1. Client membuat komentar sementara dengan ID `temp-*`.
2. Komentar sementara langsung ditampilkan agar UI terasa cepat.
3. Request dikirim ke `/api/comment`.
4. Jika berhasil, komentar sementara diganti dengan data dari server.
5. Jika gagal, komentar sementara dihapus dan jumlah komentar dikembalikan.
6. Jika request fetch gagal, client mencoba fallback ke Server Action `addArticleComment`.

## Keamanan

Implementasi komentar menggunakan beberapa lapisan proteksi:

- Session user diambil dari Supabase melalui server-side helper.
- `user_id` tidak diterima dari client sebagai sumber kebenaran; nilainya berasal dari session dan user database.
- CSRF token diperiksa menggunakan pola double-submit cookie.
- Origin request diperiksa sebelum mutasi.
- HTML pada komentar dihapus sebelum disimpan.
- Panjang komentar dibatasi 1000 karakter.
- Komentar spam sederhana ditolak.
- Rate limit diterapkan per user.
- Komentar identik dalam rentang 60 detik ditolak.
- `parent_id` harus valid dan harus merujuk komentar pada artikel yang sama.
- Penghapusan komentar tetap memeriksa kepemilikan di server.

## Pengujian Manual

### Pengguna belum login

1. Buka `/artikel/<slug>` dalam kondisi logout.
2. Pastikan form textarea tidak tampil.
3. Pastikan teks `LOGIN DULU UNTUK BERKOMENTAR` tampil.
4. Klik teks tersebut.
5. Pastikan browser berpindah ke `/login`.

### Pengguna sudah login

1. Login melalui `/login`.
2. Buka `/artikel/<slug>`.
3. Isi textarea.
4. Klik `KIRIM KOMENTAR`.
5. Pastikan komentar muncul tanpa reload penuh.
6. Refresh halaman.
7. Pastikan komentar tetap tersedia dari database.

### Balasan komentar

1. Login.
2. Klik `BALAS` pada komentar tertentu.
3. Pastikan label form berubah menjadi mode balasan.
4. Kirim balasan.
5. Pastikan balasan tampil tepat di bawah komentar induk dan memiliki indentasi.

### Validasi error

Uji kondisi berikut:

- Isi komentar kosong.
- Isi komentar lebih dari 1000 karakter.
- Kirim request tanpa CSRF token.
- Kirim `article_id` yang tidak ada.
- Kirim `parent_id` dari artikel berbeda.
- Kirim komentar yang sama berulang kali dalam waktu singkat.

## Catatan Route

Route publik menggunakan slug, bukan ID:

```text
/artikel/[slug]
```

Contoh:

```text
/artikel/authentication-vs-authorization
```

Namun API menerima `article_id` berupa UUID maupun slug agar kompatibel dengan client yang berbeda.

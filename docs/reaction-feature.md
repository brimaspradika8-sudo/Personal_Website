# Fitur Reaction Artikel

Fitur reaction memungkinkan user memberi penilaian `LIKE` atau `DISLIKE` pada artikel. Satu user hanya dapat memiliki satu reaction untuk satu artikel.

## Lokasi Implementasi

| Bagian | File |
| --- | --- |
| Route API reaction | `app/api/reaction/route.ts` |
| Client artikel detail utama | `app/(content)/artikel/[slug]/artikel-detail-client.tsx` |
| Client artikel detail alternatif | `app/(content)/artikel/[slug]/article-client.tsx` |
| Server Action fallback/legacy | `lib/actions/article.ts` |
| Model database | `prisma/schema.prisma` |
| Helper session user | `lib/auth/get-user.ts` |

## Model Database

Model `Reaction` menyimpan satu reaction dari satu user pada satu artikel:

```prisma
model Reaction {
  id         String       @id @default(uuid()) @db.Uuid
  user_id    String       @db.Uuid
  article_id String       @db.Uuid
  type       ReactionType
  created_at DateTime     @default(now())

  user    User    @relation(fields: [user_id], references: [id], onDelete: Cascade)
  article Article @relation(fields: [article_id], references: [id], onDelete: Cascade)

  @@unique([user_id, article_id])
  @@index([article_id])
  @@index([article_id, type])
}
```

Constraint `@@unique([user_id, article_id])` mencegah user memiliki dua reaction aktif pada artikel yang sama. Enum reaction hanya memiliki dua nilai:

```prisma
enum ReactionType {
  LIKE
  DISLIKE
}
```

## Alur Menampilkan Reaction

1. User membuka `/artikel/<slug>`.
2. Server mengambil reaction artikel dari Prisma.
3. Server menghitung jumlah `LIKE` dan `DISLIKE`.
4. Jika user login, server mencari reaction milik user tersebut.
5. Data `userReaction`, `likeCount`, dan `dislikeCount` diteruskan ke client artikel.
6. Client menandai tombol yang sesuai dengan reaction aktif user.

Jika user belum memiliki reaction, `userReaction` bernilai `null`.

## Tombol Reaction

Halaman detail artikel menampilkan:

- Tombol `SUKA` dengan ikon thumbs-up dan jumlah like.
- Tombol `TIDAK SUKA` dengan ikon thumbs-down dan jumlah dislike.
- Highlight pada tombol yang sesuai dengan reaction user.
- Update angka secara langsung setelah user mengklik tombol.

Sebelum request selesai, client memperbarui tampilan secara optimistic. Setelah API berhasil, client mengganti angka tersebut dengan jumlah dari database agar tetap akurat. Jika request gagal, client mengembalikan state sebelumnya.

## User Belum Login

Jika user anonim mengklik tombol reaction:

1. Client menampilkan pesan `Kamu harus login dulu untuk memberikan reaksi`.
2. Browser diarahkan ke:

```text
/login?message=Kamu%20harus%20login%20dulu%20untuk%20memberikan%20reaksi
```

API juga memvalidasi session di server dan mengembalikan status `401` jika request datang tanpa user terautentikasi.

## API `POST /api/reaction`

### Request

```http
POST /api/reaction
Content-Type: application/json
x-csrf-token: <token>
```

Body:

```json
{
  "article_id": "uuid-artikel-atau-slug-artikel",
  "type": "LIKE"
}
```

`type` hanya boleh bernilai `LIKE` atau `DISLIKE`.

### Aturan Toggle

| Kondisi awal | Tombol diklik | Hasil |
| --- | --- | --- |
| Belum punya reaction | `LIKE` | Membuat reaction `LIKE` |
| Belum punya reaction | `DISLIKE` | Membuat reaction `DISLIKE` |
| `LIKE` | `LIKE` | Menghapus reaction, menjadi unlike |
| `DISLIKE` | `DISLIKE` | Menghapus reaction |
| `LIKE` | `DISLIKE` | Mengubah reaction menjadi `DISLIKE` |
| `DISLIKE` | `LIKE` | Mengubah reaction menjadi `LIKE` |

### Response berhasil

Status `200`:

```json
{
  "success": true,
  "action": "created",
  "type": "LIKE",
  "article_id": "uuid-artikel",
  "likeCount": 12,
  "dislikeCount": 2
}
```

Nilai `action` dapat berupa `created`, `updated`, atau `deleted`. Jika reaction dihapus, field `type` bernilai `null`.

### Error response utama

| Status | Kondisi |
| --- | --- |
| `400` | `article_id` atau `type` tidak ada, atau `type` tidak valid |
| `401` | User belum login |
| `403` | Origin atau CSRF token tidak valid |
| `404` | Artikel tidak ditemukan |
| `429` | Rate limit reaction terlampaui |
| `500` | Kesalahan internal server |

## Keamanan

Implementasi reaction menggunakan beberapa lapisan proteksi:

- Session user diambil dari Supabase melalui helper server-side.
- `user_id` selalu berasal dari session, bukan dari request client.
- User disinkronkan ke tabel `User` melalui `upsert` berdasarkan email.
- Origin request diperiksa sebelum mutasi.
- CSRF token diperiksa menggunakan pola double-submit cookie.
- Rate limit reaction diterapkan per user.
- Constraint database mencegah reaction ganda untuk user dan artikel yang sama.
- Artikel harus ditemukan sebelum reaction disimpan.

## Pengujian Manual Reaction

### User belum login

1. Logout dari aplikasi.
2. Buka `/artikel/<slug>`.
3. Klik tombol `SUKA` atau `TIDAK SUKA`.
4. Pastikan browser diarahkan ke `/login` dengan pesan login yang sesuai.

### Membuat reaction

1. Login melalui `/login`.
2. Buka artikel.
3. Klik `SUKA`.
4. Pastikan tombol menjadi aktif dan jumlah like bertambah satu.
5. Refresh halaman.
6. Pastikan reaction dan jumlah like tetap tersimpan.

### Toggle dan pergantian reaction

1. Klik `SUKA` sekali lagi.
2. Pastikan highlight hilang dan jumlah like berkurang satu.
3. Klik `TIDAK SUKA`.
4. Pastikan jumlah dislike bertambah satu.
5. Klik `SUKA`.
6. Pastikan jumlah dislike berkurang satu dan jumlah like bertambah satu.

### Validasi error

Uji kondisi berikut:

- Kirim request tanpa session login.
- Kirim request tanpa CSRF token.
- Kirim `type` selain `LIKE` atau `DISLIKE`.
- Kirim `article_id` yang tidak ada.
- Kirim reaction berulang kali sampai rate limit tercapai.
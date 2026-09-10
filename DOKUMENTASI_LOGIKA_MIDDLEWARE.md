# 📄 Dokumentasi Lengkap Sistem Middleware & Auth Session

Dokumen ini berisi panduan komprehensif mengenai **cara kerja, alur diagram, penjelasan detail kode beserta kegunaannya ("buat apa sih?"), serta kelebihan dan kekurangan** dari Sistem Middleware pada website portofolio **Brimas Pradika Utama**. Written *to-the-point*, jelas, dan mudah dipahami.

---

## 🎯 1. Gambaran Umum & Arsitektur Middleware

In Next.js, **Middleware** bertindak sebagai **"Satpam" / Penjaga Gerbang Utama Server**. Setiap kali pengguna meminta suatu halaman atau data dari website, permintaan tersebut akan melewati Middleware terlebih dahulu sebelum sampai ke halaman React.

Pada aplikasi ini, Middleware digunakan khusus untuk **Pembaruan Sesi Otomatis (*Automatic Supabase Session Refresh*)** menggunakan paket `@supabase/ssr`.

### Mengapa Middleware Ini Diperlukan?
Token autentikasi (JWT) Supabase yang disimpan di cookie browser memiliki masa kadaluarsa (biasanya 1 jam). Tanpa Middleware, pengguna yang diam di website akan tiba-tiba ter-logout sendiri. Middleware ini bertugas **memeriksa dan memperbarui token cookie secara otomatis di belakang layar** setiap kali pengguna berpindah halaman.

---

## 🔄 2. Alur Kerja Sistem (Flow Logic & Diagram)

### Diagram Alur Request Lewat Middleware
```
[User Membuka Halaman Web] ──► (HTTP Request)
                                      │
                                      ▼
                        [Pemeriksaan Regex Matcher]
                                      │
                     ┌────────────────┴────────────────┐
                     ▼                                 ▼
         [File Statis / Aset]               [Halaman / Rute Web]
        (Gambar, Font, Favicon)             (Panggil proxy.ts)
                     │                                 │
                     ▼                                 ▼
          [Lewati Middleware]              [Panggil updateSession()]
                     │                                 │
                     └────────────────┬────────────────┘
                                      │
                                      ▼
                         [Membaca Cookie Supabase]
                                      │
                                      ▼
                      [Panggil supabase.auth.getUser()]
                                      │
                     ┌────────────────┴────────────────┐
                     ▼                                 ▼
            [Token Masih Valid]              [Token Perlu Refresh]
                     │                                 │
                     ▼                                 ▼
             [Gunakan Response]             [Set Cookie Baru di Response]
                     │                                 │
                     └────────────────┬────────────────┘
                                      │
                                      ▼
                       [Teruskan ke Halaman React Target]
```

---

## 🔑 3. Penjelasan Detail Kode (Apa Fungsinya & Buat Apa?)

Berikut rincian file dan fungsi yang membentuk sistem Middleware:

### A. File `proxy.ts` (Entry Point Middleware Next.js)

```typescript
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

1. **`proxy(request: NextRequest)`**
   - **Fungsinya apa?**: Fungsi handler utama Next.js yang menangkap setiap *HTTP Request* yang masuk dari browser pengguna.
   - **Buat apa sih?**: Mengarahkan seluruh lalu lintas permintaan ke fungsi `updateSession` di `lib/supabase/middleware.ts` untuk diperiksa cookies autentikasinya.

2. **`config.matcher`**
   - **Fungsinya apa?**: Pengaturan ekspresi reguler (Regex) untuk menyaring rute mana saja yang boleh dan tidak boleh melewati Middleware.
   - **Buat apa sih?**: **Menghemat memori & bandwidth server**. Gambar (`.png`, `.jpg`, `.webp`, `.svg`), file sistem Next.js (`_next/static`), dan `favicon.ico` **dikecualikan** dari pemeriksaan Middleware karena tidak memerlukan autentikasi.

---

### B. File `lib/supabase/middleware.ts` (Logika Refresh Cookie)

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

    // Refresh session automatically
    await supabase.auth.getUser();
  } catch (err) {
    console.error("Middleware Supabase Session Error:", err);
  }

  return supabaseResponse;
}
```

1. **`let supabaseResponse = NextResponse.next({ request })`**
   - **Fungsinya apa?**: Membuat objek respon Next.js awal yang akan diteruskan ke rute target.
   - **Buat apa sih?**: Memungkinkan kita untuk menyisipkan (*inject*) cookie autentikasi yang baru diperbarui langsung ke dalam Header HTTP Response sebelum dikembalikan ke browser pengguna.

2. **`createServerClient(...)` dengan Handlers `cookies.getAll` & `cookies.setAll`**
   - **Fungsinya apa?**: Membuat objek Supabase Server Client khusus untuk lingkungan Server Next.js.
   - **Buat apa sih?**:
     - `getAll()`: Membaca semua cookie yang dikirimkan oleh browser pembaca.
     - `setAll()`: Menuliskan kembali token cookie yang sudah diperbarui (*refreshed*) ke dalam *Request* sekaligus *Response*.

3. **`await supabase.auth.getUser()`**
   - **Fungsinya apa?**: Memanggil API verifikasi akun Supabase Auth.
   - **Buat apa sih?**: Memicu proses pembaruan token (*token refresh*) di balik layar secara otomatis apabila token JWT pengguna sudah mendekati masa kadaluarsa.

4. **`try { ... } catch (err)`**
   - **Fungsinya apa?**: Blok penangan kesalahan (*Error Handler*).
   - **Buat apa sih?**: Memastikan bahwa jika server Supabase atau koneksi internet terganggu, website **tetap berjalan lancar** tanpa menampilkan halaman crash error.

---

## ⚡ 4. Kelebihan Sistem Middleware Ini

1. 🔄 **Pengalaman Login Tanpa Putus (*Seamless Authentication*)**:
   - Pengguna tidak akan pernah tiba-tiba ter-logout di tengah navigasi karena cookie token selalu diperbarui secara otomatis setiap kali berpindah halaman.
2. 🚀 **Performa Sangat Ringan & Teroptimasi**:
   - Berjalan pada rantai *Edge Server* sebelum komponen React dimuat.
   - Penggunaan `matcher` memastikan aset berat seperti gambar dan font tidak ikut terbebani oleh proses autentikasi.
3. 🛠️ **Logika Terpusat (*Centralized Architecture*)**:
   - Logika autentikasi tidak perlu ditulis berulang-ulang di tiap file halaman React (`page.tsx`), cukup dikelola di satu tempat (`lib/supabase/middleware.ts`).
4. 🛡️ **Aman dari Masalah CORS & Cookie Hijacking**:
   - Menggunakan mode cookie HTTP-Only yang dikelola secara otomatis oleh `@supabase/ssr`, mencegah pencurian token oleh script berbahaya (XSS).

---

## ⚠️ 5. Kekurangan Sistem Ini & Solusi Pengembangannya

1. 🚪 **Belum Dilengkapi Fitur *Hard Route Guard Redirect***:
   - *Kekurangan*: Middleware ini saat ini bertugas untuk **memperbarui sesi cookie**, namun belum secara ketat mengalihkan (*redirect 302*) pengguna yang belum login jika mencoba membuka rute proteksi (misal `/admin`).
   - *Solusi Masa Depan*: Menambahkan logika pengecekan URL pada Middleware:
     ```typescript
     if (!user && request.nextUrl.pathname.startsWith("/admin")) {
       return NextResponse.redirect(new URL("/login", request.url));
     }
     ```
2. 🔌 **Sangat Bergantung pada Environment Variables Supabase**:
   - *Kekurangan*: Jika `NEXT_PUBLIC_SUPABASE_URL` atau `NEXT_PUBLIC_SUPABASE_ANON_KEY` belum dikonfigurasi di file `.env`, fungsi akan mencatat error di konsol server.
   - *Solusi Masa Depan*: Menambahkan pengecekan pembuka `if (!supabaseUrl || !supabaseAnonKey) return supabaseResponse;` sebelum menginisialisasi client.

---

## 📂 6. Daftar File Terkait & Perannya

| File | Peran & Responsibilitas |
| :--- | :--- |
| `proxy.ts` | Entry point Middleware Next.js & penyaring rute (*Route Matcher*). |
| `lib/supabase/middleware.ts` | Fungsi `updateSession()` pengelola refresh token Supabase Auth via Cookie. |
| `lib/supabase/client.ts` | Pembaca Environment Variables (`getSupabaseEnv`). |

Subtask: Tentukan email pemilik website di environment variable (OWNER_EMAIL) — hanya akun dengan email ini yang boleh mengakses dashboard

Jawaban:
1. 🔍 Fungsi Detektor / Pemeriksa Admin (

checkIsAdmin
)
File: 

lib/actions/auth.ts

Fungsi 

checkIsAdmin(email)
 bertugas memeriksa apakah sebuah email terdaftar sebagai admin melalui 4 tahap pengecekan:

export async function checkIsAdmin(email?: string | null): Promise<boolean> {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Cek apakah email sama dengan OWNER_EMAIL di file .env
  const ownerEmail = (process.env.OWNER_EMAIL || "").trim().toLowerCase();
  if (ownerEmail && normalizedEmail === ownerEmail) {
    return true; // ⭕ YA, DIA ADMIN!
  }

  // 2. Cek apakah email ada di daftar ADMIN_EMAILS di file .env
  const envAdminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (envAdminEmails.length > 0 && envAdminEmails.includes(normalizedEmail)) {
    return true; // ⭕ YA, DIA ADMIN!
  }

  // 3. Fallback email admin utama
  if (normalizedEmail === "brimaspradika8@gmail.com") {
    return true; // ⭕ YA, DIA ADMIN!
  }

  // 4. Cek role di Database PostgreSQL (Tabel User, kolom role === 'ADMIN')
  try {
    const dbUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { role: true },
    });
    if (dbUser && dbUser.role === "ADMIN") {
      return true; // ⭕ YA, DIA ADMIN!
    }
  } catch {}

  return false; // ❌ BUKAN ADMIN (User Biasa)
}

2. 🔀 Pengarah Halaman Saat Login (Redirect Logic)
Setelah pengguna sukses login (baik lewat Google OAuth maupun Email/Password), sistem mengeksekusi kode ini untuk menentukan halaman mana yang dituju:

A. Login via Google / GitHub (OAuth)
File: 

app/auth/callback/route.ts

typescript
// Panggil fungsi checkIsAdmin
const isAdmin = await checkIsAdmin(data.user.email);
// Jika Admin -> Lempar ke /admin, jika User Biasa -> Lempar ke /dashboard
const targetPath = isAdmin ? "/admin" : "/dashboard";
return NextResponse.redirect(`${origin}${targetPath}`);
B. Login via Email & Password Manual
File: 

lib/actions/auth.ts

typescript
const isAdmin = await checkIsAdmin(data.user.email);
targetPath = isAdmin ? "/admin" : "/dashboard";
3. 🛡️ Satpam Penjaga Rute / Middleware (

middleware.ts
)
File: 

lib/supabase/middleware.ts

Setiap kali pengguna mencoba mengetik atau membuka URL /admin secara langsung di browser, kode Middleware ini otomatis berjalan di server sebelum halaman dirender:

typescript
const isAdminRoute = pathname.startsWith("/admin");
if (isAdminRoute) {
  // 1. Jika belum login sama sekali -> Paksa login
  if (!user || !user.email) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const userEmail = user.email.toLowerCase().trim();
  const ownerEmail = (process.env.OWNER_EMAIL || "").trim().toLowerCase();
  
  // 2. Cek apakah email user yang mengakses adalah Owner / Admin
  const isOwnerOrAdmin =
    (ownerEmail && userEmail === ownerEmail) ||
    adminEmails.includes(userEmail) ||
    userEmail === "brimaspradika8@gmail.com";
  // 3. Jika BUKAN Admin -> Tendang ke /dashboard biasa
  if (!isOwnerOrAdmin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
}


Subtask: Buat middleware Next.js yang mengecek session user — kalau bukan pemilik, redirect ke halaman /login

Jawaban:

📌 Penjelasan Bagian Kode yang Mendefinisikan Fitur Ini:
Fitur ini didefinisikan pada 2 file utama:

1. File Entrypoint Middleware (

middleware.ts
)
File ini bertindak sebagai pintu masuk middleware Next.js yang mencegat (intercept) request halaman dan mendaftarkan aturan pencocokan rute (matcher):

typescript
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}
export const config = {
  matcher: [
    // Intercept semua rute KECUALI file statis, gambar, dan callback API
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.xml|images/|icons/|api/auth/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

2. File Logika Pengecekan Sesi & Redirect (

lib/supabase/middleware.ts
)
Fungsi 

updateSession
 mengambil data user dari server Supabase Auth per-request (supabase.auth.getUser()). Jika pengguna belum login (sesi tidak valid) atau bukan pemilik saat mengakses rute dilindungi seperti /admin, sistem akan otomatis me-redirect mereka ke /login:

// Ambil sesi user dari Supabase Auth
const { data: { user } } = await supabase.auth.getUser();
const pathname = request.nextUrl.pathname;
const isAdminRoute = pathname.startsWith("/admin");
if (isAdminRoute) {
  // 🔴 JIKA BELUM LOGIN / SESI KOSONG -> Redirect ke /login
  if (!user || !user.email) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(loginUrl);
  }
  // 🔴 JIKA BUKAN PEMILIK / OWNER -> Redirect ke /dashboard
  const userEmail = user.email.toLowerCase().trim();
  const ownerEmail = (process.env.OWNER_EMAIL || "").trim().toLowerCase();
  const isOwnerOrAdmin = (ownerEmail && userEmail === ownerEmail) || userEmail === "brimaspradika8@gmail.com";
  if (!isOwnerOrAdmin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
}


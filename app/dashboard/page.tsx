import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import AdminDashboard from "./admin-dashboard";
import UserDashboard from "./user-dashboard";

// Paksa Next.js untuk TIDAK PERNAH men-cache halaman ini secara statis.
// Tanpa ini, Next.js bisa menyimpan HTML hasil render user pertama (admin)
// lalu menyajikannya ke semua user berikutnya — inilah bug Route Cache.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // noStore() sebagai lapisan keamanan tambahan: memastikan Data Cache
  // juga tidak men-cache hasil fetch di dalam komponen ini.
  noStore();

  const supabase = await createClient();

  // 1. Verifikasi sesi aktif dari Supabase Auth server (bukan JWT lokal).
  //    getUser() memvalidasi token ke server → tidak bisa ditipu cookie stale.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // [DIAGNOSTIK] Log untuk memverifikasi identitas user yang dibaca server.
  // Hapus atau komentari baris ini setelah bug terkonfirmasi teratasi.
  console.log("[DashboardPage] getUser() result:", {
    userId: user?.id ?? "null",
    email: user?.email ?? "null",
    authError: authError?.message ?? "none",
  });

  // 2. Jika tidak ada sesi aktif, redirect ke login.
  //    (Middleware sudah menangani ini, tapi ini sebagai double-guard di Server Component.)
  if (!user) {
    redirect("/login");
  }

  // 3. Fetch db user berdasarkan EMAIL (bukan user.id).
  //    PENTING: Prisma men-generate UUID-nya sendiri saat create user,
  //    sehingga dbUser.id ≠ supabase user.id. Query harus pakai email.
  const userEmail = (user?.email ?? "").toLowerCase().trim();
  let dbUser = null;
  if (userEmail) {
    try {
      dbUser = await prisma.user.findUnique({
        where: { email: userEmail },
      });
    } catch {
      // Ignore database connection timeouts
    }
  }

  // [DIAGNOSTIK] Konfirmasi role yang diputuskan server.
  console.log("[DashboardPage] Role check:", {
    supabaseId: user?.id,
    dbUserId: dbUser?.id ?? "not found in DB",
    dbUserEmail: dbUser?.email ?? "null",
    role: dbUser?.role ?? "null",
  });

  // 4. Validasi Role Admin berlapis (tidak bisa di-bypass dari client):
  //    Layer 1: Role "ADMIN" di database Prisma
  //    Layer 2: ADMIN_EMAILS env var (untuk deployment)
  //    Layer 3: Hardcoded owner email sebagai ultimate fallback
  const envAdminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const isAdmin =
    dbUser?.role === "ADMIN" ||
    envAdminEmails.includes(userEmail) ||
    userEmail === "brimaspradika8@gmail.com";

  // 5. Render komponen berbeda berdasarkan role
  if (!isAdmin) {
    return <UserDashboard user={user} dbUser={dbUser} />;
  }

  // 6. Fetch Dashboard Stats ONLY for admin
  const projectsCount = await prisma.project.count().catch(() => 0);
  const articlesCount = await prisma.article.count().catch(() => 0);
  const usersCount = await prisma.user.count().catch(() => 0);
  const commentsCount = await prisma.comment.count().catch(() => 0);

  // Fetch Recent Items ONLY for admin
  const recentProjects = await prisma.project.findMany({
    take: 5,
    orderBy: { created_at: "desc" },
  }).catch(() => []);

  const recentArticles = await prisma.article.findMany({
    take: 5,
    orderBy: { created_at: "desc" },
  }).catch(() => []);

  return (
    <AdminDashboard
      user={user}
      dbUser={dbUser}
      stats={{ projectsCount, articlesCount, usersCount, commentsCount }}
      recentProjects={recentProjects}
      recentArticles={recentArticles}
    />
  );
}

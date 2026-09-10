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

  // 3. Fetch db user berdasarkan user.id dari sesi AKTIF
  let dbUser = null;
  if (user) {
    try {
      dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
    } catch {
      // Ignore database connection timeouts
    }
  }

  // [DIAGNOSTIK] Konfirmasi role yang diputuskan server untuk user ini.
  console.log("[DashboardPage] Role check:", {
    dbUserId: dbUser?.id ?? "not found in DB",
    dbUserEmail: dbUser?.email ?? "null",
    role: dbUser?.role ?? "null",
  });

  // 4. Validasi Role Admin di SERVER COMPONENT (tidak bisa di-bypass dari client).
  //    Cek via database (sumber kebenaran) dan env var sebagai fallback.
  const userEmail = (user?.email || dbUser?.email || "").toLowerCase().trim();
  const envAdminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const isAdmin =
    dbUser?.role === "ADMIN" ||
    (envAdminEmails.length > 0 && envAdminEmails.includes(userEmail));

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

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import AdminDashboard from "../dashboard/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  noStore();

  const supabase = await createClient();

  // 1. Verifikasi sesi dari Supabase Auth server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Jika tidak ada sesi, redirect ke login
  if (!user) {
    redirect("/login?redirectedFrom=/admin");
  }

  // 2. Fetch db user berdasarkan EMAIL
  const userEmail = (user?.email ?? "").toLowerCase().trim();
  let dbUser = null;
  if (userEmail) {
    try {
      dbUser = await prisma.user.findUnique({
        where: { email: userEmail },
      });
    } catch {
      // Ignore database connection errors
    }
  }

  // 3. Pengecekan Admin Role Berlapis
  const envAdminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const isAdmin =
    userEmail === "brimaspradika8@gmail.com" ||
    envAdminEmails.includes(userEmail) ||
    dbUser?.role === "ADMIN";

  // Jika BUKAN admin, redirect ke dashboard user publik
  if (!isAdmin) {
    redirect("/dashboard");
  }

  // 4. Fetch Stats untuk Admin
  const projectsCount = await prisma.project.count().catch(() => 0);
  const articlesCount = await prisma.article.count().catch(() => 0);
  const usersCount = await prisma.user.count().catch(() => 0);
  const commentsCount = await prisma.comment.count().catch(() => 0);

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

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { hasAdminDashboardAccess } from "@/lib/membership";
import { getProjects } from "@/lib/actions/project";
import { getArticles } from "@/lib/actions/article";
import AdminDashboard from "../admin-dashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kelola Proyek | Admin Dashboard",
  description: "Manajemen daftar proyek portofolio website.",
};

export default async function AdminProyekPage() {
  noStore();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectedFrom=/admin/proyek");
  }

  const userEmail = (user?.email ?? "").toLowerCase().trim();
  let dbUser = null;
  if (userEmail) {
    try {
      dbUser = await prisma.user.findUnique({
        where: { email: userEmail },
      });
    } catch {}
  }

  const envAdminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const isAdmin =
    userEmail === "brimaspradika8@gmail.com" ||
    envAdminEmails.includes(userEmail) ||
    dbUser?.role === "ADMIN";

  const hasAccess = await hasAdminDashboardAccess(dbUser?.id, isAdmin);

  if (!hasAccess) {
    redirect("/dashboard");
  }

  const projectsCount = await prisma.project.count().catch(() => 0);
  const articlesCount = await prisma.article.count().catch(() => 0);
  const usersCount = await prisma.user.count().catch(() => 0);
  const commentsCount = await prisma.comment.count().catch(() => 0);

  const recentProjectsRaw = await prisma.project.findMany({
    take: 5,
    orderBy: { created_at: "desc" },
  }).catch(() => []);

  const recentProjects = recentProjectsRaw.map((p) => ({
    id: p.id,
    title: p.title,
    thumbnail: p.thumbnail,
    created_at: p.created_at ? p.created_at.toISOString() : new Date().toISOString(),
  }));

  const recentArticlesRaw = await prisma.article.findMany({
    take: 5,
    orderBy: { created_at: "desc" },
  }).catch(() => []);

  const recentArticles = recentArticlesRaw.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    created_at: a.created_at ? a.created_at.toISOString() : new Date().toISOString(),
  }));

  const allProjects = await getProjects().catch(() => []);
  const allArticles = await getArticles().catch(() => []);

  const plainDbUser = dbUser ? { name: dbUser.name, avatar: dbUser.avatar } : null;

  return (
    <AdminDashboard
      user={user}
      dbUser={plainDbUser}
      stats={{ projectsCount, articlesCount, usersCount, commentsCount }}
      recentProjects={recentProjects}
      recentArticles={recentArticles}
      allProjects={allProjects}
      allArticles={allArticles}
      initialTab="proyek"
    />
  );
}

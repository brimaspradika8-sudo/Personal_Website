import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { checkIsAdmin, getArticles } from "@/lib/actions/article";
import { getProjects } from "@/lib/actions/project";
import AdminDashboard from "../admin-dashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kelola Artikel | Admin Dashboard",
  description: "Manajemen artikel dan moderasi komentar.",
};

export default async function AdminArticlesPage() {
  noStore();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectedFrom=/admin/artikel");
  }

  const userEmail = (user?.email ?? "").toLowerCase().trim();
  const isAdmin = await checkIsAdmin(userEmail);

  let dbUser = null;
  if (userEmail) {
    try {
      dbUser = await prisma.user.findUnique({
        where: { email: userEmail },
      });
    } catch {}
  }

  if (!isAdmin) {
    redirect("/dashboard/artikel");
  }

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

  const allProjects = await getProjects().catch(() => []);
  const allArticles = await getArticles().catch(() => []);

  return (
    <AdminDashboard
      user={user}
      dbUser={dbUser}
      stats={{ projectsCount, articlesCount, usersCount, commentsCount }}
      recentProjects={recentProjects}
      recentArticles={recentArticles}
      allProjects={allProjects}
      allArticles={allArticles}
      initialTab="artikel"
    />
  );
}

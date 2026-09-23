import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { checkIsAdmin } from "@/lib/actions/article";
import { getProjects } from "@/lib/actions/project";
import { getArticles } from "@/lib/actions/article";
import { getAuthenticatedUser } from "@/lib/auth/get-user";
import AdminDashboard from "../admin-dashboard";

export const metadata = {
  title: "Manage Projects | Admin Dashboard",
  description: "Portfolio project directory management.",
};

export default async function AdminProjectsPage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login?redirectedFrom=/admin/projects");
  }

  const userEmail = (user.email ?? "").toLowerCase().trim();

  const dbUser = userEmail
    ? await prisma.user.findUnique({ where: { email: userEmail } }).catch(() => null)
    : null;

  const isAdmin = await checkIsAdmin(userEmail, dbUser?.role);

  if (!isAdmin) {
    redirect("/dashboard");
  }

  const [
    projectsCount,
    articlesCount,
    usersCount,
    commentsCount,
    recentProjectsRaw,
    recentArticlesRaw,
    allProjects,
    allArticles,
  ] = await Promise.all([
    prisma.project.count().catch(() => 0),
    prisma.article.count().catch(() => 0),
    prisma.user.count().catch(() => 0),
    prisma.comment.count().catch(() => 0),
    prisma.project.findMany({ take: 5, orderBy: { created_at: "desc" } }).catch(() => []),
    prisma.article.findMany({ take: 5, orderBy: { created_at: "desc" } }).catch(() => []),
    getProjects().catch(() => []),
    getArticles().catch(() => []),
  ]);

  const recentProjects = recentProjectsRaw.map((p) => ({
    id: p.id,
    title: p.title,
    thumbnail: p.thumbnail,
    created_at: p.created_at ? p.created_at.toISOString() : new Date().toISOString(),
  }));

  const recentArticles = recentArticlesRaw.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    created_at: a.created_at ? a.created_at.toISOString() : new Date().toISOString(),
  }));

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

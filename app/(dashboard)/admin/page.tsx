import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { hasAdminDashboardAccess } from "@/lib/membership";
import { getProjects } from "@/lib/actions/project";
import { getArticles } from "@/lib/actions/article";
import { headers } from "next/headers";
import AdminDashboard from "./admin-dashboard";

export default async function AdminPage() {
  const headerList = await headers();
  const headerEmail = headerList.get("x-user-email");
  const headerId = headerList.get("x-user-id");
  const headerName = headerList.get("x-user-name");
  const headerAvatar = headerList.get("x-user-avatar");

  let user: { id: string; email: string; user_metadata: { full_name?: string; avatar_url?: string } } | null = null;

  if (headerEmail) {
    user = {
      id: headerId || "",
      email: headerEmail,
      user_metadata: {
        full_name: headerName ? decodeURIComponent(headerName) : "",
        avatar_url: headerAvatar ? decodeURIComponent(headerAvatar) : "",
      },
    };
  } else {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data?.user?.email) {
      user = {
        id: data.user.id,
        email: data.user.email,
        user_metadata: {
          full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || "",
          avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || "",
        },
      };
    }
  }

  if (!user) {
    redirect("/login?redirectedFrom=/admin");
  }

  const userEmail = (user.email ?? "").toLowerCase().trim();

  // 1. Fetch DB User berdasarkan email
  const dbUser = userEmail
    ? await prisma.user.findUnique({ where: { email: userEmail } }).catch(() => null)
    : null;

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

  // 2. Fetch seluruh data stats & daftar project/artikel secara paralel
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
      user={user as any}
      dbUser={plainDbUser}
      stats={{ projectsCount, articlesCount, usersCount, commentsCount }}
      recentProjects={recentProjects}
      recentArticles={recentArticles}
      allProjects={allProjects}
      allArticles={allArticles}
      initialTab="overview"
    />
  );
}

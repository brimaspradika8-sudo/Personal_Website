import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import AdminDashboard from "./admin-dashboard";
import UserDashboard from "./user-dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch db user
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

  const userEmail = (user?.email || dbUser?.email || "").toLowerCase().trim();
  const isAdmin = userEmail === "brimaspradika8@gmail.com";

  if (!isAdmin) {
    return <UserDashboard user={user} dbUser={dbUser} />;
  }

  // Fetch Dashboard Stats ONLY for admin
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

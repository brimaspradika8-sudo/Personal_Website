import { prisma } from "@/lib/prisma";
import { checkIsAdmin } from "@/lib/actions/auth";
import { getArticles } from "@/lib/actions/article";
import { getProjects } from "@/lib/actions/project";
import { getAuthenticatedUser } from "@/lib/auth/get-user";
import DashboardClient from "./dashboard-client";

// Revalidate halaman dashboard setiap 60 detik (ISR) alih-alih force-dynamic di setiap request
export const revalidate = 60;

export default async function DashboardPage() {
  // 1. Ambil user terautentikasi (0ms network delay via Middleware Headers)
  const user = await getAuthenticatedUser();
  const userEmail = (user?.email ?? "").toLowerCase().trim();

  // 2. Fetch DB User sekali saja
  const dbUser = userEmail
    ? await prisma.user.findUnique({ where: { email: userEmail } }).catch(() => null)
    : null;

  // 3. Pass dbUser.role langsung ke checkIsAdmin + fetch artikel & proyek paralel
  const [isAdmin, articles, projects] = await Promise.all([
    checkIsAdmin(userEmail, dbUser?.role),
    getArticles(),
    getProjects(),
  ]);

  return (
    <DashboardClient
      user={user}
      dbUser={dbUser}
      initialArticles={articles}
      initialProjects={projects}
      isAdmin={isAdmin}
    />
  );
}

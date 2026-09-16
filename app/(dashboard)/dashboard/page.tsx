import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { checkIsAdmin } from "@/lib/actions/auth";
import { getArticles } from "@/lib/actions/article";
import DashboardClient from "./dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userEmail = (user?.email ?? "").toLowerCase().trim();

  // Parallelize data fetching to eliminate waterfall delay
  const [dbUser, isAdmin, articles] = await Promise.all([
    userEmail
      ? prisma.user.findUnique({ where: { email: userEmail } }).catch(() => null)
      : Promise.resolve(null),
    checkIsAdmin(userEmail),
    getArticles(),
  ]);

  return (
    <DashboardClient
      user={user}
      dbUser={dbUser}
      initialArticles={articles}
      isAdmin={isAdmin}
    />
  );
}

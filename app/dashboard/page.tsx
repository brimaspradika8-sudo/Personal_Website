import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import { checkIsAdmin } from "@/lib/actions/auth";
import { getArticles } from "@/lib/actions/article";
import DashboardClient from "./dashboard-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  noStore();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let dbUser = null;
  const userEmail = (user?.email ?? "").toLowerCase().trim();
  if (userEmail) {
    try {
      dbUser = await prisma.user.findUnique({
        where: { email: userEmail },
      });
    } catch {
      // Ignore DB connection errors
    }
  }

  const isAdmin = await checkIsAdmin(userEmail);
  const articles = await getArticles();

  return (
    <DashboardClient
      user={user}
      dbUser={dbUser}
      initialArticles={articles}
      isAdmin={isAdmin}
    />
  );
}

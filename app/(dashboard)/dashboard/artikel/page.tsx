import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { checkIsAdmin, getUserArticles } from "@/lib/actions/article";
import { canUserCreateArticle, getEffectiveUserTier } from "@/lib/membership";
import UserArticlesClient from "./user-articles-client";

export const dynamic = "force-dynamic";

export default async function UserArticlesPage() {
  noStore();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectedFrom=/dashboard/artikel");
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

  const userId = dbUser?.id || "";
  const effectiveTier = userId ? await getEffectiveUserTier(userId) : "FREE";
  const permission = userId ? await canUserCreateArticle(userId, isAdmin) : { allowed: false, reason: "Harus terdaftar sebagai member." };
  
  // Ambil artikel khusus yang ditulis oleh pengguna ini
  const userArticles = userId ? await getUserArticles(userId) : [];

  return (
    <UserArticlesClient
      user={user}
      dbUser={dbUser}
      userTier={effectiveTier}
      permission={permission}
      isAdmin={isAdmin}
      initialArticles={userArticles}
    />
  );
}

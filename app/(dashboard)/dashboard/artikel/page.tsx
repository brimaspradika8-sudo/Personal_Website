import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { checkIsAdmin, getUserArticles } from "@/lib/actions/article";
import { canUserCreateArticle, getEffectiveUserTier } from "@/lib/membership";
import { getAuthenticatedUser } from "@/lib/auth/get-user";
import UserArticlesClient from "./user-articles-client";

export default async function UserArticlesPage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login?redirectedFrom=/dashboard/artikel");
  }

  const userEmail = (user.email ?? "").toLowerCase().trim();

  const dbUser = userEmail
    ? await prisma.user.findUnique({ where: { email: userEmail } }).catch(() => null)
    : null;

  const isAdmin = await checkIsAdmin(userEmail, dbUser?.role);
  const userId = dbUser?.id || "";

  const [effectiveTier, permission, userArticles] = await Promise.all([
    userId ? getEffectiveUserTier(userId) : Promise.resolve("FREE" as const),
    userId ? canUserCreateArticle(userId, isAdmin) : Promise.resolve({ allowed: false, reason: "Harus terdaftar sebagai member." }),
    userId ? getUserArticles(userId) : Promise.resolve([]),
  ]);

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

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { checkIsAdmin, getUserArticles } from "@/lib/actions/article";
import { getAuthenticatedUser } from "@/lib/auth/get-user";
import UserArticlesClient from "./user-articles-client";

export default async function UserArticlesPage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login?redirectedFrom=/dashboard/articles");
  }

  const userEmail = (user.email ?? "").toLowerCase().trim();

  const dbUser = userEmail
    ? await prisma.user.findUnique({ where: { email: userEmail } }).catch(() => null)
    : null;

  const isAdmin = await checkIsAdmin(userEmail, dbUser?.role);
  const userId = dbUser?.id || "";

  const userArticles = userId ? await getUserArticles(userId) : [];

  return (
    <UserArticlesClient
      user={user}
      dbUser={dbUser}
      isAdmin={isAdmin}
      initialArticles={userArticles}
    />
  );
}

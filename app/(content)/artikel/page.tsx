import { getArticles } from "@/lib/actions/article";
import { checkIsAdmin } from "@/lib/actions/auth";
import { prisma } from "@/lib/prisma";
import { getEffectiveUserTier, MembershipTier } from "@/lib/membership";
import { getAuthenticatedUser } from "@/lib/auth/get-user";
import ArtikelClient from "./artikel-client";

export const revalidate = 60;

export default async function ArtikelPage() {
  const user = await getAuthenticatedUser();
  const userEmail = user?.email ? user.email.toLowerCase().trim() : "";

  const [dbUser, articles] = await Promise.all([
    userEmail
      ? prisma.user.findUnique({ where: { email: userEmail }, select: { id: true, role: true } }).catch(() => null)
      : Promise.resolve(null),
    getArticles(),
  ]);

  const [isAdmin, userTier] = await Promise.all([
    checkIsAdmin(userEmail, dbUser?.role),
    dbUser ? getEffectiveUserTier(dbUser.id).catch(() => "FREE" as const) : Promise.resolve("FREE" as const),
  ]);

  return (
    <ArtikelClient
      initialArticles={articles}
      user={user}
      userTier={userTier as MembershipTier}
      isAdmin={isAdmin}
    />
  );
}

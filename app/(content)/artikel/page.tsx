import { getArticles } from "@/lib/actions/article";
import { checkIsAdmin } from "@/lib/actions/auth";
import { prisma } from "@/lib/prisma";
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

  const isAdmin = await checkIsAdmin(userEmail, dbUser?.role);

  return (
    <ArtikelClient
      initialArticles={articles}
      user={user}
      isAdmin={isAdmin}
    />
  );
}

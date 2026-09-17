import { getArticles } from "@/lib/actions/article";
import { checkIsAdmin } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getEffectiveUserTier, MembershipTier } from "@/lib/membership";
import ArtikelClient from "./artikel-client";

export const dynamic = "force-dynamic";

export default async function ArtikelPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userEmail = user?.email ? user.email.toLowerCase().trim() : "";

  const [isAdmin, articles, dbUser] = await Promise.all([
    checkIsAdmin(userEmail),
    getArticles(),
    userEmail
      ? prisma.user.findUnique({ where: { email: userEmail }, select: { id: true } }).catch(() => null)
      : Promise.resolve(null),
  ]);

  const userTier: MembershipTier = dbUser
    ? await getEffectiveUserTier(dbUser.id).catch(() => "FREE")
    : "FREE";

  return (
    <ArtikelClient
      initialArticles={articles}
      user={user}
      userTier={userTier}
      isAdmin={isAdmin}
    />
  );
}

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

  let userTier: MembershipTier = "FREE";
  if (user?.email) {
    try {
      const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
      if (dbUser) {
        userTier = await getEffectiveUserTier(dbUser.id);
      }
    } catch {}
  }

  const [isAdmin, articles] = await Promise.all([
    checkIsAdmin(user?.email),
    getArticles(),
  ]);

  return (
    <ArtikelClient
      initialArticles={articles}
      user={user}
      userTier={userTier}
      isAdmin={isAdmin}
    />
  );
}

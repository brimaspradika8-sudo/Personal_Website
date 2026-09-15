import { getArticles } from "@/lib/actions/article";
import { checkIsAdmin } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/server";
import ArtikelClient from "./artikel-client";

export const dynamic = "force-dynamic";

export default async function ArtikelPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const isAdmin = await checkIsAdmin(user?.email);
  const articles = await getArticles();

  return <ArtikelClient initialArticles={articles} user={user} isAdmin={isAdmin} />;
}

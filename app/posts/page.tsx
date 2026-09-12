import { getArticles } from "@/lib/actions/article";
import { checkIsAdmin } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/server";
import PostsClient from "./posts-client";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const isAdmin = await checkIsAdmin(user?.email);
  const articles = await getArticles();

  return <PostsClient initialArticles={articles} user={user} isAdmin={isAdmin} />;
}

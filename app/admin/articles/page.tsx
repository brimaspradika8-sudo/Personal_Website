import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { checkIsAdmin, getArticles } from "@/lib/actions/article";
import AdminArticlesClient from "./articles-client";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  noStore();

  const supabase = await createClient();

  // 1. Verifikasi sesi dari Supabase Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectedFrom=/admin/articles");
  }

  // 2. Pengecekan Admin Role
  const userEmail = (user?.email ?? "").toLowerCase().trim();
  const isAdmin = await checkIsAdmin(userEmail);

  if (!isAdmin) {
    redirect("/dashboard");
  }

  // 3. Fetch Data User dari DB
  let dbUser = null;
  if (userEmail) {
    try {
      dbUser = await prisma.user.findUnique({
        where: { email: userEmail },
      });
    } catch {}
  }

  // 4. Fetch Daftar Artikel Lengkap
  const articles = await getArticles();

  return (
    <AdminArticlesClient
      user={user}
      dbUser={dbUser}
      initialArticles={articles}
    />
  );
}

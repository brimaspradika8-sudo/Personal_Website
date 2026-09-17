import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { checkIsAdmin } from "@/lib/actions/auth";
import { getArticles } from "@/lib/actions/article";
import { headers } from "next/headers";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const headerList = await headers();
  const headerEmail = headerList.get("x-user-email");
  const headerId = headerList.get("x-user-id");
  const headerName = headerList.get("x-user-name");
  const headerAvatar = headerList.get("x-user-avatar");

  // Single Source of Truth: Gunakan user dari middleware headers jika tersedia (0ms network delay), atau fallback ke Supabase Auth
  let user: { id: string; email: string; user_metadata: { full_name?: string; avatar_url?: string } } | null = null;

  if (headerEmail) {
    user = {
      id: headerId || "",
      email: headerEmail,
      user_metadata: {
        full_name: headerName ? decodeURIComponent(headerName) : "",
        avatar_url: headerAvatar ? decodeURIComponent(headerAvatar) : "",
      },
    };
  } else {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data?.user?.email) {
      user = {
        id: data.user.id,
        email: data.user.email,
        user_metadata: {
          full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || "",
          avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || "",
        },
      };
    }
  }

  const userEmail = (user?.email ?? "").toLowerCase().trim();

  // 1. Fetch DB User sekali saja
  const dbUser = userEmail
    ? await prisma.user.findUnique({ where: { email: userEmail } }).catch(() => null)
    : null;

  // 2. Pass dbUser.role langsung ke checkIsAdmin agar TIDAK melakukan query Prisma duplikat
  const [isAdmin, articles] = await Promise.all([
    checkIsAdmin(userEmail, dbUser?.role),
    getArticles(),
  ]);

  return (
    <DashboardClient
      user={user as any}
      dbUser={dbUser}
      initialArticles={articles}
      isAdmin={isAdmin}
    />
  );
}

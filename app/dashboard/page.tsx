import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import AdminDashboard from "./admin-dashboard";
import DashboardClient from "./dashboard-client";

// Paksa Next.js untuk TIDAK PERNAH men-cache halaman ini secara statis.
export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams?: Promise<{ view?: string }> | { view?: string };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  // noStore() sebagai lapisan keamanan tambahan
  noStore();

  const resolvedSearchParams = await searchParams;
  const requestedView = resolvedSearchParams?.view;

  const supabase = await createClient();

  // 1. Verifikasi sesi aktif dari Supabase Auth server (bukan JWT lokal).
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // [DIAGNOSTIK] Log untuk memverifikasi identitas user yang dibaca server.
  console.log("[DashboardPage] getUser() result:", {
    userId: user?.id ?? "null",
    email: user?.email ?? "null",
    authError: authError?.message ?? "none",
  });

  // 2. Jika tidak ada sesi aktif, redirect ke login.
  if (!user) {
    redirect("/login");
  }

  // 3. Fetch db user berdasarkan EMAIL.
  const userEmail = (user?.email ?? "").toLowerCase().trim();
  let dbUser = null;
  if (userEmail) {
    try {
      dbUser = await prisma.user.findUnique({
        where: { email: userEmail },
      });
    } catch {
      // Ignore database connection timeouts
    }
  }

  // [DIAGNOSTIK] Konfirmasi role yang diputuskan server.
  console.log("[DashboardPage] Role check:", {
    supabaseId: user?.id,
    dbUserId: dbUser?.id ?? "not found in DB",
    dbUserEmail: dbUser?.email ?? "null",
    role: dbUser?.role ?? "null",
  });

  // 4. Validasi Role Admin berlapis:
  const envAdminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const isAdmin =
    dbUser?.role === "ADMIN" ||
    envAdminEmails.includes(userEmail) ||
    userEmail === "brimaspradika8@gmail.com";

  // 5. Fetch Projects untuk DashboardClient
  let supabaseProjects: any[] = [];
  try {
    const { data, error } = await supabase
      .from("Project")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      supabaseProjects = data;
    }
  } catch (err) {
    console.warn("Supabase Project fetch failed:", err);
  }

  // 6. Keputusan Tampilan (View):
  // Default untuk SEMUA USER (termasuk Visitor & Admin) adalah DashboardClient (Tampilan Portfolio).
  // HANYA Admin yang bisa mengakses AdminDashboard jika ?view=admin dipanggil.
  const showAdminDashboard = isAdmin && requestedView === "admin";

  if (!showAdminDashboard) {
    return (
      <DashboardClient
        user={user}
        dbUser={dbUser}
        dbProjects={supabaseProjects}
        isAdmin={isAdmin}
      />
    );
  }

  // 7. Jika Admin mengakses ?view=admin: Render AdminDashboard
  const projectsCount = await prisma.project.count().catch(() => 0);
  const articlesCount = await prisma.article.count().catch(() => 0);
  const usersCount = await prisma.user.count().catch(() => 0);
  const commentsCount = await prisma.comment.count().catch(() => 0);

  const recentProjects = await prisma.project.findMany({
    take: 5,
    orderBy: { created_at: "desc" },
  }).catch(() => []);

  const recentArticles = await prisma.article.findMany({
    take: 5,
    orderBy: { created_at: "desc" },
  }).catch(() => []);

  return (
    <AdminDashboard
      user={user}
      dbUser={dbUser}
      stats={{ projectsCount, articlesCount, usersCount, commentsCount }}
      recentProjects={recentProjects}
      recentArticles={recentArticles}
    />
  );
}


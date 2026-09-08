import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Fetch current Supabase user session (Server Component Fetch)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Fetch Projects directly from Supabase Table ("Project")
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
    console.warn("Supabase fetch failed, fallback to Prisma:", err);
  }

  // 3. Fallback / Sync user info from Prisma DB
  let dbUser = null;
  if (user) {
    try {
      dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
    } catch {
      // Ignore database connection timeouts
    }
  }

  let dbProjects: any[] = [];
  try {
    dbProjects = await prisma.project.findMany({
      orderBy: { created_at: "desc" },
    });
  } catch {
    dbProjects = [];
  }

  // Prefer projects fetched directly from Supabase
  const finalProjects = supabaseProjects.length > 0 ? supabaseProjects : dbProjects;

  return (
    <DashboardClient
      user={user}
      dbUser={dbUser}
      dbProjects={finalProjects}
    />
  );
}

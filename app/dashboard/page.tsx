import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch current Supabase user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let dbUser = null;
  if (user) {
    try {
      dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
    } catch {
      // Ignore database connection timeouts during builds
    }
  }

  let dbProjects: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    thumbnail: string | null;
    demo_url: string | null;
    repository_url: string | null;
    created_at: Date | string;
  }> = [];

  try {
    dbProjects = await prisma.project.findMany({
      orderBy: { created_at: "desc" },
    });
  } catch {
    dbProjects = [];
  }

  return (
    <DashboardClient
      user={user}
      dbUser={dbUser}
      dbProjects={dbProjects}
    />
  );
}

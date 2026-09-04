import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let dbUser = null;
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

  if (user?.email) {
    try {
      const dbQuery = prisma.user.findUnique({
        where: { email: user.email },
        select: {
          id: true,
          email: true,
          name: true,
          created_at: true,
        },
      });
      const timeout = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), 1500)
      );

      dbUser = await Promise.race([dbQuery, timeout]);
    } catch (e) {
      console.warn("Failed or timed out fetching user from database:", e);
      dbUser = null;
    }
  }

  try {
    const projectsQuery = prisma.project.findMany({
      orderBy: { created_at: "desc" },
    });
    const timeout = new Promise<typeof dbProjects>((resolve) =>
      setTimeout(() => resolve([]), 1500)
    );
    dbProjects = (await Promise.race([projectsQuery, timeout])) || [];
  } catch (e) {
    console.warn("Failed or timed out fetching projects from database:", e);
    dbProjects = [];
  }

  return <DashboardClient user={user} dbUser={dbUser} dbProjects={dbProjects} />;
}

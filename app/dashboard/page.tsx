import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Run user query and projects query concurrently via Promise.all
  const userPromise = user?.email
    ? prisma.user
        .findUnique({
          where: { email: user.email },
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            created_at: true,
          },
        })
        .catch((e) => {
          console.warn("Failed fetching user from database:", e);
          return null;
        })
    : Promise.resolve(null);

  const projectsPromise = prisma.project
    .findMany({
      orderBy: { created_at: "desc" },
    })
    .catch((e) => {
      console.warn("Failed fetching projects from database:", e);
      return [];
    });

  // Execute both queries concurrently with a 4s max fallback limit
  const timeoutPromise = new Promise<[null, []]>((resolve) =>
    setTimeout(() => resolve([null, []]), 4000)
  );

  const [dbUser, dbProjects] = await Promise.race([
    Promise.all([userPromise, projectsPromise]),
    timeoutPromise,
  ]);

  return <DashboardClient user={user} dbUser={dbUser} dbProjects={dbProjects || []} />;
}


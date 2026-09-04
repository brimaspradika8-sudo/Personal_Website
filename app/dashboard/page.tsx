import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let dbUser = null;
  if (user.email) {
    try {
      const dbQuery = prisma.user.findUnique({
        where: { email: user.email },
      });
      const timeout = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), 4000)
      );

      dbUser = await Promise.race([dbQuery, timeout]);
    } catch (e) {
      console.warn("Failed or timed out fetching user from database:", e);
      dbUser = null;
    }
  }

  return <DashboardClient user={user} dbUser={dbUser} />;
}

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import ProfileClient from "./profile-client";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let dbUser = null;

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
      console.warn("Failed or timed out fetching user for profile:", e);
      dbUser = null;
    }
  }

  return <ProfileClient user={user} dbUser={dbUser} />;
}

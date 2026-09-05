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
      dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          created_at: true,
        },
      });
    } catch (e) {
      console.warn("Failed fetching user for profile:", e);
      dbUser = null;
    }
  }

  return <ProfileClient user={user} dbUser={dbUser} />;
}


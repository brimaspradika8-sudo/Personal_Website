import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import ProfileClient from "./profile-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
          tier: true,
          tier_expires_at: true,
          role: true,
          created_at: true,
        },
      });
    } catch (e) {
      console.warn("Failed fetching user for profile:", e);
    }
  }

  return <ProfileClient user={user} dbUser={dbUser} />;
}

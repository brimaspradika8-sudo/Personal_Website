import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth/get-user";
import ProfileClient from "./profile-client";

export default async function ProfilePage() {
  const user = await getAuthenticatedUser();
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

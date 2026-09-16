import { createClient } from "@/lib/supabase/server";
import { getMyMembershipStatus } from "@/lib/actions/membership";
import UpgradeClient from "./upgrade-client";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

export default async function UpgradePage() {
  noStore();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const membershipStatus = await getMyMembershipStatus();

  return (
    <UpgradeClient
      initialUser={user}
      initialMembershipStatus={membershipStatus}
    />
  );
}

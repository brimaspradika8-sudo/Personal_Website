import { Suspense } from "react";
import { getMyMembershipStatus } from "@/lib/actions/membership";
import { getAuthenticatedUser } from "@/lib/auth/get-user";
import UpgradeClient from "./upgrade-client";

export default async function UpgradePage() {
  const user = await getAuthenticatedUser();
  const membershipStatus = await getMyMembershipStatus();

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F9FA]" />}>
      <UpgradeClient
        initialUser={user}
        initialMembershipStatus={membershipStatus}
      />
    </Suspense>
  );
}

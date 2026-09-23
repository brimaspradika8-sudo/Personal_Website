"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("brimas_onboarding_seen") === "true";
    router.replace(hasSeenOnboarding ? "/dashboard" : "/onboarding");
  }, [router]);

  return null;
}

import type { Metadata } from "next";
import OnboardingSplash from "@/components/OnboardingSplash";

const isProductionEnv =
  (process.env.VERCEL_ENV ?? process.env.NEXT_PUBLIC_VERCEL_ENV ?? "production") === "production";

export const metadata: Metadata = {
  robots: {
    index: isProductionEnv,
    follow: isProductionEnv,
    nocache: !isProductionEnv,
  },
};

export default function OnboardingPage() {
  return <OnboardingSplash />;
}

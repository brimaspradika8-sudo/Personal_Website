import type { Metadata } from "next";
import OnboardingSplash from "@/components/OnboardingSplash";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function OnboardingPage() {
  return <OnboardingSplash />;
}

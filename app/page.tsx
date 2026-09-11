"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import IntroSplash from "@/components/IntroSplash";

export default function HomePage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    try {
      const hasSeen = sessionStorage.getItem("hasSeenRiveIntro");
      if (hasSeen === "true") {
        router.replace("/dashboard");
      } else {
        setCheckingSession(false);
      }
    } catch {
      setCheckingSession(false);
    }
  }, [router]);

  if (checkingSession) {
    return (
      <div className="fixed inset-0 bg-[#FAFAFA] flex items-center justify-center text-slate-900" />
    );
  }

  return (
    <main className="fixed inset-0 w-screen h-screen bg-[#FAFAFA] overflow-hidden">
      <IntroSplash
        ownerName="BRIMAS PRADIKA UTAMA"
        onComplete={() => {
          try {
            sessionStorage.setItem("hasSeenRiveIntro", "true");
          } catch {}
          window.location.href = "/dashboard";
        }}
      />
    </main>
  );
}

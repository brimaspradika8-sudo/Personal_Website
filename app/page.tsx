"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import IntroLoader from "@/components/IntroLoader";

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
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white" />
    );
  }

  return (
    <main className="fixed inset-0 w-screen h-screen bg-black overflow-hidden">
      <IntroLoader
        animationSrc="/animations/maploadingscreen.riv"
        onComplete={() => {
          window.location.href = "/dashboard";
        }}
      />
    </main>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { useRive } from "@rive-app/react-canvas";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  const [riveLoaded, setRiveLoaded] = useState(false);
  const isTransitioningRef = useRef(false);

  const { RiveComponent, rive } = useRive(
    {
      src: "/animations/theme-switch.riv",
      autoplay: true,
    },
    {
      shouldResizeCanvasToContainer: true,
    }
  );

  // Sync state machine boolean input when rive is loaded or when isDark state changes
  useEffect(() => {
    if (!rive) return;

    const smNames = rive.stateMachineNames || [];
    console.log("[Rive Theme Switch Debug] State Machine Names:", smNames);

    if (smNames.length > 0) {
      const activeSm = smNames[0];
      const inputs = rive.stateMachineInputs(activeSm);
      console.log(
        `[Rive Theme Switch Debug] Inputs for '${activeSm}':`,
        inputs?.map((i) => ({ name: i.name, type: i.type, value: i.value }))
      );

      // Find the boolean input in the state machine (e.g. isDark, isNight, toggle, switch, day, etc.)
      const boolInput = inputs?.find(
        (i) =>
          i.name.toLowerCase().includes("dark") ||
          i.name.toLowerCase().includes("night") ||
          i.name.toLowerCase().includes("toggle") ||
          i.name.toLowerCase().includes("switch") ||
          i.name.toLowerCase().includes("day") ||
          i.name.toLowerCase().includes("light") ||
          typeof i.value === "boolean"
      );

      if (boolInput) {
        console.log(`[Rive Theme Switch Debug] Setting input '${boolInput.name}' to:`, isDark);
        boolInput.value = isDark;
      }
    }
    setRiveLoaded(true);
  }, [rive, isDark]);

  const handleClick = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    // Trigger theme toggle callback
    onToggle();

    // Prevent rapid double clicking / spamming during animation
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 400);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden hover:scale-105 active:scale-95 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 shrink-0 cursor-pointer flex items-center justify-center bg-transparent border-0"
    >
      <RiveComponent className="w-full h-full pointer-events-none" />
    </button>
  );
}

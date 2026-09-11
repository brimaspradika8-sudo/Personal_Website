"use client";

import React from "react";
import { useRive } from "@rive-app/react-canvas";

export default function RiveDataChangeAnimation() {
  const { RiveComponent, rive } = useRive(
    {
      src: "/animations/24596-46145-data-change-on-click.riv",
      autoplay: true,
    },
    {
      shouldResizeCanvasToContainer: true,
    }
  );

  return (
    <div
      onClick={() => {
        try {
          if (rive) {
            rive.play();
          }
        } catch {}
      }}
      className="w-full h-full min-h-[180px] max-h-[260px] cursor-pointer flex items-center justify-center relative overflow-hidden rounded-xl"
      title="Klik untuk memicu animasi perubahan data Rive"
    >
      <RiveComponent className="w-full h-full min-h-[180px] object-contain" />
    </div>
  );
}

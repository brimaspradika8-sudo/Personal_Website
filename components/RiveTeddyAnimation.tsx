"use client";

import React, { useEffect } from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

interface RiveTeddyProps {
  nameText?: string;
  emailText?: string;
  isPasswordFocused?: boolean;
  showPassword?: boolean;
  error?: string | null;
  success?: boolean;
}

export default function RiveTeddyAnimation({
  nameText = "",
  emailText = "",
  isPasswordFocused = false,
  showPassword = false,
  error = null,
  success = false,
}: RiveTeddyProps) {
  const STATE_MACHINE_NAME = "Login Machine";

  const { RiveComponent, rive } = useRive(
    {
      src: "/animations/auth-teddy.riv",
      stateMachine: STATE_MACHINE_NAME,
      autoplay: true,
      layout: new Layout({
        fit: Fit.Contain,
        alignment: Alignment.Center,
      }),
    },
    {
      shouldResizeCanvasToContainer: true,
    }
  );

  const activeStateMachineName = rive?.stateMachineNames?.[0] || STATE_MACHINE_NAME;

  // Sync focus & password visibility state
  useEffect(() => {
    if (!rive) return;
    const inputsList = rive.stateMachineInputs(activeStateMachineName);
    if (!inputsList) return;

    const isPrivateField = inputsList.find((i) => i.name === "isPrivateField");
    const isFocus = inputsList.find((i) => i.name === "isFocus");

    // Teddy covers eyes if password field is focused AND password is hidden
    if (isPrivateField) {
      isPrivateField.value = isPasswordFocused && !showPassword;
    }

    if (isFocus) {
      isFocus.value = !isPasswordFocused;
    }
  }, [rive, activeStateMachineName, isPasswordFocused, showPassword]);

  // Sync error & success triggers
  useEffect(() => {
    if (!rive || !error) return;
    const inputsList = rive.stateMachineInputs(activeStateMachineName);
    const failTrigger = inputsList?.find((i) => i.name === "failTrigger");
    failTrigger?.fire();
  }, [rive, activeStateMachineName, error]);

  useEffect(() => {
    if (!rive || !success) return;
    const inputsList = rive.stateMachineInputs(activeStateMachineName);
    const successTrigger = inputsList?.find((i) => i.name === "successTrigger");
    successTrigger?.fire();
  }, [rive, activeStateMachineName, success]);

  // Sync eye look movement when typing
  useEffect(() => {
    if (!rive || isPasswordFocused) return;
    const inputsList = rive.stateMachineInputs(activeStateMachineName);
    const numLook = inputsList?.find((i) => i.name === "numLook");
    if (numLook) {
      const activeText = nameText || emailText;
      const targetLook = Math.min(Math.max((activeText.length > 0 ? activeText.length : 0) * 3.3, 0), 100);
      numLook.value = targetLook;
    }
  }, [rive, activeStateMachineName, nameText, emailText, isPasswordFocused]);

  return (
    <div className="w-full h-full flex items-center justify-center min-h-[160px]">
      <RiveComponent className="w-full h-full" />
    </div>
  );
}


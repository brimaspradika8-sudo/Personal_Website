"use client";

import React, { useEffect, useRef } from "react";
import { useRive } from "@rive-app/react-canvas";

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
      stateMachines: STATE_MACHINE_NAME,
      autoplay: true,
    },
    {
      shouldResizeCanvasToContainer: true,
    }
  );

  const activeStateMachineName = rive?.stateMachineNames?.[0] || STATE_MACHINE_NAME;

  const inputs = rive ? rive.stateMachineInputs(activeStateMachineName) : [];
  const isFocusInput = inputs?.find((i) => i.name === "isFocus");
  const numLookInput = inputs?.find((i) => i.name === "numLook");
  const isPrivateFieldInput = inputs?.find((i) => i.name === "isPrivateField");
  const isPrivateFieldShowInput = inputs?.find((i) => i.name === "isPrivateFieldShow");
  const successTriggerInput = inputs?.find((i) => i.name === "successTrigger");
  const failTriggerInput = inputs?.find((i) => i.name === "failTrigger");

  // Sync focus & password visibility state
  useEffect(() => {
    if (isPrivateFieldInput) isPrivateFieldInput.value = isPasswordFocused;
    if (isPrivateFieldShowInput) isPrivateFieldShowInput.value = showPassword;
    if (isFocusInput) isFocusInput.value = !isPasswordFocused;
  }, [isPasswordFocused, showPassword, isPrivateFieldInput, isPrivateFieldShowInput, isFocusInput]);

  // Sync error & success triggers
  useEffect(() => {
    if (error && failTriggerInput) failTriggerInput.fire();
  }, [error, failTriggerInput]);

  useEffect(() => {
    if (success && successTriggerInput) successTriggerInput.fire();
  }, [success, successTriggerInput]);

  // Sync eye look movement when typing
  useEffect(() => {
    if (!isPasswordFocused && numLookInput) {
      const activeText = nameText || emailText;
      const targetLook = Math.min(Math.max((activeText.length > 0 ? activeText.length : 15) * 3.3, 0), 100);
      numLookInput.value = targetLook;
    }
  }, [nameText, emailText, isPasswordFocused, numLookInput]);

  return <RiveComponent className="w-full h-full min-w-[220px] min-h-[220px]" />;
}

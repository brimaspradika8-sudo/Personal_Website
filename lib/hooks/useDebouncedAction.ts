"use client";

import { useCallback, useRef, useEffect } from "react";

export function useDebouncedAction<T extends (...args: any[]) => void | Promise<void>>(
  callback: T,
  delay = 500
) {
  const timeoutRef = useRef<NodeJS.Timeout | number | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );
}


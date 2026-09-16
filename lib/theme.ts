"use client";

export type ThemeMode = "day";

export function getSavedTheme(): ThemeMode {
  return "day";
}

export function saveTheme(_mode?: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("theme_mode", "day");
    localStorage.setItem("landscape_mode", "day");
    localStorage.setItem("dashboard_theme", "day");
    document.documentElement.classList.remove("dark");
  } catch (e) {
    console.warn("Error enforcing day theme", e);
  }
}

export function applyThemeOnLoad() {
  saveTheme("day");
  return "day";
}

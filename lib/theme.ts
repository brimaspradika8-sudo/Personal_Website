"use client";

export type ThemeMode = "night" | "day";

export function getSavedTheme(): ThemeMode {
  if (typeof window === "undefined") return "day";
  try {
    const saved =
      localStorage.getItem("theme_mode") ||
      localStorage.getItem("landscape_mode") ||
      localStorage.getItem("dashboard_theme");
    if (saved === "night" || saved === "dark") return "night";
    if (saved === "day" || saved === "light") return "day";
  } catch (e) {
    console.warn("Error reading theme from localStorage", e);
  }
  return "day";
}

export function saveTheme(mode: ThemeMode) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("theme_mode", mode);
    localStorage.setItem("landscape_mode", mode);
    localStorage.setItem("dashboard_theme", mode);

    if (mode === "night") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } catch (e) {
    console.warn("Error saving theme to localStorage", e);
  }
}

export function applyThemeOnLoad() {
  const current = getSavedTheme();
  saveTheme(current);
  return current;
}


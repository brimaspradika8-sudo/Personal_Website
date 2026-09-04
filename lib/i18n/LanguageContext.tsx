"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import idDict from "./dictionaries/id.json";
import enDict from "./dictionaries/en.json";

export type Language = "id" | "en";
export type Dictionary = typeof idDict;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  dict: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("id");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("landscape_lang");
    if (saved === "en" || saved === "id") {
      setLangState(saved);
    }
    setMounted(true);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("landscape_lang", newLang);
  };

  const toggleLang = () => {
    const nextLang = lang === "id" ? "en" : "id";
    setLang(nextLang);
  };

  const dict = lang === "id" ? idDict : enDict;

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, dict }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

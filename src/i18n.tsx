import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "en" | "ru";

const STORAGE_KEY = "claimshift-site-language";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function initialLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "en" || saved === "ru") return saved;
  return navigator.language.toLowerCase().startsWith("ru") ? "ru" : "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  useEffect(() => {
    document.documentElement.lang = language === "ru" ? "ru" : "en";
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
}

export const commonCopy = {
  en: {
    home: "Home",
    wiki: "Wiki",
    github: "GitHub",
    modrinth: "Modrinth",
    source: "Source",
    issues: "Issues",
    websiteSource: "Website source",
    language: "Language",
    menu: "Menu",
    closeMenu: "Close menu",
    copyright: "© 2026 Onelsey. All rights reserved.",
  },
  ru: {
    home: "Главная",
    wiki: "Вики",
    github: "GitHub",
    modrinth: "Modrinth",
    source: "Исходники",
    issues: "Ошибки",
    websiteSource: "Исходники сайта",
    language: "Язык",
    menu: "Меню",
    closeMenu: "Закрыть меню",
    copyright: "© 2026 Onelsey. Все права защищены.",
  },
} as const;

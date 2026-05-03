"use client";

import Cookies from "js-cookie";
import { createContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE } from "@/lib/constants";
import { translate } from "@/lib/i18n";
import { Languages } from "@/types";

type LanguageContextValue = {
  language: Languages;
  setLanguage: (language: Languages) => void;
  t: (key: string, fallback?: string) => string;
};

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Languages>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const savedLanguage =
      (window.localStorage.getItem("millflow_lang") as Languages | null) ??
      (Cookies.get(LANGUAGE_COOKIE) as Languages | undefined);

    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (value: Languages) => {
    setLanguageState(value);
    window.localStorage.setItem("millflow_lang", value);
    Cookies.set(LANGUAGE_COOKIE, value, { expires: 365 });
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: string, fallback?: string) => translate(language, key, fallback)
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

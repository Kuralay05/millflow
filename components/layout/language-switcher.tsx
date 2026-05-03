"use client";

import { Languages } from "@/types";
import { useLanguage } from "@/hooks/use-language";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="rounded-full border border-slate-200 bg-slate-50 p-1">
      {(["ru", "en", "kk"] as Languages[]).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLanguage(item)}
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            language === item ? "bg-brand-600 text-white" : "text-slate-600"
          }`}
        >
          {item === "kk" ? "KZ" : item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

import en from "@/messages/en.json";
import kk from "@/messages/kk.json";
import ru from "@/messages/ru.json";
import { DEFAULT_LANGUAGE } from "@/lib/constants";
import { Dictionary, Languages } from "@/types";

const dictionaries: Record<Languages, Dictionary> = { ru, en, kk };

export function getDictionary(language: Languages = DEFAULT_LANGUAGE) {
  return dictionaries[language] ?? dictionaries[DEFAULT_LANGUAGE];
}

export function translate(
  language: Languages,
  key: string,
  fallback?: string
): string {
  const dictionary = getDictionary(language);
  const value = key.split(".").reduce<unknown>((acc, part) => {
    if (!acc || typeof acc !== "object") {
      return undefined;
    }

    return (acc as Dictionary)[part];
  }, dictionary);

  if (typeof value === "string") {
    return value;
  }

  return fallback ?? key;
}

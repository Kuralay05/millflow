"use client";

import { useEffect, useState } from "react";

export function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(url, { cache: "no-store" });
      const text = await response.text();
      const payload = text ? JSON.parse(text) : null;

      if (!response.ok) {
        setError(payload?.error ?? "Request error");
        setLoading(false);
        return;
      }

      if (!payload) {
        setError("Empty server response");
        setLoading(false);
        return;
      }

      setData(payload.data);
      setLoading(false);
    } catch {
      setError("Failed to load data");
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [url]);

  return { data, loading, error, reload: load, setData };
}

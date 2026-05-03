"use client";

import { createContext, useCallback, useMemo, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Toast = {
  id: string;
  title: string;
  variant?: "success" | "error" | "info";
};

type ToasterContextValue = {
  notify: (title: string, variant?: Toast["variant"]) => void;
};

export const ToasterContext = createContext<ToasterContextValue | null>(null);

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((title: string, variant: Toast["variant"] = "info") => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, title, variant }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3500);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToasterContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "flex items-start justify-between rounded-2xl border px-4 py-3 shadow-card",
              toast.variant === "success" && "border-emerald-200 bg-emerald-50 text-emerald-800",
              toast.variant === "error" && "border-rose-200 bg-rose-50 text-rose-800",
              toast.variant === "info" && "border-slate-200 bg-white text-slate-700"
            )}
          >
            <p className="pr-3 text-sm font-medium">{toast.title}</p>
            <button
              type="button"
              onClick={() =>
                setToasts((current) => current.filter((item) => item.id !== toast.id))
              }
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToasterContext.Provider>
  );
}

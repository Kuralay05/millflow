"use client";

import { X } from "lucide-react";

export function FormModal({
  open,
  title,
  children,
  onClose
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-card">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <button type="button" onClick={onClose}>
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

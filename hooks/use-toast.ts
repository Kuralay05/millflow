"use client";

import { useContext } from "react";
import { ToasterContext } from "@/components/providers/toaster-provider";

export function useToast() {
  const context = useContext(ToasterContext);

  if (!context) {
    throw new Error("useToast must be used within ToasterProvider");
  }

  return context;
}

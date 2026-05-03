"use client";

import { createContext, useContext } from "react";
import { SessionUser } from "@/types";

const AuthContext = createContext<SessionUser | null>(null);

export function AuthProvider({
  children,
  session
}: {
  children: React.ReactNode;
  session: SessionUser;
}) {
  return <AuthContext.Provider value={session}>{children}</AuthContext.Provider>;
}

export function useSessionUser() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useSessionUser must be used within AuthProvider");
  }

  return context;
}

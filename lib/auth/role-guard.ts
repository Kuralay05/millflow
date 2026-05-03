import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { UserRole } from "@/types";

export async function requirePageRole(roles?: UserRole[]) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (roles && !roles.includes(session.role)) {
    redirect("/dashboard");
  }

  return session;
}

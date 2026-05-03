import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { UserRole } from "@/types";

export async function requireAuth(allowedRoles?: UserRole[]) {
  const session = await getSession();

  if (!session) {
    return {
      session: null,
      error: NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    };
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    return {
      session,
      error: NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      )
    };
  }

  return { session, error: null };
}

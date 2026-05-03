import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/constants";
import { verifyToken } from "@/lib/auth/jwt";

export async function getSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

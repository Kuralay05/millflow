import { cookies } from "next/headers";
import { ok } from "@/lib/api";
import { SESSION_COOKIE } from "@/lib/constants";

export async function POST() {
  cookies().delete(SESSION_COOKIE);
  return ok({ loggedOut: true });
}

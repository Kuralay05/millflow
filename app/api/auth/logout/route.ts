import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/constants";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    data: { loggedOut: true }
  });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}

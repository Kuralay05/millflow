import { SignJWT, jwtVerify } from "jose";
import { SessionUser } from "@/types";

const encoder = new TextEncoder();
const secret = encoder.encode(process.env.JWT_SECRET || "demo_secret");

export async function signToken(user: SessionUser) {
  return new SignJWT(user as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

import { cookies } from "next/headers";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db/mongoose";
import { loginSchema } from "@/lib/validation";
import { parseRequest, ok } from "@/lib/api";
import { signToken } from "@/lib/auth/jwt";
import { SESSION_COOKIE } from "@/lib/constants";
import { handleApiError } from "@/lib/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await parseRequest(request, loginSchema);
    await connectToDatabase();

    const user = (await User.findOne({ email })) as {
      _id: string;
      fullName: string;
      email: string;
      password: string;
      role: "admin" | "operator" | "warehouse_manager";
    } | null;

    if (!user || user.password !== password) {
      return Response.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await signToken({
      id: String(user._id),
      fullName: user.fullName,
      email: user.email,
      role: user.role
    });

    cookies().set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });

    return ok({
      fullName: user.fullName,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    return handleApiError(error);
  }
}

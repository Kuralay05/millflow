import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db/mongoose";
import { loginSchema } from "@/lib/validation";
import { parseRequest } from "@/lib/api";
import { signToken } from "@/lib/auth/jwt";
import { SESSION_COOKIE } from "@/lib/constants";
import { handleApiError } from "@/lib/server";
import { demoUsers } from "@/data/demo-users";

export async function POST(request: Request) {
  try {
    const { email, password } = await parseRequest(request, loginSchema);
    let user:
      | {
          _id: string;
          fullName: string;
          email: string;
          password: string;
          role: "admin" | "operator" | "warehouse_manager";
        }
      | null = null;

    try {
      await connectToDatabase();
      user = (await User.findOne({ email })) as {
        _id: string;
        fullName: string;
        email: string;
        password: string;
        role: "admin" | "operator" | "warehouse_manager";
      } | null;
    } catch (dbError) {
      console.error("[MillFlow Login DB Fallback]", dbError);
      const demoUser = demoUsers.find(
        (item) => item.email === email && item.password === password
      );

      if (demoUser) {
        user = {
          _id: demoUser.email,
          fullName: demoUser.fullName,
          email: demoUser.email,
          password: demoUser.password,
          role: demoUser.role
        };
      }
    }

    if (!user || user.password !== password) {
      return NextResponse.json(
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

    const response = NextResponse.json({
      success: true,
      data: {
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: true,
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

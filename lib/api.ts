import { NextResponse } from "next/server";
import { ZodSchema } from "zod";

export async function parseRequest<T>(request: Request, schema: ZodSchema<T>) {
  const body = await request.json();
  return schema.parse(body);
}

export function ok<T>(data: T, message?: string) {
  return NextResponse.json({ success: true, data, message });
}

export function fail(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

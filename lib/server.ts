import { ZodError } from "zod";
import { fail } from "@/lib/api";

export function handleApiError(error: unknown) {
  console.error("[MillFlow API Error]", error);

  if (error instanceof ZodError) {
    return fail(error.issues[0]?.message ?? "Validation error", 422);
  }

  if (error instanceof Error) {
    return fail(error.message, 500);
  }

  return fail("Unknown server error", 500);
}

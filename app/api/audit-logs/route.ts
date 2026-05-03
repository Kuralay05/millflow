import AuditLog from "@/models/AuditLog";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ok } from "@/lib/api";
import { requireAuth } from "@/lib/auth/guards";

export async function GET() {
  const { error } = await requireAuth(["admin"]);
  if (error) return error;
  await connectToDatabase();
  const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100).lean();
  return ok(logs);
}

import GrainBatch from "@/models/GrainBatch";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ok, parseRequest } from "@/lib/api";
import { requireAuth } from "@/lib/auth/guards";
import { grainBatchSchema } from "@/lib/validation";
import { createAuditLog } from "@/lib/audit";
import { handleApiError } from "@/lib/server";

export async function GET() {
  const { error } = await requireAuth(["admin", "operator"]);
  if (error) return error;
  await connectToDatabase();
  const batches = await GrainBatch.find()
    .populate("supplierId")
    .sort({ intakeDate: -1 })
    .lean();
  return ok(batches);
}

export async function POST(request: Request) {
  const { session, error } = await requireAuth(["admin", "operator"]);
  if (error) return error;

  try {
    const payload = await parseRequest(request, grainBatchSchema);
    await connectToDatabase();
    const batch = await GrainBatch.create({
      ...payload,
      intakeDate: new Date(payload.intakeDate)
    });
    await createAuditLog({
      action: "CREATE",
      entityType: "GrainBatch",
      entityId: String(batch._id),
      userEmail: session!.email,
      details: `Создана партия зерна ${batch.batchNumber}`
    });
    return ok(batch);
  } catch (error) {
    return handleApiError(error);
  }
}

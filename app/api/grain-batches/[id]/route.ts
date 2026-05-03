import GrainBatch from "@/models/GrainBatch";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ok, parseRequest, fail } from "@/lib/api";
import { requireAuth } from "@/lib/auth/guards";
import { grainBatchSchema } from "@/lib/validation";
import { createAuditLog } from "@/lib/audit";
import { handleApiError } from "@/lib/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAuth(["admin", "operator"]);
  if (error) return error;
  await connectToDatabase();
  const batch = await GrainBatch.findById(params.id).populate("supplierId").lean();
  if (!batch) return fail("Batch not found", 404);
  return ok(batch);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { session, error } = await requireAuth(["admin", "operator"]);
  if (error) return error;

  try {
    const payload = await parseRequest(request, grainBatchSchema);
    await connectToDatabase();
    const batch = await GrainBatch.findByIdAndUpdate(
      params.id,
      { ...payload, intakeDate: new Date(payload.intakeDate) },
      { new: true }
    );
    if (!batch) return fail("Batch not found", 404);
    await createAuditLog({
      action: "UPDATE",
      entityType: "GrainBatch",
      entityId: params.id,
      userEmail: session!.email,
      details: `Обновлена партия зерна ${batch.batchNumber}`
    });
    return ok(batch);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { session, error } = await requireAuth(["admin", "operator"]);
  if (error) return error;
  await connectToDatabase();
  const batch = await GrainBatch.findByIdAndDelete(params.id);
  if (!batch) return fail("Batch not found", 404);
  await createAuditLog({
    action: "DELETE",
    entityType: "GrainBatch",
    entityId: params.id,
    userEmail: session!.email,
    details: `Удалена партия зерна ${batch.batchNumber}`
  });
  return ok({ deleted: true });
}

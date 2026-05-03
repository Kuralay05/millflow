import ProductionBatch from "@/models/ProductionBatch";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ok, parseRequest, fail } from "@/lib/api";
import { requireAuth } from "@/lib/auth/guards";
import { productionBatchSchema } from "@/lib/validation";
import { createAuditLog } from "@/lib/audit";
import { handleApiError } from "@/lib/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAuth(["admin", "operator"]);
  if (error) return error;
  await connectToDatabase();
  const item = await ProductionBatch.findById(params.id).populate("grainBatchId").lean();
  if (!item) return fail("Production batch not found", 404);
  return ok(item);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { session, error } = await requireAuth(["admin", "operator"]);
  if (error) return error;

  try {
    const payload = await parseRequest(request, productionBatchSchema);
    await connectToDatabase();
    const item = await ProductionBatch.findByIdAndUpdate(
      params.id,
      { ...payload, productionDate: new Date(payload.productionDate) },
      { new: true }
    );
    if (!item) return fail("Production batch not found", 404);
    await createAuditLog({
      action: "UPDATE",
      entityType: "ProductionBatch",
      entityId: params.id,
      userEmail: session!.email,
      details: `Обновлена производственная партия ${item.batchNumber}`
    });
    return ok(item);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { session, error } = await requireAuth(["admin", "operator"]);
  if (error) return error;
  await connectToDatabase();
  const item = await ProductionBatch.findByIdAndDelete(params.id);
  if (!item) return fail("Production batch not found", 404);
  await createAuditLog({
    action: "DELETE",
    entityType: "ProductionBatch",
    entityId: params.id,
    userEmail: session!.email,
    details: `Удалена производственная партия ${item.batchNumber}`
  });
  return ok({ deleted: true });
}

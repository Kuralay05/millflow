import ProductionBatch from "@/models/ProductionBatch";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ok, parseRequest } from "@/lib/api";
import { requireAuth } from "@/lib/auth/guards";
import { productionBatchSchema } from "@/lib/validation";
import { createAuditLog } from "@/lib/audit";
import { handleApiError } from "@/lib/server";

export async function GET() {
  const { error } = await requireAuth(["admin", "operator"]);
  if (error) return error;
  await connectToDatabase();
  const items = await ProductionBatch.find()
    .populate("grainBatchId")
    .sort({ productionDate: -1 })
    .lean();
  return ok(items);
}

export async function POST(request: Request) {
  const { session, error } = await requireAuth(["admin", "operator"]);
  if (error) return error;

  try {
    const payload = await parseRequest(request, productionBatchSchema);
    await connectToDatabase();
    const item = await ProductionBatch.create({
      ...payload,
      productionDate: new Date(payload.productionDate)
    });
    await createAuditLog({
      action: "CREATE",
      entityType: "ProductionBatch",
      entityId: String(item._id),
      userEmail: session!.email,
      details: `Создана производственная партия ${item.batchNumber}`
    });
    return ok(item);
  } catch (error) {
    return handleApiError(error);
  }
}

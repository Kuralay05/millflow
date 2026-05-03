import InventoryItem from "@/models/InventoryItem";
import { connectToDatabase } from "@/lib/db/mongoose";
import { normalizeInventoryStatus } from "@/lib/db/helpers";
import { ok, parseRequest } from "@/lib/api";
import { requireAuth } from "@/lib/auth/guards";
import { inventorySchema } from "@/lib/validation";
import { createAuditLog } from "@/lib/audit";
import { handleApiError } from "@/lib/server";

export async function GET() {
  const { error } = await requireAuth(["admin", "warehouse_manager"]);
  if (error) return error;
  await connectToDatabase();
  const items = await InventoryItem.find().sort({ lastUpdated: -1 }).lean();
  return ok(items);
}

export async function POST(request: Request) {
  const { session, error } = await requireAuth(["admin", "warehouse_manager"]);
  if (error) return error;

  try {
    const payload = await parseRequest(request, inventorySchema);
    await connectToDatabase();
    const item = await InventoryItem.create({
      ...payload,
      status: normalizeInventoryStatus(payload.quantityKg),
      lastUpdated: new Date()
    });
    await createAuditLog({
      action: "CREATE",
      entityType: "InventoryItem",
      entityId: String(item._id),
      userEmail: session!.email,
      details: `Создан складской остаток ${item.productName}`
    });
    return ok(item);
  } catch (error) {
    return handleApiError(error);
  }
}

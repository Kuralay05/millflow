import InventoryItem from "@/models/InventoryItem";
import { connectToDatabase } from "@/lib/db/mongoose";
import { normalizeInventoryStatus } from "@/lib/db/helpers";
import { ok, parseRequest, fail } from "@/lib/api";
import { requireAuth } from "@/lib/auth/guards";
import { inventorySchema } from "@/lib/validation";
import { createAuditLog } from "@/lib/audit";
import { handleApiError } from "@/lib/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAuth(["admin", "warehouse_manager"]);
  if (error) return error;
  await connectToDatabase();
  const item = await InventoryItem.findById(params.id).lean();
  if (!item) return fail("Inventory item not found", 404);
  return ok(item);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { session, error } = await requireAuth(["admin", "warehouse_manager"]);
  if (error) return error;

  try {
    const payload = await parseRequest(request, inventorySchema);
    await connectToDatabase();
    const item = await InventoryItem.findByIdAndUpdate(
      params.id,
      {
        ...payload,
        status: normalizeInventoryStatus(payload.quantityKg),
        lastUpdated: new Date()
      },
      { new: true }
    );
    if (!item) return fail("Inventory item not found", 404);
    await createAuditLog({
      action: "UPDATE",
      entityType: "InventoryItem",
      entityId: params.id,
      userEmail: session!.email,
      details: `Обновлен складской остаток ${item.productName}`
    });
    return ok(item);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { session, error } = await requireAuth(["admin", "warehouse_manager"]);
  if (error) return error;
  await connectToDatabase();
  const item = await InventoryItem.findByIdAndDelete(params.id);
  if (!item) return fail("Inventory item not found", 404);
  await createAuditLog({
    action: "DELETE",
    entityType: "InventoryItem",
    entityId: params.id,
    userEmail: session!.email,
    details: `Удален складской остаток ${item.productName}`
  });
  return ok({ deleted: true });
}

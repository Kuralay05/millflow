import Shipment from "@/models/Shipment";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ok, parseRequest, fail } from "@/lib/api";
import { requireAuth } from "@/lib/auth/guards";
import { shipmentSchema } from "@/lib/validation";
import { createAuditLog } from "@/lib/audit";
import { handleApiError } from "@/lib/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAuth(["admin", "warehouse_manager"]);
  if (error) return error;
  await connectToDatabase();
  const item = await Shipment.findById(params.id).lean();
  if (!item) return fail("Shipment not found", 404);
  return ok(item);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { session, error } = await requireAuth(["admin", "warehouse_manager"]);
  if (error) return error;

  try {
    const payload = await parseRequest(request, shipmentSchema);
    await connectToDatabase();
    const item = await Shipment.findByIdAndUpdate(
      params.id,
      { ...payload, shipmentDate: new Date(payload.shipmentDate) },
      { new: true }
    );
    if (!item) return fail("Shipment not found", 404);
    await createAuditLog({
      action: "UPDATE",
      entityType: "Shipment",
      entityId: params.id,
      userEmail: session!.email,
      details: `Обновлена отгрузка ${item.shipmentNumber}`
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
  const item = await Shipment.findByIdAndDelete(params.id);
  if (!item) return fail("Shipment not found", 404);
  await createAuditLog({
    action: "DELETE",
    entityType: "Shipment",
    entityId: params.id,
    userEmail: session!.email,
    details: `Удалена отгрузка ${item.shipmentNumber}`
  });
  return ok({ deleted: true });
}

import Shipment from "@/models/Shipment";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ok, parseRequest } from "@/lib/api";
import { requireAuth } from "@/lib/auth/guards";
import { shipmentSchema } from "@/lib/validation";
import { createAuditLog } from "@/lib/audit";
import { handleApiError } from "@/lib/server";

export async function GET() {
  const { error } = await requireAuth(["admin", "warehouse_manager"]);
  if (error) return error;
  await connectToDatabase();
  const items = await Shipment.find().sort({ shipmentDate: -1 }).lean();
  return ok(items);
}

export async function POST(request: Request) {
  const { session, error } = await requireAuth(["admin", "warehouse_manager"]);
  if (error) return error;

  try {
    const payload = await parseRequest(request, shipmentSchema);
    await connectToDatabase();
    const item = await Shipment.create({
      ...payload,
      shipmentDate: new Date(payload.shipmentDate)
    });
    await createAuditLog({
      action: "CREATE",
      entityType: "Shipment",
      entityId: String(item._id),
      userEmail: session!.email,
      details: `Создана отгрузка ${item.shipmentNumber}`
    });
    return ok(item);
  } catch (error) {
    return handleApiError(error);
  }
}

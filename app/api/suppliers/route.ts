import Supplier from "@/models/Supplier";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ok, parseRequest } from "@/lib/api";
import { requireAuth } from "@/lib/auth/guards";
import { supplierSchema } from "@/lib/validation";
import { createAuditLog } from "@/lib/audit";
import { handleApiError } from "@/lib/server";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;
  await connectToDatabase();
  const suppliers = await Supplier.find().sort({ createdAt: -1 }).lean();
  return ok(suppliers);
}

export async function POST(request: Request) {
  const { session, error } = await requireAuth(["admin", "operator"]);
  if (error) return error;

  try {
    const payload = await parseRequest(request, supplierSchema);
    await connectToDatabase();
    const supplier = await Supplier.create(payload);
    await createAuditLog({
      action: "CREATE",
      entityType: "Supplier",
      entityId: String(supplier._id),
      userEmail: session!.email,
      details: `Создан поставщик ${supplier.name}`
    });
    return ok(supplier, "Supplier created");
  } catch (error) {
    return handleApiError(error);
  }
}

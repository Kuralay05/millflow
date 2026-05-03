import Supplier from "@/models/Supplier";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ok, parseRequest, fail } from "@/lib/api";
import { requireAuth } from "@/lib/auth/guards";
import { supplierSchema } from "@/lib/validation";
import { createAuditLog } from "@/lib/audit";
import { handleApiError } from "@/lib/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAuth();
  if (error) return error;
  await connectToDatabase();
  const supplier = await Supplier.findById(params.id).lean();
  if (!supplier) return fail("Supplier not found", 404);
  return ok(supplier);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { session, error } = await requireAuth(["admin", "operator"]);
  if (error) return error;

  try {
    const payload = await parseRequest(request, supplierSchema);
    await connectToDatabase();
    const supplier = await Supplier.findByIdAndUpdate(params.id, payload, { new: true });
    if (!supplier) return fail("Supplier not found", 404);
    await createAuditLog({
      action: "UPDATE",
      entityType: "Supplier",
      entityId: params.id,
      userEmail: session!.email,
      details: `Обновлен поставщик ${supplier.name}`
    });
    return ok(supplier);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { session, error } = await requireAuth(["admin"]);
  if (error) return error;
  await connectToDatabase();
  const supplier = await Supplier.findByIdAndDelete(params.id);
  if (!supplier) return fail("Supplier not found", 404);
  await createAuditLog({
    action: "DELETE",
    entityType: "Supplier",
    entityId: params.id,
    userEmail: session!.email,
    details: `Удален поставщик ${supplier.name}`
  });
  return ok({ deleted: true });
}

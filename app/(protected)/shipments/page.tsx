import { ShipmentsView } from "@/components/modules/shipments-view";
import { requirePageRole } from "@/lib/auth/role-guard";

export default async function ShipmentsPage() {
  await requirePageRole(["admin", "warehouse_manager"]);
  return <ShipmentsView />;
}

import { WarehouseView } from "@/components/modules/warehouse-view";
import { requirePageRole } from "@/lib/auth/role-guard";

export default async function WarehousePage() {
  await requirePageRole(["admin", "warehouse_manager"]);
  return <WarehouseView />;
}

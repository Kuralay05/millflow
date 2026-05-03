import { ReportsView } from "@/components/reports/reports-view";
import { requirePageRole } from "@/lib/auth/role-guard";

export default async function ReportsPage() {
  await requirePageRole(["admin", "operator", "warehouse_manager"]);
  return <ReportsView />;
}

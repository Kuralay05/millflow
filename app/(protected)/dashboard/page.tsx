import { DashboardView } from "@/components/dashboard/dashboard-view";
import { requirePageRole } from "@/lib/auth/role-guard";

export default async function DashboardPage() {
  await requirePageRole(["admin", "operator", "warehouse_manager"]);
  return <DashboardView />;
}

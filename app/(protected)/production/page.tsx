import { ProductionView } from "@/components/modules/production-view";
import { requirePageRole } from "@/lib/auth/role-guard";

export default async function ProductionPage() {
  await requirePageRole(["admin", "operator"]);
  return <ProductionView />;
}

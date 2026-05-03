import { GrainIntakeView } from "@/components/modules/grain-intake-view";
import { requirePageRole } from "@/lib/auth/role-guard";

export default async function GrainIntakePage() {
  await requirePageRole(["admin", "operator"]);
  return <GrainIntakeView />;
}

import { AuditLogView } from "@/components/audit/audit-log-view";
import { requirePageRole } from "@/lib/auth/role-guard";

export default async function AuditLogPage() {
  await requirePageRole(["admin"]);
  return <AuditLogView />;
}

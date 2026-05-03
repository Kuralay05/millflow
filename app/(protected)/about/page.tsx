import { AboutView } from "@/components/about/about-view";
import { requirePageRole } from "@/lib/auth/role-guard";

export default async function AboutPage() {
  await requirePageRole(["admin", "operator", "warehouse_manager"]);
  return <AboutView />;
}

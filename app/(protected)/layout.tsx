import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { AuthProvider } from "@/components/providers/auth-provider";
import { AppShell } from "@/components/layout/app-shell";

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <AuthProvider session={session}>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}

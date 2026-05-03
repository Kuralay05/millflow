"use client";

import { usePathname, useRouter } from "next/navigation";
import { BarChart3, ClipboardList, Factory, Info, LogOut, Package, ScrollText, ShieldCheck, Truck, Wheat } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/hooks/use-language";
import { useSessionUser } from "@/components/providers/auth-provider";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";

const roleAccess: Record<UserRole, string[]> = {
  admin: ["/dashboard", "/grain-intake", "/production", "/warehouse", "/shipments", "/reports", "/about", "/audit-log"],
  operator: ["/dashboard", "/grain-intake", "/production", "/reports", "/about"],
  warehouse_manager: ["/dashboard", "/warehouse", "/shipments", "/reports", "/about"]
};

const navItems = [
  { href: "/dashboard", labelKey: "nav.dashboard", icon: BarChart3 },
  { href: "/grain-intake", labelKey: "nav.grainIntake", icon: Wheat },
  { href: "/production", labelKey: "nav.production", icon: Factory },
  { href: "/warehouse", labelKey: "nav.warehouse", icon: Package },
  { href: "/shipments", labelKey: "nav.shipments", icon: Truck },
  { href: "/reports", labelKey: "nav.reports", icon: ClipboardList },
  { href: "/about", labelKey: "nav.about", icon: Info },
  { href: "/audit-log", labelKey: "nav.audit", icon: ShieldCheck }
];

const titleMap: Record<string, string> = {
  "/dashboard": "nav.dashboard",
  "/grain-intake": "nav.grainIntake",
  "/production": "nav.production",
  "/warehouse": "nav.warehouse",
  "/shipments": "nav.shipments",
  "/reports": "nav.reports",
  "/about": "nav.about",
  "/audit-log": "nav.audit"
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const user = useSessionUser();

  const allowedItems = navItems.filter((item) =>
    roleAccess[user.role].includes(item.href)
  );

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-slate-200 bg-white lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col px-5 py-6">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white">
              <Wheat className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">MillFlow</p>
              <p className="text-xs text-slate-500">Flour Mill Operations Platform</p>
            </div>
          </div>

          <nav className="space-y-1">
            {allowedItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4">
              <p className="text-sm font-semibold text-slate-900">{user.fullName}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
              <p className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-brand-700">
                {user.role}
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              <LogOut className="h-4 w-4" />
              {t("nav.logout", "Выйти")}
            </button>
          </div>
        </div>
      </aside>

      <main className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between px-5 py-4 sm:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">
                Mill Operations
              </p>
              <h1 className="text-2xl font-bold text-slate-900">
                {t(titleMap[pathname] ?? "nav.dashboard")}
              </h1>
            </div>
            <LanguageSwitcher />
          </div>
        </header>

        <div className="flex-1 px-5 py-6 sm:px-8">{children}</div>

        <footer className="border-t border-slate-200 px-5 py-4 text-sm text-slate-500 sm:px-8">
          {t(
            "app.footer",
            "MillFlow - flour mill operations management system"
          )}
        </footer>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, Wheat } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

const accounts = [
  ["admin@millflow.local", "123456", "admin"],
  ["operator@millflow.local", "123456", "operator"],
  ["warehouse@millflow.local", "123456", "warehouse_manager"]
];

export function LoginForm() {
  const { t, language, setLanguage } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState(accounts[0][0]);
  const [password, setPassword] = useState(accounts[0][1]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(t("login.invalid", "Неверный email или пароль"));
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-page-grid bg-[size:40px_40px] px-6 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-card lg:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden bg-gradient-to-br from-brand-900 via-brand-700 to-wheat-600 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <Wheat className="h-7 w-7" />
              </div>
              <h1 className="max-w-md text-4xl font-bold leading-tight">
                MillFlow
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/80">
                Web system for managing grain intake, flour production, warehouse
                inventory and shipments in a flour mill enterprise.
              </p>
            </div>
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 text-sm text-white/85">
              <p className="font-semibold">Enterprise platform</p>
              <p className="mt-2">
                Centralized workspace for intake operations, production tracking,
                warehouse control and shipment coordination.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-700">
                  MillFlow
                </p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {t("login.title", "Вход в систему")}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {t(
                    "login.subtitle",
                    "Secure access to the MillFlow operational platform"
                  )}
                </p>
              </div>

              <div className="rounded-full border border-slate-200 bg-slate-50 p-1 text-sm">
                {(["ru", "en", "kk"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setLanguage(item)}
                    className={`rounded-full px-3 py-1 ${
                      item === language ? "bg-brand-600 text-white" : "text-slate-600"
                    }`}
                  >
                    {item.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  {t("login.email", "Электронная почта")}
                </span>
                <div className="flex items-center rounded-2xl border border-slate-200 px-4">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full bg-transparent px-3 py-3 outline-none"
                    placeholder="admin@millflow.local"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  {t("login.password", "Пароль")}
                </span>
                <div className="flex items-center rounded-2xl border border-slate-200 px-4">
                  <LockKeyhole className="h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full bg-transparent px-3 py-3 outline-none"
                    placeholder="123456"
                  />
                </div>
              </label>

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-brand-600 px-4 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-70"
              >
                {loading
                  ? t("common.loading", "Загрузка...")
                  : t("login.submit", "Войти")}
              </button>
            </form>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="mb-3 text-sm font-semibold text-slate-800">
                {t("login.demoCredentials", "Демо-учетные записи")}
              </p>
              <div className="space-y-3 text-sm text-slate-600">
                {accounts.map(([accountEmail, accountPassword, role]) => (
                  <button
                    key={accountEmail}
                    type="button"
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left"
                    onClick={() => {
                      setEmail(accountEmail);
                      setPassword(accountPassword);
                    }}
                  >
                    <span>{accountEmail}</span>
                    <span className="font-medium text-slate-500">
                      {role} / {accountPassword}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

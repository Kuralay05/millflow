"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { SearchBar } from "@/components/ui/search-bar";
import { Card } from "@/components/ui/card";
import { DataTable, StatusBadge } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { FormModal } from "@/components/ui/form-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/hooks/use-toast";

type FieldOption = { label: string; value: string };

type FormField<T> = {
  name: keyof T & string;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "select";
  options?: FieldOption[];
};

type CrudManagerProps<T extends Record<string, unknown> & { _id?: string }> = {
  title: string;
  subtitle: string;
  endpoint: string;
  items: T[] | null;
  loading: boolean;
  error: string;
  onReload: () => Promise<void> | void;
  columns: {
    key: string;
    header: string;
    render: (item: T) => React.ReactNode;
  }[];
  fields: FormField<T>[];
  initialValues: T;
  searchPlaceholder: string;
  searchMatcher: (item: T, query: string) => boolean;
  filterLabel?: string;
  filterKey?: keyof T & string;
  filterOptions?: string[];
  canDelete?: boolean;
  normalize?: (values: Record<string, unknown>) => Record<string, unknown>;
};

export function CrudManager<T extends Record<string, unknown> & { _id?: string }>({
  title,
  subtitle,
  endpoint,
  items,
  loading,
  error,
  onReload,
  columns,
  fields,
  initialValues,
  searchPlaceholder,
  searchMatcher,
  filterKey,
  filterLabel,
  filterOptions,
  canDelete = true,
  normalize
}: CrudManagerProps<T>) {
  const { notify } = useToast();
  const [query, setQuery] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>(initialValues as Record<string, unknown>);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);

  const filteredItems = useMemo(() => {
    const source = items ?? [];
    return source.filter((item) => {
      const matchesSearch = searchMatcher(item, query.toLowerCase());
      const matchesFilter =
        !filterKey ||
        filterValue === "all" ||
        String(item[filterKey] ?? "") === filterValue;

      return matchesSearch && matchesFilter;
    });
  }, [items, query, filterKey, filterValue, searchMatcher]);

  function openCreate() {
    setEditingItem(null);
    setViewMode(false);
    setValues(initialValues as Record<string, unknown>);
    setOpen(true);
  }

  function openEdit(item: T, readOnly = false) {
    setEditingItem(item);
    setViewMode(readOnly);
    const nextValues: Record<string, unknown> = {};

    fields.forEach((field) => {
      const raw = item[field.name];
      nextValues[field.name] =
        field.type === "date" && typeof raw === "string" ? raw.slice(0, 10) : raw;
    });

    setValues(nextValues);
    setOpen(true);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = normalize ? normalize(values) : values;
    const response = await fetch(editingItem?._id ? `${endpoint}/${editingItem._id}` : endpoint, {
      method: editingItem?._id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!response.ok) {
      notify(result.error ?? "Operation failed", "error");
      return;
    }

    notify(editingItem?._id ? "Запись обновлена" : "Запись создана", "success");
    setOpen(false);
    await onReload();
  }

  async function remove() {
    if (!deleteTarget?._id) return;
    const response = await fetch(`${endpoint}/${deleteTarget._id}`, { method: "DELETE" });
    const result = await response.json();

    if (!response.ok) {
      notify(result.error ?? "Delete failed", "error");
      return;
    }

    notify("Запись удалена", "success");
    setDeleteTarget(null);
    await onReload();
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-brand-50 to-wheat-50">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Add record
          </button>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder={searchPlaceholder}
        />
        {filterKey && filterOptions ? (
          <label className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em]">
              {filterLabel}
            </span>
            <select
              value={filterValue}
              onChange={(event) => setFilterValue(event.target.value)}
              className="w-full bg-transparent outline-none"
            >
              <option value="all">All</option>
              {filterOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      {loading ? <LoadingState label="Loading records..." /> : null}
      {!loading && error ? (
        <Card className="border-rose-200 bg-rose-50 text-rose-700">{error}</Card>
      ) : null}
      {!loading && !error && filteredItems.length === 0 ? (
        <EmptyState title="Нет данных" description="По выбранным параметрам записи не найдены." />
      ) : null}
      {!loading && !error && filteredItems.length > 0 ? (
        <DataTable
          columns={columns}
          rows={filteredItems as T[]}
          getRowKey={(item, index) => item._id ?? String(index)}
          actions={(item) => (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openEdit(item, true)}
                className="rounded-xl border border-slate-200 p-2 text-slate-600"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => openEdit(item)}
                className="rounded-xl border border-slate-200 p-2 text-slate-600"
              >
                <Pencil className="h-4 w-4" />
              </button>
              {canDelete ? (
                <button
                  type="button"
                  onClick={() => setDeleteTarget(item)}
                  className="rounded-xl border border-rose-200 p-2 text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          )}
        />
      ) : null}

      <FormModal
        open={open}
        onClose={() => setOpen(false)}
        title={viewMode ? "Просмотр записи" : editingItem?._id ? "Редактирование" : "Создание записи"}
      >
        <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
          {fields.map((field) => (
            <label
              key={field.name}
              className={`block ${field.type === "textarea" ? "md:col-span-2" : ""}`}
            >
              <span className="mb-2 block text-sm font-medium text-slate-700">
                {field.label}
              </span>
              {field.type === "textarea" ? (
                <textarea
                  value={String(values[field.name] ?? "")}
                  disabled={viewMode}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, [field.name]: event.target.value }))
                  }
                  className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                />
              ) : field.type === "select" ? (
                <select
                  value={String(values[field.name] ?? "")}
                  disabled={viewMode}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, [field.name]: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                >
                  <option value="">Select...</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type ?? "text"}
                  value={String(values[field.name] ?? "")}
                  disabled={viewMode}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      [field.name]:
                        field.type === "number"
                          ? Number(event.target.value)
                          : event.target.value
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                />
              )}
            </label>
          ))}

          {!viewMode ? (
            <div className="mt-2 flex justify-end gap-3 md:col-span-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white"
              >
                Save
              </button>
            </div>
          ) : null}
        </form>
      </FormModal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Удалить запись"
        description="Действие нельзя отменить. Запись будет удалена из системы."
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          void remove();
        }}
      />
    </div>
  );
}

export { StatusBadge };

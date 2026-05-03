import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  Принято: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "На проверке": "bg-amber-50 text-amber-700 border-amber-200",
  Отклонено: "bg-rose-50 text-rose-700 border-rose-200",
  "В процессе": "bg-sky-50 text-sky-700 border-sky-200",
  Завершено: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "В наличии": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Низкий остаток": "bg-amber-50 text-amber-700 border-amber-200",
  "Нет в наличии": "bg-rose-50 text-rose-700 border-rose-200",
  Подготовка: "bg-slate-100 text-slate-700 border-slate-200",
  Отгружено: "bg-sky-50 text-sky-700 border-sky-200",
  Доставлено: "bg-emerald-50 text-emerald-700 border-emerald-200"
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
        styles[value] ?? "border-slate-200 bg-slate-100 text-slate-700"
      )}
    >
      {value}
    </span>
  );
}

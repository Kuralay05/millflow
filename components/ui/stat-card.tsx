import { Card } from "@/components/ui/card";

export function StatCard({
  title,
  value,
  description
}: {
  title: string;
  value: string;
  description?: string;
}) {
  return (
    <Card className="bg-gradient-to-br from-white to-slate-50">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
      {description ? <p className="mt-2 text-sm text-slate-500">{description}</p> : null}
    </Card>
  );
}

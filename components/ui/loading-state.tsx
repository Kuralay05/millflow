import { Card } from "@/components/ui/card";

export function LoadingState({ label }: { label: string }) {
  return (
    <Card className="animate-pulse">
      <div className="h-4 w-48 rounded bg-slate-200" />
      <div className="mt-4 h-28 rounded-2xl bg-slate-100" />
      <p className="mt-4 text-sm text-slate-500">{label}</p>
    </Card>
  );
}

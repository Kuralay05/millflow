import { cn } from "@/lib/utils";

export function Card({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-3xl border border-slate-200 bg-white p-5 shadow-card", className)}>
      {children}
    </div>
  );
}

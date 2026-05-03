"use client";

import { useApi } from "@/hooks/use-api";
import { Card } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/loading-state";
import { formatNumber } from "@/lib/utils";

type GroupItem = { _id: string; count: number; quantityKg?: number; totalWeight?: number; flourProducedKg?: number; wasteKg?: number };

type ReportData = {
  grainSummary: GroupItem[];
  productionSummary: GroupItem[];
  inventorySummary: GroupItem[];
  shipmentSummary: GroupItem[];
};

function SummaryBlock({
  title,
  items,
  valueKey
}: {
  title: string;
  items: GroupItem[];
  valueKey: keyof GroupItem;
}) {
  return (
    <Card>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item._id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
            <div>
              <p className="font-semibold text-slate-900">{item._id}</p>
              <p className="text-sm text-slate-500">{item.count} records</p>
            </div>
            <p className="text-lg font-bold text-brand-700">
              {formatNumber(Number(item[valueKey] ?? 0))}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ReportsView() {
  const { data, loading, error } = useApi<ReportData>("/api/reports/overview");

  if (loading) return <LoadingState label="Loading report..." />;
  if (!data || error) {
    return <Card className="border-rose-200 bg-rose-50 text-rose-700">{error}</Card>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-brand-50 to-wheat-50">
        <h2 className="text-2xl font-bold text-slate-900">Operational Reports</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Export-friendly summary for internship screenshots, print view and academic
          presentation. This section aggregates intake, production, inventory and shipment
          indicators.
        </p>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <SummaryBlock title="Grain Intake Summary" items={data.grainSummary} valueKey="totalWeight" />
        <SummaryBlock title="Production Summary" items={data.productionSummary} valueKey="flourProducedKg" />
        <SummaryBlock title="Inventory Summary" items={data.inventorySummary} valueKey="quantityKg" />
        <SummaryBlock title="Shipments Summary" items={data.shipmentSummary} valueKey="quantityKg" />
      </div>

      <Card>
        <h3 className="text-lg font-bold text-slate-900">Printable Summary</h3>
        <div className="mt-4 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6">
          <p className="text-sm leading-7 text-slate-600">
            MillFlow summarizes key production and logistics metrics of the flour mill: accepted
            grain batches, production yield, warehouse balances and customer shipments. The page
            is intentionally designed in a clear printable style for report inserts and defense
            slides.
          </p>
        </div>
      </Card>
    </div>
  );
}

"use client";

import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useApi } from "@/hooks/use-api";
import { useLanguage } from "@/hooks/use-language";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable, StatusBadge } from "@/components/ui/data-table";
import { LoadingState } from "@/components/ui/loading-state";
import { formatDate, formatNumber } from "@/lib/utils";
import { GrainBatch, InventoryItem, Shipment, Supplier } from "@/types/entities";

type DashboardSummary = {
  kpis: {
    grainVolume: number;
    flourVolume: number;
    warehouseStock: number;
    shipments: number;
    lowStock: number;
    lastActivity: string;
  };
  charts: {
    grainByWeek: { label: string; value: number }[];
    productionOutput: { label: string; value: number }[];
    shipmentStatus: { label: string; value: number }[];
  };
  recentGrain: GrainBatch[];
  recentShipments: Shipment[];
  lowStockItems: InventoryItem[];
};

export function DashboardView() {
  const { t } = useLanguage();
  const { data, loading, error } = useApi<DashboardSummary>("/api/dashboard/summary");

  if (loading) {
    return <LoadingState label={t("common.loading", "Загрузка...")} />;
  }

  if (!data || error) {
    return <Card className="border-rose-200 bg-rose-50 text-rose-700">{error}</Card>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard title={t("dashboard.grainVolume")} value={`${formatNumber(data.kpis.grainVolume)} кг`} />
        <StatCard title={t("dashboard.flourVolume")} value={`${formatNumber(data.kpis.flourVolume)} кг`} />
        <StatCard title={t("dashboard.warehouseStock")} value={`${formatNumber(data.kpis.warehouseStock)} кг`} />
        <StatCard title={t("dashboard.shipments")} value={String(data.kpis.shipments)} />
        <StatCard title={t("dashboard.lowStock")} value={String(data.kpis.lowStock)} />
        <StatCard title={t("dashboard.lastActivity")} value={data.kpis.lastActivity} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <h3 className="mb-4 text-lg font-bold text-slate-900">{t("dashboard.grainChart")}</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.charts.grainByWeek}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b8654" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-bold text-slate-900">{t("dashboard.productionChart")}</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.charts.productionOutput}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#eaa11d" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-bold text-slate-900">{t("dashboard.shipmentChart")}</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.charts.shipmentStatus} dataKey="value" nameKey="label" outerRadius={95} fill="#3b8654" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <h3 className="mb-4 text-lg font-bold text-slate-900">{t("dashboard.recentGrain")}</h3>
          <DataTable
            rows={data.recentGrain}
            getRowKey={(item) => item._id}
            columns={[
              { key: "batch", header: "Batch", render: (item) => item.batchNumber },
              {
                key: "supplier",
                header: "Supplier",
                render: (item) => ((item.supplierId as Supplier | undefined)?.name ?? "-")
              },
              { key: "weight", header: "Weight", render: (item) => `${formatNumber(item.weightKg)} кг` },
              { key: "status", header: "Status", render: (item) => <StatusBadge value={item.qualityStatus} /> }
            ]}
          />
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold text-slate-900">{t("dashboard.lowStockItems")}</h3>
          <div className="space-y-3">
            {data.lowStockItems.map((item) => (
              <Card key={item._id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{item.productName}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.batchNumber} • {item.location}
                    </p>
                  </div>
                  <StatusBadge value={item.status} />
                </div>
                <p className="mt-3 text-2xl font-bold text-slate-900">{formatNumber(item.quantityKg)} кг</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-bold text-slate-900">{t("dashboard.recentShipments")}</h3>
        <DataTable
          rows={data.recentShipments}
          getRowKey={(item) => item._id}
          columns={[
            { key: "number", header: "Shipment", render: (item) => item.shipmentNumber },
            { key: "customer", header: "Customer", render: (item) => item.customerName },
            { key: "date", header: "Date", render: (item) => formatDate(item.shipmentDate) },
            { key: "status", header: "Status", render: (item) => <StatusBadge value={item.status} /> }
          ]}
        />
      </div>
    </div>
  );
}

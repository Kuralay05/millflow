"use client";

import { CrudManager, StatusBadge } from "@/components/forms/crud-manager";
import { useApi } from "@/hooks/use-api";
import { formatDate, formatNumber } from "@/lib/utils";
import { GrainBatch, Supplier } from "@/types/entities";

export function GrainIntakeView() {
  const { data: items, loading, error, reload } = useApi<GrainBatch[]>("/api/grain-batches");
  const { data: suppliers } = useApi<Supplier[]>("/api/suppliers");

  return (
    <CrudManager<GrainBatch>
      title="Grain Intake"
      subtitle="Registration of incoming grain batches from suppliers with weight, moisture, quality control and acceptance status."
      endpoint="/api/grain-batches"
      items={items}
      loading={loading}
      error={error}
      onReload={reload}
      initialValues={{
        batchNumber: "",
        supplierId: "",
        grainType: "",
        weightKg: 0,
        moisturePercent: 0,
        intakeDate: new Date().toISOString().slice(0, 10),
        qualityStatus: "Принято",
        notes: ""
      } as GrainBatch}
      searchPlaceholder="Search by batch number or supplier"
      searchMatcher={(item, query) =>
        item.batchNumber.toLowerCase().includes(query) ||
        String((item.supplierId as Supplier)?.name ?? "")
          .toLowerCase()
          .includes(query)
      }
      filterKey="qualityStatus"
      filterLabel="Quality status"
      filterOptions={["Принято", "На проверке", "Отклонено"]}
      fields={[
        { name: "batchNumber", label: "Batch number" },
        {
          name: "supplierId",
          label: "Supplier",
          type: "select",
          options:
            suppliers?.map((supplier) => ({ label: supplier.name, value: supplier._id })) ?? []
        },
        { name: "grainType", label: "Grain type" },
        { name: "weightKg", label: "Weight, kg", type: "number" },
        { name: "moisturePercent", label: "Moisture, %", type: "number" },
        { name: "intakeDate", label: "Intake date", type: "date" },
        {
          name: "qualityStatus",
          label: "Quality status",
          type: "select",
          options: ["Принято", "На проверке", "Отклонено"].map((item) => ({
            label: item,
            value: item
          }))
        },
        { name: "notes", label: "Notes", type: "textarea" }
      ]}
      columns={[
        { key: "batchNumber", header: "Batch", render: (item) => item.batchNumber },
        {
          key: "supplier",
          header: "Supplier",
          render: (item) => (item.supplierId as Supplier)?.name ?? "-"
        },
        { key: "grainType", header: "Type", render: (item) => item.grainType },
        { key: "weightKg", header: "Weight", render: (item) => `${formatNumber(item.weightKg)} кг` },
        { key: "intakeDate", header: "Date", render: (item) => formatDate(item.intakeDate) },
        {
          key: "qualityStatus",
          header: "Status",
          render: (item) => <StatusBadge value={item.qualityStatus} />
        }
      ]}
    />
  );
}

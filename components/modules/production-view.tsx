"use client";

import { CrudManager, StatusBadge } from "@/components/forms/crud-manager";
import { useApi } from "@/hooks/use-api";
import { formatDate, formatNumber } from "@/lib/utils";
import { GrainBatch, ProductionBatch } from "@/types/entities";

export function ProductionView() {
  const { data: items, loading, error, reload } = useApi<ProductionBatch[]>("/api/production-batches");
  const { data: grainBatches } = useApi<GrainBatch[]>("/api/grain-batches");

  return (
    <CrudManager<ProductionBatch>
      title="Production"
      subtitle="Accounting of production batches linked to grain lots with flour output, waste and execution status."
      endpoint="/api/production-batches"
      items={items}
      loading={loading}
      error={error}
      onReload={reload}
      initialValues={{
        batchNumber: "",
        grainBatchId: "",
        productionDate: new Date().toISOString().slice(0, 10),
        flourProducedKg: 0,
        wasteKg: 0,
        status: "В процессе",
        notes: ""
      } as ProductionBatch}
      searchPlaceholder="Search by batch number"
      searchMatcher={(item, query) => item.batchNumber.toLowerCase().includes(query)}
      filterKey="status"
      filterLabel="Production status"
      filterOptions={["В процессе", "Завершено"]}
      fields={[
        { name: "batchNumber", label: "Batch number" },
        {
          name: "grainBatchId",
          label: "Linked grain batch",
          type: "select",
          options:
            grainBatches?.map((batch) => ({ label: batch.batchNumber, value: batch._id })) ?? []
        },
        { name: "productionDate", label: "Production date", type: "date" },
        { name: "flourProducedKg", label: "Flour output, kg", type: "number" },
        { name: "wasteKg", label: "Waste, kg", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["В процессе", "Завершено"].map((item) => ({ label: item, value: item }))
        },
        { name: "notes", label: "Notes", type: "textarea" }
      ]}
      columns={[
        { key: "batchNumber", header: "Batch", render: (item) => item.batchNumber },
        {
          key: "grainBatch",
          header: "Grain batch",
          render: (item) => (item.grainBatchId as GrainBatch)?.batchNumber ?? "-"
        },
        { key: "productionDate", header: "Date", render: (item) => formatDate(item.productionDate) },
        {
          key: "flourProducedKg",
          header: "Flour",
          render: (item) => `${formatNumber(item.flourProducedKg)} кг`
        },
        { key: "wasteKg", header: "Waste", render: (item) => `${formatNumber(item.wasteKg)} кг` },
        { key: "status", header: "Status", render: (item) => <StatusBadge value={item.status} /> }
      ]}
    />
  );
}

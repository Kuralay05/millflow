"use client";

import { CrudManager, StatusBadge } from "@/components/forms/crud-manager";
import { useApi } from "@/hooks/use-api";
import { formatDate, formatNumber } from "@/lib/utils";
import { InventoryItem } from "@/types/entities";

export function WarehouseView() {
  const { data: items, loading, error, reload } = useApi<InventoryItem[]>("/api/inventory");

  return (
    <CrudManager<InventoryItem>
      title="Warehouse"
      subtitle="Tracking of finished products, by-products and grain residues by storage location, quantity and stock status."
      endpoint="/api/inventory"
      items={items}
      loading={loading}
      error={error}
      onReload={reload}
      initialValues={{
        productName: "",
        productType: "Мука",
        batchNumber: "",
        quantityKg: 0,
        location: "",
        status: "В наличии",
        lastUpdated: new Date().toISOString()
      } as InventoryItem}
      searchPlaceholder="Search by product or batch"
      searchMatcher={(item, query) =>
        item.productName.toLowerCase().includes(query) ||
        item.batchNumber.toLowerCase().includes(query)
      }
      filterKey="status"
      filterLabel="Stock status"
      filterOptions={["В наличии", "Низкий остаток", "Нет в наличии"]}
      fields={[
        { name: "productName", label: "Product name" },
        {
          name: "productType",
          label: "Product type",
          type: "select",
          options: ["Мука", "Отруби", "Зерно"].map((item) => ({ label: item, value: item }))
        },
        { name: "batchNumber", label: "Batch number" },
        { name: "quantityKg", label: "Quantity, kg", type: "number" },
        { name: "location", label: "Location" }
      ]}
      columns={[
        { key: "productName", header: "Product", render: (item) => item.productName },
        { key: "productType", header: "Type", render: (item) => item.productType },
        { key: "batchNumber", header: "Batch", render: (item) => item.batchNumber },
        { key: "quantityKg", header: "Quantity", render: (item) => `${formatNumber(item.quantityKg)} кг` },
        { key: "lastUpdated", header: "Updated", render: (item) => formatDate(item.lastUpdated) },
        { key: "status", header: "Status", render: (item) => <StatusBadge value={item.status} /> }
      ]}
    />
  );
}

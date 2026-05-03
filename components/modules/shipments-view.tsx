"use client";

import { CrudManager, StatusBadge } from "@/components/forms/crud-manager";
import { useApi } from "@/hooks/use-api";
import { formatDate, formatNumber } from "@/lib/utils";
import { Shipment } from "@/types/entities";

export function ShipmentsView() {
  const { data: items, loading, error, reload } = useApi<Shipment[]>("/api/shipments");

  return (
    <CrudManager<Shipment>
      title="Shipments"
      subtitle="Registration of outgoing shipments to customers with quantity, batch, date and delivery status."
      endpoint="/api/shipments"
      items={items}
      loading={loading}
      error={error}
      onReload={reload}
      initialValues={{
        shipmentNumber: "",
        customerName: "",
        productName: "",
        batchNumber: "",
        quantityKg: 0,
        shipmentDate: new Date().toISOString().slice(0, 10),
        status: "Подготовка"
      } as Shipment}
      searchPlaceholder="Search by customer or shipment number"
      searchMatcher={(item, query) =>
        item.customerName.toLowerCase().includes(query) ||
        item.shipmentNumber.toLowerCase().includes(query)
      }
      filterKey="status"
      filterLabel="Shipment status"
      filterOptions={["Подготовка", "Отгружено", "Доставлено"]}
      fields={[
        { name: "shipmentNumber", label: "Shipment number" },
        { name: "customerName", label: "Customer" },
        { name: "productName", label: "Product name" },
        { name: "batchNumber", label: "Batch number" },
        { name: "quantityKg", label: "Quantity, kg", type: "number" },
        { name: "shipmentDate", label: "Shipment date", type: "date" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["Подготовка", "Отгружено", "Доставлено"].map((item) => ({
            label: item,
            value: item
          }))
        }
      ]}
      columns={[
        { key: "shipmentNumber", header: "Shipment", render: (item) => item.shipmentNumber },
        { key: "customerName", header: "Customer", render: (item) => item.customerName },
        { key: "productName", header: "Product", render: (item) => item.productName },
        { key: "shipmentDate", header: "Date", render: (item) => formatDate(item.shipmentDate) },
        { key: "quantityKg", header: "Quantity", render: (item) => `${formatNumber(item.quantityKg)} кг` },
        { key: "status", header: "Status", render: (item) => <StatusBadge value={item.status} /> }
      ]}
    />
  );
}

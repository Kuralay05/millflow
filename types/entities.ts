export type Supplier = {
  _id: string;
  name: string;
  contactPerson: string;
  phone: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
};

export type GrainBatch = {
  _id: string;
  batchNumber: string;
  supplierId: Supplier | string;
  grainType: string;
  weightKg: number;
  moisturePercent: number;
  intakeDate: string;
  qualityStatus: "Принято" | "На проверке" | "Отклонено";
  notes?: string;
};

export type ProductionBatch = {
  _id: string;
  batchNumber: string;
  grainBatchId: GrainBatch | string;
  productionDate: string;
  flourProducedKg: number;
  wasteKg: number;
  status: "В процессе" | "Завершено";
  notes?: string;
};

export type InventoryItem = {
  _id: string;
  productName: string;
  productType: "Мука" | "Отруби" | "Зерно";
  batchNumber: string;
  quantityKg: number;
  location: string;
  status: "В наличии" | "Низкий остаток" | "Нет в наличии";
  lastUpdated: string;
};

export type Shipment = {
  _id: string;
  shipmentNumber: string;
  customerName: string;
  productName: string;
  batchNumber: string;
  quantityKg: number;
  shipmentDate: string;
  status: "Подготовка" | "Отгружено" | "Доставлено";
};

export type AuditLogEntry = {
  _id: string;
  action: string;
  entityType: string;
  entityId: string;
  userEmail: string;
  timestamp: string;
  details: string;
};

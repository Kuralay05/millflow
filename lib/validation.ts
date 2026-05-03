import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const supplierSchema = z.object({
  name: z.string().min(2),
  contactPerson: z.string().min(2),
  phone: z.string().min(5),
  address: z.string().min(5)
});

export const grainBatchSchema = z.object({
  batchNumber: z.string().min(3),
  supplierId: z.string().min(1),
  grainType: z.string().min(2),
  weightKg: z.coerce.number().min(1),
  moisturePercent: z.coerce.number().min(0).max(100),
  intakeDate: z.string().min(1),
  qualityStatus: z.enum(["Принято", "На проверке", "Отклонено"]),
  notes: z.string().optional().default("")
});

export const productionBatchSchema = z.object({
  batchNumber: z.string().min(3),
  grainBatchId: z.string().min(1),
  productionDate: z.string().min(1),
  flourProducedKg: z.coerce.number().min(0),
  wasteKg: z.coerce.number().min(0),
  status: z.enum(["В процессе", "Завершено"]),
  notes: z.string().optional().default("")
});

export const inventorySchema = z.object({
  productName: z.string().min(2),
  productType: z.enum(["Мука", "Отруби", "Зерно"]),
  batchNumber: z.string().min(2),
  quantityKg: z.coerce.number().min(0),
  location: z.string().min(2)
});

export const shipmentSchema = z.object({
  shipmentNumber: z.string().min(3),
  customerName: z.string().min(2),
  productName: z.string().min(2),
  batchNumber: z.string().min(2),
  quantityKg: z.coerce.number().min(1),
  shipmentDate: z.string().min(1),
  status: z.enum(["Подготовка", "Отгружено", "Доставлено"])
});

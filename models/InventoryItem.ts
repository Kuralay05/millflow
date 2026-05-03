import { Schema, model, models } from "mongoose";

const InventoryItemSchema = new Schema(
  {
    productName: { type: String, required: true },
    productType: { type: String, enum: ["Мука", "Отруби", "Зерно"], required: true },
    batchNumber: { type: String, required: true },
    quantityKg: { type: Number, required: true },
    location: { type: String, required: true },
    status: {
      type: String,
      enum: ["В наличии", "Низкий остаток", "Нет в наличии"],
      required: true
    },
    lastUpdated: { type: Date, required: true }
  },
  { timestamps: true }
);

const InventoryItem = models.InventoryItem || model("InventoryItem", InventoryItemSchema);

export default InventoryItem;

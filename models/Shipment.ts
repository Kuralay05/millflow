import { Schema, model, models } from "mongoose";

const ShipmentSchema = new Schema(
  {
    shipmentNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    productName: { type: String, required: true },
    batchNumber: { type: String, required: true },
    quantityKg: { type: Number, required: true },
    shipmentDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Подготовка", "Отгружено", "Доставлено"],
      required: true
    }
  },
  { timestamps: true }
);

const Shipment = models.Shipment || model("Shipment", ShipmentSchema);

export default Shipment;

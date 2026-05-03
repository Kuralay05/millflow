import { Schema, model, models } from "mongoose";

const ProductionBatchSchema = new Schema(
  {
    batchNumber: { type: String, required: true, unique: true },
    grainBatchId: { type: Schema.Types.ObjectId, ref: "GrainBatch", required: true },
    productionDate: { type: Date, required: true },
    flourProducedKg: { type: Number, required: true },
    wasteKg: { type: Number, required: true },
    status: { type: String, enum: ["В процессе", "Завершено"], required: true },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

const ProductionBatch =
  models.ProductionBatch || model("ProductionBatch", ProductionBatchSchema);

export default ProductionBatch;

import { Schema, model, models } from "mongoose";

const GrainBatchSchema = new Schema(
  {
    batchNumber: { type: String, required: true, unique: true },
    supplierId: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
    grainType: { type: String, required: true },
    weightKg: { type: Number, required: true },
    moisturePercent: { type: Number, required: true },
    intakeDate: { type: Date, required: true },
    qualityStatus: {
      type: String,
      enum: ["Принято", "На проверке", "Отклонено"],
      required: true
    },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

const GrainBatch = models.GrainBatch || model("GrainBatch", GrainBatchSchema);

export default GrainBatch;

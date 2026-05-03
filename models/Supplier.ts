import { Schema, model, models } from "mongoose";

const SupplierSchema = new Schema(
  {
    name: { type: String, required: true },
    contactPerson: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
  },
  { timestamps: true }
);

const Supplier = models.Supplier || model("Supplier", SupplierSchema);

export default Supplier;

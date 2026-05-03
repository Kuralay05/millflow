import { Schema, model, models } from "mongoose";

const AuditLogSchema = new Schema({
  action: { type: String, required: true },
  entityType: { type: String, required: true },
  entityId: { type: String, required: true },
  userEmail: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  details: { type: String, required: true }
});

const AuditLog = models.AuditLog || model("AuditLog", AuditLogSchema);

export default AuditLog;

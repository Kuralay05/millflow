import AuditLog from "@/models/AuditLog";
import { connectToDatabase } from "@/lib/db/mongoose";

type AuditParams = {
  action: string;
  entityType: string;
  entityId: string;
  userEmail: string;
  details: string;
};

export async function createAuditLog(params: AuditParams) {
  await connectToDatabase();
  await AuditLog.create({
    ...params,
    timestamp: new Date()
  });
}

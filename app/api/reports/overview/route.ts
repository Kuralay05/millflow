import GrainBatch from "@/models/GrainBatch";
import ProductionBatch from "@/models/ProductionBatch";
import InventoryItem from "@/models/InventoryItem";
import Shipment from "@/models/Shipment";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ok } from "@/lib/api";
import { requireAuth } from "@/lib/auth/guards";

export async function GET() {
  const { error } = await requireAuth(["admin", "operator", "warehouse_manager"]);
  if (error) return error;
  await connectToDatabase();

  const [grainSummary, productionSummary, inventorySummary, shipmentSummary] =
    await Promise.all([
      GrainBatch.aggregate([
        {
          $group: {
            _id: "$qualityStatus",
            totalWeight: { $sum: "$weightKg" },
            count: { $sum: 1 }
          }
        }
      ]),
      ProductionBatch.aggregate([
        {
          $group: {
            _id: "$status",
            flourProducedKg: { $sum: "$flourProducedKg" },
            wasteKg: { $sum: "$wasteKg" },
            count: { $sum: 1 }
          }
        }
      ]),
      InventoryItem.aggregate([
        {
          $group: {
            _id: "$productType",
            quantityKg: { $sum: "$quantityKg" },
            count: { $sum: 1 }
          }
        }
      ]),
      Shipment.aggregate([
        {
          $group: {
            _id: "$status",
            quantityKg: { $sum: "$quantityKg" },
            count: { $sum: 1 }
          }
        }
      ])
    ]);

  return ok({
    grainSummary,
    productionSummary,
    inventorySummary,
    shipmentSummary
  });
}

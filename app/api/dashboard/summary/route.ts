import GrainBatch from "@/models/GrainBatch";
import ProductionBatch from "@/models/ProductionBatch";
import InventoryItem from "@/models/InventoryItem";
import Shipment from "@/models/Shipment";
import AuditLog from "@/models/AuditLog";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ok } from "@/lib/api";
import { requireAuth } from "@/lib/auth/guards";
import { handleApiError } from "@/lib/server";

export async function GET() {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    await connectToDatabase();

    const [
      totalGrainResult,
      totalFlourResult,
      totalInventoryResult,
      shipmentsCount,
      lowStockCount,
      lastActivity,
      recentGrain,
      recentShipments,
      lowStockItems,
      grainByWeek,
      productionOutput,
      shipmentStatus
    ] = await Promise.all([
      GrainBatch.aggregate([{ $group: { _id: null, total: { $sum: "$weightKg" } } }]),
      ProductionBatch.aggregate([
        { $group: { _id: null, total: { $sum: "$flourProducedKg" } } }
      ]),
      InventoryItem.aggregate([{ $group: { _id: null, total: { $sum: "$quantityKg" } } }]),
      Shipment.countDocuments(),
      InventoryItem.countDocuments({ status: "Низкий остаток" }),
      AuditLog.findOne().sort({ timestamp: -1 }),
      GrainBatch.find().populate("supplierId").sort({ intakeDate: -1 }).limit(5).lean(),
      Shipment.find().sort({ shipmentDate: -1 }).limit(5).lean(),
      InventoryItem.find({ status: { $in: ["Низкий остаток", "Нет в наличии"] } })
        .sort({ quantityKg: 1 })
        .limit(5)
        .lean(),
      GrainBatch.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%U", date: "$intakeDate" }
            },
            total: { $sum: "$weightKg" }
          }
        },
        { $sort: { _id: 1 } },
        { $limit: 8 }
      ]),
      ProductionBatch.aggregate([
        {
          $group: {
            _id: "$status",
            total: { $sum: "$flourProducedKg" }
          }
        }
      ]),
      Shipment.aggregate([
        {
          $group: {
            _id: "$status",
            total: { $sum: 1 }
          }
        }
      ])
    ]);

    return ok({
      kpis: {
        grainVolume: totalGrainResult[0]?.total ?? 0,
        flourVolume: totalFlourResult[0]?.total ?? 0,
        warehouseStock: totalInventoryResult[0]?.total ?? 0,
        shipments: shipmentsCount,
        lowStock: lowStockCount,
        lastActivity: lastActivity?.details ?? "-"
      },
      charts: {
        grainByWeek: grainByWeek.map((item) => ({
          label: item._id,
          value: item.total
        })),
        productionOutput: productionOutput.map((item) => ({
          label: item._id,
          value: item.total
        })),
        shipmentStatus: shipmentStatus.map((item) => ({
          label: item._id,
          value: item.total
        }))
      },
      recentGrain,
      recentShipments,
      lowStockItems
    });
  } catch (error) {
    return handleApiError(error);
  }
}
